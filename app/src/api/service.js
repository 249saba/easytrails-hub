import { APICore } from "./apiCore";

const api = new APICore();

export const getAllService = () => {
  const baseUrl = "/services";
  return api.get(`${baseUrl}`, {});
}
export const getSingleService = (params)=>{
  const baseUrl = "/service-data/";
  return api.get(`${baseUrl}${params}`, {});
}