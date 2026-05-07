<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { api, type SessionRecord } from '../api';

const sessions = ref<SessionRecord[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const { data } = await api.get<{ sessions: SessionRecord[] }>('/api/sessions');
    sessions.value = data.sessions;
  } catch (e: any) {
    error.value = e?.response?.data?.error || 'Failed to load sessions';
  } finally {
    loading.value = false;
  }
});

function formatDuration(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const totalSeconds = computed(() =>
  sessions.value.reduce((acc, s) => acc + Number(s.duration_seconds || 0), 0)
);

const totalPretty = computed(() => formatDuration(totalSeconds.value));
</script>

<template>
  <div class="container">
    <h1>Session History</h1>
    <p class="muted">Your recorded meditation sessions (most recent first).</p>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <template v-else>
      <div class="card" style="margin-bottom:1rem;">
        <strong>{{ sessions.length }}</strong> session<span v-if="sessions.length !== 1">s</span>
        &middot; total <strong>{{ totalPretty }}</strong>
      </div>

      <p v-if="sessions.length === 0" class="muted">
        No sessions yet. <router-link to="/timer">Start one →</router-link>
      </p>

      <div v-else class="stack">
        <div v-for="s in sessions" :key="s.id" class="card">
          <div class="row" style="justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <div style="font-size:1.1rem;">
                <strong>{{ s.concept || 'Unspecified' }}</strong>
                <span v-if="s.jhana_depth" class="badge badge-forest" style="margin-left:0.5rem; text-transform:capitalize;">
                  {{ s.jhana_depth }} jhana
                </span>
              </div>
              <div class="muted" style="font-size:0.9rem; margin-top:0.2rem;">
                {{ formatDate(s.started_at) }}
              </div>
            </div>
            <div style="font-size:1.2rem; font-variant-numeric: tabular-nums;">
              {{ formatDuration(Number(s.duration_seconds)) }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
