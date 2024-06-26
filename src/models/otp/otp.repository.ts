import { user } from "./../../db/schema";
import { desc, eq } from "drizzle-orm";
import { ctx } from "../../ctx";
import { NotFoundError } from "../../errors";
import { generateOtp } from "./otp.helpers";
import { userRepository } from "../users/user.repository";

const otpTable = ctx.schema.userOtps;

const userOtpValues = {
  expiresAt: otpTable.expiresAt,
  email: otpTable.email,
  otp: otpTable.otp,
};

const createOTP = async (email: string) => {
  const otpNo = generateOtp();
  const customerDetails = await userRepository.getUserDetails(email);
  if (customerDetails) {
    const [customerOTP] = await ctx.db
      .insert(otpTable)
      .values({ email, otp: otpNo, expiresAt: Date.now() + 600000 })
      .returning(userOtpValues);
    return customerOTP;
  }
};

const getOTP = async (email: string) => {
  const otps = await ctx.db
    .select(userOtpValues)
    .from(otpTable)
    .where(eq(otpTable.email, email))
    .orderBy(desc(otpTable.expiresAt));
  if (otps.length === 0)
    throw new NotFoundError("No OTP has been provided for this email.");
  return otps[0];
};

const deleteOTP = async (email: string) => {
  const deletedOtps = await ctx.db
    .delete(otpTable)
    .where(eq(otpTable.email, email))
    .returning(userOtpValues);

  if (!deletedOtps)
    throw new NotFoundError("No OTPs have been provided for this email.");
  return deletedOtps;
};

export const otpRepository = {
  createOTP,
  getOTP,
  deleteOTP,
};
