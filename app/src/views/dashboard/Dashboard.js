// ** React Imports
import React, { useEffect, useState } from "react";

// ** Context
// import { ThemeColors } from "@src/utility/context/ThemeColors";

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import "@styles/base/pages/dashboard-ecommerce.scss";
import "../../assets/styles/style.css";
import Card1 from "./components/Card1";
import StudyList1 from "./components/StudyList1";
import { getAllTrials } from "../../api/trials";
import PortalDesign from "./components/PortalDesign";
import { getUserData, getDomainInfo } from "../../api/ecttrails";

const Dashboard = () => {
  document.title = "Dashboard | EasyTrials Hub ";
  const [ectTrialsInfo, setectTrialsInfo] = useState();
  const [DomainInfo, setDomainInfo] = useState();
  // ** State
  const [userData, setUserData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  //** ComponentDidMount
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData")));
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);
  const allTrials = async () => {
    let res = await getAllTrials({});
    setTrialsData(res.data);
  };
  const getUserInfo = async () => {
    let res = await getUserData();
    let user = JSON.parse(localStorage.getItem("userData"));
    console.log("userInfo", user);
    let res2 = await getDomainInfo(user.id);
    setDomainInfo(res2.data);
    setectTrialsInfo(res.data);
  };
console.log("ectTrialsInfo",ectTrialsInfo);
console.log("DomainInfo",DomainInfo)
  return (
    <div id="dashboard-ecommerce">
      <div className="card-in-dashboard">
        <Card1 heading="Clinical Trials List" classes="first-card" flex="0.6">
          {DomainInfo?.trials?.map((val, key) => (
            <>
              <StudyList1 key={key} studyName={val.name}></StudyList1>
            </>
          ))}
        </Card1>
        <Card1 heading="Other Portals" classes="d-flex flex-wrap" flex="0.4">
          {ectTrialsInfo ? (
            <div className="d-flex flex-wrap">
              {DomainInfo?.services?.map((item)=>(
                  <PortalDesign
                  portalName={item.name}
                  icon={item.icon_name}
                  access_token={ectTrialsInfo.access_token}
                  // accessToken={accessToken}
                  service_login_url={ectTrialsInfo.service_login_url}
                  sub_domain={item?.domain?.sub_domain}
                  api_sub_domain={item.domain?.api_sub_domain}
                />
              ))}
            </div>
          ) : (
            ""
          )}
        </Card1>
      </div>
    </div>
  );
};

export default Dashboard;
