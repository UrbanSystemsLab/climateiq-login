<script setup lang="ts">
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { onBeforeUnmount } from 'vue';

import { deleteCookies, getApigeeTokenAndSetCookies } from './common';
import firebaseConfigStr from '../firebase-config.json?raw';

const firebaseConfig = JSON.parse(firebaseConfigStr);
initializeApp(firebaseConfig);

const auth = getAuth();

// Listening for auth state changes.
const unsubscribeAuthListener = onAuthStateChanged(
  auth,
  async (user: User | null) => {
    if (user) {
      // User is signed in.
      const accessToken = await user.getIdToken();
      await getApigeeTokenAndSetCookies(accessToken);
    } else {
      // User is signed out.
      deleteCookies();
    }
  },
);

onBeforeUnmount(unsubscribeAuthListener);
</script>

<template>
  <h1 class="logo">ClimateIQ</h1>
  <RouterView />
</template>
