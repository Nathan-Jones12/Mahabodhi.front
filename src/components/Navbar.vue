<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store';

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push('/login');
}
</script>

<template>
  <nav class="navbar">
    <span class="brand">
      <i class="ti ti-leaf"></i> MahaBodhi
    </span>
    <router-link to="/" active-class="active" exact><i class="ti ti-home"></i> Home</router-link>
    <router-link to="/stages" active-class="active"><i class="ti ti-stairs-up"></i> Stages</router-link>
    <router-link to="/timer" active-class="active"><i class="ti ti-clock"></i> Timer</router-link>
    <router-link to="/concepts" active-class="active"><i class="ti ti-book"></i> Concepts</router-link>
    <router-link to="/journal" active-class="active"><i class="ti ti-notebook"></i> Journal</router-link>
    <router-link to="/forum" active-class="active"><i class="ti ti-messages"></i> Forum</router-link>
    <button class="btn-ghost" style="background: transparent; color: var(--mist); border-color: var(--mist);" @click="logout">
      <i class="ti ti-logout"></i> {{ auth.user?.display_name || auth.user?.username || 'Logout' }}
    </button>
  </nav>
</template>
