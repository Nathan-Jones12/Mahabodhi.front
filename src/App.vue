<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './store';
const auth = useAuthStore();
</script>

<template>
  <Navbar v-if="auth.isAuthed" />
  <router-view />
</template>
