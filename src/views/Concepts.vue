<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const concepts = [
  { name: 'Vitarka', summary: 'Applied thought — the mind taking up its object.',
    body: 'Vitarka is the initial directing of attention onto the meditation object. It is the cognitive movement that places the mind on its target — the breath, a phrase, an image, an idea — again and again, until the mind learns to remain.' },
  { name: 'Vicara', summary: 'Sustained thought — the mind investigating and dwelling.',
    body: 'Where vitarka places, vicara holds. Vicara is the sustained, exploratory contact with the object — turning it over, becoming familiar with it, settling into its presence without losing the thread.' },
  { name: 'First Jhana', summary: 'Vitarka, vicara, rapture, pleasure, one-pointedness.',
    body: 'The first jhana arises when the hindrances quiet and the mind unifies on its object. It still contains both vitarka and vicara, accompanied by piti (rapture) and sukha (pleasure).' },
  { name: 'Second Jhana', summary: 'Inner stillness without applied/sustained thought.',
    body: 'In the second jhana, vitarka and vicara fall away. What remains is rapture, pleasure, and one-pointed inner unity — a stillness no longer dependent on directed thought.' },
  { name: 'Third Jhana', summary: 'Equanimity with pleasure, rapture released.',
    body: 'Even rapture is released. The third jhana is characterized by an even, mindful pleasure — a quieter joy than the second, suffused with equanimity.' },
  { name: 'Fourth Jhana', summary: 'Pure mindfulness and equanimity, beyond pleasure and pain.',
    body: 'The fourth jhana abandons even pleasant feeling. It is the purification of mindfulness by equanimity — neither pain nor pleasure, simply lucid presence.' },
  { name: 'Ananda', summary: 'Bliss — non-sensual joy of the deepening practice.',
    body: 'Ananda is a deep, non-sensual joy that may saturate practice as the obstructions thin. It is not the goal but a fruit; clinging to it becomes its own subtle obstacle.' },
  { name: 'Asmita', summary: 'I-am-ness — the bare sense of being.',
    body: 'Asmita is the residual sense of an experiencer — "I am" — without further content. In samkhya/yoga maps it is one of the subtle samapattis; in practice it is a thin, almost transparent self-feeling that itself is to be seen through.' },
];

function meditate(name: string) {
  router.push(`/timer/${encodeURIComponent(name)}`);
}
</script>

<template>
  <div class="container">
    <h1>Concepts</h1>
    <p class="muted">A brief reference. Tap any concept to begin a timed sit on it.</p>

    <div class="concept-grid">
      <div v-for="c in concepts" :key="c.name" class="card">
        <h3>{{ c.name }}</h3>
        <p class="muted" style="margin: 0.2rem 0 0.6rem;">{{ c.summary }}</p>
        <p>{{ c.body }}</p>
        <button @click="meditate(c.name)"><i class="ti ti-clock-play"></i> Sit with this</button>
      </div>
    </div>
  </div>
</template>
