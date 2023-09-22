import React, { useEffect, useState } from "react";
// ** React Imports
import { Link, useNavigate, useParams } from "react-router-dom";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Custom Components
import InputPassword from "@components/input-password-toggle";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Button,
  Row,
  Col,
} from "reactstrap";
// ** Styles
import "@styles/react/pages/page-authentication.scss";

import illustrationsLight from "@src/assets/images/pages/reset-password-v2.svg";
import { setUserPassword } from "../../../../api/auth";
import { toast } from "react-hot-toast";
import themeConfig from "@configs/themeConfig";
import AuthWrapper from "../../../pages/authentication/AuthWrapper";
const UserAccept = () => {
  let { token } = useParams();
  const navigate = useNavigate();
  const source = illustrationsLight;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState("");
  const [isValidPasswordConfirm, setIsValidPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      console.log("post api : ");
      let res = await setUserPassword({
        token: token,
        password: newPassword,
        confirm_password: confirmPassword,
      });
      if (res.success) {
        toast.success(res.message);
        navigate("/login");
      } else {
        toast.error(res.message);
      }
    }
  };
  function validatePassword() {
    if (!newPassword) {
      setIsValidPassword("is-invalid");
      return false;
    } else {
      setIsValidPassword("is-valid");
    }
    if (!confirmPassword) {
      setIsValidPasswordConfirm("is-invalid");
      return false;
    } else {
      setIsValidPasswordConfirm("is-valid");
    }
    if (newPassword !== confirmPassword) {
      setIsValidPasswordConfirm("is-invalid");
      setError("password and confirm password should be same");
      return false;
    } else {
      setError("");
      setIsValidPasswordConfirm("is-valid");
    }
    return true;
  }
  return (
    <AuthWrapper>
      <Col className="px-xl-2 mx-auto auth-content-card" sm="8" md="6" lg="12">
        <CardTitle tag="h2" className="fw-bold mb-1">
          Set Password
        </CardTitle>

        <Form
          className="auth-reset-password-form mt-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="mb-1">
            <Label className="form-label" for="new-password">
              New Password
            </Label>
            <InputPassword
              className={`input-group-merge  ${isValidPassword}`}
              id="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              autoFocus
            />
          </div>
          <div className="mb-1">
            <Label className="form-label" for="confirm-password">
              Confirm Password
            </Label>
            <InputPassword
              className={`input-group-merge ${isValidPasswordConfirm}`}
              id="confirm-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <p className="text-danger">{error}</p>
          </div>
          <Button type="submit" color="primary" block>
            Set New Password
          </Button>
        </Form>
        {/* <p className='text-center mt-2'>
              <Link to='/pages/login-cover'>
                <ChevronLeft className='rotate-rtl me-25' size={14} />
                <span className='align-middle'>Back to login</span>
              </Link>
            </p> */}
      </Col>
    </AuthWrapper>
  );
};

export default UserAccept;
