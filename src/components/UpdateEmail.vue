<script setup lang="ts">
import {
  getAuth,
  signInWithEmailAndPassword,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';

import { router } from '../router';

const auth = getAuth();

const currentEmail = ref();
const newEmail = ref();
const password = ref();

const errorMessage = ref();

async function updateEmail() {
  try {
    await signInWithEmailAndPassword(auth, currentEmail.value, password.value);
    await verifyBeforeUpdateEmail(auth.currentUser!, newEmail.value);
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  errorMessage.value = null;
  router.push({
    path: 'update-email-check-email',
    query: { newEmail: newEmail.value },
  });
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
  <h2>Update email</h2>
  <form @submit.prevent :class="{ 'error-message': errorMessage }">
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="current-email">
      <label for="current-email">Current email</label>
      <input type="text" name="current-email" :value="currentEmail" readonly />
    </div>

    <div class="new-email">
      <label for="new-email">New email</label>
      <input type="text" name="new-email" v-model="newEmail" required />
    </div>

    <div class="password">
      <label for="password">Password</label>
      <input type="password" name="password" v-model="password" required />
    </div>
    <p>We'll send you an email verification link.</p>
    <button @click="updateEmail" type="submit">Continue</button>
  </form>
</template>
