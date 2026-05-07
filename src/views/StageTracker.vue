<script setup lang="ts">
import { onMounted, ref } from 'vue';
import StageCard from '../components/StageCard.vue';
import { api, type Stage, type StageRecord } from '../api';

const STAGES: { stage: Stage; title: string; description: string }[] = [
  { stage: 'vitarka', title: 'Vitarka',
    description: 'Applied thought. The mind first lays hold of the meditation object.' },
  { stage: 'vicara', title: 'Vicara',
    description: 'Sustained thought. The mind continues to investigate and dwell on the object.' },
  { stage: 'ananda', title: 'Ananda',
    description: 'Bliss. A deep, non-sensual joy permeates the practice.' },
  { stage: 'asmita', title: 'Asmita',
    description: 'I-am-ness. The bare awareness of being, distilled from object and content.' },
];

const current = ref<Stage | null>(null);
const history = ref<StageRecord[]>([]);
const status = ref('');

async function load() {
  const { data } = await api.get('/api/stages');
  current.value = data.current;
  history.value = data.history;
}

async function mark(stage: Stage) {
  status.value = '';
  await api.post('/api/stages', { stage });
  status.value = `Marked: ${stage}`;
  await load();
}

function fmt(d: string) { return new Date(d).toLocaleString(); }

onMounted(load);
</script>

<template>
  <div class="container">
    <h1>Stage Tracker</h1>
    <p class="muted">Mark the samapatti stage your practice is currently dwelling in.</p>

    <p v-if="status" class="success">{{ status }}</p>

    <div class="stage-grid">
      <StageCard
        v-for="s in STAGES"
        :key="s.stage"
        :stage="s.stage"
        :title="s.title"
        :description="s.description"
        :active="current === s.stage"
        @mark="mark"
      />
    </div>

    <h2 style="margin-top:2rem;">History</h2>
    <div v-if="!history.length" class="muted">No stage marks yet.</div>
    <div v-else class="card" v-for="h in history" :key="h.id">
      <div class="row between">
        <span class="badge badge-forest" style="text-transform: capitalize;">{{ h.stage }}</span>
        <span class="muted">{{ fmt(h.marked_at) }}</span>
      </div>
      <p v-if="h.notes" style="margin: 0.5rem 0 0;">{{ h.notes }}</p>
    </div>
  </div>
</template>
