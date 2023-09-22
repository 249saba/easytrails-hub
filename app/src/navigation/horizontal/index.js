// ** Icons Import
import { Home,  User,
    Circle,Settings } from 'react-feather'

export default [
  {
    id: 'dashboards',
    title: 'Dashboards',
    icon: <Home />
  },
  {
    id: 'adminSetting',
    title: 'Admin Setting',
    icon: <Settings />,
    children: [
      {
        id: 'users',
        title: 'Manage Users',
        icon: <User />,
        navLink: '/apps/user/list'
      },
      {
        id: 'roles',
        title: 'Manage Roles',
        icon: <Circle />,
        navLink: '/apps/role/list'
      },
      {
        id: 'trials',
        title: 'Manage Trials',
        icon: <Circle />,
        navLink: '/apps/trial/list'
      },
      {
        id: 'sponsers',
        title: 'Manage Sponser',
        icon: <Circle />,
        navLink: '/apps/sponsor/list'
      },
      {
        id: 'languages',
        title: 'Manage Languages',
        icon: <Circle />,
        navLink: '/apps/languages/list'
      },
      {
        id: 'userReport',
        title: 'Portal User Report',
        icon: <Circle />,
        navLink: '/apps/user-report/list'
      },
      {
        id: 'trialReport',
        title: 'Trial Reports',
        icon: <Circle />,
        navLink: '/apps/trial-report/list'
      }
    ]
  }
]
