<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import GuideLanguageSelect from './GuideLanguageSelect.vue'
import UploaderProgressPreview from './UploaderProgressPreview.vue'
import { guideCopy, type GuideLocale } from './cn-net-ios-copy'
import { uploaderUi, type UploadPhase } from './bookmarklet-preview-copy'

const { lang } = useData()
const locale = computed<GuideLocale>(() => lang.value.startsWith('en') ? 'en' : lang.value.startsWith('ja') ? 'ja' : /TW|Hant|HK/i.test(lang.value) ? 'zh-TW' : 'zh')
const screenLanguage = ref<GuideLocale | ''>('')
const uiLocale = computed(() => screenLanguage.value || locale.value)
const ui = computed(() => uploaderUi[uiLocale.value])
const copy = computed(() => uploaderUi[locale.value])
const phases: UploadPhase[] = ['prepare', 'fetching', 'uploading', 'parsing']
const phase = ref<UploadPhase>('uploading')
</script>

<template>
  <figure class="uploader-demo">
    <div class="demo-toolbar"><strong>{{ copy.title }}</strong><GuideLanguageSelect v-model="screenLanguage" :label="copy.language" :follow="guideCopy[locale].follow" /></div>
    <div class="demo-phases" :aria-label="copy.title"><button v-for="item in phases" :key="item" type="button" :aria-pressed="phase === item" @click="phase = item">{{ copy[item] }}</button></div>
    <div class="demo-scene" :lang="uiLocale"><div class="net-page" aria-hidden="true"><strong>maimai NET</strong><span>PLAYER</span><i></i><i></i></div><UploaderProgressPreview :locale="uiLocale" :phase="phase" compact /></div>
    <figcaption aria-live="polite">{{ phase === 'fetching' ? copy.fetchingHint : copy.spinningHint }} {{ copy.example }}</figcaption>
  </figure>
</template>

<style scoped>
.uploader-demo { margin: 24px 0; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 20px; background: var(--vp-c-bg-soft); }
.demo-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; }
.demo-toolbar > strong { font-size: 13px; }
.demo-phases { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); border-block: 1px solid var(--vp-c-divider); }
.demo-phases button { min-width: 0; padding: 12px 8px; color: var(--vp-c-text-2); font-size: 12px; line-height: 1.5; cursor: pointer; overflow-wrap: anywhere; }
.demo-phases button + button { border-left: 1px solid var(--vp-c-divider); }
.demo-phases button[aria-pressed="true"] { color: var(--vp-c-brand-1); background: var(--vp-c-bg); box-shadow: inset 0 -3px var(--vp-c-brand-1); font-weight: 600; }
.demo-phases button:focus-visible { outline: 3px solid var(--vp-c-brand-1); outline-offset: -3px; }
.demo-scene { position: relative; min-height: 220px; margin: 20px; overflow: hidden; border: 1px solid #d9dfe8; border-radius: 12px; background: #f7f8fb; }
.net-page { display: grid; gap: 14px; padding: 22px; color: #526477; }.net-page strong { font-size: 22px; }.net-page span { font-size: 10px; }.net-page i { height: 7px; width: 60%; border-radius: 9px; background: #e0e5ed; }.net-page i + i { width: 38%; }
figcaption { padding: 13px 20px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 12px; line-height: 1.7; }
@media (max-width: 400px) { .demo-toolbar { padding-inline: 16px; }.demo-scene { margin-inline: 14px; }.demo-phases { grid-template-columns: repeat(2,minmax(0,1fr)); }.demo-phases button:nth-child(3) { border-left: 0; }.demo-phases button:nth-child(n+3) { border-top: 1px solid var(--vp-c-divider); } }
</style>
