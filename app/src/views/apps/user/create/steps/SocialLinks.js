// ** React Imports
import React, { useEffect, useState } from "react";

// ** Icons Imports
import FeatherIcon from "feather-icons-react";

// ** Reactstrap Imports
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import DataTablesBasic from "../TableZeroConfig";
import { getAllService } from "../../../../../api/service";
import { inviteUser, updateUser } from "../../../../../api/user";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
let finalData = [];

export const getTrialsData = (params) => {
  for (let i = 0; i < finalData.length; i++) {
    if (finalData[i].type == params.type || finalData[i].type == undefined) {
      finalData.splice(i, 1);
    }
  }
  finalData.push(params);
};
const SocialLinks = ({
  stepper,
  formData,
  setFormData,
  actionType,
  actionId,
}) => {
  const [active, setActive] = useState(1);
  const [hubPermit, setHubPermit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState([{}]);
  const navigate = useNavigate();

  const getServices = async () => {
    let service = await getAllService();
    setServices(service.data);
  };
  useEffect(() => {
    getServices();
  }, []);
  useEffect(() => {
    formData?.hub_admin == 1 ? setHubPermit(true) : "";
  }, [formData]);
  const toggle = (tab) => {
    setActive(tab);
  };
  let service_trials = [];

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    await finalData.map((val) => {
      service_trials.push({ service_id: val.type, trials: val.allTrial });
    });
    let customFormData;

    await setFormData((data) => ({
      ...data,
      hub_admin: hubPermit,
      service_trials: service_trials,
    }));
    customFormData = await {
      ...formData,
      hub_admin: hubPermit,
      service_trials: service_trials,
    };
    let res =
      actionType === "edit"
        ? await updateUser(customFormData, actionId)
        : await inviteUser(customFormData);
    setIsLoading(false);
    if (res.success) {
      toast.success(res.message);
      navigate("/apps/user/list");
    } else {
      toast.error(res.message);
    }
  };
  return (
    <>
      <h5>HUB Admin</h5>
      <div className="demo-inline-spacing">
        <div className="form-check form-switch">
          <Input
            type="switch"
            id="exampleCustomSwitch"
            value={hubPermit}
            checked={hubPermit}
            onChange={() => setHubPermit(!hubPermit)}
          />
          <Label for="exampleCustomSwitch" className="form-check-label">
            Provide permission as EasyTrials Hub Admin
          </Label>
        </div>
      </div>
      <h5 className="head-margin">Give access of trial</h5>
      <div className="demo-inline-spacing  custom-tabs-trials">
        <Row className="row-in-user-invite">
          <div className="left-part">
            <Nav pills vertical>
              {services.map((val, key) => (
                <NavItem key={"vertical" + key} active={active === val.id}>
                  <NavLink
                    active={active === val.id}
                    name={val.id}
                    onClick={() => {
                      toggle(val.id);
                    }}
                  >
                    <i className={val.icon_name}></i>
                    {val.name}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </div>
          <div className="right-part">
            {formData.name !== "" ? (
              <TabContent activeTab={active}>
                {services.map((val, key) => (
                  <TabPane tabId={val.id} key={"right-part" + key}>
                    <DataTablesBasic
                      active={active}
                      formData={formData}
                      type={val.id}
                      actionType={actionType}
                    />
                  </TabPane>
                ))}
              </TabContent>
            ) : (
              ""
            )}
          </div>
        </Row>
      </div>

      <div className="d-flex justify-content-between">
        <Button
          className="btn-prev orange-bg orange-border"
          onClick={() => stepper.previous()}
        >
          <FeatherIcon
            icon="arrow-left"
            size={14}
            className="align-middle me-sm-25 me-0"
          />
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button>
        <Button
          type="submit"
          className="btn-next orange-bg orange-border"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size={"sm"} />
          ) : (
            <>
              <span className="align-middle d-sm-inline-block d-none">Submit</span>
              <FeatherIcon
                icon="arrow-right"
                size={14}
                className="align-middle me-sm-25 me-0"
              />
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default SocialLinks;
