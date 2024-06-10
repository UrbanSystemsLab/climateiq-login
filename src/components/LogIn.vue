<script setup lang="ts">
import CommonDisclaimer from './CommonDisclaimer.vue';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { onBeforeUnmount, ref } from 'vue';

import { REDIRECT_URI_PROP } from '../common';
import { router } from '../router';

const auth = getAuth();
const props = defineProps(REDIRECT_URI_PROP);

// Fields
const email = ref();
const password = ref();
const errorMessage = ref();

async function signIn() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  // Clear the error if this sign in attempt does not throw an error.
  errorMessage.value = null;
}

// Listening for auth state changes.
const unsubscribeAuthListener = onAuthStateChanged(auth, (user) => {
  if (user) {
    if (props.redirectUri) {
      window.location.href = props.redirectUri;
    } else {
      router.push({ path: '/account-management' });
    }
  }
});

onBeforeUnmount(unsubscribeAuthListener);
</script>

<template>
  <h2>Login</h2>
  <form @submit.prevent :class="{ 'error-state': errorMessage }">
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="email">
      <label for="email">Email</label>
      <input type="email" v-model="email" />
    </div>

    <div class="password">
      <label for="password">Password</label>
      <input type="password" v-model="password" />
    </div>

    <div class="reset-password">
      <RouterLink to="reset-password">Reset Password</RouterLink>
    </div>

    <button @click="signIn" type="submit">Continue</button>

    <CommonDisclaimer />
  </form>
  <div class="no-account-sign-up">
    <p>Don't have an account?</p>
    <RouterLink to="/sign-up">Create account</RouterLink>
  </div>
</template>
