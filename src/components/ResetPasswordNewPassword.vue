<script setup lang="ts">
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { ref } from 'vue';

import { router } from '../router';

const auth = getAuth();

const props = defineProps({ oobCode: String });

const password = ref();

const errorMessage = ref();

async function confirmPassword() {
  try {
    await confirmPasswordReset(auth, props.oobCode!, password.value);
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  errorMessage.value = null;
  router.push({ path: 'reset-password-completed' });
}
</script>

<template>
  <h2>Reset password</h2>
  <!-- <p>Password requirement (placeholder)</p> -->
  <form @submit.prevent :class="{ 'error-state': errorMessage }">
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="password">
      <label for="password">New password</label>
      <input type="password" name="password" v-model="password" />
    </div>

    <button @click="confirmPassword" type="submit">Continue</button>
  </form>
  <div class="account-actions">
    <p><RouterLink to="/sign-up">Create an account</RouterLink></p>
    <p><RouterLink to="/login">Log in</RouterLink></p>
  </div>
</template>
