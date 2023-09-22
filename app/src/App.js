import React, { Suspense, useEffect } from "react";

// ** Router Import
import Router from "./router/Router";
import "font-awesome/css/font-awesome.min.css";
const App = () => {
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
