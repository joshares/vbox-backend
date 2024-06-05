import { db } from "./db/db";
import "dotenv/config";
import nodemailer from "nodemailer";
import { dbSchema, dbSchemaType } from "./db/schema";
import { StatusCodes } from "http-status-codes";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface Context {
  db: typeof db;
  schema: dbSchemaType;
  httpstatus: typeof StatusCodes;
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  // secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

export const httpstatus = StatusCodes;
const createContext = (): Context => {
  return {
    db: db,
    schema: dbSchema,
    httpstatus,
    transporter,
  };
};

export const ctx = createContext();
