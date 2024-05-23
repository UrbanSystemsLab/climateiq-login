import { createRouter, createWebHistory } from 'vue-router';

import SignUp from './components/SignUp.vue';
import SignUpCheckEmail from './components/SignUpCheckEmail.vue';

export const router = createRouter({
  history: createWebHistory('/auth/'),
  routes: [
    // Sign Up
    { path: '/sign-up', component: SignUp },
    { path: '/sign-up-check-email', component: SignUpCheckEmail },
  ],
});
