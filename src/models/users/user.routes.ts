import { Router } from "express";
import { userHandlers } from "./user.handlers";
// import { verifyToken } from "../middleware/jwt-token";

export const userRouter = Router();

userRouter.post("/register", userHandlers.registerUser);
// customerRouter.post("/loginCustomer", customerHandlers.loginCustomer);
// customerRouter.get(
//   "/listCustomers",
//   // verifyToken,
//   customerHandlers.listCustomers
// );
// customerRouter.delete(
//   "/deleteCustomer",
//   verifyToken,
//   customerHandlers.deleteCustomer
// );
// customerRouter.patch(
//   "/updateCustomer",
//   verifyToken,
//   customerHandlers.updateCustomer
// );
// customerRouter.patch(
//   "/updateCustomerEmail",
//   customerHandlers.updateCustomerEmail
// );
// customerRouter.patch(
//   "/updateCustomerPassword",
//   customerHandlers.updateCustomerPassword
// );
