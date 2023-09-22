import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import themeConfig from "@configs/themeConfig";

const AuthWrapper = (props) => {
  return (
    <div>
      <div className='auth-wrapper auth-cover'>
        <Row className='auth-inner m-0'>
          <Col
            className='d-none d-lg-flex align-items-center p-5 login-cover-bg'
            lg='8'
            sm='12'>
            <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'></div>
          </Col>

          <Col
            className='d-flex flex-column align-items-center justify-content-evenly auth-bg px-2 p-lg-1'
            lg='4'
            sm='12'>
            <Link
              className=' brand-logo-link '
              to='/login'
              onClick={(e) => e.preventDefault()}>
              <span className='new-cover-in-login'>
                <img src={themeConfig.app.appLogoImage} alt='logo' />
              </span>
            </Link>

            {props.children}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AuthWrapper;
