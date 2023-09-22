import { APICore } from "./apiCore";

const api = new APICore();

export const getAll = (params) => {
  const baseUrl = "/users";
  return api.get(`${baseUrl}`, params);
};

export const getUserCounts = () => {
  const baseUrl = "/user-list-count";
  return api.get(`${baseUrl}`, {});
};
export const inviteUser = (params) => {
  const baseUrl = "/users";
  return api.create(`${baseUrl}`, params);
};

export const updateUser = (params, id) => {
  const baseUrl = "/users/" + id;
  return api.update(`${baseUrl}`, params);
};
export const getSingleUser = (params) => {
  const baseUrl = "/users/" + params;
  return api.get(`${baseUrl}`, params);
};

export const deactivateUser = (params) => {
  const baseUrl = "/users/" + params;
  return api.delete(`${baseUrl}`, params);
};
export const deleteUser = (params) => {
  const baseUrl = "/users/" + params;
  return api.delete(`${baseUrl}`, params);
};
export const changePassword = (params, userid) => {
  const baseUrl = "/change-password/" + userid;
  return api.create(`${baseUrl}`, params);
};

export const editUser = (params) => {
  const baseUrl = "/users/edit/" + params;
  return api.get(`${baseUrl}`, {});
};

export const changeStatus = (userid, status) => {
  const baseUrl = "/users/change-status/" + userid;
  return api.update(`${baseUrl}`, { status: status.toLowerCase() });
};

export const exportUsers = (params) => {
  const baseUrl = "/users/export" ;
  return api.get(`${baseUrl}`, params);
};
export const reInviteUser = (userid) => {
  const baseUrl = `/users/re-invite/${userid}` ;
  return api.create(`${baseUrl}`,{});
};