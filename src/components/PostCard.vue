<script setup lang="ts">
import type { ForumPostSummary } from '../api';

defineProps<{ post: ForumPostSummary }>();

function fmt(d: string) {
  return new Date(d).toLocaleString();
}
</script>

<template>
  <router-link :to="`/forum/${post.id}`" style="display:block;">
    <div class="card">
      <div class="row between">
        <h3 style="margin-bottom: 0.2em;">{{ post.title }}</h3>
        <span v-if="post.user_stage" class="badge badge-earth">{{ post.user_stage }}</span>
      </div>
      <p class="muted" style="margin: 0 0 0.8rem;">
        by {{ post.display_name || post.username }} · {{ fmt(post.created_at) }}
      </p>
      <p style="margin: 0 0 0.8rem;">{{ post.body.slice(0, 240) }}<span v-if="post.body.length > 240">…</span></p>
      <div class="row" style="font-size: 0.85rem;">
        <span v-if="post.concept_tag" class="tag">#{{ post.concept_tag }}</span>
        <span class="muted"><i class="ti ti-heart"></i> {{ post.like_count }}</span>
        <span class="muted"><i class="ti ti-message-circle"></i> {{ post.reply_count }}</span>
      </div>
    </div>
  </router-link>
</template>
