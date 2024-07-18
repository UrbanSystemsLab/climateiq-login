<script setup lang="ts">
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';

import CommonHelp from './CommonHelp.vue';
import { router } from '../router';

const auth = getAuth();

// Fields
const email = ref();

// Toggles
const loggedIn = ref(false);

// Error messages
const errorMessage = ref();

async function resetPassword() {
  try {
    await sendPasswordResetEmail(auth, email.value);
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  errorMessage.value = null;
  router.push({
    path: 'reset-password-check-email',
    query: { email: email.value },
  });
}

onBeforeMount(async () => {
  await auth.authStateReady();
  if (auth.currentUser) {
    loggedIn.value = true;
    email.value = auth.currentUser.email;
  }
});
</script>

<template>
  <div class="reset-password narrow-view">
    <h2>Reset your password</h2>
    <CvInlineNotification
      v-if="errorMessage"
      :subTitle="errorMessage"
      kind="error"
      lowContrast
      hideCloseButton
    ></CvInlineNotification>
    <CvForm @submit.prevent="resetPassword">
      <CvTextInput v-model="email" :data-invalid="errorMessage" label="Email" />
      <CvButton kind="primary">Continue</CvButton>
    </CvForm>
    <div class="account-actions" v-if="!loggedIn">
      <p><CvLink to="/sign-up" inline>Create an account</CvLink></p>
      <p><CvLink to="/login" inline>Log in</CvLink></p>
    </div>
    <CommonHelp />
  </div>
</template>
