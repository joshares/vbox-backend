import { ctx } from "../../ctx";
// import { user } from "../../db/schema";
import { DuplicateEntryError, NotFoundError } from "../../errors";
// import { generateAccessToken } from "../middleware/jwt-token";
import { checkIfPasswordIsCorrect, hashUserPassword } from "./user.helpers";
import { userRepository } from "./user.repository";
import { v } from "./user.validators";
import { Handler } from "express";

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

export const userHandlers = {
  registerUser,
};
