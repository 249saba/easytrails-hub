// ** React Imports
import React, { useEffect, useState } from "react";

// ** Icons Imports
import FeatherIcon from "feather-icons-react";

// ** Reactstrap Imports
import { Label, Input, Button } from "reactstrap";
import { getAllService } from "../../../../../api/service";

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updateTrial } from "../../../../../api/trials";

const Step3 = ({ stepper, formData, setFormData, actionId }) => {
  const [services, setServices] = useState([{}]);
  const navigate = useNavigate();

  const getServices = async () => {
    let service = await getAllService();
    setServices(service.data);
  };
  useEffect(() => {
    getServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.has_appointment_locations);
    let submitData = formData;
    if (submitData.languages.length > 0) {
      submitData.languages = await formData.languages.map((row) => row.value);
    }
    if (submitData.countries.length > 0) {
      submitData.countries = await formData.countries.map((row) => row.value);
    }
    let res = await updateTrial(submitData, actionId);
    if (res.success) {
      toast.success(res.message);
      navigate("/apps/trial/list");
    } else {
      toast.error(res.message);
    }
  };
  const handleService = async (e, val) => {
    let customser = [...formData.services];
    if (e.target.checked) {
      await customser.push(val);
    } else {
      await customser.splice(customser.indexOf(val));
    }
    await setFormData((data) => ({
      ...data,
      services: customser,
    }));
  };
  return (
    <>
      <h5>Supported Services for this Trial</h5>
      <div className="demo-inline-spacing mb-2">
        {services.map((val, key) => (
          <div className="form-check form-switch">
            <Input
              type="switch"
              id="exampleCustomSwitch"
              checked={
                formData.services.length > 0
                  ? formData.services.find((p) => p == val.id) !== undefined
                    ? true
                    : false
                  : false
              }
              name="services"
              onChange={(e) => handleService(e, val.id)}
            />
            <Label for="exampleCustomSwitch" className="form-check-label">
              {val.name}
            </Label>
          </div>
        ))}
      </div>
      <h5>Appointment Locations</h5>
      <div className="demo-inline-spacing mb-2">
        <div className="form-check form-switch">
          <Input
            type="switch"
            id="exampleCustomSwitch"
            checked={formData.has_appointment_locations}
            name="has_appointment_locations"
            onChange={(e) =>
              setFormData((data) => ({
                ...data,
                has_appointment_locations: e.target.checked,
              }))
            }
          />
          <Label for="exampleCustomSwitch" className="form-check-label">
            Does this Trial support multiple site locations?
          </Label>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <Button
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}>
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
          color="primary"
          className="btn-next"
          onClick={handleSubmit}>
          <span className="align-middle d-sm-inline-block d-none">Submit</span>
          <FeatherIcon
            icon="arrow-right"
            size={14}
            className="align-middle me-sm-25 me-0"
          />
        </Button>
      </div>
    </>
  );
};

export default Step3;
