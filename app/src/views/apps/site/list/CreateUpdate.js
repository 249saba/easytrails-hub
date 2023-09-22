import React from 'react'
import { Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import "@styles/react/libs/react-select/_react-select.scss";
import Select from "react-select";
const CreateUpdate = ({centeredModal,setCenteredModal,siteData,handleSubmit,handleChange,formError,selectThemeColors, countryOptions, timezoneOptions,selectCountry,selectTimeZone}) => {
   
  return (
    <div>
        <Modal
        isOpen={centeredModal}
        toggle={() => setCenteredModal(!centeredModal)}
        className="modal-dialog-centered"
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            siteData.id?.toString().length > 0
              ? handleSubmit("update")
              : handleSubmit("new");
          }}
        >
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
            { siteData.id?.toString().length > 0 ? "Edit Site": "Add New Site"}
          </ModalHeader>
          <ModalBody>
            <div className="mb-1">
              <Label className="form-label" for="site-code">
                Site Code <span style={{color:"crimson",fontWeight:"700"}}>*</span>
              </Label>
              <Input
                className={`input-group-merge `}
                id="site-code"
                name="code"
                placeholder="Enter a Site Code"
                onChange={handleChange}
                value={siteData.code}
                autoFocus
              />
              {formError.map((val, key) => {
                return (
                  <p className="text-danger" key={key}>
                    {val.code}
                  </p>
                );
              })}
            </div>
            <div className="mb-1">
              <Label className="form-label" for="site-lab">
                Site Lab Name <span style={{color:"crimson",fontWeight:"700"}}>*</span>
              </Label>
              <Input
                className={`input-group-merge`}
                id="site-lab"
                name="title"
                onChange={handleChange}
                value={siteData.title}
                placeholder="Enter a Site Lab Name"
                autoFocus
              />
              {formError.map((val, key) => {
                return (
                  <p className="text-danger" key={key}>
                    {val.title}
                  </p>
                );
              })}
            </div>
            <div className="mb-1">
              <Label className="form-label" for="site-address">
                Site Lab Address <span style={{color:"crimson",fontWeight:"700"}}>*</span>
              </Label>
              <Input
                className={`input-group-merge `}
                id="site-address"
                name="address"
                onChange={handleChange}
                value={siteData.address}
                placeholder="Enter a Site Lab Address"
                autoFocus
              />
              {formError.map((val, key) => {
                return (
                  <p className="text-danger" key={key}>
                    {val.address}
                  </p>
                );
              })}
            </div>
            <div className="mb-1">
              <Label className="form-label" for={`country-select`}>
                Country <span style={{color:"crimson",fontWeight:"700"}}>*</span>
              </Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                id={`country-select`}
                className={`react-select `}
                classNamePrefix="select"
                options={countryOptions}
                value={countryOptions.filter(
                  ({ value }) => value === siteData.country_id
                )}
                onChange={(e) => selectCountry(e)}
              />
              {formError.map((val, key) => {
                return (
                  <p className="text-danger" key={key}>
                    {val.country_id}
                  </p>
                );
              })}
            </div>
            <div className="mb-1">
              <Label className="form-label" for={`timezone-select`}>
                TimeZones <span style={{color:"crimson",fontWeight:"700"}}>*</span>
              </Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                id={`timezone-select`}
                options={timezoneOptions}
                className={`react-select `}
                classNamePrefix="select"
                onChange={selectTimeZone}
                value={timezoneOptions.filter(
                  ({ value }) => value === siteData.timezone_id
                )}
              />
              {formError.map((val, key) => {
                return (
                  <p className="text-danger" key={key}>
                    {val.timezone_id}
                  </p>
                );
              })}
            </div>
            <div className="mb-1">
              <Label className="form-label" for="site-phone-number">
                Phone Number <span style={{color:"crimson",fontWeight:"700"}}>*</span>
              </Label>
              <Input
                className={`input-group-merge `}
                id="site-phone-number"
                onChange={handleChange}
                name="phone_number"
                value={siteData.phone_number}
                placeholder="Enter a Phone Number"
                autoFocus
              />
              {formError.map((val, key) => {
                return (
                  <p className="text-danger" key={key}>
                    {val.phone_number}
                  </p>
                );
              })}
            </div>
            <div className="mb-1">
              <Label className="form-label" for="site-email">
                Site Email Address <span style={{color:"crimson",fontWeight:"700"}}>*</span>
              </Label>
              <Input
                type="email"
                className={`input-group-merge `}
                onChange={handleChange}
                value={siteData.email_address}
                id="site-email"
                name="email_address"
                placeholder="Enter a Site Email Address"
                autoFocus
              />
              {formError.map((val, key) => {
                return (
                  <p className="text-danger" key={key}>
                    {val.email_address}
                  </p>
                );
              })}
            </div>
            <div className="mb-1">
              <Label className="form-label">Consent Type <span style={{color:"crimson",fontWeight:"700"}}>*</span></Label>
              <br />
              <br />
              <Input
                type="radio"
                name="consent_type"
                onChange={handleChange}
                value={"eSignature"}
                className="mr-1"
                id="ex1-inactive"
                checked={siteData.consent_type === "eSignature"}
              />
              <Label
                className="form-check-label custom-label-in-site-radio ml-1"
                for="ex1-inactive"
              >
                eSignature
              </Label>
            </div>
            <div className="mb-1">
              <Input
                type="radio"
                onChange={handleChange}
                name="consent_type"
                className="mr-1"
                value={"Manual Upload"}
                id="ex2-inactive"
                checked={siteData.consent_type === "Manual Upload"}
              />
              <Label
                className="form-check-label custom-label-in-site-radio ml-1"
                for="ex2-inactive"
              >
                Manually Upload
              </Label>
              {formError.map((val, key) => {
                return (
                  <p className="text-danger" key={key}>
                    {val.consent_type}
                  </p>
                );
              })}
            </div>

            <div className="mb-1">
              <Label className="form-label" for="new-password">
                Manual Enrollment via Add new participant <span style={{color:"crimson",fontWeight:"700"}}>*</span>
              </Label>
              <br />
              <br />
              {siteData.id?.toString().length > 0 ? (
                <Input
                  type="radio"
                  onChange={handleChange}
                  name="manual_enrollment"
                  className="mr-1"
                  value={1}
                  id="ex3-inactive"
                  checked={siteData.manual_enrollment == 1 ? true : false}
                />
              ) : (
                <Input
                  type="radio"
                  onChange={handleChange}
                  name="manual_enrollment"
                  className="mr-1"
                  value={1}
                  id="ex3-inactive"
                />
              )}

              <Label
                className="form-check-label custom-label-in-site-radio ml-1"
                for="ex3-inactive"
              >
                On
              </Label>
            </div>
            <div className="mb-1">
              {siteData.id?.toString().length > 0 ? (
                <Input
                  type="radio"
                  onChange={(e) => handleChange(e)}
                  value={0}
                  name="manual_enrollment"
                  className="mr-1"
                  id="ex4-inactive"
                  checked={siteData.manual_enrollment == 0 ? true : false}
                />
              ) : (
                <Input
                  type="radio"
                  onChange={(e) => handleChange(e)}
                  value={0}
                  name="manual_enrollment"
                  className="mr-1"
                  id="ex4-inactive"
                />
              )}

              <Label
                className="form-check-label custom-label-in-site-radio ml-1"
                for="ex4-inactive"
              >
                Off
              </Label>
              {formError.map((val, key) => {
                return (
                  <p className="text-danger" key={key}>
                    {val.manual_enrollment}
                  </p>
                );
              })}
            </div>
          </ModalBody>
          <ModalFooter className="d-flex align-items-center justify-content-center">
            <Button color="primary" type="submit">
              Submit
            </Button>
            <Button
              color="white"
              onClick={()=> setCenteredModal(!centeredModal)}
            >
              cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default CreateUpdate