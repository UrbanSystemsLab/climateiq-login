<script setup lang="ts">
import CommonHelp from './CommonHelp.vue';

const props = defineProps(['email']);
</script>

<template>
  <h2>Email restored</h2>
  <p>Your account's email has been reset to {{ props.email }}.</p>
  <p>
    If you didn't initiate the original email change, your account may be compromised
    and you should reset your password.
  </p>
  <RouterLink to="/reset-password"><button>Reset password</button></RouterLink>
  <div class="account-actions">
    <p><RouterLink to="/login">Log in</RouterLink></p>
  </div>

  <CommonHelp />
</template>
