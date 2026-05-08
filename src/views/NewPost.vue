<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';

const router = useRouter();
const title = ref('');
const body = ref('');
const tag = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    const { data } = await api.post('/api/forum/posts', {
      title: title.value,
      body: body.value,
      concept_tag: tag.value || null,
    });
    router.push(`/forum/${data.id}`);
  } catch (e: any) {
    const data = e?.response?.data;
    if (data?.error === 'content_blocked') {
      error.value = data.reason || 'Your post contains disallowed content. Please revise and try again.';
    } else {
      error.value = data?.error || 'Failed to post';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <h1>New post</h1>
    <div class="card stack">
      <form class="stack" @submit.prevent="submit">
        <div>
          <label>Title</label>
          <input v-model="title" required maxlength="200" />
        </div>
        <div>
          <label>Body</label>
          <textarea v-model="body" rows="8" required></textarea>
        </div>
        <div>
          <label>Concept tag (optional)</label>
          <input v-model="tag" maxlength="100" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="row">
          <button :disabled="loading">{{ loading ? 'Posting…' : 'Publish' }}</button>
          <router-link to="/forum" class="btn btn-ghost" style="display:inline-block;">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
