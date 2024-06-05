export type OTPRequest = {
  otp: number;
  email: string;
};

export type OTPMail = {
  name: string;
  otp: number;
  subscriberMail: string;
};
