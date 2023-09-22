import { Home } from "react-feather";
import { Circle, User, Settings } from "react-feather";
import "@fortawesome/fontawesome-free/css/all.min.css";
const navmenu = [
  {
    id: "dashboards",
    title: "Dashboards",
    icon: <Home size={20} />,
    requirePermission:false,
  },
  {
    id: "adminSetting",
    title: "Admin Setting",
    icon: <Settings size={20} />,
    requirePermission:true,
    children: [
      {
        id: "users",
        title: "Manage Users",
        icon: <i className='fa-solid fa-users'></i>,
        navLink: "/apps/user/list",
        otherLink: "/users/create" ,
        extraLink:"/users/edit",
      },
      {
        id: "roles",
        title: "Manage Roles",
        icon: <i className='fa fa-universal-access'></i>,
        navLink: "/apps/role/list",
      },
      {
        id: "trials",
        title: "Manage Trials",
        icon: <i className='fas fa-file-medical'></i>,
        navLink: "/apps/trial/list",
        otherLink:"/apps/site/list",
        extraLink:"trial/edit",
      },
      {
        id: "sponsers",
        title: "Manage Sponser",
        icon: <i className='fa fa-user-md'></i>,
        navLink: "/apps/sponsor/list",
      },
      {
        id: "languages",
        title: "Manage Languages",
        icon: <i className='fa fa-language '></i>,
        navLink: "/apps/languages/list",
      },
    ],
  },
];

export default navmenu;
