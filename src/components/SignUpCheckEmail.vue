<script setup lang="ts">
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import { onBeforeUnmount, ref } from 'vue';

import { REDIRECT_URI_PROP } from '../common';

const auth = getAuth();
const props = defineProps(REDIRECT_URI_PROP);

const email = ref();

const emailResent = ref(false);

const errorMessage = ref();

async function resendEmail() {
  emailResent.value = false;
  try {
    await sendEmailVerification(
      auth.currentUser!,
      props.redirectUri ? { url: props.redirectUri } : null,
    );
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  errorMessage.value = null;
  emailResent.value = true;
}

const unsubscribeAuthListener = onAuthStateChanged(auth, (user) => {
  if (user) {
    email.value = user.email;
  }
});

onBeforeUnmount(unsubscribeAuthListener);
</script>

<template>
  <div class="sign-up-check-email narrow-view">
    <h2>Check your email</h2>
    <p class="sent-email">
      We've sent an email to <span class="email">{{ email }}</span
      >. Please click on the link in your email to verify.
    </p>
    <p class="didnt-receive-email">
      Didn't receive the email? Check your spam filter for an email from
      noreply@climateiq.org.
    </p>
    <CvButton @click="resendEmail" type="primary">Resend email</CvButton>
    <CvInlineNotification
      v-if="errorMessage"
      :subTitle="errorMessage"
      kind="error"
      lowContrast
      hideCloseButton
    ></CvInlineNotification>
    <CvInlineNotification
      v-if="emailResent"
      subTitle="Email resent!"
      kind="success"
      lowContrast
      hideCloseButton
    ></CvInlineNotification>
    <div class="account-actions">
      <p><CvLink to="/sign-up" inline>Use another email</CvLink></p>
      <p><CvLink to="/login" inline>Log in</CvLink></p>
    </div>
  </div>
</template>
