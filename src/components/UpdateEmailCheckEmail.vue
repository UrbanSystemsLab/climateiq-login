<script setup lang="ts">
import { getAuth, verifyBeforeUpdateEmail } from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';

import { router } from '../router';

const auth = getAuth();

const props = defineProps(['newEmail']);

const currentEmail = ref();

async function resendEmail() {
  try {
    await verifyBeforeUpdateEmail(auth.currentUser!, props.newEmail);
  } catch (error) {
    // TODO: Show error in UI.
    console.log(error);
    return;
  }
  // TODO: Show UI message indicating the email has been sent.
  alert('Update Email Sent!');
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
  <h2>Check your email</h2>
  <p>
    We've sent an email to {{ props.newEmail }}. Please click on the link in
    your email to verify.
  </p>
  <p>
    Didn't receive the mail? Check your spam filter for an email from
    account@climateiq.org.
  </p>
  <button @click="resendEmail">Resend email</button>
  <div class="account-actions">
    <p><RouterLink to="/update-email">Use another email</RouterLink></p>
    <p><RouterLink to="/login">Log in</RouterLink></p>
  </div>
</template>
