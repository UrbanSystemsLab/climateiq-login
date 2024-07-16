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

<style scoped>
.update-email {
  width: var(--narrow-width);
}

.password {
  margin-bottom: 0;
}

.will-send-email {
  color: var(--secondary-text-color);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
</style>

<template>
  <div class="update-email">
    <h2>Update email</h2>
    <form
      @submit.prevent="updateEmail"
      :class="{ 'error-state': errorMessage }"
    >
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="current-email">
        <label for="current-email">Current email</label>
        <input type="email" id="current-email" :value="currentEmail" readonly />
      </div>

      <div class="new-email">
        <label for="new-email">New email</label>
        <input type="email" id="new-email" v-model="newEmail" required />
      </div>

      <div class="password">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          autocomplete="current-password"
          required
        />
      </div>
      <p class="will-send-email">We'll send you an email verification link.</p>
      <button type="submit" class="primary-action">Continue</button>
    </form>
  </div>
</template>
