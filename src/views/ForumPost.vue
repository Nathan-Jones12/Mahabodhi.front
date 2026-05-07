<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, type ForumPostSummary, type ForumReply } from '../api';
import { useAuthStore } from '../store';
import ReplyCard from '../components/ReplyCard.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const post = ref<ForumPostSummary | null>(null);
const replies = ref<ForumReply[]>([]);
const replyBody = ref('');
const editing = ref(false);
const editTitle = ref('');
const editBody = ref('');
const editTag = ref('');

async function load() {
  const id = route.params.id;
  const { data } = await api.get(`/api/forum/posts/${id}`);
  post.value = data.post;
  replies.value = data.replies;
}

async function submitReply() {
  if (!replyBody.value.trim() || !post.value) return;
  await api.post(`/api/forum/posts/${post.value.id}/replies`, { body: replyBody.value });
  replyBody.value = '';
  await load();
}

async function toggleLike() {
  if (!post.value) return;
  await api.post(`/api/forum/posts/${post.value.id}/like`);
  await load();
}

function startEdit() {
  if (!post.value) return;
  editing.value = true;
  editTitle.value = post.value.title;
  editBody.value = post.value.body;
  editTag.value = post.value.concept_tag || '';
}

async function saveEdit() {
  if (!post.value) return;
  await api.patch(`/api/forum/posts/${post.value.id}`, {
    title: editTitle.value,
    body: editBody.value,
    concept_tag: editTag.value || null,
  });
  editing.value = false;
  await load();
}

async function remove() {
  if (!post.value) return;
  if (!confirm('Delete this post?')) return;
  await api.delete(`/api/forum/posts/${post.value.id}`);
  router.push('/forum');
}

function fmt(d: string) { return new Date(d).toLocaleString(); }

onMounted(load);
</script>

<template>
  <div class="container">
    <p><router-link to="/forum">← Back to forum</router-link></p>

    <div v-if="post && !editing" class="card">
      <div class="row between">
        <h1 style="margin: 0 0 0.4rem;">{{ post.title }}</h1>
        <span v-if="post.user_stage" class="badge badge-earth">{{ post.user_stage }}</span>
      </div>
      <p class="muted">by {{ post.display_name || post.username }} · {{ fmt(post.created_at) }}</p>
      <p v-if="post.concept_tag"><span class="tag">#{{ post.concept_tag }}</span></p>
      <p style="white-space: pre-wrap;">{{ post.body }}</p>
      <div class="row" style="margin-top: 1rem;">
        <button class="btn-ghost" @click="toggleLike">
          <i class="ti ti-heart"></i> {{ post.like_count }}
        </button>
        <template v-if="auth.user?.id === post.user_id">
          <button class="btn-ghost" @click="startEdit"><i class="ti ti-edit"></i> Edit</button>
          <button class="btn-danger" @click="remove"><i class="ti ti-trash"></i> Delete</button>
        </template>
      </div>
    </div>

    <div v-if="post && editing" class="card stack">
      <h3 style="margin:0;">Edit post</h3>
      <input v-model="editTitle" />
      <textarea v-model="editBody" rows="8"></textarea>
      <input v-model="editTag" placeholder="concept tag" />
      <div class="row">
        <button @click="saveEdit">Save</button>
        <button class="btn-ghost" @click="editing = false">Cancel</button>
      </div>
    </div>

    <h2 style="margin-top: 2rem;">Replies</h2>
    <div v-if="!replies.length" class="muted">No replies yet.</div>
    <ReplyCard v-for="r in replies" :key="r.id" :reply="r" />

    <div class="card stack">
      <label>Add a reply</label>
      <textarea v-model="replyBody" rows="4"></textarea>
      <button @click="submitReply" :disabled="!replyBody.trim()">Post reply</button>
    </div>
  </div>
</template>
