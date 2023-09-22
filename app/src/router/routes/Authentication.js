// ** React Imports
import { lazy } from "react";

const Login = lazy(() => import("../../views/pages/authentication/Login"));

const ForgotPassword = lazy(() =>
  import("../../views/pages/authentication/ForgotPassword")
);

const ResetPasswordCover = lazy(() =>
  import("../../views/pages/authentication/ResetPasswordCover")
);
const UserAccept = lazy(() =>
  import("../../views/apps/user/accept/UserAccept")
);

const AuthenticationRoutes = [
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/accept/:token",
    element: <UserAccept />,
    layout: "BlankLayout",
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    layout: "BlankLayout",
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },

  {
    path: "/reset-password/:token",
    element: <ResetPasswordCover />,
    meta: {
      layout: "blank",
      publicRoute: true,
    },
  },
];

export default AuthenticationRoutes;
