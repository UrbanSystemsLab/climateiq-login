<script setup lang="ts">
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import { onBeforeUnmount, ref } from 'vue';

const auth = getAuth();

const email = ref();

const emailResent = ref(false);

const errorMessage = ref();

async function resendEmail() {
  emailResent.value = false;
  try {
    await sendEmailVerification(auth.currentUser!);
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
  <h2>Check your email</h2>
  <p>
    We've sent an email to {{ email }}. Please click on the link in your email
    to verify.
  </p>
  <p>
    Didn't receive the email? Check your spam filter for an email from
    account@climateiq.com.
  </p>
  <button @click="resendEmail">Resend email</button>
  <div class="email-resent" v-if="emailResent">Email resent!</div>
  <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
  <div class="account-actions">
    <p><RouterLink to="/sign-up">Use another email</RouterLink></p>
    <p><RouterLink to="/login">Log in</RouterLink></p>
  </div>
</template>
