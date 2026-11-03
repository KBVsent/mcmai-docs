<script setup lang="ts">
import { computed, ref } from 'vue'
import GuideLanguageSelect from './GuideLanguageSelect.vue'
import ProxyValue from './ProxyValue.vue'
import { useData } from 'vitepress'
import { guideCopy, interfaceCopy, type GuideLocale } from './cn-net-ios-copy'

const { lang } = useData()
const locale = computed<GuideLocale>(() => lang.value.startsWith('en') ? 'en' : lang.value.startsWith('ja') ? 'ja' : /TW|Hant|HK/i.test(lang.value) ? 'zh-TW' : 'zh')
const copy = computed(() => guideCopy[locale.value])
const screenLanguage = ref<GuideLocale | ''>('')
const ui = computed(() => interfaceCopy[screenLanguage.value || locale.value])
const scene = ref(0)
</script>

<template>
  <figure class="net-ios-guide">
    <div class="guide-toolbar">
      <span class="guide-tag">iPhone / iPad</span>
      <GuideLanguageSelect v-model="screenLanguage" :label="copy.language" :follow="copy.follow" />
    </div>

    <div class="guide-stages" :aria-label="copy.navigation">
      <button v-for="(step, index) in copy.steps" :key="index" type="button"
        :aria-pressed="scene === index" @click="scene = index">
        <span class="stage-number">{{ index + 1 }}</span><span>{{ step.title }}</span>
      </button>
    </div>

    <div class="guide-body">
      <!-- Deliberately non-interactive: these are illustrations, not system controls. -->
      <div class="guide-device" :lang="screenLanguage || locale" role="group" :aria-label="copy.steps[scene].description">
        <div class="device-status" aria-hidden="true"><span>9:41</span><span>▰ ▰ ▰</span></div>
        <div class="device-nav" aria-hidden="true">
          <span class="device-back">‹</span>
          <strong>{{ scene === 0 ? ui.wifi : scene === 1 ? 'McMai Wi-Fi' : ui.configure }}</strong>
          <span v-if="scene === 2" class="device-save">{{ ui.save }}<b class="pin pin-small">4</b></span>
        </div>

        <div class="device-content">
          <template v-if="scene === 0">
            <h4>Wi-Fi</h4>
            <div class="settings-group"><div class="settings-row"><span>Wi-Fi</span><span class="switch switch-on"></span></div></div>
            <p class="settings-heading">{{ ui.network }}</p>
            <div class="settings-group">
              <div class="settings-row row-highlight"><span class="blue-check">✓</span><span class="row-grow">McMai Wi-Fi</span><span class="info-icon">i</span><b class="pin">1</b></div>
            </div>
            <div class="ghost-lines"><span></span><span></span></div>
          </template>
          <template v-else-if="scene === 1">
            <p class="settings-heading">McMai Wi-Fi</p>
            <div class="settings-group"><div class="settings-row"><span>{{ ui.autoJoin }}</span><span class="switch switch-on"></span></div></div>
            <div class="ghost-lines"><span></span><span></span></div>
            <p class="settings-heading">HTTP {{ ui.proxy }}</p>
            <div class="settings-group"><div class="settings-row row-highlight"><span class="row-grow">{{ ui.configure }}</span><span class="muted">{{ ui.off }}</span><span class="chevron">›</span><b class="pin">1</b></div></div>
          </template>
          <template v-else>
            <div class="settings-group">
              <div class="settings-row">{{ ui.off }}</div>
              <div class="settings-row row-highlight"><span class="row-grow">{{ ui.manual }}</span><span class="blue-check">✓</span><b class="pin">1</b></div>
              <div class="settings-row">{{ ui.auto }}</div>
            </div>
            <div class="settings-group">
              <div class="settings-row row-highlight"><span>{{ ui.server }}</span><ProxyValue class="example-value" kind="host" :locale="screenLanguage || locale" /><b class="pin">2</b></div>
              <div class="settings-row row-highlight"><span>{{ ui.port }}</span><ProxyValue class="example-value" kind="port" :locale="screenLanguage || locale" /><b class="pin">3</b></div>
              <div class="settings-row"><span class="row-grow">{{ ui.authentication }}</span><span class="switch"></span></div>
            </div>
          </template>
        </div>
        <div class="device-home" aria-hidden="true"></div>
      </div>

      <div class="guide-explanation" aria-live="polite" aria-atomic="true">
        <span class="guide-progress">{{ scene + 1 }} / 3</span>
        <h4>{{ copy.steps[scene].title }}</h4>
        <p>{{ copy.steps[scene].description }}</p>
        <ol class="guide-callouts">
          <li v-for="(note, index) in copy.steps[scene].notes" :key="`${scene}-${index}`"><b class="pin">{{ index + 1 }}</b><span>{{ note }}</span></li>
        </ol>
        <p class="guide-reminder">{{ scene === 2 ? copy.check : copy.realDevice }}</p>
      </div>
    </div>
    <figcaption>{{ copy.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.net-ios-guide { --guide-accent: var(--vp-c-brand-1); margin: 24px 0; border: 1px solid var(--vp-c-divider); border-radius: 20px; overflow: hidden; background: var(--vp-c-bg-soft); }
.guide-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; }
.guide-tag { font-size: 12px; font-weight: 700; letter-spacing: .04em; color: var(--vp-c-text-2); }
.guide-stages { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-block: 1px solid var(--vp-c-divider); }
.guide-stages button { display: flex; align-items: center; gap: 8px; padding: 14px 12px; text-align: start; font-size: 13px; line-height: 1.5; color: var(--vp-c-text-2); cursor: pointer; overflow-wrap: anywhere; }
.guide-stages button + button { border-left: 1px solid var(--vp-c-divider); }
.guide-stages button[aria-pressed="true"] { background: var(--vp-c-bg); color: var(--guide-accent); font-weight: 650; box-shadow: inset 0 -3px var(--guide-accent); }
.stage-number { flex-shrink: 0; display: grid; place-items: center; width: 23px; height: 23px; border: 1px solid currentColor; border-radius: 50%; font-size: 11px; }
.guide-stages button:focus-visible { outline: 3px solid var(--guide-accent); outline-offset: -3px; }
.guide-body { display: grid; grid-template-columns: minmax(0, 290px) minmax(0, 1fr); align-items: center; gap: 26px; padding: 28px 20px; }
.guide-device { container-type: inline-size; min-width: 0; position: relative; padding: 10px 0 24px; border: 5px solid #30343c; border-radius: 32px; background: #f2f2f7; color: #17171c; box-shadow: 0 12px 24px #00000012; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.device-status { display: flex; justify-content: space-between; padding: 0 19px; font-size: 10px; font-weight: 700; }
.device-nav { display: grid; grid-template-columns: 24px minmax(0, 1fr) auto; align-items: center; gap: 5px; min-height: 60px; padding: 10px 13px; line-height: 1.35; font-size: 13px; }
.device-nav strong { text-align: center; overflow-wrap: anywhere; }
.device-back { color: #1765ce; font-size: 30px; }
.device-save { display: flex; align-items: center; gap: 3px; color: #1765ce; font-size: 12px; }
.device-content { min-height: 300px; padding: 0 12px 20px; }
.device-content h4 { margin: 8px 4px 20px; font-size: 26px; line-height: 1.2; }
.settings-heading { margin: 20px 10px 8px; color: #60606b; font-size: 11px; line-height: 1.5; }
.settings-group { margin: 12px 0; border-radius: 10px; background: #fff; }
.settings-row { position: relative; display: flex; align-items: center; gap: 7px; min-height: 44px; padding: 10px; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.settings-row + .settings-row { border-top: 1px solid #e7e7ed; }
.row-highlight { background: #e9f3ff; box-shadow: inset 0 0 0 1.5px #4385d5; border-radius: 9px; }
.row-grow { flex: 1; min-width: 0; }
.blue-check, .info-icon, .chevron { color: #1765ce; }
.info-icon { display: grid; place-items: center; width: 19px; height: 19px; border: 1.5px solid currentColor; border-radius: 50%; font-family: serif; font-weight: 700; }
.chevron { font-size: 20px; }
.muted { color: #74747f; }
.switch { flex-shrink: 0; width: 30px; height: 19px; border-radius: 12px; background: #d6d6dc; padding: 2px; }
.switch::before { content: ''; display: block; width: 15px; height: 15px; border-radius: 50%; background: white; box-shadow: 0 1px 3px #0002; }
.switch-on { background: #34c759; margin-left: auto; }
.switch-on::before { margin-left: auto; }
.example-value { min-width: 0; flex: 1; color: #50667f; font-size: 11px; text-align: end; }
.pin { display: inline-grid; flex: 0 0 22px; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #1765ce; color: white; font: 700 11px/1 sans-serif; }
.pin-small { width: 18px; height: 18px; flex-basis: 18px; }
.ghost-lines { display: grid; gap: 14px; padding: 24px 10px; }
.ghost-lines span { height: 9px; width: 75%; border-radius: 9px; background: #e2e2e9; }
.ghost-lines span + span { width: 48%; }
.device-home { position: absolute; bottom: 8px; left: 32%; width: 36%; height: 4px; border-radius: 8px; background: #30343c; }
.guide-progress { color: var(--guide-accent); font-size: 12px; font-weight: 700; }
.guide-explanation { min-width: 0; }
.guide-explanation h4 { margin: 8px 0 12px; font-size: 19px; line-height: 1.5; }
.guide-explanation p { margin: 0 0 16px; font-size: 14px; line-height: 1.8; }
.guide-callouts { display: grid; gap: 14px; list-style: none; padding: 0; margin: 18px 0; }
.guide-callouts li { display: flex; align-items: flex-start; gap: 10px; margin: 0; font-size: 14px; line-height: 1.7; }
.guide-callouts .pin { margin-top: 2px; }
.guide-explanation .guide-reminder { margin-top: 22px; padding-left: 12px; border-left: 2px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 12px; }
.net-ios-guide figcaption { padding: 13px 20px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 12px; line-height: 1.7; }
@media (max-width: 640px) {
  .guide-body { grid-template-columns: minmax(0, 1fr); gap: 24px; padding: 24px 18px; }
  .guide-device { width: 290px; max-width: 100%; justify-self: center; }
  .guide-stages button { flex-direction: column; align-items: flex-start; font-size: 12px; padding: 12px 9px; }
  .guide-toolbar { padding-inline: 16px; }
}
@container (max-width: 245px) {
  .settings-row:has(.proxy-value) { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px; }
  .settings-row .proxy-value { grid-column: 1 / -1; grid-row: 2; text-align: start; }
  .settings-row:has(.proxy-value) > .pin { grid-column: 2; grid-row: 1; }
}
@media print {
  .guide-stages, .guide-language { display: none; }
  .guide-body { break-inside: avoid; }
}
</style>
