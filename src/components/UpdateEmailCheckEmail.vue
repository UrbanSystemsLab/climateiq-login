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
  <h2>Check your email</h2>
  <p>
    We've sent an email to {{ props.newEmail }}. Please click on the link in
    your email to verify.
  </p>
  <p>
    Didn't receive the email? Check your spam filter for an email from
    noreply@climateiq.org.
  </p>
  <button @click="resendEmail">Resend email</button>
  <div class="email-resent" v-if="emailResent">Email resent!</div>
  <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
  <div class="account-actions">
    <p><RouterLink to="/update-email">Use another email</RouterLink></p>
    <p><RouterLink to="/login">Log in</RouterLink></p>
  </div>
</template>
