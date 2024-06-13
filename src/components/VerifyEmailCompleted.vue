<script setup lang="ts">
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { ref } from 'vue';

import { REDIRECT_URI_PROP, updateUserName } from '../common';

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

function goToRedirectUri() {
  window.location.href = props.redirectUri ? props.redirectUri : 'login';
}
</script>

<template>
  <h2>Complete Your Profile</h2>
  <p>
    Thanks for signing up! Please help improve our products by telling us a bit
    about your use case. Your answers will help us understand our audience and
    improve our offerings. We won't share your personal information.
  </p>
  <form @submit.prevent :class="{ 'error-state': errorMessage }">
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="first-name">
      <label for="firstName">First Name / Preferred Name</label>
      <input type="text" name="first-name" v-model="firstName" />
    </div>

    <div class="last-name">
      <label for="lastName">Last Name</label>
      <input type="text" name="last-name" v-model="lastName" />
    </div>

    <button @click="submitInfo" type="submit">Continue</button>
  </form>
  <div class="skip">
    <button @click="goToRedirectUri">Skip</button>
  </div>
</template>
