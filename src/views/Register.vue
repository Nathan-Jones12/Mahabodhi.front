<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const display_name = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.register(username.value, email.value, password.value, display_name.value || undefined);
    router.push('/');
  } catch (e: any) {
    const data = e?.response?.data;
    if (data?.error === 'content_blocked') {
      error.value = data.reason || 'Username or display name contains disallowed content.';
    } else {
      error.value = data?.error || 'Registration failed';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="narrow">
    <h1 style="text-align:center;">Begin Your Practice</h1>
    <div class="card stack">
      <form class="stack" @submit.prevent="submit">
        <div>
          <label>Username</label>
          <input v-model="username" required minlength="3" autocomplete="username" />
        </div>
        <div>
          <label>Display name (optional)</label>
          <input v-model="display_name" />
        </div>
        <div>
          <label>Email</label>
          <input v-model="email" type="email" required autocomplete="email" />
        </div>
        <div>
          <label>Password (min 6 chars)</label>
          <input v-model="password" type="password" required minlength="6" autocomplete="new-password" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button :disabled="loading">{{ loading ? 'Creating…' : 'Create account' }}</button>
      </form>
      <p class="muted">Already practicing? <router-link to="/login">Sign in</router-link></p>
    </div>
  </div>
</template>
