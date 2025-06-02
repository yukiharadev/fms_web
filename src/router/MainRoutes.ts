const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true,
  },
  redirect: '/main',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'Dashboard',
      path: '/',
      component: () => import('@/views/dashboard/index.vue'),
    },
    //Company
    {
      name: 'Business Category',
      path: '/company/business-category',
      component: () => import('@/views/business_sector/index.vue'),
    },
    {
      name: 'All Companies',
      path: '/company/all-companies',
      component: () => import('@/views/company/index.vue'),
    },
    {
      name: 'company.view',

      path: '/company/details/:symbol',
      props: true,
      component: () => import('@/views/company/ViewCompany.vue'),
    },
    {
      name: 'company.edit',
      path: '/company/edit/:symbol',
      props: true,
      component: () => import('@/views/company/EditCompany.vue'),
    },
    //Financial
    {
      name: 'Import',
      path: '/financial/import',
      component: () => import('@/views/financial/ImportFinancial.vue'),
    },

    //Auth
    {
      name: 'All Users',

      path: '/auth/all-users',
      component: () => import('@/views/auth/AllUsers.vue'),
    },
    {
      name: ' Roles',
      path: '/auth/roles',
      component: () => import('@/views/auth/Roles.vue'),
    },
    {
      name: 'Profile',
      path: '/auth/profile',
      component: () => import('@/views/users/profile.vue'),
    },
    {
      name: 'Follow',

      path: '/auth/follow',
      component: () => import('@/views/users/follow.vue'),
    },
    {
      name: 'person-detail',
      path: '/person/detail/:id',
      component: () => import('@/views/person/index.vue'),
    },
    {
      name: 'company-list-sector',
      path: '/company/list-sector/:id',
      props: true,
      component: () => import('@/views/dashboard/CompanyListSector.vue'),
    },
    {
      name: 'ceo',
      path: '/ceo',
      component: () => import('@/views/ceo/index.vue'),
    },
  ],
}

export default MainRoutes
