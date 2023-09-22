import React, { useEffect, useRef, useState } from "react";
import Wizard from "../../../../@core/components/wizard";
import PersonalInfo from "./steps/PersonalInfo";
import Address from "./steps/Address";
import SocialLinks from "./steps/SocialLinks";
// ** Icons Imports
import { FileText, User, MapPin, Link } from "react-feather";
import { useParams, Link as RedirectLink } from "react-router-dom";
import { editUser } from "../../../../api/user";

let defaultValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  country_id: "",
  timezone_id: "",
  hub_admin: "",
  service_trials: [],
};
const UserCreate = () => {
  // ** Ref
  const ref = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);
  const [formData, setFormData] = useState(defaultValues);
  const { id } = useParams();
  const getEditUser = async (id) => {
    let res = await editUser(id);
    setFormData((data) => ({
      ...data,
      first_name: res.data.first_name,
      last_name: res.data.last_name,
      email: res.data.email,
      phone_number: res.data.phone_number,
      country_id: res.data.country_id,
      timezone_id: res.data.timezone_id,
      hub_admin: res.data.hub_admin,
      service_trials: res.data.service_trials,
    }));
  };
  useEffect(() => {
    if (id !== undefined) getEditUser(id);
  }, [id]);
  const steps = [
    {
      id: "personal-info",
      title: "Personal Details",
      icon: <User size={18} />,
      content: (
        <PersonalInfo
          stepper={stepper}
          formData={formData}
          setFormData={setFormData}
          type="wizard-modern"
        />
      ),
    },
    {
      id: "step-address",
      title: "User's Timezones Details",
      icon: <MapPin size={18} />,
      content: (
        <Address
          stepper={stepper}
          formData={formData}
          setFormData={setFormData}
          type="wizard-modern"
        />
      ),
    },
    {
      id: "social-links",
      title: "Other Details",
      icon: <Link size={18} />,
      content: (
        <SocialLinks
          stepper={stepper}
          formData={formData}
          setFormData={setFormData}
          actionType={id !== undefined ? "edit" : "add"}
          actionId={id}
          type="wizard-modern"
        />
      ),
    },
  ];

  return (
    <div>
      <div className="col-12 d-flex align-items-center ">
        <h2 className="content-header-title float-left mb-0">Add User</h2>
        <div className="breadcrumb-wrapper ">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <RedirectLink to="/dashboard">Dashboard</RedirectLink>
            </li>
            <li className="breadcrumb-item">
              <a href="#">Admin Setting</a>
            </li>
            <li className="breadcrumb-item">
              <RedirectLink to="/apps/user/list">Manage Users</RedirectLink>
            </li>
            <li className="breadcrumb-item active">
              <RedirectLink to="/users/create">Add User</RedirectLink>
            </li>
          </ol>
        </div>
      </div>
      <form className="new-wizard-for-responsive">
        <Wizard
          type="modern-horizontal"
          ref={ref}
          steps={steps}
          options={{
            linear: id !== undefined ? false : true,
          }}
          instance={(el) => setStepper(el)}
        />
      </form>
    </div>
  );
};

export default UserCreate;
