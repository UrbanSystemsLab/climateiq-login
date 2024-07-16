<script setup lang="ts">
import { getApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { ref } from 'vue';

import { REDIRECT_URI_PROP } from '../common';
import CommonDisclaimer from './CommonDisclaimer.vue';
import { router } from '../router';
import { createUserOnClimasens } from '../user-utils';

const auth = getAuth();
const db = getFirestore(getApp());
const props = defineProps(REDIRECT_URI_PROP);

// Fields
const email = ref();
const password = ref();

const errorMessage = ref();

async function signUp() {
  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value,
    );
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  try {
    await setDoc(doc(db, 'users', userCredential.user.uid), {});
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  try {
    await createUserOnClimasens();
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  try {
    sendEmailVerification(
      userCredential.user,
      props.redirectUri ? { url: props.redirectUri } : null,
    );
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  errorMessage.value = null;
  router.push({
    path: 'sign-up-check-email',
    query: { redirect_uri: props.redirectUri },
  });
}
</script>

<style scoped>
.sign-up {
  width: var(--narrow-width);
}

.email p {
  color: var(--secondary-text-color);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.have-account-log-in {
  border-top: 1px solid var(--divider-color);
}
</style>

<template>
  <div class="sign-up">
    <h2>Sign Up</h2>
    <form @submit.prevent="signUp" :class="{ 'error-state': errorMessage }">
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="email">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
        <p>We'll send you an email verification link.</p>
      </div>

      <div class="password">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          autocomplete="new-password"
          required
        />
      </div>

      <button type="submit" class="primary-action">Continue</button>

      <CommonDisclaimer />
    </form>
    <div class="have-account-login">
      <p>Already have an account?</p>
      <RouterLink to="/login" class="secondary-action">Log in</RouterLink>
    </div>
  </div>
</template>
