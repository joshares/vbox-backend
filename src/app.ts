import express, { NextFunction, Express, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { userRouter } from "./models/users/user.routes";
import { handleErrors } from "./errors";
import { otpRouter } from "./models/otp/otp.routes";

//setup
const app: Express = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/otp", otpRouter);

//errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const errors = handleErrors(err);
  console.trace(errors);
  console.log({ err: errors.error });
  return res
    .status(errors.status)
    .json({ error_type: errors.type, error: errors.error, isSuccess: false });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
