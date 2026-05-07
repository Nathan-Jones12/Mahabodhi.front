<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api, type JournalEntry } from '../api';

const entries = ref<JournalEntry[]>([]);
const title = ref('');
const body = ref('');
const tag = ref('');
const editingId = ref<number | null>(null);
const error = ref('');

async function load() {
  const { data } = await api.get('/api/journal');
  entries.value = data.entries;
}

async function save() {
  error.value = '';
  if (!body.value.trim()) { error.value = 'Body required'; return; }
  if (editingId.value !== null) {
    await api.patch(`/api/journal/${editingId.value}`, {
      title: title.value || null,
      body: body.value,
      concept_tag: tag.value || null,
    });
    editingId.value = null;
  } else {
    await api.post('/api/journal', {
      title: title.value || null,
      body: body.value,
      concept_tag: tag.value || null,
    });
  }
  title.value = '';
  body.value = '';
  tag.value = '';
  await load();
}

function edit(e: JournalEntry) {
  editingId.value = e.id;
  title.value = e.title || '';
  body.value = e.body;
  tag.value = e.concept_tag || '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  editingId.value = null;
  title.value = '';
  body.value = '';
  tag.value = '';
}

async function remove(id: number) {
  if (!confirm('Delete this entry?')) return;
  await api.delete(`/api/journal/${id}`);
  await load();
}

function fmt(d: string) { return new Date(d).toLocaleString(); }

onMounted(load);
</script>

<template>
  <div class="container">
    <h1>Journal</h1>
    <p class="muted">Private entries. Only you can see these.</p>

    <div class="card stack">
      <h3 style="margin:0;">{{ editingId !== null ? 'Edit entry' : 'New entry' }}</h3>
      <form class="stack" @submit.prevent="save">
        <div>
          <label>Title (optional)</label>
          <input v-model="title" maxlength="200" />
        </div>
        <div>
          <label>Body</label>
          <textarea v-model="body" rows="6" required></textarea>
        </div>
        <div>
          <label>Concept tag (optional)</label>
          <input v-model="tag" maxlength="100" placeholder="e.g. vitarka, breath, equanimity" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="row">
          <button>{{ editingId !== null ? 'Save changes' : 'Add entry' }}</button>
          <button v-if="editingId !== null" type="button" class="btn-ghost" @click="cancelEdit">Cancel</button>
        </div>
      </form>
    </div>

    <h2 style="margin-top:2rem;">Entries</h2>
    <div v-if="!entries.length" class="muted">No entries yet.</div>
    <div v-for="e in entries" :key="e.id" class="card">
      <div class="row between">
        <h3 style="margin:0;">{{ e.title || '(untitled)' }}</h3>
        <span v-if="e.concept_tag" class="tag">#{{ e.concept_tag }}</span>
      </div>
      <p class="muted" style="margin:0.2rem 0 0.6rem;">{{ fmt(e.created_at) }}</p>
      <p style="white-space: pre-wrap; margin: 0 0 0.8rem;">{{ e.body }}</p>
      <div class="row">
        <button class="btn-ghost" @click="edit(e)"><i class="ti ti-edit"></i> Edit</button>
        <button class="btn-danger" @click="remove(e.id)"><i class="ti ti-trash"></i> Delete</button>
      </div>
    </div>
  </div>
</template>
