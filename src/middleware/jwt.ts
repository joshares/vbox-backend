import "dotenv/config";
import { sign, verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { httpstatus } from "../ctx";

export type User = {
  id: string;
  role: "admin" | "user";
  email: string;
  is_verified: boolean | null;
  firstName: string | null;
  lastName: string | null;
};

export function generateAccessToken(user: User) {
  const token = sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
}

export function generateRefreshToken(user: User) {
  const refreshToken = sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "2d",
    }
  );
  return refreshToken;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(httpstatus.FORBIDDEN).json({
      error_type: "JWT Error",
      error: "Unauthorized request. No token provided.",
      isSuccess: false,
    });
  }
  verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    next();
  });
}
