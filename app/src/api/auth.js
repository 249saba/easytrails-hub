import { APICore } from "./apiCore";

const api = new APICore();

// login
export const login = (params) => {
  const baseUrl = "/login";
  return api.create(`${baseUrl}`, {
    email: params.email,
    password: params.password,
  });
};
// logout
export const logout = () => {
  const baseUrl = "/logout";
  return api.create(`${baseUrl}`);
};
export const deleteSession = () => {
  api.setLoggedOutUser();
};
// forgot password
export const userForgotPassword = (params) => {
  const baseUrl = "/forgot-password";
  return api.create(`${baseUrl}`, {
    email: params.email,
  });
};
// reset password
export const userPasswordReset = (params) => {
  const baseUrl = "/reset-password";
  return api.create(`${baseUrl}`, {
    token: params.token,
    email: params.email,
    password: params.resetPassword,
    password_confirmation: params.resetPasswordConfirm,
  });
};
export const setToken = (token, user) => {
  api.setLoggedInUser(token, user);
};
export const setUserPassword = (params) => {
  const baseUrl = "/set-password";
  return api.create(`${baseUrl}`, {
    token: params.token,
    password: params.password,
    password_confirmation: params.confirm_password,
  });
};
