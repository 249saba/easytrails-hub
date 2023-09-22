// ** React Imports
import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Table,
  Alert,
  Input,
  Modal,
  Button,
  CardBody,
  CardTitle,
  ModalBody,
  CardHeader,
  ModalHeader,
  FormFeedback
} from 'reactstrap'
import toast from "react-hot-toast";
import {changePassword} from '../../../../api/user'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Third Party Components
import * as yup from 'yup'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
// ** Images
import chromeLogo from '@src/assets/images/icons/google-chrome.png'

const SignupSchema = yup.object().shape({
  password: yup.string().min(8).required(),
  password_confirmation: yup
    .string()
    .min(8)
    .oneOf([yup.ref('password'), null], 'Passwords must match')
})

const recentDevicesArr = []

const defaultValues = {
  password: '',
  password_confirmation: ''
}

const SecurityTab = ({ selectedUser }) => {
  // ** Hooks
  const {
    control,
    trigger,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(SignupSchema) })

  const onSubmit = async(data) => {
    let res = await changePassword(data,selectedUser.id)
    if(res.success){
      toast.success(res.message);
      reset(defaultValues)
    }
    else{
      toast.error(res.message);
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Change Password</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Alert color='warning' className='mb-2'>
              <h4 className='alert-heading'>Ensure that these requirements are met</h4>
              <div className='alert-body'>Minimum 8 characters long, uppercase & symbol</div>
            </Alert>
            <Row>
              <Col className='mb-2' md={6}>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='New Password'
                      htmlFor='password'
                      className='input-group-merge'
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors.password && <FormFeedback className='d-block'>{errors.password.message}</FormFeedback>}
              </Col>
              <Col className='mb-2' md={6}>
                <Controller
                  control={control}
                  id='password_confirmation'
                  name='password_confirmation'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='Confirm New Password'
                      htmlFor='password_confirmation'
                      className='input-group-merge'
                      invalid={errors.password_confirmation && true}
                      {...field}
                    />
                  )}
                />
                {errors.password_confirmation && (
                  <FormFeedback className='d-block'>{errors.password_confirmation.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12}>
                <Button type='submit' className='orange-bg orange-border'>
                  Change Password
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Recent devices</CardTitle>
        </CardHeader>
        <Table className='text-nowrap text-center' responsive>
          <thead>
            <tr>
              <th className='text-start'>Browser</th>
              <th>Device</th>
              <th>Location</th>
              <th>Recent Activity</th>
            </tr>
          </thead>
          <tbody>
            {recentDevicesArr.map((item, index) => {
              return (
                <tr key={index}>
                  <td className='text-start'>
                    <img className='me-50' src={chromeLogo} alt={item.device} width='20' height='20' />
                    <span className='fw-bolder'>{item.browser}</span>
                  </td>
                  <td>{item.device}</td>
                  <td>{item.location}</td>
                  <td>{item.activity}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Card>
    </Fragment>
  )
}

export default SecurityTab
