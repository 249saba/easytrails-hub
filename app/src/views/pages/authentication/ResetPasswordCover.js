import React, { useState } from "react";
// ** React Imports
import { Link, useNavigate, useParams } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Custom Components
import InputPassword from "@components/input-password-toggle";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Button,
  Input,
} from "reactstrap";
import themeConfig from "@configs/themeConfig";
// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/reset-password-v2.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { userPasswordReset } from "../../../api/auth";
import { toast } from "react-hot-toast";
import AuthWrapper from "./AuthWrapper";

let defualtValue = { email: "", resetPassword: "", resetPasswordConfirm: "" };
const ResetPasswordCover = () => {
  // ** Hooks
  const { skin } = useSkin();
  const [formData, setFormData] = useState(defualtValue);
  const [resetPassword, setResetPassword] = useState("");
  const [emailValid, setEmailValid] = useState("");
  const [resetPasswordValid, setResetPasswordValid] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");
  const [resetPasswordConfirmValid, setResetPasswordConfirmValid] = useState({
    message: "",
    classname: "",
  });
  let { token } = useParams();
  const navigate = useNavigate();
  const source = illustrationsLight;

  const handleChange = (e) => {
    setFormData((query) => ({
      ...query,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setEmailValid("is-invalid");
    } else {
      setEmailValid("is-valid");
    }
    if (!formData.resetPassword) {
      setResetPasswordValid("is-invalid");
    } else {
      setResetPasswordValid("is-valid");
    }
    if (!formData.resetPasswordConfirm) {
      setResetPasswordConfirmValid((query) => ({
        ...query,
        classname: "is-invalid",
      }));
    } else if (formData.resetPassword !== formData.resetPasswordConfirm) {
      setResetPasswordConfirmValid((query) => ({
        ...query,
        classname: "is-invalid",
        message: "Password and Confirm Password field should be same",
      }));
    } else {
      setResetPasswordConfirmValid((query) => ({
        ...query,
        classname: "is-valid",
        message: "",
      }));
    }

    if (
      formData.resetPassword === formData.resetPasswordConfirm &&
      formData.resetPassword &&
      formData.resetPasswordConfirm &&
      formData.email
    ) {
      let res = await userPasswordReset({ token, ...formData });
      if (res.success) {
        toast.success(res.message);
        navigate("/login");
      } else {
        toast.error(res.message);
      }
    }
  };
  return (
    <AuthWrapper>
      <Col className="px-xl-2 mx-auto auth-content-card" sm="8" md="6" lg="12">
          
            <CardTitle tag="h2" className="fw-bold mb-1 mt-2">
              Reset Password
            </CardTitle>
            <CardText className="mb-2">
              Your new password must be different from previously used passwords
            </CardText>
            <Form
              className="auth-reset-password-form mt-2"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="mb-1">
                <Label className="form-label" for="new-password">
                  Email
                </Label>
                <Input
                  className={`input-group-merge ${emailValid}`}
                  id="new-email"
                  name="email"
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="new-password">
                  New Password
                </Label>
                <InputPassword
                  className={`input-group-merge ${resetPasswordValid}`}
                  id="new-password"
                  name="resetPassword"
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="confirm-password">
                  Confirm Password
                </Label>
                <InputPassword
                  className={`input-group-merge ${resetPasswordConfirmValid.classname}`}
                  name="resetPasswordConfirm"
                  id="confirm-password"
                  onChange={handleChange}
                />
                <p className="text-danger">
                  {resetPasswordConfirmValid.message}
                </p>
              </div>
              <Button type="submit" className="orange-bg orange-border" block>
                Set New Password
              </Button>
            </Form>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft
                  className="rotate-rtl me-25 orange-text"
                  size={14}
                />
                <span className="align-middle orange-text">Back to login</span>
              </Link>
            </p>
          </Col>
    </AuthWrapper>
  );
};

export default ResetPasswordCover;
