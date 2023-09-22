// ** React Imports
import React from "react";
import { Link, Navigate } from "react-router-dom";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";

// ** Utils
import { isUserLoggedIn } from "@utils";
import themeConfig from "@configs/themeConfig";
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/forgot-password-v2.svg";
import illustrationsDark from "@src/assets/images/pages/forgot-password-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { userForgotPassword } from "../../../api/auth";

import toast from "react-hot-toast";
import AuthWrapper from "./AuthWrapper";
const ForgotPassword = () => {
  // ** Hooks
  const { skin } = useSkin();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState("");
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.length > 0) {
      let res = await userForgotPassword({ email });
      console.log(res);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setIsEmailValid("is-valid");
    } else {
      setIsEmailValid("is-invalid");
    }
  };
  if (!isUserLoggedIn()) {
    return (
     <AuthWrapper>
       <Col className="px-xl-2 mx-auto auth-content-card" sm="8" md="6" lg="12">
            
              <CardTitle tag="h2" className="fw-bold mb-1 mt-2">
                Forgot Password?
              </CardTitle>
              <CardText className="mb-2">Enter your email</CardText>
              <Form
                className="auth-forgot-password-form mt-2"
                onSubmit={(e) => handleSubmit(e)}
              >
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="login-email"
                    className={`${isEmailValid}`}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="john@example.com"
                    autoFocus
                  />
                </div>
                <Button className="orange-bg orange-border" block>
                  Send reset link
                </Button>
              </Form>
              <p className="text-center mt-2">
                <Link to="/login">
                  <ChevronLeft
                    className="orange-text rotate-rtl me-25"
                    size={14}
                  />
                  <span className="align-middle orange-text">
                    Back to login
                  </span>
                </Link>
              </p>
            </Col>
     </AuthWrapper>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default ForgotPassword;
