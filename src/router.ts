import { createRouter, createWebHistory, RouteLocation } from 'vue-router';

import AccountManagement from './components/AccountManagement.vue';
import LogIn from './components/LogIn.vue';
import LogOut from './components/LogOut.vue';
import SignUp from './components/SignUp.vue';
import SignUpCheckEmail from './components/SignUpCheckEmail.vue';

export const router = createRouter({
  history: createWebHistory('/auth/'),
  routes: [
    {
      path: '/',
      component: LogIn,
      props: (route: RouteLocation) => ({
        redirectUri: route.query.redirect_uri,
      }),
    },
    // Account Management
    { path: '/account-management', component: AccountManagement },
    // Login
    {
      path: '/login',
      component: LogIn,
      props: (route: RouteLocation) => ({
        redirectUri: route.query.redirect_uri,
      }),
    },
    // Logout
    {
      path: '/logout',
      component: LogOut,
      props: (route: RouteLocation) => ({
        redirectUri: route.query.redirect_uri,
      }),
    },
    // Sign Up
    { path: '/sign-up', component: SignUp },
    { path: '/sign-up-check-email', component: SignUpCheckEmail },
  ],
});
