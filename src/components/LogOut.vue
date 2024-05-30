<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';
import { onMounted } from 'vue';

import { REDIRECT_URI_PROP } from '../common';
import { router } from '../router';

const auth = getAuth();

const props = defineProps(REDIRECT_URI_PROP);

function logOut() {
  signOut(auth).then(() => {
    if (props.redirectUri) {
      window.location.href = props.redirectUri;
    } else {
      router.push({ path: '/' });
    }
  });
}

onMounted(logOut);
</script>

<template><div></div></template>
