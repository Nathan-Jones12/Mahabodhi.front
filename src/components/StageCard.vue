<script setup lang="ts">
import type { Stage } from '../api';

defineProps<{
  stage: Stage;
  title: string;
  description: string;
  active: boolean;
}>();

defineEmits<{ (e: 'mark', stage: Stage): void }>();
</script>

<template>
  <div class="card" :style="active ? 'border-color: var(--moss); border-width: 2px;' : ''">
    <div class="row between">
      <h3 style="margin-bottom: 0.2em;">{{ title }}</h3>
      <span v-if="active" class="badge badge-forest">Current</span>
    </div>
    <p class="muted" style="margin: 0.4rem 0 1rem;">{{ description }}</p>
    <button @click="$emit('mark', stage)">
      <i class="ti ti-flag"></i> Mark as current
    </button>
  </div>
</template>
