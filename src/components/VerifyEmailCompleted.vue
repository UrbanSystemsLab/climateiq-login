<script setup lang="ts">
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { ref } from 'vue';

import { cookiesSet, REDIRECT_URI_PROP } from '../common';
import { router } from '../router';
import { updateUserName } from '../user-utils';

const auth = getAuth();
const db = getFirestore(getApp());
const props = defineProps(REDIRECT_URI_PROP);

// Fields
const firstName = ref();
const lastName = ref();

const errorMessage = ref();

async function submitInfo() {
  try {
    await updateUserName(
      auth.currentUser!,
      db,
      firstName.value,
      lastName.value,
    );
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }

  errorMessage.value = null;
  goToRedirectUri();
}

async function goToRedirectUri() {
  await cookiesSet;
  if (props.redirectUri) {
    window.location.href = props.redirectUri;
  } else {
    router.push({ path: '/' });
  }
}
</script>

<style scoped>
form,
p,
.cv-text-input {
  margin-bottom: 1rem;
}

form .fields {
  display: grid;
  column-gap: 0.5rem;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  row-gap: 0.5rem;
}
</style>

<template>
  <div class="verify-email-completed wide-view">
    <h2>Complete Your Profile</h2>
    <p>
      Thanks for signing up! Please help improve our products by telling us a
      bit about your use case. Your answers will help us understand our audience
      and improve our offerings. We won't share your personal information.
    </p>
    <CvInlineNotification
      v-if="errorMessage"
      :subTitle="errorMessage"
      kind="error"
      lowContrast
      hideCloseButton
    ></CvInlineNotification>
    <CvForm @submit.prevent="submitInfo">
      <div class="fields">
        <CvTextInput
          v-model="firstName"
          :data-invalid="errorMessage"
          label="First / Preferred Name"
          required
        />
        <CvTextInput
          v-model="lastName"
          :data-invalid="errorMessage"
          label="Last Name"
          required
        />
      </div>
      <CvButton kind="primary">Continue</CvButton>
    </CvForm>
    <div class="skip">
      <CvButton @click="goToRedirectUri" kind="ghost" size="small"
        >Skip</CvButton
      >
    </div>
  </div>
</template>
