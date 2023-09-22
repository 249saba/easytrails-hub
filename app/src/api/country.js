import { APICore } from "./apiCore";

const api = new APICore();
// get all countries
export const getAllCountries = () =>{
    const baseUrl = "/countries";
    return api.get(`${baseUrl}`,"");
  
  }
  
  // get timezones
  export const getTimeZonesByCountry= (countryId) =>{
    const baseUrl = "/timezones";
    return api.get(`${baseUrl}?country_id=${countryId}`,"");
  }