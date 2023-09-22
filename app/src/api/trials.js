import { APICore } from "./apiCore";

const api = new APICore();
// get trials
export const getAllTrials = (params) => {
  const baseUrl = "/trials";
  return api.get(`${baseUrl}`, params);
};
export const changeTrialStatus = (trialid, status) => {
  const baseUrl = "/trials/change-status/" + trialid;
  return api.update(`${baseUrl}`, { status: status.toLowerCase() });
};
export const deleteTrial = (params) => {
  const baseUrl = "/trials/" + params;
  return api.delete(`${baseUrl}`, params);
};

export const editTrial = (params) => {
  const baseUrl = "/trials/edit/" + params;
  return api.get(`${baseUrl}`, {});
};

export const updateTrial = (params, id) => {
  const baseUrl = "/trials/" + id;
  return api.update(`${baseUrl}`, params);
};
