<script setup lang="ts">
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { ref } from 'vue';

const auth = getAuth();

const props = defineProps(['email']);

const emailResent = ref(false);

const errorMessage = ref();

async function resendEmail() {
  emailResent.value = false;
  try {
    await sendPasswordResetEmail(auth, props.email);
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  errorMessage.value = null;
  emailResent.value = true;
}
</script>

<template>
  <div class="reset-password-check-email narrow-view">
    <h2>Check your email</h2>
    <p class="sent-email">
      If there is an account associated with
      <span class="email">{{ email }}</span
      >, you will receive an email with a link to reset your password.
    </p>
    <p>
      Didn't receive the email? Check your spam filter for an email from
      noreply@climateiq.org.
    </p>
    <CvButton @click="resendEmail" kind="primary">Resend email</CvButton>
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
      <p><CvLink to="/reset-password" inline>Use another email</CvLink></p>
      <p><CvLink to="/login" inline>Log in</CvLink></p>
    </div>
  </div>
</template>
