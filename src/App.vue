<script setup lang="ts">
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from './config';

initializeApp(FIREBASE_CONFIG);
</script>

<template>
  <h1 class="logo">ClimateIQ</h1>
  <RouterView />
</template>
