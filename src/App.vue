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
      // Cookies are also deleted by the LogOut component, but this is here to
      // catch any alternate logout paths.
      deleteCookies();
    }
  },
);

onBeforeUnmount(unsubscribeAuthListener);
</script>

<style lang="scss">
@import 'carbon-components/scss/globals/scss/theme-tokens.scss';

header {
  background-color: $ui-background !important;
  border-bottom: 1px solid transparent !important;
  padding: 0 24px;
  position: static !important;
}

.cv-header-name {
  background: url('./logo.svg') 1rem 0 no-repeat;
  box-sizing: content-box;
  font-size: 0 !important;
  height: 18px !important;
  width: 81px !important;
}

.main-content {
  display: flex;
  justify-content: center;
  margin-top: 5rem;
}
</style>

<template>
  <CvHeader>
    <CvHeaderName href="https://dashboard.climateiq.org"
      >ClimateIQ</CvHeaderName
    >
  </CvHeader>
  <div class="main-content"><RouterView /></div>
</template>
