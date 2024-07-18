<script setup lang="ts">
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { ref } from 'vue';

import { router } from '../router';

const auth = getAuth();

const props = defineProps({ oobCode: String });

const password = ref();

const errorMessage = ref();

async function confirmPassword() {
  try {
    await confirmPasswordReset(auth, props.oobCode!, password.value);
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  errorMessage.value = null;
  router.push({ path: 'reset-password-completed' });
}
</script>

<style scoped lang="scss">
@import 'carbon-components/scss/globals/scss/theme-tokens.scss';

.password-requirement {
  color: $text-02;
  font-size: 0.9rem;

  li {
    margin-left: 0;
  }

  p {
    margin: 0;
  }

  ul {
    margin-top: 0;
    padding-left: 1.5rem;
  }
}
</style>

<template>
  <div class="reset-password-new-password narrow-view">
    <h2>Reset password</h2>
    <div class="password-requirement">
      <p>Password requirement</p>
      <ul>
        <li>Between 8 - 128 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
        <li>At least one special character</li>
      </ul>
    </div>
    <CvInlineNotification
      v-if="errorMessage"
      :subTitle="errorMessage"
      kind="error"
      lowContrast
      hideCloseButton
    ></CvInlineNotification>
    <CvForm @submit.prevent="confirmPassword">
      <CvTextInput
        v-model="password"
        :data-invalid="errorMessage"
        label="New password"
        type="password"
        minlength="8"
        maxlength="128"
        pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&\;*\-\[\]]).{8,128}"
        autocomplete="new-password"
        required
      />
      <CvButton kind="primary">Continue</CvButton>
    </CvForm>
    <div class="account-actions">
      <p><CvLink to="/sign-up" inline>Create an account</CvLink></p>
      <p><CvLink to="/login" inline>Log in</CvLink></p>
    </div>
  </div>
</template>
