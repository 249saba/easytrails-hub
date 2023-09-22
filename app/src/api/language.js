import { APICore } from "./apiCore";

const api = new APICore();

export const getAllLanguage = (params) => {
  const baseUrl = "/languages";
  return api.get(`${baseUrl}`, params !== undefined ? params : {});
};

export const deleteLanguage = (params) => {
  const baseUrl = "/languages/" + params;
  return api.delete(`${baseUrl}`, params);
};

export const createLanguage = (params) => {
  const baseUrl = "/languages";
  return api.create(`${baseUrl}`, params);
};

export const updateLanguage = (id, data) => {
  const baseUrl = "/languages/" + id;
  return api.update(`${baseUrl}`, data);
};

export const getSingleLocation = (id) => {
  const baseUrl = "/languages/" + id;
  return api.get(`${baseUrl}`, {});
};
