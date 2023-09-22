import { APICore } from "./apiCore";

const api = new APICore();

export const getAllSponsor = (params) => {
  const baseUrl = "/sponsors";
  return api.get(`${baseUrl}`, params !== undefined ? params : {});
};
export const createSponsor = (params) => {
  const baseUrl = "/sponsors";
  return api.create(`${baseUrl}`, { name: params });
};

export const changeSponsorStatus = (userid, status) => {
  const baseUrl = "/sponsors/change-status/" + userid;
  return api.update(`${baseUrl}`, { status: status.toLowerCase() });
};
export const updateSponsor = (userid, data) => {
  const baseUrl = "/sponsors/" + userid;
  return api.update(`${baseUrl}`, { name: data });
};
