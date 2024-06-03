<script setup lang="ts">
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { ref } from 'vue';

import { updateUserName } from '../common';
import { router } from '../router';

const auth = getAuth();
const db = getFirestore(getApp());

// Fields
const firstName = ref();
const lastName = ref();

async function submitInfo() {
  await updateUserName(auth.currentUser!, db, firstName.value, lastName.value);
  router.push('/');
}
</script>

<template>
  <h2>Complete Your Profile</h2>
  <p>
    Thanks for signing up! Please help improve our products by telling us a bit
    about your use case. Your answers will help us understand our audience and
    improve our offerings. We won't share your personal information.
  </p>
  <form @submit.prevent>
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
    <RouterLink to="/">Skip</RouterLink>
  </div>
</template>
