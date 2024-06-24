import { createRouter, createWebHistory, RouteLocation } from 'vue-router';

import LogIn from './components/LogIn.vue';
import LogOut from './components/LogOut.vue';

// All the routes except LogIn and LogOut are dynamically loaded because we expect 99%
// of traffic to be logging in and logging out, which doesn't require the rest of the
// app to be loaded.
// This also triggers Rollup to chunk the files appropriately when building for prod -
// we don't need to load large dependencies like Firestore unless the user is visiting
// one of the routes that requires it.
export const router = createRouter({
  history: createWebHistory('/auth/'),
  routes: [
    {
      path: '/',
      component: LogIn,
      props: (route: RouteLocation) => ({
        redirectUri: route.query.redirect_uri,
      }),
      alias: '/login',
    },
    // Account Management
    {
      path: '/account-management',
      component: () => import('./components/AccountManagement.vue'),
    },
    // Cookie Statement
    {
      path: '/cookie-statement',
      component: () => import('./components/CookieStatement.vue'),
    },
    // Handle Action
    {
      path: '/action',
      component: () => import('./components/HandleAction.vue'),
      props: (route: RouteLocation) => ({
        continueUrl: route.query.continueUrl,
        mode: route.query.mode,
        oobCode: route.query.oobCode,
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
    // Privacy Policy
    {
      path: '/privacy-policy',
      component: () => import('./components/PrivacyPolicy.vue'),
    },
    // Recover Email
    {
      path: '/recover-email-completed',
      component: () => import('./components/RecoverEmailCompleted.vue'),
      props: (route: RouteLocation) => ({ email: route.query.email }),
    },
    // Reset Password
    {
      path: '/reset-password',
      component: () => import('./components/ResetPassword.vue'),
    },
    {
      path: '/reset-password-check-email',
      component: () => import('./components/ResetPasswordCheckEmail.vue'),
      props: (route: RouteLocation) => ({ email: route.query.email }),
    },
    {
      path: '/reset-password-new-password',
      component: () => import('./components/ResetPasswordNewPassword.vue'),
      props: (route: RouteLocation) => ({ oobCode: route.query.oobCode }),
    },
    {
      path: '/reset-password-completed',
      component: () => import('./components/ResetPasswordCompleted.vue'),
    },
    // Sign Up
    {
      path: '/sign-up',
      component: () => import('./components/SignUp.vue'),
      props: (route: RouteLocation) => ({
        redirectUri: route.query.redirect_uri,
      }),
    },
    {
      path: '/sign-up-check-email',
      component: () => import('./components/SignUpCheckEmail.vue'),
      props: (route: RouteLocation) => ({
        redirectUri: route.query.redirect_uri,
      }),
    },
    // Terms of Service
    {
      path: '/terms-of-service',
      component: () => import('./components/TermsOfService.vue'),
    },
    // Update Email
    {
      path: '/update-email',
      component: () => import('./components/UpdateEmail.vue'),
    },
    {
      path: '/update-email-check-email',
      component: () => import('./components/UpdateEmailCheckEmail.vue'),
      props: (route: RouteLocation) => ({ newEmail: route.query.newEmail }),
    },
    {
      path: '/update-email-completed',
      component: () => import('./components/UpdateEmailCompleted.vue'),
    },
    // Verify Email (after signup)
    {
      path: '/verify-email-completed',
      component: () => import('./components/VerifyEmailCompleted.vue'),
      props: (route: RouteLocation) => ({
        redirectUri: route.query.redirect_uri,
      }),
    },
  ],
});
