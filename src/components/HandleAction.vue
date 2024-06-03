<!--Handles all actions with oobCodes, like
  https://firebase.google.com/docs/auth/custom-email-handler-->
<script setup lang="ts">
import { applyActionCode, checkActionCode, getAuth } from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';

const auth = getAuth();

const props = defineProps(['mode', 'oobCode']);

const errorMessage = ref();
const header = ref('Loading...');

function showError(error: Error) {
  header.value = 'Error';
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
  header.value = 'Update email completed!';
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
  <h2>{{ header }}</h2>
  <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
  <div><RouterLink to="/login">Log in</RouterLink></div>
</template>
