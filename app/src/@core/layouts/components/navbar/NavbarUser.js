import * as React from 'react';
import UserDropdown from './UserDropdown'

const NavbarUser = () => {
  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
