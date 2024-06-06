import { verify } from "jsonwebtoken";
import { ctx } from "../../ctx";
// import { user } from "../../db/schema";
import { DuplicateEntryError, NotFoundError } from "../../errors";
import { User, generateAccessToken } from "../../middleware/jwt";
// import { generateAccessToken } from "../middleware/jwt-token";
import {
  checkIfPasswordIsCorrect,
  hashUserPassword,
  sendOTPEmail,
} from "./user.helpers";
import { userRepository } from "./user.repository";
import { v } from "./user.validators";
import { Handler } from "express";
import { otpRepository } from "../otp/otp.repository";

const { httpstatus } = ctx;

const registerUser: Handler = async (req, res, next) => {
  try {
    const body = v.registrationValidator.parse(req.body);
    if (!body.password) {
      throw new NotFoundError(`No password.`);
    }
    body.password = hashUserPassword(body.password);
    const customerDetails = await userRepository.getUserDetails(body.email);
    if (customerDetails) {
      throw new DuplicateEntryError(
        `Customer with email ${body.email} already exists.`
      );
    }

    await userRepository.register(body);
    return res
      .status(httpstatus.CREATED)
      .send({ message: "Account created.", isSuccess: true });
  } catch (err) {
    next(err);
  }
};

const loginUser: Handler = async (req, res, next) => {
  try {
    const { email, password } = v.loginValidator.parse(req.body);
    const user = await userRepository.getUserDetails(email);
    if (!user)
      throw new NotFoundError(
        `An account with the provided email does not exist.`
      );
    const passwordIsCorrect = await checkIfPasswordIsCorrect(password, email);
    if (!passwordIsCorrect) {
      throw new NotFoundError("Incorrect email or password.");
    }
    const token = generateAccessToken({
      email: user.email,
      id: user.id,
      is_verified: user.isVerified,
      role: "user",
      firstName: user.firstName,
      lastName: user.lastName,
    });
    return res.status(httpstatus.OK).send({ token, isSuccess: true });
  } catch (err) {
    next(err);
  }
};

const updateUserPassword: Handler = async (req, res, next) => {
  try {
    const body = v.updatePasswordValidator.parse(req.body);
    const customerDetails = await userRepository.getUserDetails(body.email);
    if (!customerDetails)
      throw new NotFoundError(
        `Customer with email ${body.email} does not exist.`
      );
    const passwordIsCorrect = await checkIfPasswordIsCorrect(
      body.currentPassword,
      body.email
    );
    if (!passwordIsCorrect) {
      throw new NotFoundError(`Invalid email or password.`);
    }
    const newPassword = hashUserPassword(body.newPassword);
    const updatedCustomer = await userRepository.updateUserPassword({
      ...body,
      newPassword,
    });
    return res.status(httpstatus.OK).send({ updatedCustomer, isSuccess: true });
  } catch (err) {
    next(err);
  }
};

const forgotPassword: Handler = async (req, res, next) => {
  try {
    const { email } = v.emailValidator.parse(req.query);
    const user = await userRepository.getUserDetails(email);
    if (!user)
      throw new NotFoundError(
        `User with email ${email} does not exist in the DB. Please create an account`
      );
    const otpDetails = await otpRepository.createOTP(email);
    // await sendOTPEmail
    //TODO:uncomment later lol
    if (otpDetails) {
      const response = await sendOTPEmail({
        otp: otpDetails.otp,
        name: `${user.firstName} ${user.lastName}`,
        subscriberMail: email,
      });
      if (response) {
        return res.status(201).send({ otpDetails, isSuccess: true });
      }
    }
  } catch (err) {
    next(err);
  }
};

const resetPassword: Handler = async (req, res, next) => {
  try {
    const body = v.resetPasswordValidator.parse(req.body);
    const dbOTP = await otpRepository.getOTP(body.email);

    if (dbOTP.expiresAt < Date.now()) {
      await otpRepository.deleteOTP(body.email);
      return res.status(httpstatus.GONE).send({
        message: `User OTP has expired. Please get another one`,
        isSuccess: false,
      });
    }
    if (dbOTP.otp === body.otp) {
      const newPassword = hashUserPassword(body.newPassword);
      const updatedUser = await userRepository.resetUserPassword({
        ...body,
        newPassword,
      });
      return res.status(httpstatus.OK).send({ updatedUser, isSuccess: true });
    } else {
      throw new NotFoundError("Could not fetch a user with this OTP");
    }
  } catch (err) {
    next(err);
  }
};

const getUserProfile: Handler = async (req, res, next) => {
  try {
    const { email } = v.emailValidator.parse(req.query);
    const user = await userRepository.getUserDetails(email);
    if (!user)
      throw new NotFoundError(
        `User with email ${email} does not exist in the DB. Please create an account`
      );

    return res.status(httpstatus.OK).send({ user, isSuccess: true });
  } catch (err) {
    next(err);
  }
};
const getCurrentUser: Handler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        error_type: "JWT Error",
        error: "Unauthorized request. No token provided.",
        isSuccess: false,
      });
    }
    const decoded = verify(token, process.env.JWT_SECRET!) as User;
    const user = await userRepository.getUserDetailsToken(decoded.id);
    if (!user)
      throw new NotFoundError(
        `User does not exist in the DB. Please create an account`
      );

    return res.status(httpstatus.OK).send({ user, isSuccess: true });
  } catch (err) {
    next(err);
  }
};

export const userHandlers = {
  registerUser,
  loginUser,
  updateUserPassword,
  getUserProfile,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
