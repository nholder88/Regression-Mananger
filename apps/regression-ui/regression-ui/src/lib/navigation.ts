export interface NavLink {
  title: string;
  link: string;
  subRoutes: NavLink[] | null;
  rolesAllowed: string[];
  summary: string;
}

export const appAreas: NavLink[] = [
  {
    title: 'Dashboard',
    link: '/dashboard',
    subRoutes: null,
    rolesAllowed: ['admin', 'tester', 'qa'],
    summary: 'Overview of Regression',
  },
  {
    title: 'Regressions',
    link: '/regression',
    subRoutes: [
      {
        title: 'Test Passes',
        link: '/regression/listing',
        summary: '',
        rolesAllowed: ['admin', 'tester', 'qa'],
        subRoutes: null,
      },
      {
        title: 'History',
        link: '/regression/history',
        summary: '',
        rolesAllowed: ['admin', 'tester', 'qa'],
        subRoutes: null,
      },
    ],
    rolesAllowed: ['admin', 'tester', 'qa'],
    summary: 'Overview of Regression',
  },
  {
    title: 'Administration',
    link: '/admin',
    subRoutes: [
      {
        title: 'Users',
        link: '/admin/users',
        summary: 'Manage Users and roles',
        rolesAllowed: ['admin'],
        subRoutes: null,
      },
      {
        title: 'Features',
        link: '/admin/features',
        summary: 'Manage Features',
        rolesAllowed: ['admin'],
        subRoutes: null,
      },
      {
        title: 'Scenarios',
        link: '/admin/scenarios',
        summary: 'Manage Scenarios',
        rolesAllowed: ['admin'],
        subRoutes: null,
      },
    ],
    rolesAllowed: ['admin'],
    summary: 'Administration',
  },
];
