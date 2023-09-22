// ** React Imports
import { useState, Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import { Check, Briefcase, X } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'
import {deactivateUser} from '../../../../api/user'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const roleColors = {
  editor: 'light-info',
  admin: 'light-danger',
  author: 'light-warning',
  maintainer: 'light-success',
  subscriber: 'light-primary'
}

const statusColors = {
  active: 'light-success',
  pending: 'light-warning',
  inactive: 'light-secondary'
}

const MySwal = withReactContent(Swal)

const UserInfoCard = ({ selectedUser }) => {
  // ** State
  const navigate = useNavigate();
  // ** Hook
  const {
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: selectedUser.first_name + selectedUser.last_name,
      lastName: selectedUser.last_name,
      firstName: selectedUser.first_name
    }
  })

  
  // ** render user img
  const renderUserImg = () => {
    if (selectedUser !== null && selectedUser.avatar.length) {
      return (
        <img
          height='110'
          width='110'
          alt='user-avatar'
          src={selectedUser.avatar}
          className='img-fluid rounded mt-3 mb-2'
        />
      )
    } else {
      return (
        <Avatar
          initials
          color={selectedUser.avatarColor || 'light-primary'}
          className='rounded mt-3 mb-2'
          content={selectedUser.first_name}
          contentStyles={{
            borderRadius: 0,
            fontSize: 'calc(48px)',
            width: '100%',
            height: '100%'
          }}
          style={{
            height: '110px',
            width: '110px'
          }}
        />
      )
    }
  }

  const handleDeactivatedClick = async() => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert user!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deactivate user!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(async function (result) {
      if (result.value) {
        let res = await deactivateUser(selectedUser.id)
        if(res.success){
          MySwal.fire({
            icon: 'success',
            title: 'Deactivated!',
            text: 'User has been Deactivated.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
          navigate('/apps/user/list');
        }
        else{
          MySwal.fire({
            title: 'Error',
            text: 'Something went wrong)',
            icon: 'error'
          })
        }
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Cancelled Deactivation :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  const redirectToEdit = () => {
    navigate('/apps/user/edit/' + selectedUser.id);
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className='user-avatar-section'>
            <div className='d-flex align-items-center flex-column'>
              {renderUserImg()}
              <div className='d-flex flex-column align-items-center text-center'>
                <div className='user-info'>
                  <h4>{selectedUser !== null ? selectedUser.fullName : 'Eleanor Aguilar'}</h4>
                  {selectedUser !== null ? (
                    <Badge color={roleColors[selectedUser.role]} className='text-capitalize'>
                      {selectedUser.role}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-around my-2 pt-75'>
            <div className='d-flex align-items-start me-2'>
              <Badge  className='light-blue-bg orange-text rounded p-75'>
                <Check className='font-medium-2' />
              </Badge>
              <div className='ms-75'>
                <h4 className='mb-0'>Hub Admin</h4>
                <small>{selectedUser.hub_admin === 1 ? "YES" : "NO"}</small>
              </div>
            </div>
            <div className='d-flex align-items-start'>
              <Badge className='light-blue-bg orange-text rounded p-75'>
                <Briefcase className='font-medium-2' />
              </Badge>
              <div className='ms-75'>
                <h4 className='mb-0'>Involved in trials</h4>
                <small>{selectedUser.trials_count}</small>
              </div>
            </div>
          </div>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4>
          <div className='info-container'>
            {selectedUser !== null ? (
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Email:</span>
                  <span>{selectedUser.email}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Status:</span>
                  <Badge className='text-capitalize' color={statusColors[selectedUser.status]}>
                    {selectedUser.status}
                  </Badge>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Involved in total services:</span>
                  <span className='text-capitalize'>{selectedUser.services_count}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Contact:</span>
                  <span>{selectedUser.phone_number}</span>
                </li>
                
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Country:</span>
                  <span>{selectedUser.country_id !== null ? selectedUser.country.name : ""}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Timezone:</span>
                  <span>{selectedUser.timezone_id !== null ? selectedUser.timezone.name : ""}</span>
                </li>
              </ul>
            ) : null}
          </div>
          <div className='d-flex justify-content-center pt-2'>
            <Button className='orange-bg orange-border' onClick={redirectToEdit}>
              Edit
            </Button>
            <Button className='ms-1' color='danger' outline onClick={handleDeactivatedClick}>
              Deactivated
            </Button>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserInfoCard
