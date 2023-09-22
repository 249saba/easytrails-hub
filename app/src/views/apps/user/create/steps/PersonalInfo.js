// ** React Imports
import React, { Fragment, useState, useEffect } from "react";

import { ArrowLeft, ArrowRight } from "react-feather";

// ** Reactstrap Imports
import { Label, Row, Col, Form, Input, Button, FormFeedback } from "reactstrap";
// ** Third Party Components
import toast from "react-hot-toast";

import { useForm, Controller } from "react-hook-form";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

let defaultValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
};
const PersonalInfo = ({ stepper, formData, setFormData }) => {
  const [errors, setError] = useState(defaultValues);

  const hangleInputChange = (e) => {
    setFormData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
    setError((data) => ({
      ...data,
      [e.target.name]: "",
    }));
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const step1Validation = async () => {
    let noError = 1;
    let subFormData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone_number: formData.phone_number,
    };
    console.log(formData);
    for (const key in subFormData) {
      if (formData[key].length === 0) {
        setError((data) => ({
          ...data,
          [key]: "This field is required",
        }));
        noError = 0;
      } else if (key === "phone_number" && formData[key].length < 10) {
        setError((data) => ({
          ...data,
          [key]:  "Invalid Phone Number",
        }));
        noError = 0;
      } else if (key === "email" && !validateEmail(formData[key])) {
        setError((data) => ({
          ...data,
          [key]: key + " should be a valid email",
        }));
        noError = 0;
      } else {
        noError = noError * 1;
      }
    }
    if (noError === 1) {
      stepper.next();
    }
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Personal Details</h5>
      </div>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            First name<span style={{color:"crimson",fontWeight:"700"}}>*</span>
          </Label>
          <Input
            className={`input-group-merge`}
            name="first_name"
            onChange={hangleInputChange}
            value={formData.first_name}
            placeholder="Enter a first name"
            autoFocus
          />
          {errors.first_name && (
            <FormFeedback style={{ display: "block" }}>
              {errors.first_name}
            </FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Last name <span style={{color:"crimson",fontWeight:"700"}}>*</span>
          </Label>
          <Input
            className={`input-group-merge`}
            name="last_name"
            onChange={hangleInputChange}
            value={formData.last_name}
            placeholder="Enter a last name"
            autoFocus
          />
          {errors.last_name && (
            <FormFeedback style={{ display: "block" }}>
              {errors.last_name}
            </FormFeedback>
          )}
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Email <span style={{color:"crimson",fontWeight:"700"}}>*</span>
          </Label>
          <Input
            className={`input-group-merge`}
            name="email"
            onChange={hangleInputChange}
            value={formData.email}
            placeholder="Enter a Email"
            autoFocus
          />
          {errors.email && (
            <FormFeedback style={{ display: "block" }}>
              {errors.email}
            </FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Contact Number <span style={{color:"crimson",fontWeight:"700"}}>*</span>
          </Label>
          <Input
            className={`input-group-merge`}
            name="phone_number"
            onChange={hangleInputChange}
            value={formData.phone_number}
            placeholder="Enter a phone number"
            type="number"
            autoFocus
          />
          {errors.phone_number && (
            <FormFeedback style={{ display: "block" }}>
              {errors.phone_number}
            </FormFeedback>
          )}
        </Col>
      </Row>

      <div className="d-flex justify-content-between">
        <Button
          className="btn-prev orange-bg orange-border"
          onClick={() => stepper.previous()}>
          <ArrowLeft
            size={14}
            className="align-middle me-sm-25 me-0 "></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button>
        <Button
          type="button"
         
          className="btn-next orange-bg orange-border"
          onClick={step1Validation}>
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"></ArrowRight>
        </Button>
      </div>
    </Fragment>
  );
};

export default PersonalInfo;
