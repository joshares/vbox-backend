import { ctx } from "../../ctx";
import { OTPMail } from "../otp/otp.types";
import { userRepository } from "./user.repository";
import { compare, genSaltSync, hashSync } from "bcryptjs";

export const checkIfPasswordIsCorrect = async (
  plainPassword: string,
  email: string
) => {
  const hashedPasswordInDb = await userRepository.getUserPassword(email);
  const passwordIsCorrect = await compare(plainPassword, hashedPasswordInDb);
  return passwordIsCorrect;
};

export const hashUserPassword = (plainPassword: string) => {
  const SALT_ROUNDS = genSaltSync(10);
  let hashedPassword = hashSync(plainPassword, SALT_ROUNDS);
  return hashedPassword;
};

export const sendOTPEmail = async ({ name, otp, subscriberMail }: OTPMail) => {
  try {
    const html = `<h1>Hello ${name},Your OTP is: <br/> <span style="font-size:60px;">${otp}</span></h1><p>It expires in <span style="color:red;">10 minutes.</span></p>`;
    const info = await ctx.transporter.sendMail({
      from: process.env.EMAIL,
      to: subscriberMail,
      subject: "Reset Password",
      html,
    });
    if (info) {
      return info.response;
    }
  } catch (err) {
    throw new Error("An error occured when sending the email.");
  }
};
