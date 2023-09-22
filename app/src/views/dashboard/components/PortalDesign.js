import React from "react";
import portal_icon from "../../../assets/images/vectors/portal_icon.png";
import { Link } from "react-router-dom";

const PortalDesign = ({
  portalName,
  login_token,
  icon,
  api_sub_domain,
  sub_domain,
  access_token
}) => {
  return (
    <a
    href={access_token?"http://localhost:5173/?access_token="+access_token+"&api_sub_domain="+api_sub_domain
    :""}
  
      target="_blank"
    >
      <div className="portal-card">
        <i className={`${icon} portal-icons`}></i>
        <div className="portal-name">{portalName}</div>
      </div>
    </a>
  );
};

export default PortalDesign;
