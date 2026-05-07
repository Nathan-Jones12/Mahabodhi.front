<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    const next = (route.query.next as string) || '/';
    router.push(next);
  } catch (e: any) {
    error.value = e?.response?.data?.error || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="narrow">
    <h1 style="text-align:center;">MahaBodhi</h1>
    <p class="muted" style="text-align:center;">Sit. Breathe. Return.</p>
    <div class="card stack">
      <h2 style="margin:0;">Sign in</h2>
      <form class="stack" @submit.prevent="submit">
        <div>
          <label>Email</label>
          <input v-model="email" type="email" required autocomplete="email" />
        </div>
        <div>
          <label>Password</label>
          <input v-model="password" type="password" required autocomplete="current-password" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button :disabled="loading">{{ loading ? 'Signing in…' : 'Sign in' }}</button>
      </form>
      <p class="muted">No account? <router-link to="/register">Register</router-link></p>
    </div>
  </div>
</template>
