<script setup lang="ts">
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import { onBeforeUnmount, ref } from 'vue';

const auth = getAuth();

const email = ref();

async function resendEmail() {
  try {
    await sendEmailVerification(auth.currentUser!);
  } catch (error) {
    // TODO: Show error in UI.
    console.log(error);
  }
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
    Didn't receive the mail? Check your spam filter for an email from
    account@climateiq.com.
  </p>
  <button @click="resendEmail">Resend email</button>
  <div class="account-actions">
    <p><RouterLink to="/sign-up">Use another email</RouterLink></p>
    <p><RouterLink to="/login">Log in</RouterLink></p>
  </div>

  <div class="need-help">
    Need help? Contact at
    <a href="mailto:support@climateiq.com">support@climateiq.com</a>.
  </div>
</template>
