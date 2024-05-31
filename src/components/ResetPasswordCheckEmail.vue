<script setup lang="ts">
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { defineProps } from 'vue';

import CommonHelp from './CommonHelp.vue';

const auth = getAuth();

const props = defineProps(['email']);

async function resendEmail() {
  try {
    await sendPasswordResetEmail(auth, props.email);
  } catch (error) {
    // TODO: Show error in UI.
    console.log(error);
    return;
  }
  alert('Password Reset Email Sent!');
}
</script>

<template>
  <h2>Check your email</h2>
  <p>
    If there is an account associated with {{ email }}, you will receive an
    email with a link to reset your password.
  </p>
  <p>
    Didn't receive the email? Check your spam filter for an email from
    account@climateiq.org.
  </p>
  <button @click="resendEmail">Resend email</button>
  <div class="account-actions">
    <p><RouterLink to="/reset-password">Use another email</RouterLink></p>
    <p><RouterLink to="/login">Log in</RouterLink></p>
  </div>

  <CommonHelp />
</template>
