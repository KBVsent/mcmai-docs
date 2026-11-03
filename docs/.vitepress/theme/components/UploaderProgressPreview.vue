<script setup lang="ts">
import { computed, useId } from 'vue'
import { withBase } from 'vitepress'
import { uploaderUi, type UploadPhase } from './bookmarklet-preview-copy'
import type { GuideLocale } from './cn-net-ios-copy'

const props = withDefaults(defineProps<{ locale: GuideLocale; phase?: UploadPhase; compact?: boolean }>(), { phase: 'uploading', compact: false })
const gradientId = `uploader-preview-${useId()}`
const circumference = 2 * Math.PI * 33
const words = computed(() => uploaderUi[props.locale])
const indeterminate = computed(() => props.phase !== 'fetching')
</script>

<template>
  <div class="uploader-progress-preview" :class="{ compact }" role="img" :aria-label="words[phase]">
    <div class="status-pill"><span>{{ words[phase] }}</span><b v-if="phase === 'fetching'">18/30</b></div>
    <div class="uploader-fab">
      <svg class="progress-ring" :class="{ spin: indeterminate }" viewBox="0 0 76 76" fill="none" aria-hidden="true">
        <defs><linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4d8d" /><stop offset=".5" stop-color="#6d5efc" /><stop offset="1" stop-color="#22d3ee" /></linearGradient></defs>
        <circle class="ring-track" cx="38" cy="38" r="33" />
        <circle class="ring-bar" cx="38" cy="38" r="33" :stroke="`url(#${gradientId})`" :stroke-dasharray="circumference" :stroke-dashoffset="circumference * (indeterminate ? .72 : .4)" />
      </svg>
      <div class="uploader-knob"><img :src="withBase('/images/bookmarklet-uploader-mark.png')" alt="" loading="lazy" /></div>
    </div>
  </div>
</template>

<style scoped>
.uploader-progress-preview { position: absolute; right: 20px; bottom: 20px; display: flex; align-items: center; justify-content: flex-end; gap: 12px; max-width: calc(100% - 40px); color: #14141b; }
.uploader-fab { position: relative; flex: 0 0 76px; width: 76px; height: 76px; }
.progress-ring { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.progress-ring circle { fill: none; stroke-width: 3.5; stroke-linecap: round; }
.ring-track { stroke: #11111a17; }
.ring-bar { filter: drop-shadow(0 0 5px #6d5efc66); transition: stroke-dashoffset .45s cubic-bezier(.4,0,.2,1); }
.progress-ring.spin .ring-bar { transform-origin: 38px 38px; animation: uploader-ring-spin 1.15s linear infinite; }
.uploader-knob { position: absolute; inset: 11.84%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #11111a17; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px #1012200f, 0 18px 40px -12px #10122042; }
.uploader-knob img { display: block; width: 58.6%; height: 58.6%; object-fit: contain; }
.status-pill { min-width: 0; padding: 7px 14px; border: 1px solid #11111a17; border-radius: 999px; background: #fff; color: #14141b; box-shadow: 0 1px 2px #1012200f; font-size: 13px; font-weight: 600; line-height: 1.5; letter-spacing: .2px; overflow-wrap: anywhere; }
.status-pill b { margin-left: 6px; color: #6e6e7d; font-size: inherit; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
.compact { right: 12px; bottom: 16px; gap: 8px; max-width: calc(100% - 24px); }
.compact .uploader-fab { flex-basis: 56px; width: 56px; height: 56px; }
.compact .status-pill { padding: 6px 10px; font-size: 11px; }
@keyframes uploader-ring-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .progress-ring.spin .ring-bar { transform-origin: 38px 38px; animation: none; }.ring-bar { transition: none; } }
</style>
