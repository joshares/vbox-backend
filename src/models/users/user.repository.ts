import { asc, eq, gte, ilike, or } from "drizzle-orm";
import { ctx } from "../../ctx";
import {
  UserDeleteRequest,
  UserRegisterRequest,
  UserUpdateEmailRequest,
  UserUpdatePasswordRequest,
  UserUpdateRequest,
} from "./user.types";

const userTable = ctx.schema.user;

export const userValues = {
  firstName: userTable.firstName,
  lastName: userTable.lastName,
  email: userTable.email,
  id: userTable.id,
  isVerified: userTable.isVerified,
  createdAt: userTable.createdAt,
  updatedAt: userTable.updatedAt,
  role: userTable.role,
};

const register = async (userRequest: UserRegisterRequest) => {
  const [user] = await ctx.db
    .insert(userTable)
    .values(userRequest)
    .returning(userValues);
  return user;
};

const getUserDetails = async (userEmail: string) => {
  const user = await ctx.db.query.user.findFirst({
    where: eq(userTable.email, userEmail),
    columns: { password: false },
  });
  return user;
};

// const listCustomer = async () => {
//   const customers = await ctx.db.select(customerValues).from(customerTable);
//   return customers || [];
// };

// const deleteCustomer = async (customerRequest: CustomerDeleteRequest) => {
//   const [customer] = await ctx.db
//     .delete(customerTable)
//     .where(eq(customerValues.email, customerRequest.email))
//     .returning(customerValues);
//   return customer;
// };

const updateUser = async (userRequest: UserUpdateRequest) => {
  const { email, ...request } = userRequest;
  const [user] = await ctx.db
    .update(userTable)
    .set(request)
    .where(eq(userTable.email, email))
    .returning(userValues);
  return user;
};

// const updateCustomerEmail = async (
//   userRequest: CustomerUpdateEmailRequest
// ) => {
//   const [customer] = await ctx.db
//     .update(userTable)
//     .set({ email: userRequest.newEmail })
//     .where(eq(userTable.email, userRequest.email))
//     .returning(customerValues);
//   return customer;
// };

// const updateCustomerPassword = async (
//   customerRequest: CustomerUpdatePasswordRequest
// ) => {
//   const [customer] = await ctx.db
//     .update(customerTable)
//     .set({ password: customerRequest.newPassword })
//     .where(eq(customerTable.email, customerRequest.email))
//     .returning(customerValues);
//   return customer;
// };

const getUserPassword = async (email: string) => {
  const userPassword = await ctx.db.query.user.findFirst({
    where: eq(userTable.email, email),
    columns: { password: true },
  });
  return userPassword?.password || "";
};

export const userRepository = {
  register,
  getUserPassword,
  getUserDetails,
  updateUser,
  // listCustomer,
  // deleteCustomer,
  // getCustomerPassword,
  // updateCustomer,
  // updateCustomerEmail,
  // updateCustomerPassword,
  // getCustomerDetails,
};
