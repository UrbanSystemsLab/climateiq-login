<script setup lang="ts">
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';

import CommonHelp from './CommonHelp.vue';
import { router } from '../router';

const auth = getAuth();

// Fields
const email = ref();

// Toggles
const loggedIn = ref(false);

async function resetPassword() {
  try {
    await sendPasswordResetEmail(auth, email.value);
  } catch (error) {
    // TODO: Show error in UI.
    console.log(error);
    return;
  }
  router.push({
    path: 'reset-password-check-email',
    query: { email: email.value },
  });
}

onBeforeMount(async () => {
  await auth.authStateReady();
  if (auth.currentUser) {
    loggedIn.value = true;
    email.value = auth.currentUser.email;
  }
});
</script>

<template>
  <h2>Reset your password</h2>
  <form @submit.prevent>
    <div class="email">
      <label for="email">Email</label>
      <input type="text" name="email" v-model="email" />
    </div>

    <button @click="resetPassword" type="submit">Continue</button>
  </form>
  <div class="account-actions" v-if="!loggedIn">
    <p><RouterLink to="/sign-up">Create an account</RouterLink></p>
    <p><RouterLink to="/login">Log in</RouterLink></p>
  </div>

  <CommonHelp />
</template>
