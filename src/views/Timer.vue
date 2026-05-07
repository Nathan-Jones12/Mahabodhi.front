<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api, type JhanaDepth } from '../api';

const route = useRoute();

const PRESETS = ['Vitarka', 'Vicara', 'First Jhana', 'Second Jhana', 'Third Jhana', 'Fourth Jhana', 'Ananda', 'Asmita', 'Breath', 'Metta'];

const presetChoice = ref<string>('Breath');
const customConcept = ref<string>('');
const useCustom = ref(false);
const jhana = ref<JhanaDepth | ''>('');

const conceptText = computed(() =>
  (useCustom.value ? customConcept.value.trim() : presetChoice.value).slice(0, 100)
);

const seconds = ref(0);
const running = ref(false);
const saveStatus = ref('');
let timerId: number | null = null;

watch(() => route.params.concept, (c) => {
  if (typeof c === 'string' && c.length) {
    useCustom.value = true;
    customConcept.value = c;
  }
}, { immediate: true });

function start() {
  if (running.value) return;
  running.value = true;
  saveStatus.value = '';
  timerId = window.setInterval(() => { seconds.value += 1; }, 1000);
}

function pause() {
  if (timerId) { clearInterval(timerId); timerId = null; }
  running.value = false;
}

function reset() {
  pause();
  seconds.value = 0;
}

async function finish() {
  pause();
  if (seconds.value <= 0) return;
  saveStatus.value = 'Saving…';
  try {
    await api.post('/api/sessions', {
      concept: conceptText.value || null,
      duration_seconds: seconds.value,
      jhana_depth: jhana.value || null,
    });
    saveStatus.value = `Session saved: ${formatted.value} on "${conceptText.value || 'unspecified'}"`;
    seconds.value = 0;
  } catch (e: any) {
    saveStatus.value = e?.response?.data?.error || 'Failed to save';
  }
}

const formatted = computed(() => {
  const s = seconds.value;
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
});

onUnmounted(pause);
</script>

<template>
  <div class="container">
    <h1>Meditation Timer</h1>

    <div class="card stack">
      <div>
        <label>
          <input type="checkbox" v-model="useCustom" style="width:auto; margin-right:0.4rem;" />
          Use my own object / thought
        </label>
      </div>

      <div v-if="!useCustom">
        <label>Concept</label>
        <select v-model="presetChoice">
          <option v-for="p in PRESETS" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <div v-else>
        <label>Custom object of meditation</label>
        <input v-model="customConcept" maxlength="100" placeholder="e.g. impermanence, the breath at the nostrils, a candle flame…" />
      </div>

      <div>
        <label>Jhana depth (optional)</label>
        <select v-model="jhana">
          <option value="">— none —</option>
          <option value="first">First</option>
          <option value="second">Second</option>
          <option value="third">Third</option>
          <option value="fourth">Fourth</option>
        </select>
      </div>

      <div class="timer-display">{{ formatted }}</div>

      <div class="row" style="justify-content:center;">
        <button v-if="!running" @click="start"><i class="ti ti-player-play"></i> Start</button>
        <button v-else class="btn-ghost" @click="pause"><i class="ti ti-player-pause"></i> Pause</button>
        <button class="btn-ghost" @click="reset" :disabled="seconds === 0"><i class="ti ti-refresh"></i> Reset</button>
        <button @click="finish" :disabled="seconds === 0"><i class="ti ti-check"></i> Finish & save</button>
      </div>

      <p v-if="saveStatus" class="success" style="text-align:center;">{{ saveStatus }}</p>
    </div>
  </div>
</template>
