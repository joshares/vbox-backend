import { Handler } from "express";
import { sendOTPEmail } from "./otp.helpers";
import { v } from "./otp.validators";
import { userRepository } from "../users/user.repository";
import { otpRepository } from "./otp.repository";
import { httpstatus } from "../../ctx";
import { NotFoundError } from "../../errors";

const sendOTP: Handler = async (req, res, next) => {
  try {
    const { email } = v.createOTPValidator.parse(req.query);
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

const verifyOTP: Handler = async (req, res, next) => {
  try {
    const { email, otp } = v.verifyOTPValidator.parse(req.body);
    const dbOTP = await otpRepository.getOTP(email);

    if (dbOTP.expiresAt < Date.now()) {
      await otpRepository.deleteOTP(email);
      return res.status(httpstatus.GONE).send({
        message: `User OTP has expired. Please get another one`,
        isSuccess: false,
      });
    }
    if (dbOTP.otp === otp) {
      await otpRepository.deleteOTP(email);
      await userRepository.updateUser({
        email: email,
        isVerified: true,
      });
      return res.status(httpstatus.OK).send({
        message: `User with email ${email} has been verified.`,
        isSuccess: true,
      });
    } else {
      throw new NotFoundError("Could not fetch a user with this OTP");
    }
  } catch (err) {
    next(err);
  }
};
export const otpHandlers = {
  sendOTP,
  verifyOTP,
};
