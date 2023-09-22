import * as React from 'react';

import { Fragment } from 'react'

// ** Third Party Components
import * as Icon from 'react-feather'


// ** Reactstrap Imports
import {
  NavItem,
  NavLink
} from 'reactstrap'


const NavbarBookmarks = props => {
  // ** Props
  const { setMenuVisibility } = props

  return (
    <Fragment>
      <ul className='navbar-nav d-xl-none'>
        <NavItem className='mobile-menu me-auto'>
          <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => setMenuVisibility(true)}>
            <Icon.Menu className='ficon' />
          </NavLink>
        </NavItem>
      </ul>
      <div className="welcome-msg-in-dashboard">
      Welcome to the EasyTrials Hub
      </div>
    </Fragment>
  )
}

export default NavbarBookmarks
