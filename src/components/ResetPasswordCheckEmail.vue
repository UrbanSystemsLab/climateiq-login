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

<style scoped>
.reset-password-check-email {
  width: var(--narrow-width);
}

.error-message {
  margin-top: 1.25rem;
}
</style>

<template>
  <div class="reset-password-check-email">
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
    <button @click="resendEmail" class="primary-action">Resend email</button>
    <div class="email-resent" v-if="emailResent">Email resent!</div>
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="account-actions">
      <p><RouterLink to="/reset-password">Use another email</RouterLink></p>
      <p><RouterLink to="/login">Log in</RouterLink></p>
    </div>
  </div>
</template>
