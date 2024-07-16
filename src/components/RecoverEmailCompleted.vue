<script setup lang="ts">
import CommonHelp from './CommonHelp.vue';

const props = defineProps(['email']);
</script>

<style scoped>
.recover-email-completed {
  width: var(--narrow-width);
}

.primary-action {
  margin-top: 1.25rem;
}
</style>

<template>
  <div class="recover-email-completed">
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
    <RouterLink to="/reset-password" class="reset-password-action"
      >Reset password</RouterLink
    >
    <RouterLink to="/login" class="primary-action">Log in</RouterLink>
    <CommonHelp />
  </div>
</template>
