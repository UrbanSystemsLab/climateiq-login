<script setup lang="ts">
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { ref } from 'vue';

import { cookiesSet, REDIRECT_URI_PROP } from '../common';
import { router } from '../router';
import { updateUserName } from '../user-utils';

const auth = getAuth();
const db = getFirestore(getApp());
const props = defineProps(REDIRECT_URI_PROP);

// Fields
const firstName = ref();
const lastName = ref();

const errorMessage = ref();

async function submitInfo() {
  try {
    await updateUserName(
      auth.currentUser!,
      db,
      firstName.value,
      lastName.value,
    );
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }

  errorMessage.value = null;
  goToRedirectUri();
}

async function goToRedirectUri() {
  await cookiesSet;
  if (props.redirectUri) {
    window.location.href = props.redirectUri;
  } else {
    router.push({ path: '/' });
  }
}
</script>

<style scoped>
.verify-email-completed {
  max-width: var(--wide-width);
}

form {
  display: grid;
  column-gap: 1rem;
  grid-template-areas:
    'error-msg error-msg'
    '. .';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  margin-bottom: 1.25rem;
  row-gap: 1rem;

  .error-message {
    grid-area: error-msg;
    margin-bottom: 0;
  }

  .primary-action {
    min-width: 12rem;
    height: fit-content;
    width: fit-content;
  }
}

.skip button {
  background: none;
  border: 0;
  color: var(--accent-color);
  font-size: 1rem;
  padding: 0;
  text-decoration: underline;
}

.skip button:hover {
  cursor: pointer;
}
</style>

<template>
  <div class="verify-email-completed">
    <h2>Complete Your Profile</h2>
    <p>
      Thanks for signing up! Please help improve our products by telling us a
      bit about your use case. Your answers will help us understand our audience
      and improve our offerings. We won't share your personal information.
    </p>
    <form @submit.prevent="submitInfo" :class="{ 'error-state': errorMessage }">
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="first-name">
        <label for="first-name">First Name / Preferred Name</label>
        <input type="text" id="first-name" v-model="firstName" required />
      </div>

      <div class="last-name">
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" v-model="lastName" required />
      </div>

      <button type="submit" class="primary-action">Continue</button>
    </form>
    <div class="skip">
      <button @click="goToRedirectUri">Skip</button>
    </div>
  </div>
</template>
