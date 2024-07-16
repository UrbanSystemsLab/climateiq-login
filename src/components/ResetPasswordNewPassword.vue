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

<style scoped>
.reset-password-new-password {
  width: var(--narrow-width);
}

.password-requirement {
  color: var(--secondary-text-color);
  font-size: 0.9rem;

  li {
    margin-left: 0;
  }

  p {
    margin: 0;
  }

  ul {
    margin-top: 0;
    padding-left: 1.5rem;
  }
}
</style>

<template>
  <div class="reset-password-new-password">
    <h2>Reset password</h2>
    <div class="password-requirement">
      <p>Password requirement</p>
      <ul>
        <li>Between 8 - 128 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
        <li>At least one special character</li>
      </ul>
    </div>
    <form
      @submit.prevent="confirmPassword"
      :class="{ 'error-state': errorMessage }"
    >
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="password">
        <label for="password">New password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          minlength="8"
          maxlength="128"
          pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&\;*\-\[\]]).{8,128}"
          autocomplete="new-password"
          required
        />
      </div>

      <button type="submit" class="primary-action">Continue</button>
    </form>
    <div class="account-actions">
      <p><RouterLink to="/sign-up">Create an account</RouterLink></p>
      <p><RouterLink to="/login">Log in</RouterLink></p>
    </div>
  </div>
</template>
