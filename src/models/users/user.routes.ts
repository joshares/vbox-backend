import { Router } from "express";
import { userHandlers } from "./user.handlers";
import { verifyToken } from "../../middleware/jwt";

export const userRouter = Router();

userRouter.post("/register", userHandlers.registerUser);
userRouter.post("/login", userHandlers.loginUser);
userRouter.patch(
  "/updateUserPassword",
  verifyToken,
  userHandlers.updateUserPassword
);
userRouter.get("/profile", verifyToken, userHandlers.getUserProfile);
userRouter.get("/current", userHandlers.getCurrentUser);
userRouter.get("/forgotPassword", userHandlers.forgotPassword);
userRouter.patch("/resetPassword", userHandlers.resetPassword);
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
