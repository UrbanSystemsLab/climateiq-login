<script setup lang="ts">
import firebaseConfigStr from '../firebase-config.json?raw';
import { initializeApp } from 'firebase/app';

const firebaseConfig = JSON.parse(firebaseConfigStr);
initializeApp(firebaseConfig);
</script>

<template>
  <h1 class="logo">ClimateIQ</h1>
  <RouterView />
</template>
