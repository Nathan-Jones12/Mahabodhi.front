<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { api } from '../api';
import { useAuthStore } from '../store';

const auth = useAuthStore();
const currentStage = ref<string | null>(null);
const totalSeconds = ref(0);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get('/api/auth/me');
    currentStage.value = data.current_stage;
    totalSeconds.value = data.total_meditation_seconds;
  } finally {
    loading.value = false;
  }
});

const totalPretty = computed(() => {
  const s = totalSeconds.value;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return `${h}h ${m}m`;
  return `${m}m`;
});
</script>

<template>
  <div class="container">
    <h1>Welcome back, {{ auth.user?.display_name || auth.user?.username }}</h1>
    <p class="muted">"The mind is everything. What you think you become." — Buddha</p>

    <div v-if="!loading" class="stage-grid" style="margin-top:1.5rem;">
      <div class="card">
        <h3>Current stage</h3>
        <p v-if="currentStage" style="font-size:1.4rem; margin: 0.4rem 0; text-transform: capitalize;">
          <span class="badge badge-forest">{{ currentStage }}</span>
        </p>
        <p v-else class="muted">No stage marked yet.</p>
        <router-link to="/stages">View stages →</router-link>
      </div>
      <div class="card">
        <h3>Lifetime meditation</h3>
        <p style="font-size:1.4rem; margin: 0.4rem 0;">{{ totalPretty }}</p>
        <router-link to="/timer">Start a session →</router-link>
      </div>
      <div class="card">
        <h3>Today's invitation</h3>
        <p>Choose an object of contemplation and sit for a few minutes.</p>
        <router-link to="/concepts">Browse concepts →</router-link>
      </div>
    </div>
  </div>
</template>
