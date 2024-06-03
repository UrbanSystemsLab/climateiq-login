import { createRouter, createWebHistory, RouteLocation } from 'vue-router';

import AccountManagement from './components/AccountManagement.vue';
import HandleAction from './components/HandleAction.vue';
import LogIn from './components/LogIn.vue';
import LogOut from './components/LogOut.vue';
import RecoverEmailCompleted from './components/RecoverEmailCompleted.vue';
import ResetPassword from './components/ResetPassword.vue';
import ResetPasswordCheckEmail from './components/ResetPasswordCheckEmail.vue';
import ResetPasswordCompleted from './components/ResetPasswordCompleted.vue';
import ResetPasswordNewPassword from './components/ResetPasswordNewPassword.vue';
import SignUp from './components/SignUp.vue';
import SignUpCheckEmail from './components/SignUpCheckEmail.vue';
import UpdateEmail from './components/UpdateEmail.vue';
import UpdateEmailCheckEmail from './components/UpdateEmailCheckEmail.vue';
import UpdateEmailCompleted from './components/UpdateEmailCompleted.vue';
import VerifyEmailCompleted from './components/VerifyEmailCompleted.vue';

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
    // Recover Email
    {
      path: '/recover-email-completed',
      component: RecoverEmailCompleted,
      props: (route: RouteLocation) => ({ email: route.query.email }),
    },
    // Reset Password
    { path: '/reset-password', component: ResetPassword },
    {
      path: '/reset-password-check-email',
      component: ResetPasswordCheckEmail,
      props: (route: RouteLocation) => ({ email: route.query.email }),
    },
    {
      path: '/reset-password-new-password',
      component: ResetPasswordNewPassword,
      props: (route: RouteLocation) => ({ oobCode: route.query.oobCode }),
    },
    { path: '/reset-password-completed', component: ResetPasswordCompleted },
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
    // Verify Email (after signup)
    { path: '/verify-email-completed', component: VerifyEmailCompleted },
  ],
});
