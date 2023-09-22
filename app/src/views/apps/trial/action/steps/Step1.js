// ** React Imports
import React, { Fragment, useState, useEffect } from "react";

import { ArrowLeft, ArrowRight } from "react-feather";
import Select from "react-select";
// ** Reactstrap Imports
import { Label, Row, Col, Form, Input, Button, FormFeedback } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

let defaultValues = {
  name: "",
  sponsor_id: "",
  recruitment_url: "",
  study_number: "",
  email: "",
  countries: "",
  contact_number: "",
  languages: "",
};
const Step1 = ({
  stepper,
  formData,
  setFormData,
  countries,
  sponsers,
  languages,
}) => {
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

  const handleSelectInputChange = (e, name) => {
    setFormData((data) => ({
      ...data,
      [name]: e,
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
      name: formData.name,
      sponsor_id: formData.sponsor_id,
      email: formData.email,
      countries: formData.countries,
      languages: formData.languages,
    };
    for (const key in subFormData) {
      if (formData[key].length === 0) {
        setError((data) => ({
          ...data,
          [key]: key + " is required",
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
        <h5 className="mb-0">Trial Details</h5>
      </div>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Trial
          </Label>
          <Input
            className={`input-group-merge`}
            name="name"
            onChange={hangleInputChange}
            value={formData.name}
            placeholder="Enter a trial name"
            autoFocus
          />
          {errors.name && (
            <FormFeedback style={{ display: "block" }}>
              {errors.name}
            </FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Sponser
          </Label>
          <Select
            isClearable={false}
            classNamePrefix="select"
            options={sponsers}
            name="sponsor_id"
            value={sponsers.filter(
              ({ value }) => value === formData.sponsor_id
            )}
            onChange={(e) => hangleInputChange(e)}
          />
          {errors.name && (
            <FormFeedback style={{ display: "block" }}>
              {errors.name}
            </FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Recruitment Url
          </Label>
          <Input
            className={`input-group-merge`}
            name="recruitment_url"
            onChange={hangleInputChange}
            value={formData.recruitment_url}
            placeholder="Enter a recruitment URL"
            autoFocus
          />
          {errors.recruitment_url && (
            <FormFeedback style={{ display: "block" }}>
              {errors.recruitment_url}
            </FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Study Number
          </Label>
          <Input
            className={`input-group-merge`}
            name="study_number"
            onChange={hangleInputChange}
            value={formData.study_number}
            placeholder="Enter a study Number"
            autoFocus
          />
          {errors.study_number && (
            <FormFeedback style={{ display: "block" }}>
              {errors.study_number}
            </FormFeedback>
          )}
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Trial Email
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
            Countries
          </Label>
          <Select
            isClearable={false}
            classNamePrefix="select"
            options={countries}
            name="countries"
            value={countries.filter(({ value }) =>
              formData.countries.find((v) =>
                v.value !== undefined ? v.value === value : v === value
              )
            )}
            onChange={(e) => handleSelectInputChange(e, "countries")}
            isMulti={true}
          />
          {errors.countries && (
            <FormFeedback style={{ display: "block" }}>
              {errors.countries}
            </FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Contact Number
          </Label>
          <Input
            className={`input-group-merge`}
            name="contact_number"
            onChange={hangleInputChange}
            value={formData.contact_number}
            placeholder="Enter a phone number"
            type="number"
            autoFocus
          />
          {errors.contact_number && (
            <FormFeedback style={{ display: "block" }}>
              {errors.phone_number}
            </FormFeedback>
          )}
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="login-email">
            Languages
          </Label>
          <Select
            isClearable={false}
            classNamePrefix="select"
            options={languages}
            name="languages"
            value={languages.filter(({ value }) =>
              formData.languages.find((v) =>
                v.value !== undefined ? v.value === value : v === value
              )
            )}
            onChange={(e) => handleSelectInputChange(e, "languages")}
            isMulti={true}
          />
          {errors.languages && (
            <FormFeedback style={{ display: "block" }}>
              {errors.languages}
            </FormFeedback>
          )}
        </Col>
      </Row>

      <div className="d-flex justify-content-between">
        <Button
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}>
          <ArrowLeft
            size={14}
            className="align-middle me-sm-25 me-0"></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button>
        <Button
          type="button"
          color="primary"
          className="btn-next"
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

export default Step1;
