import BlankLayout from '@/layouts/blank/BlankLayout.vue';
  import Login from '@/views/auth/Login.vue';
  import Register from '@/views/auth/Register.vue';

  const AuthRoutes = {
    path: '/auth',
    component: BlankLayout,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        name: 'Login',
        path: '/auth/login',
        component: Login
      },
      {
        name: 'Register',
        path: '/auth/register',
        component: Register
      },
    ]
  };

  export default AuthRoutes;
