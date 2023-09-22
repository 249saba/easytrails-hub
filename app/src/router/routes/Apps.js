// ** React Imports
import React from "react";
import { lazy } from "react";

const UserList = lazy(() => import("../../views/apps/user/list"));
const UserView = lazy(() => import("../../views/apps/user/view"));
const UserCreate = lazy(() =>
  import("../../views/apps/user/create/UserCreate")
);

const SponserList = lazy(() => import("../../views/apps/sponser/list/index"));

const SiteList = lazy(() => import("../../views/apps/site/list/index"));
const ManageRole = lazy(() =>
  import("../../views/apps/roles/list/index")
);

const LanguageList = lazy(() => import("../../views/apps/language/list"));
const TrialList = lazy(() => import("../../views/apps/trial/list"));
const TrialEdit = lazy(() => import("../../views/apps/trial/action/Update"));

const AppRoutes = [
  {
    element: <UserList />,
    path: "/apps/user/list",
  },
  {
    element: <UserView />,
    path: "/apps/user/view/:id",
  },
  {
    element: <UserCreate />,
    path: "/apps/user/edit/:id",
  },
  {
    element: <UserView />,
    path: "/pages/profile",
  },
  {
    element: <UserCreate />,
    path: "/users/create",
  },
  {
    element: <UserCreate />,
    path: "/users/edit/:id",
  },
  {
    element: <LanguageList />,
    path: "/apps/languages/list",
  },
  {
    element: <SponserList />,
    path: "/apps/sponsor/list",
  },
  {
    element: <ManageRole />,
    path: "/apps/role/list",
  },
  {
    element: <SiteList />,
    path: "/apps/site/list/:id",
  },
  {
    element: <TrialList />,
    path: "/apps/trial/list",
  },
  {
    element: <TrialEdit />,
    path: "/trial/edit/:id",
  },
];

export default AppRoutes;
