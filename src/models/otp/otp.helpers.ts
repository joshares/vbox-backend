import { ctx } from "../../ctx";
import { OTPMail } from "./otp.types";

export const generateOtp = () => {
  const OTP = Math.floor(Math.random() * 900000) + 100000;
  return OTP;
};

import "dotenv/config";

export const sendOTPEmail = async ({ name, otp, subscriberMail }: OTPMail) => {
  try {
    const html = `<h1>Hello ${name},Your OTP is: <br/> <span style="font-size:60px;">${otp}</span></h1><p>It expires in <span style="color:red;">10 minutes.</span></p>`;
    const info = await ctx.transporter.sendMail({
      from: process.env.EMAIL,
      to: subscriberMail,
      subject: "OTP Verification code",
      html,
    });
    if (info) {
      return info.response;
    }
  } catch (err) {
    throw new Error("An error occured when sending the email.");
  }
};
