<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';
import { onBeforeMount } from 'vue';

import { REDIRECT_URI_PROP } from '../common';
import { router } from '../router';

const auth = getAuth();

const props = defineProps(REDIRECT_URI_PROP);

async function logOut() {
  await signOut(auth);
  if (props.redirectUri) {
    window.location.href = props.redirectUri;
  } else {
    router.push({ path: '/' });
  }
}

onBeforeMount(logOut);
</script>

<template><h2>Logging out...</h2></template>
