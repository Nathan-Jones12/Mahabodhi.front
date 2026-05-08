<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import PostCard from '../components/PostCard.vue';
import { api, type ForumPostSummary } from '../api';

const posts = ref<ForumPostSummary[]>([]);
const tag = ref('');
const POLL_MS = 20_000;
let pollId: number | null = null;

async function load() {
  const params = tag.value ? { tag: tag.value } : {};
  try {
    const { data } = await api.get('/api/forum/posts', { params });
    posts.value = data.posts;
  } catch {
    // ignore transient errors so polling continues
  }
}

function startPolling() {
  stopPolling();
  pollId = window.setInterval(() => {
    if (document.visibilityState === 'visible') load();
  }, POLL_MS);
}

function stopPolling() {
  if (pollId !== null) {
    clearInterval(pollId);
    pollId = null;
  }
}

function onVisibilityChange() {
  if (document.visibilityState === 'visible') load();
}

watch(tag, load);

onMounted(() => {
  load();
  startPolling();
  document.addEventListener('visibilitychange', onVisibilityChange);
});

onUnmounted(() => {
  stopPolling();
  document.removeEventListener('visibilitychange', onVisibilityChange);
});
</script>

<template>
  <div class="container">
    <div class="row between" style="flex-wrap: wrap; gap: 1rem;">
      <h1 style="margin:0;">Forum</h1>
      <router-link to="/forum/new" class="btn" style="display:inline-block;">
        <i class="ti ti-plus"></i> New post
      </router-link>
    </div>

    <div class="card" style="margin-top:1rem;">
      <label>Filter by concept tag</label>
      <input v-model="tag" placeholder="(blank = all)" />
    </div>

    <div v-if="!posts.length" class="muted" style="margin-top:1rem;">No posts yet.</div>
    <PostCard v-for="p in posts" :key="p.id" :post="p" />
  </div>
</template>
