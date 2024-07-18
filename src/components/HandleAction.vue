<!--Handles all actions with oobCodes, like
  https://firebase.google.com/docs/auth/custom-email-handler-->
<script setup lang="ts">
import {
  ActionCodeInfo,
  applyActionCode,
  checkActionCode,
  getAuth,
  signOut,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';

import { router } from '../router';

const auth = getAuth();

const props = defineProps(['continueUrl', 'mode', 'oobCode']);

const errorMessage = ref();
const showState = ref('loading');

function showError(error: Error) {
  showState.value = 'error';
  // TODO: Clean up error message.
  errorMessage.value = error.message;
}

async function handleRecoverEmail() {
  let info: ActionCodeInfo;
  try {
    info = await checkActionCode(auth, props.oobCode);
    await applyActionCode(auth, props.oobCode);
  } catch (error) {
    showError(error as Error);
    return;
  }
  router.push({
    path: 'recover-email-completed',
    query: { email: info['data']['email'] },
  });
}

async function handleResetPassword() {
  try {
    await verifyPasswordResetCode(auth, props.oobCode);
  } catch (error) {
    showError(error as Error);
    return;
  }
  router.push({
    path: 'reset-password-new-password',
    query: { oobCode: props.oobCode },
  });
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

async function handleVerifyEmail() {
  try {
    await checkActionCode(auth, props.oobCode);
    await applyActionCode(auth, props.oobCode);
  } catch (error) {
    showError(error as Error);
    return;
  }
  if (auth.currentUser) {
    router.push({
      path: 'verify-email-completed',
      query: { redirect_uri: props.continueUrl },
    });
  } else {
    router.push({
      path: 'login',
      query: {
        redirect_uri: `verify-email-completed?redirect_uri=${props.continueUrl ? props.continueUrl : ''}`,
      },
    });
  }
}

onBeforeMount(async () => {
  switch (props.mode) {
    case 'recoverEmail':
      // i.e., undo email change.
      handleRecoverEmail();
      break;
    case 'resetPassword':
      handleResetPassword();
      break;
    case 'verifyAndChangeEmail':
      // i.e., verify email change on existing account.
      handleUpdateEmail();
      break;
    case 'verifyEmail':
      // i.e., verify email after sign up.
      handleVerifyEmail();
      break;
    default:
      showError(Error(`${props.mode} is not a valid mode.`));
  }
});
</script>

<template>
  <div class="handle-action loading narrow-view" v-if="showState == 'loading'">
    <h2>Loading...</h2>
    <CvLoading active />
  </div>

  <div class="handle-action error narrow-view" v-if="showState == 'error'">
    <h2>Error</h2>
    <CvInlineNotification
      v-if="errorMessage"
      :subTitle="errorMessage"
      kind="error"
      lowContrast
      hideCloseButton
    ></CvInlineNotification>
  </div>
</template>
