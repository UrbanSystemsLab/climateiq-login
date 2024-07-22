<script setup lang="ts">
import CommonHelp from './CommonHelp.vue';

const props = defineProps(['email']);
</script>

<template>
  <div class="recover-email-completed narrow-view">
    <h2>Email restored</h2>
    <p class="sent-email">
      Your account's email has been reset to
      <span class="email">{{ props.email }}</span
      >.
    </p>
    <p>
      If you didn't initiate the original email change, your account may be
      compromised and you should reset your password.
    </p>
    <div class="reset-password-link">
      <CvLink to="/reset-password" inline>Reset password</CvLink>
    </div>
    <div>
      <RouterLink to="/login"
        ><CvButton kind="primary">Log in</CvButton></RouterLink
      >
    </div>
    <CommonHelp />
  </div>
</template>
