<script setup lang="ts">
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { ref } from 'vue';

import CommonHelp from './CommonHelp.vue';
import { router } from '../router';

const auth = getAuth();

const props = defineProps({ oobCode: String });

const password = ref();

async function confirmPassword() {
  try {
    await confirmPasswordReset(auth, props.oobCode!, password.value);
  } catch (error) {
    // TODO: Show error in UI.
    console.log(error);
    return;
  }
  router.push({ path: 'reset-password-completed' });
}
</script>

<template>
  <h2>Reset password</h2>
  <p>Password requirement (placeholder)</p>
  <form @submit.prevent>
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

  <CommonHelp />
</template>
