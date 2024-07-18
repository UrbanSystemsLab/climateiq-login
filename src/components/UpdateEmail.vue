<script setup lang="ts">
import {
  getAuth,
  signInWithEmailAndPassword,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';

import { router } from '../router';

const auth = getAuth();

const currentEmail = ref();
const newEmail = ref();
const password = ref();

const errorMessage = ref();

async function updateEmail() {
  try {
    await signInWithEmailAndPassword(auth, currentEmail.value, password.value);
    await verifyBeforeUpdateEmail(auth.currentUser!, newEmail.value);
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  errorMessage.value = null;
  router.push({
    path: 'update-email-check-email',
    query: { newEmail: newEmail.value },
  });
}

onBeforeMount(async () => {
  await auth.authStateReady();
  if (auth.currentUser) {
    currentEmail.value = auth.currentUser.email;
  } else {
    router.push('/');
  }
});
</script>

<template>
  <div class="update-email narrow-view">
    <h2>Update email</h2>
    <CvInlineNotification
      v-if="errorMessage"
      :subTitle="errorMessage"
      kind="error"
      lowContrast
      hideCloseButton
    ></CvInlineNotification>
    <CvForm @submit.prevent="updateEmail">
      <CvTextInput
        v-model="currentEmail"
        :data-invalid="errorMessage"
        label="Current Email"
        invalid="errorMessage"
        readonly
      />
      <CvTextInput
        v-model="newEmail"
        :data-invalid="errorMessage"
        label="New email"
        helperText="We'll send you an email verification link."
        required
      />
      <CvTextInput
        v-model="password"
        :data-invalid="errorMessage"
        label="Password"
        type="password"
        autocomplete="current-password"
        required
      />
      <CvButton kind="primary">Continue</CvButton>
    </CvForm>
  </div>
</template>
