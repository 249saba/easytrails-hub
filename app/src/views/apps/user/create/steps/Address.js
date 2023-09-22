// ** React Imports
import { Fragment, useEffect, useState } from "react";
// ** Third Party Components
import Select from "react-select";
// ** Icons Imports
import { ArrowLeft, ArrowRight } from "react-feather";

// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button } from "reactstrap";
// ** Utils
import { selectThemeColors } from "@utils";
import {
  getAllCountries,
  getTimeZonesByCountry,
} from "../../../../../api/country";

const Address = ({ stepper, type, formData, setFormData }) => {
  const [countries, setCountries] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [countryIsValid, setCountryIsValid] = useState("");
  const [timezoneIsValid, setTimezoneIsValid] = useState("");
  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    let res = await getAllCountries();
    setCountries(res.data);
  };
  const countryOptions = countries.map((val) => ({
    value: val.id,
    label: val.name,
  }));

  useEffect(() => {
    if (formData.country_id !== "") getTimeZones(formData.country_id);
  }, [formData.country_id]);
  const getTimeZones = async (country_id) => {
    let res = await getTimeZonesByCountry(country_id);
    setTimezones(res.data);
  };

  const timezoneOptions = timezones.map((val) => ({
    value: val.id,
    label: val.name,
  }));
  function handleSubmit(e) {
    e.preventDefault();
    if (formData.country_id && formData.timezone_id) {
      stepper.next();
    }
    if (!formData.country_id) {
      setCountryIsValid("is-invalid");
    } else {
      setCountryIsValid("is-valid");
    }
    if (!formData.timezone_id) {
      setTimezoneIsValid("is-invalid");
    } else {
      setTimezoneIsValid("is-valid");
    }
  }

  const hangleInputChange = (e, name) => {
    setFormData((data) => ({
      ...data,
      [name]: e.value,
    }));
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Address</h5>
        <small>Enter Your Address.</small>
      </div>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for={`country-${type}`}>
            Country <span style={{color:"crimson",fontWeight:"700"}}>*</span>
          </Label>
          <Select
            theme={selectThemeColors}
            isClearable={false}
            id={`country-${type}`}
            className={`react-select ${countryIsValid}`}
            classNamePrefix="select"
            options={countryOptions}
            name="country_id"
            value={countryOptions.filter(
              ({ value }) => value === formData.country_id
            )}
            onChange={(e) => hangleInputChange(e, "country_id")}
          />
        </Col>
        <Col md="6" className="mb-1">
          <Label className="form-label" for={`timezone-${type}`}>
            TimeZones <span style={{color:"crimson",fontWeight:"700"}}>*</span>
          </Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            id={`timezone-${type}`}
            options={timezoneOptions}
            className={`react-select ${timezoneIsValid}`}
            classNamePrefix="select"
            value={timezoneOptions.filter(
              ({ value }) => value === formData.timezone_id
            )}
            name="timezone_id"
            onChange={(e) => hangleInputChange(e, "timezone_id")}
          />
        </Col>
      </Row>
      <div className="d-flex justify-content-between">
        <Button
          className="btn-prev orange-bg orange-border"
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
          className="btn-next orange-bg orange-border"
          onClick={handleSubmit}>
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"></ArrowRight>
        </Button>
      </div>
    </Fragment>
  );
};

export default Address;
