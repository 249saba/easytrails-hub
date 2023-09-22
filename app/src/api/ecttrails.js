import { APICore } from "./apiCore";

const api = new APICore();

export const getUserData = () => {
  const baseUrl = "/service-login/" + 3 + "/service";
  return api.get(`${baseUrl}`, {});
};
export const getDomainInfo = (id) => {
  const baseUrl = "/users/trial-services/"+id;
  return api.get(`${baseUrl}`,"");
};
