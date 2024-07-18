<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';
import { onBeforeMount } from 'vue';

import { deleteCookies, REDIRECT_URI_PROP } from '../common';
import { router } from '../router';

const auth = getAuth();

const props = defineProps(REDIRECT_URI_PROP);

async function logOut() {
  await signOut(auth);
  deleteCookies();
  if (props.redirectUri) {
    window.location.href = props.redirectUri;
  } else {
    router.push({ path: '/' });
  }
}

onBeforeMount(logOut);
</script>

<template>
  <div class="log-out narrow-view">
    <h2>Logging out...</h2>
    <CvLoading active />
  </div>
</template>
