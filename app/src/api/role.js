import { APICore } from "./apiCore";

const api = new APICore();
// get all roles
export const getAllRoles = (service, rowsPerPage, page) => {
  const baseUrl =
    "/roles?service_id=" +
    service +
    "&per_page=" +
    rowsPerPage +
    "&page=" +
    page;
  return api.get(`${baseUrl}`, "");
};
export const deleteRoles = (params) => {
  console.log("params", params);
  const baseUrl1 = "/roles/" + params;
  return api.delete(`${baseUrl1}`);
};
export const getPermissions = () => {
  const baseUrl2 = "/all-permissions";
  return api.get(`${baseUrl2}`, "");
};
export const postRoles = (params) => {
  const baseUrl = "/roles";
  return api.create(`${baseUrl}`, params);
};
export const updateRole = (id, data) => {
  const updateBaseUrl = "/roles/" + id;
  return api.update(`${updateBaseUrl}`, data);
};
export const changeStatus = (id, data) => {
  const statusURl = "/roles/change-status/" + id;
  return api.update(`${statusURl}`, data);
};
