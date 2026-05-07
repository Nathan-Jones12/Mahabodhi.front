<script setup lang="ts">
import type { ForumReply } from '../api';

defineProps<{ reply: ForumReply }>();

function fmt(d: string) {
  return new Date(d).toLocaleString();
}
</script>

<template>
  <div class="card" style="background: var(--mist);">
    <div class="row between">
      <strong>{{ reply.display_name || reply.username }}</strong>
      <span v-if="reply.user_stage" class="badge badge-earth">{{ reply.user_stage }}</span>
    </div>
    <p class="muted" style="margin: 0.2rem 0 0.6rem;">{{ fmt(reply.created_at) }}</p>
    <p style="margin: 0; white-space: pre-wrap;">{{ reply.body }}</p>
  </div>
</template>
