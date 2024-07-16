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

<style scoped>
.sign-up-check-email {
  width: var(--narrow-width);
}

.email-resent {
  color: var(--secondary-text-color);
  font-size: 0.8rem;
}

.email-resent,
.error-message {
  margin-top: 1.25rem;
}
</style>

<template>
  <div class="sign-up-check-email">
    <h2>Check your email</h2>
    <p class="sent-email">
      We've sent an email to <span class="email">{{ email }}</span
      >. Please click on the link in your email to verify.
    </p>
    <p class="didnt-receive-email">
      Didn't receive the email? Check your spam filter for an email from
      noreply@climateiq.org.
    </p>
    <button @click="resendEmail" class="primary-action">Resend email</button>
    <div class="email-resent" v-if="emailResent">Email resent!</div>
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="account-actions">
      <p><RouterLink to="/sign-up">Use another email</RouterLink></p>
      <p><RouterLink to="/login">Log in</RouterLink></p>
    </div>
  </div>
</template>
