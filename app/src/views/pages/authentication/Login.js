import * as React from "react";
// ** React Imports
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Third Party Components
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";

// ** Actions
import { handleLogin } from "@store/authentication";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Utils

import { login, setToken } from "../../../api/auth";
// ** Reactstrap Imports
import {
  Col,
  Form,
  Input,
  Label,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

// lottie animation imports
import AuthWrapper from "./AuthWrapper";

const defaultValues = {
  password: "",
  loginEmail: "",
};

const Login = () => {
  // ** Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = async (data, e) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      const res = await login({
        email: data.loginEmail,
        password: data.password,
      });
      if (!res.success) {
        e.preventDefault();
        toast.error(res.message);
        return false;
      } else {
        const data = {
          ...res.data.user,
          accessToken: res.data.access_token,
        };
        setToken(res.data.access_token);
        dispatch(handleLogin(data));
        navigate("/dashboard");
        toast.success(`Login Successfully as ${res.data.user.first_name}`);
      }
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
          });
        }
      }
    }
  };

  return (
    <AuthWrapper>
      <Col className='px-xl-2 mx-auto auth-content-card' sm='8' md='6' lg='12'>
        <CardTitle tag='h2' className='fw-bold mb-1 mt-2'>
          Welcome to EasyTrials
        </CardTitle>
        <CardText className='mb-2'>Please sign-in to your account</CardText>
        <Form
          className='auth-login-form mt-2'
          onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-1'>
            <Label className='form-label' for='login-email'>
              Email
            </Label>
            <Controller
              id='loginEmail'
              name='loginEmail'
              control={control}
              render={({ field }) => (
                <Input
                  autoFocus
                  type='email'
                  placeholder='john@example.com'
                  invalid={errors.loginEmail && true}
                  {...field}
                />
              )}
            />
            {errors.loginEmail && (
              <FormFeedback>{errors.loginEmail.message}</FormFeedback>
            )}
          </div>
          <div className='mb-1'>
            <div className='d-flex justify-content-between'>
              <Label className='form-label' for='login-password'>
                Password
              </Label>
              <Link to='/forgot-password' className='orange-text'>
                <small>Forgot Password?</small>
              </Link>
            </div>
            <Controller
              id='password'
              name='password'
              control={control}
              render={({ field }) => (
                <InputPasswordToggle
                  className='input-group-merge'
                  invalid={errors.password && true}
                  {...field}
                />
              )}
            />
          </div>
          <div className='form-check mb-1'>
            <Input type='checkbox' id='remember-me' />
            <Label className='form-check-label' for='remember-me'>
              Remember Me
            </Label>
          </div>
          <Button
            className='orange-bg orange-border'
            type='submit'
            color='primary'
            block>
            Sign in
          </Button>
        </Form>
      </Col>
    </AuthWrapper>
  );
};

export default Login;
