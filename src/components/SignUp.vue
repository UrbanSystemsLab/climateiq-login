<script setup lang="ts">
import { getApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { ref } from 'vue';

import CommonDisclaimer from './CommonDisclaimer.vue';
import { router } from '../router';

const auth = getAuth();
const db = getFirestore(getApp());

// Fields
const email = ref();
const password = ref();

async function signUp() {
  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value,
    );
  } catch (error) {
    // TODO: Show errors in UI.
    console.log(error);
    return;
  }
  await setDoc(doc(db, 'users', userCredential.user.uid), {});
  router.push({ path: 'sign-up-check-email' });
}
</script>

<template>
  <h2>Sign Up</h2>
  <form @submit.prevent>
    <div class="email">
      <label for="email">Email</label>
      <input type="text" name="email" v-model="email" />
      <p>We'll send you an email verification link.</p>
    </div>

    <div class="password">
      <label for="password">Password</label>
      <input type="password" name="password" v-model="password" />
    </div>

    <button @click="signUp" type="submit">Continue</button>

    <CommonDisclaimer />
  </form>
  <div class="have-account-login">
    <p>Already have an account?</p>
    <RouterLink to="/login">Log in</RouterLink>
  </div>
</template>
