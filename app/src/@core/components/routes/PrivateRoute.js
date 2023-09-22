// ** React Imports
import { Navigate } from "react-router-dom";
import React, { useContext, Suspense } from "react";

// ** Context Imports
import { AbilityContext } from "@src/utility/context/Can";

// ** Spinner Import
import Spinner from "../spinner/Loading-spinner";
import LoadingSpinLottie from "../../../assets/images/lottie/Comp 1.json";

// lottie animation imports
import { Player, Controls } from "@lottiefiles/react-lottie-player";
const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  const ability = useContext(AbilityContext);
  const user = JSON.parse(localStorage.getItem("userData"));

  if (route) {
    let action = null;
    let resource = null;
    let restrictedRoute = false;

    if (route.meta) {
      action = route.meta.action;
      resource = route.meta.resource;
      restrictedRoute = route.meta.restricted;
    }
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (user && restrictedRoute) {
      return <Navigate to="/" />;
    }
  }

  return (
    <Suspense fallback={ <div className="d-flex h-100 w-100 align-items-center justify-content-center m-auto position-absolute spinner-lottie-content">
    <Player
    autoplay
    loop
    src={LoadingSpinLottie}
    style={{ height: "150px", width: "150px" }}
  >
    <Controls
      visible={false}
      buttons={["play", "repeat", "frame", "debug"]}
    />
  </Player>
  </div>}>
      {children}
    </Suspense>
  );
};

export default PrivateRoute;
