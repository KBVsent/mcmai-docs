<script setup lang="ts">
defineProps<{ name: 'book' | 'star' | 'search' | 'menu' }>()
</script>
<template>
  <svg viewBox="0 0 24 24" fill="none" class="tutorial-icon" aria-hidden="true">
    <path v-if="name === 'book'" d="M12 5C8 2 4 3 2 4v15c3-1.5 6-1.5 10 1 4-2.5 7-2.5 10-1V4c-2-1-6-2-10 1Zm0 0v15" />
    <path v-else-if="name === 'star'" d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
    <template v-else-if="name === 'search'"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></template>
    <template v-else><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></template>
  </svg>
</template>
<style scoped>
.tutorial-icon { display: inline-block; flex-shrink: 0; width: 18px; height: 18px; vertical-align: middle; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
</style>
