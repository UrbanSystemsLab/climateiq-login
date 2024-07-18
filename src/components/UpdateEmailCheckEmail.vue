<script setup lang="ts">
import { getAuth, verifyBeforeUpdateEmail } from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';

import { router } from '../router';

const auth = getAuth();

const props = defineProps(['newEmail']);

const emailResent = ref(false);

const errorMessage = ref();

async function resendEmail() {
  emailResent.value = false;
  try {
    await verifyBeforeUpdateEmail(auth.currentUser!, props.newEmail);
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  errorMessage.value = null;
  emailResent.value = true;
}

onBeforeMount(async () => {
  await auth.authStateReady();
  if (!auth.currentUser) {
    router.push('/');
  }
});
</script>

<template>
  <div class="update-email-check-email narrow-view">
    <h2>Check your email</h2>
    <p class="sent-email">
      We've sent an email to <span class="email">{{ props.newEmail }}</span
      >. Please click on the link in your email to verify.
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
      <p><CvLink to="/update-email" inline>Use another email</CvLink></p>
      <p><CvLink to="/login" inline>Log in</CvLink></p>
    </div>
  </div>
</template>
