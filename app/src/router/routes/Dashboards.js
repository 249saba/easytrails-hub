import { lazy } from "react";

const Dashboard = lazy(() => import("../../views/dashboard/Dashboard"));


const DashboardRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  }
];

export default DashboardRoutes;
