// ** Reducers Imports
import navbar from "./navbar";
import layout from "./layout";
import auth from "./authentication";
import users from "@src/views/apps/user/store/index";
import trials from "@src/views/apps/trial/store";
import languages from "@src/views/apps/language/store";
import service from "@src/views/apps/roles/store";
import sites from "@src/views/apps/site/store";
import activites from "@src/views/apps/user/store/activity";

const rootReducer = {
  auth,
  users,
  trials,
  navbar,
  layout,
  service,
  languages,
  sites,
  activites,
};

export default rootReducer;
