import React, { useEffect, useRef, useState } from "react";
import Wizard from "../../../../@core/components/wizard";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
// ** Icons Imports
import { FileText, User, MapPin, Link } from "react-feather";
import { useParams, Link as RedirectLink } from "react-router-dom";
import { editTrial } from "../../../../api/trials";
import { getAllCountries } from "../../../../api/country";
import { getAllSponsor } from "../../../../api/sponsor";
import { getAllLanguage } from "../../../../api/language";

let defaultValues = {
  name: "",
  sponsor_id: "",
  recruitment_url: "",
  study_number: "",
  email: "",
  countries: [],
  contact_number: "",
  languages: [],
  short_code: "",
  app_name: "",
  app_store_url: "",
  play_store_url: "",
  description: "",
  services: [],
  has_appointment_locations: false,
};
const TrialUdate = () => {
  // ** Ref
  const ref = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);
  const [formData, setFormData] = useState(defaultValues);
  const { id } = useParams();
  const getEditUser = async (id) => {
    let res = await editTrial(id);
    setFormData((data) => ({
      ...data,
      name: res.data.name,
      sponsor_id: res.data.sponsor_id,
      recruitment_url: res.data.recruitment_url,
      study_number: res.data.study_number,
      email: res.data.email,
      countries: res.data.countries,
      contact_number: res.data.contact_number,
      languages: res.data.languages,
      short_code: res.data.short_code,
      app_name: res.data.app_name,
      app_store_url: res.data.app_store_url,
      play_store_url: res.data.play_store_url,
      description: res.data.description,
      services: res.data.services,
      has_appointment_locations:
        res.data.has_appointment_locations === null
          ? false
          : res.data.has_appointment_locations,
    }));
  };
  const [countries, setCountries] = useState([]);
  const [sponsers, setSponsers] = useState([]);
  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    getMountedData();
  }, []);

  const getMountedData = async () => {
    let res = await getAllCountries();
    setCountries(
      res.data.map((val) => ({
        value: val.id,
        label: val.name,
      }))
    );
    let res1 = await getAllSponsor();
    setSponsers(
      res1.data.map((val) => ({
        value: val.id,
        label: val.name,
      }))
    );
    let res2 = await getAllLanguage();
    setLanguages(
      res2.data.map((val) => ({
        value: val.id,
        label: val.name,
      }))
    );
    if (id !== undefined) {
      getEditUser(id);
    }
  };
  const steps = [
    {
      id: "step1",
      title: "Trial Details",
      icon: <User size={18} />,
      content: (
        <Step1
          stepper={stepper}
          formData={formData}
          setFormData={setFormData}
          type="wizard-modern"
          countries={countries}
          sponsers={sponsers}
          languages={languages}
        />
      ),
    },
    {
      id: "step2",
      title: "App Details",
      icon: <MapPin size={18} />,
      content: (
        <Step2
          stepper={stepper}
          formData={formData}
          setFormData={setFormData}
          type="wizard-modern"
        />
      ),
    },
    {
      id: "step3",
      title: "Other Details",
      icon: <Link size={18} />,
      content: (
        <Step3
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
        <h2 className="content-header-title float-left mb-0">Edit Trial</h2>
        <div className="breadcrumb-wrapper ">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <RedirectLink to="/dashboard">Dashboard</RedirectLink>
            </li>
            <li className="breadcrumb-item">
              <RedirectLink to="#">Admin Setting</RedirectLink>
            </li>
            <li className="breadcrumb-item">
              <RedirectLink to="/apps/trial/list">Manage Trials</RedirectLink>
            </li>
            <li className="breadcrumb-item active">Edit Trial</li>
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

export default TrialUdate;
