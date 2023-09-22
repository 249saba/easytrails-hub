// ** React Imports
import { NavLink, useLocation } from "react-router-dom";

// ** Third Party Components
import classnames from "classnames";
import { useTranslation } from "react-i18next";

// ** Reactstrap Imports
import { Badge } from "reactstrap";
import { useEffect, useState } from "react";

const VerticalNavMenuLink = ({ item, activeItem }) => {
  const location = useLocation()
  const [activeOtherLink, setActiveOtherLink] = useState(false)
  useEffect(() => {
   if(location.pathname.includes(item.otherLink) || location.pathname.includes(item.extraLink) ){
    setActiveOtherLink(true)
   }
   else{
    setActiveOtherLink(false)
   }
  
  }, [location])
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? "a" : NavLink;

  // ** Hooks
  const { t } = useTranslation();
  return (
    <li
      className={classnames({
        "nav-item": !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem,
      })}>
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? "_blank" : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || "/",
            }
          : {
            to: item.navLink || '/',
            className: ({ isActive }) => {
              if ((isActive && !item.disabled) || activeOtherLink) {
                return 'd-flex align-items-center active'
              }
            }
          })}
        onClick={(e) => {
          if (
            item.navLink.length === 0 ||
            item.navLink === "#" ||
            item.disabled === true
          ) {
            e.preventDefault();
          }
        }}>
        {item.icon}
        <span className='menu-item text-truncate'>{t(item.title)}</span>

        {item.badge && item.badgeText ? (
          <Badge className='ms-auto me-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  );
};

export default VerticalNavMenuLink;
