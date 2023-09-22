import { APICore } from "./apiCore";

const api = new APICore();

export const getAllSites = (pages) => {
  const baseUrl = "/trial-site-locations";
  return api.get(`${baseUrl}`, {
    trial_id: pages.trialId,
    per_page: pages.perPage,
  });
};
export const getSingleSite = (siteid) => {
  const baseUrl = "/trial-site-locations/"+ siteid;
  return api.get(`${baseUrl}`, {});
};
export const deleteSite = (params) => {
  const baseUrl = "/trial-site-locations/" + params;
  return api.delete(`${baseUrl}`, {});
};
export const createSite = (params) => {
  
  const baseUrl = "/trial-site-locations";
  return api.create(`${baseUrl}`, params);
};
export const updateSite = (siteid,data) =>{
  const baseUrl = "/trial-site-locations/"+siteid;
  return api.update(`${baseUrl}`,data);
}