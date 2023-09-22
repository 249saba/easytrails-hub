// ** React Imports
import React, { Fragment, useState, useEffect } from "react";

import { ArrowLeft, ArrowRight } from "react-feather";
import Select from "react-select";
// ** Reactstrap Imports
import { Label, Row, Col, Form, Input, Button, FormFeedback } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

let defaultValues = {
  short_code: "",
  app_name: "",
  app_store_url: "",
  play_store_url: "",
  description: "",
};
const Step2 = ({ stepper, formData, setFormData }) => {
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

  const step2Validation = async () => {
    let noError = 1;
    let subFormData = {
      short_code: formData.short_code,
      app_name: formData.app_name,
    };
    for (const key in subFormData) {
      if (formData[key] === null || formData[key].length === 0) {
        setError((data) => ({
          ...data,
          [key]: key + " is required",
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
        <h5 className="mb-0">App Details</h5>
      </div>
      <Row>
        <Col md="6">
          <Row>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="shortcode">
                Short Code
              </Label>
              <Input
                className={`input-group-merge`}
                name="short_code"
                onChange={hangleInputChange}
                value={formData.short_code}
                placeholder="Enter a short code"
                autoFocus
              />
              {errors.short_code && (
                <FormFeedback style={{ display: "block" }}>
                  {errors.short_code}
                </FormFeedback>
              )}
            </Col>

            <Col md="12" className="mb-1">
              <Label className="form-label" for="ios">
                App Store URL (iOS)
              </Label>
              <Input
                className={`input-group-merge`}
                name="app_store_url"
                onChange={hangleInputChange}
                value={formData.app_store_url}
                placeholder="Enter a short code"
                autoFocus
              />
              {errors.app_store_url && (
                <FormFeedback style={{ display: "block" }}>
                  {errors.app_store_url}
                </FormFeedback>
              )}
            </Col>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="ios">
                Playstore App URL (Android)
              </Label>
              <Input
                className={`input-group-merge`}
                name="play_store_url"
                onChange={hangleInputChange}
                value={formData.play_store_url}
                placeholder="Enter a short code"
                autoFocus
              />
              {errors.play_store_url && (
                <FormFeedback style={{ display: "block" }}>
                  {errors.play_store_url}
                </FormFeedback>
              )}
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="app_name">
                App Name
              </Label>
              <Input
                className={`input-group-merge`}
                name="app_name"
                onChange={hangleInputChange}
                value={formData.app_name}
                placeholder="Enter a short code"
                autoFocus
              />
              {errors.app_name && (
                <FormFeedback style={{ display: "block" }}>
                  {errors.app_name}
                </FormFeedback>
              )}
            </Col>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="description">
                Short Description
              </Label>
              <Input
                type="textarea"
                className={`input-group-merge`}
                name="description"
                onChange={hangleInputChange}
                value={formData.description}
                placeholder="Enter a short code"
                autoFocus
              />
              {errors.description && (
                <FormFeedback style={{ display: "block" }}>
                  {errors.description}
                </FormFeedback>
              )}
            </Col>
          </Row>
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
          onClick={step2Validation}>
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"></ArrowRight>
        </Button>
      </div>
    </Fragment>
  );
};

export default Step2;
