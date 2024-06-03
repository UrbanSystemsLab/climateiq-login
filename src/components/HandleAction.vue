<!--Handles all actions with oobCodes, like
  https://firebase.google.com/docs/auth/custom-email-handler-->
<script setup lang="ts">
import { applyActionCode, checkActionCode, getAuth, signOut } from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';

import { router } from '../router';

const auth = getAuth();

const props = defineProps(['mode', 'oobCode']);

const errorMessage = ref();
const showState = ref('loading');

function showError(error: Error) {
  showState.value = 'error';
  // TODO: Clean up error message.
  errorMessage.value = error.message;
}

async function handleUpdateEmail() {
  try {
    await checkActionCode(auth, props.oobCode);
    await applyActionCode(auth, props.oobCode);
  } catch (error) {
    showError(error as Error);
    return;
  }
  // Need to sign out explicitly to prevent bug where the user still appears
  // to be signed in on the next view.
  signOut(auth);
  router.push({ path: 'update-email-completed' });
}

onBeforeMount(async () => {
  switch (props.mode) {
    case 'verifyAndChangeEmail':
      handleUpdateEmail();
      break;
    default:
    // Invalid mode
  }
});
</script>

<template>
  <div class="loading" v-if="showState == 'loading'">
    <h2>Loading...</h2>
  </div>

  <div class="error-message" v-if="showState == 'error'">
    <h2>Error</h2>
    <p>{{ errorMessage }}</p>
  </div>
</template>
