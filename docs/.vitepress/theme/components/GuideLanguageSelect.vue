<script setup lang="ts">
import { languages, type GuideLocale } from './cn-net-ios-copy'

defineProps<{ modelValue: GuideLocale | ''; label: string; follow: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: GuideLocale | ''] }>()
function change(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value as GuideLocale | '')
}
</script>

<template>
  <label class="guide-language">
    <span>{{ label }}</span>
    <span class="guide-select">
      <select :value="modelValue" @change="change">
        <option value="">{{ follow }}</option>
        <option v-for="language in languages" :key="language.value" :value="language.value">{{ language.label }}</option>
      </select>
      <svg class="guide-select-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
    </span>
  </label>
</template>

<style scoped>
.guide-language { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; font-size: 12px; color: var(--vp-c-text-2); }
.guide-select { position: relative; display: inline-flex; align-items: center; min-width: 0; max-width: 100%; }
select { box-sizing: border-box; min-width: 0; max-width: 100%; min-height: 32px; appearance: none; -webkit-appearance: none; padding: 5px 32px 5px 10px; border: 1px solid var(--vp-c-divider); border-radius: 7px; background: var(--vp-c-bg); background-image: none; color: var(--vp-c-text-1); font: inherit; line-height: 20px; cursor: pointer; }
select:focus-visible { outline: 3px solid var(--vp-c-brand-1); outline-offset: -3px; }
.guide-select-arrow { position: absolute; top: 50%; right: 10px; width: 14px; height: 14px; transform: translateY(-50%); pointer-events: none; color: var(--vp-c-text-2); stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
</style>
