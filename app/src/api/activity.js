import { APICore } from "./apiCore";

const api = new APICore();

export const getAll = (params) => {
  const baseUrl = "/activities";
  return api.get(`${baseUrl}`, params);
};
