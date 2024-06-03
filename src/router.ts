import { createRouter, createWebHistory, RouteLocation } from 'vue-router';

import AccountManagement from './components/AccountManagement.vue';
import HandleAction from './components/HandleAction.vue';
import LogIn from './components/LogIn.vue';
import LogOut from './components/LogOut.vue';
import SignUp from './components/SignUp.vue';
import SignUpCheckEmail from './components/SignUpCheckEmail.vue';
import UpdateEmail from './components/UpdateEmail.vue';
import UpdateEmailCheckEmail from './components/UpdateEmailCheckEmail.vue';
import UpdateEmailCompleted from './components/UpdateEmailCompleted.vue';

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
    // Handle Action
    {
      path: '/action',
      component: HandleAction,
      props: (route: RouteLocation) => ({
        mode: route.query.mode,
        oobCode: route.query.oobCode,
      }),
    },
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
    // Update Email
    { path: '/update-email', component: UpdateEmail },
    {
      path: '/update-email-check-email',
      component: UpdateEmailCheckEmail,
      props: (route: RouteLocation) => ({ newEmail: route.query.newEmail }),
    },
    { path: '/update-email-completed', component: UpdateEmailCompleted },
  ],
});
