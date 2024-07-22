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

<template>
  <div class="sign-up narrow-view">
    <h2>Sign Up</h2>
    <CvInlineNotification
      v-if="errorMessage"
      :subTitle="errorMessage"
      kind="error"
      lowContrast
      hideCloseButton
    ></CvInlineNotification>
    <CvForm @submit.prevent="signUp">
      <CvTextInput
        label="Email"
        v-model="email"
        :data-invalid="errorMessage"
        helperText="We'll send you an email verification link."
      />
      <CvTextInput
        label="Password"
        v-model="password"
        :data-invalid="errorMessage"
        type="password"
        autocomplete="new-password"
        required
      />
      <CvButton kind="primary">Continue</CvButton>
    </CvForm>
    <CommonDisclaimer />
    <div class="account-actions">
      <p>Already have an account?</p>
      <RouterLink to="/login"
        ><CvButton kind="tertiary">Log in</CvButton></RouterLink
      >
    </div>
  </div>
</template>
