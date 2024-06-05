export type UserRegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
};

export type UserRegisterResponse = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
};

export type UpdateUserPasswordRequest = {
  email: string;
  password: string;
};

export type UserDeleteRequest = {
  email: string;
};

export type UserUpdatePasswordRequest = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

export type UserUpdateRequest = {
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
  email: string;
  hasCreatedPasswordForAccount?: boolean;
};

export type UserUpdateEmailRequest = {
  email: string;
  newEmail: string;
  password: string;
};
