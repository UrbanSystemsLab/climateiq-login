<script setup lang="ts">
import { defineProps } from 'vue';

import CommonHelp from './CommonHelp.vue';
import { router } from '../router';

const props = defineProps(['email']);

function goToResetPassword() {
  router.push({ path: 'reset-password' });
}
</script>

<template>
  <h2>Email recovered</h2>
  <p>Your account's email has been reset to {{ props.email }}.</p>
  <p>
    If you didn't initiate this email change, your account may be compromised
    and you should reset your password.
  </p>
  <button @click="goToResetPassword">Reset password</button>
  <div class="account-actions">
    <p><RouterLink to="/login">Log in</RouterLink></p>
  </div>

  <CommonHelp />
</template>
