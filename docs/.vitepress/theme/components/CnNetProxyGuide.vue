<script setup lang="ts">
import { computed, ref } from 'vue'
import ProxyValue from './ProxyValue.vue'
import { useData } from 'vitepress'
import { guideCopy, interfaceCopy, languages, type GuideLocale } from './cn-net-ios-copy'
import { platformCopy, platformUi, type ProxyPlatform } from './cn-net-platform-copy'

const props = defineProps<{ platform: ProxyPlatform }>()
const { lang } = useData()
const locale = computed<GuideLocale>(() => lang.value.startsWith('en') ? 'en' : lang.value.startsWith('ja') ? 'ja' : /TW|Hant|HK/i.test(lang.value) ? 'zh-TW' : 'zh')
const screenLanguage = ref<GuideLocale | ''>('')
const uiLocale = computed(() => screenLanguage.value || locale.value)
const ui = computed(() => ({ ...interfaceCopy[uiLocale.value], ...platformUi[uiLocale.value] }))
const copy = computed(() => platformCopy[locale.value][props.platform])
const common = computed(() => guideCopy[locale.value])
const scene = ref(0)
const platformName = computed(() => ({ windows: 'Windows 11', macos: 'macOS', android: 'Android · Google Pixel' })[props.platform])
</script>

<template>
  <figure class="proxy-guide" :data-platform="platform">
    <div class="guide-toolbar">
      <span class="guide-tag">{{ platformName }}</span>
      <label class="guide-language">
        <span>{{ platformCopy[locale].language }}</span>
        <span class="guide-select">
        <select v-model="screenLanguage">
          <option value="">{{ common.follow }}</option>
          <option v-for="language in languages" :key="language.value" :value="language.value">{{ language.label }}</option>
        </select>
        <svg class="guide-select-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
        </span>
      </label>
    </div>
    <div class="guide-stages" :aria-label="copy.title">
      <button v-for="(step, index) in copy.steps" :key="index" type="button" :aria-pressed="scene === index" @click="scene = index">
        <span class="stage-number">{{ index + 1 }}</span><span>{{ step.title }}</span>
      </button>
    </div>

    <div class="guide-body" :class="{ 'mobile-body': platform === 'android' }">
      <div class="illustration" :class="[platform, { phone: platform === 'android' }]" :lang="uiLocale" role="group" :aria-label="copy.steps[scene].description">
        <div v-if="platform !== 'android'" class="window-chrome" aria-hidden="true">
          <span v-if="platform === 'macos'" class="traffic-lights"><i></i><i></i><i></i></span>
          <span>{{ platform === 'windows' ? ui.settings : ui.systemSettings }}</span><span v-if="platform === 'windows'" class="window-actions">−　□　×</span>
        </div>
        <div v-else class="phone-status" aria-hidden="true"><span>9:41</span><span>▰ ▰ ▰</span></div>

        <div v-if="platform === 'windows'" class="desktop-layout">
          <div class="desktop-sidebar">
            <div class="sidebar-search">⌕　{{ ui.findSetting }}</div>
            <div class="sidebar-item">▦　{{ ui.system }}</div>
            <div class="sidebar-item" :class="{target:scene === 0}">◎　{{ ui.networkInternet }}<b v-if="scene === 0" class="pin">1</b></div>
            <div class="sidebar-item">◉　{{ ui.personalization }}</div>
          </div>
          <div class="desktop-main">
            <p class="breadcrumbs">{{ scene === 0 ? ui.settings : ui.networkInternet }} › {{ scene === 0 ? ui.networkInternet : ui.proxy }}</p>
            <h4>{{ scene === 0 ? ui.networkInternet : scene === 2 ? ui.editProxy : ui.proxy }}</h4>
            <template v-if="scene === 0">
              <div class="settings-card"><span>Wi-Fi</span><span class="muted">McMai Wi-Fi</span></div>
              <div class="settings-card target"><span>{{ ui.proxy }}</span><span>›</span><b class="pin">2</b></div>
            </template>
            <template v-else-if="scene === 1">
              <p class="section-label">{{ ui.autoProxy }}</p>
              <div class="settings-card"><span>{{ ui.autoDetect }}</span><span class="toggle"></span></div>
              <p class="section-label">{{ ui.manualProxy }}</p>
              <div class="settings-card target"><span>{{ ui.useProxy }}</span><span class="fake-button">{{ ui.setup }}</span><b class="pin">1</b></div>
            </template>
            <template v-else>
              <div class="settings-card target"><span>{{ ui.useProxy }}</span><span class="toggle on"></span><b class="pin">1</b></div>
              <div class="desktop-fields">
                <div class="fake-field target"><span>{{ ui.proxyIp }}</span><ProxyValue class="fake-input" kind="host" :locale="uiLocale" /><b class="pin">2</b></div>
                <div class="fake-field target"><span>{{ ui.port }}</span><ProxyValue class="fake-input" kind="port" :locale="uiLocale" /><b class="pin">3</b></div>
              </div>
              <div class="ghost-lines"><span></span><span></span></div>
              <div class="dialog-footer"><span class="fake-button primary">{{ ui.save }}<b class="pin">4</b></span><span class="fake-button">{{ ui.cancel }}</span></div>
            </template>
          </div>
        </div>

        <div v-else-if="platform === 'macos'" class="desktop-layout">
          <div class="desktop-sidebar">
            <div class="sidebar-search">⌕　{{ ui.search }}</div>
            <div class="sidebar-item">◉　Wi-Fi</div>
            <div class="sidebar-item" :class="{target:scene === 0}">◎　{{ ui.network }}<b v-if="scene === 0" class="pin">1</b></div>
            <div class="sidebar-item">▦　{{ ui.general }}</div>
          </div>
          <div class="desktop-main">
            <p class="breadcrumbs">{{ ui.network }} › Wi-Fi › {{ ui.details }}</p>
            <h4>{{ scene === 0 ? ui.network : scene === 1 ? ui.details : ui.proxies }}</h4>
            <template v-if="scene === 0">
              <div class="settings-card"><span>Wi-Fi</span><span class="muted">McMai Wi-Fi</span></div>
              <div class="settings-card target"><span>McMai Wi-Fi</span><span class="fake-button">{{ ui.details }}…</span><b class="pin">2</b></div>
            </template>
            <template v-else-if="scene === 1">
              <div class="settings-card"><span>TCP/IP</span><span>›</span></div>
              <div class="settings-card"><span>DNS</span><span>›</span></div>
              <div class="settings-card target"><span>{{ ui.proxies }}</span><span>›</span><b class="pin">1</b></div>
            </template>
            <template v-else>
              <div v-for="protocol in ['HTTP','HTTPS']" :key="protocol" class="protocol-card">
                <div class="settings-card target"><span>{{ protocol === 'HTTP' ? ui.webProxy : ui.secureProxy }} ({{ protocol }})</span><span class="toggle on"></span><b class="pin">1</b></div>
                <div class="desktop-fields">
                  <div class="fake-field target"><span>{{ ui.server }}</span><ProxyValue class="fake-input" kind="host" :locale="uiLocale" /><b class="pin">2</b></div>
                  <div class="fake-field target"><span>{{ ui.port }}</span><ProxyValue class="fake-input" kind="port" :locale="uiLocale" /><b class="pin">3</b></div>
                </div>
              </div>
              <div class="dialog-footer"><span class="fake-button primary">{{ ui.ok }}<b class="pin">4</b></span></div>
            </template>
          </div>
        </div>

        <div v-else class="android-content">
          <div class="android-nav"><span>‹</span><strong>{{ scene === 0 ? ui.internet : scene === 1 ? ui.networkDetails : 'McMai Wi-Fi' }}</strong><span v-if="scene === 1" class="edit-icon">✎<b class="pin">1</b></span></div>
          <template v-if="scene === 0">
            <div class="settings-card"><span>Wi-Fi</span><span class="toggle on"></span></div>
            <p class="section-label">{{ ui.connected }}</p>
            <div class="settings-card target"><span>McMai Wi-Fi</span><span>⚙</span><b class="pin">1</b></div>
            <div class="ghost-lines"><span></span><span></span></div>
          </template>
          <template v-else-if="scene === 1">
            <div class="wifi-emblem">◎</div>
            <p class="network-name">McMai Wi-Fi</p>
            <div class="ghost-lines"><span></span><span></span></div>
            <div class="settings-card"><span>{{ ui.connected }}</span><span>✓</span></div>
          </template>
          <template v-else>
            <div class="settings-card"><span>{{ ui.advanced }}</span><span>⌃</span></div>
            <div class="fake-field target"><span>{{ ui.proxy }}<b class="pin">1</b></span><span class="fake-input">{{ ui.manual }}　⌄</span></div>
            <div class="fake-field target"><span>{{ ui.proxyHostname }}<b class="pin">2</b></span><ProxyValue class="fake-input" kind="host" :locale="uiLocale" /></div>
            <div class="fake-field target"><span>{{ ui.proxyPort }}<b class="pin">3</b></span><ProxyValue class="fake-input" kind="port" :locale="uiLocale" /></div>
            <div class="dialog-footer"><span class="fake-button">{{ ui.cancel }}</span><span class="fake-button primary">{{ ui.save }}<b class="pin">4</b></span></div>
          </template>
        </div>
        <div v-if="platform === 'android'" class="phone-home" aria-hidden="true"></div>
      </div>

      <div class="guide-explanation" aria-live="polite" aria-atomic="true">
        <span class="guide-progress">{{ scene + 1 }} / {{ copy.steps.length }}</span>
        <h4>{{ copy.steps[scene].title }}</h4><p>{{ copy.steps[scene].description }}</p>
        <ol class="guide-callouts"><li v-for="(note,index) in copy.steps[scene].notes" :key="`${scene}-${index}`"><b class="pin">{{ index + 1 }}</b><span>{{ note }}</span></li></ol>
        <p class="guide-reminder">{{ copy.restore }}</p>
      </div>
    </div>
    <figcaption>{{ common.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.proxy-guide { margin: 24px 0; border: 1px solid var(--vp-c-divider); border-radius: 20px; overflow: hidden; background: var(--vp-c-bg-soft); }
.guide-toolbar { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; padding:16px 20px; }
.guide-tag { font-size:12px; font-weight:700; color:var(--vp-c-text-2); }
.guide-language { display:flex; flex-wrap:wrap; align-items:center; gap:8px; font-size:12px; color:var(--vp-c-text-2); }
.guide-select { position: relative; display: inline-flex; align-items: center; min-width: 0; max-width: 100%; }
.guide-language select { box-sizing: border-box; min-width: 0; max-width: 100%; min-height: 32px; appearance: none; -webkit-appearance: none; padding: 5px 32px 5px 10px; border: 1px solid var(--vp-c-divider); border-radius: 7px; background: var(--vp-c-bg); background-image: none; color: var(--vp-c-text-1); font: inherit; line-height: 20px; cursor: pointer; }
.guide-select-arrow { position: absolute; top: 50%; right: 10px; width: 14px; height: 14px; transform: translateY(-50%); pointer-events: none; color: var(--vp-c-text-2); stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.guide-stages { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); border-block:1px solid var(--vp-c-divider); }
.guide-stages button { display:flex; align-items:center; gap:8px; padding:14px 12px; text-align:start; font-size:13px; line-height:1.5; color:var(--vp-c-text-2); cursor:pointer; overflow-wrap:anywhere; }
.guide-stages button + button { border-left:1px solid var(--vp-c-divider); }
.guide-stages button[aria-pressed="true"] { background:var(--vp-c-bg); color:var(--vp-c-brand-1); font-weight:650; box-shadow:inset 0 -3px var(--vp-c-brand-1); }
.stage-number { flex-shrink:0; display:grid; place-items:center; width:23px; height:23px; border:1px solid currentColor; border-radius:50%; font-size:11px; }
button:focus-visible, select:focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:-3px; }
.guide-body { padding:24px 20px; }
.illustration { container-type:inline-size; min-width:0; border:1px solid #cfd2d9; border-radius:12px; overflow:hidden; background:#f5f6fa; color:#242730; box-shadow:0 8px 22px #0000000b; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
.window-chrome { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:11px 14px; background:#eef0f5; font-size:11px; }
.traffic-lights { display:flex; gap:5px; }.traffic-lights i { width:9px;height:9px;border-radius:50%;background:#ff6258; }.traffic-lights i:nth-child(2){background:#febc2e}.traffic-lights i:nth-child(3){background:#28c840}
.desktop-layout { display:grid; grid-template-columns:minmax(90px,28%) minmax(0,1fr); min-height:280px; }
.desktop-sidebar { padding:16px 8px; background:#ebedf3; font-size:10px; }
.sidebar-search { margin-bottom:24px; border-radius:5px; padding:8px 5px; background:#fff9; color:#6b6c76; }
.sidebar-item { display:flex; align-items:center; gap:5px; margin:8px 0; padding:8px 5px; border-radius:6px; line-height:1.6; overflow-wrap:anywhere; }
.desktop-main { min-width:0; padding:16px; }
.breadcrumbs { margin:0 0 12px; font-size:10px; color:#626977; overflow-wrap:anywhere; }
.desktop-main h4 { margin:0 0 18px; font-size:19px; line-height:1.5; }
.settings-card { display:flex; align-items:center; gap:8px; justify-content:space-between; min-height:43px; margin:8px 0; padding:10px; border:1px solid #e0e2e8; border-radius:8px; background:#fff; font-size:11px; line-height:1.6; overflow-wrap:anywhere; }
.settings-card>span:first-child { flex:1; min-width:0; }
.muted { color:#657181; }.section-label { margin:18px 2px 8px; font-size:11px; font-weight:600; line-height:1.6; }
.target { background:#eaf2ff; box-shadow:inset 0 0 0 1.5px #4385d5; border-radius:8px; }
.toggle { flex:0 0 29px; width:29px; height:18px; border-radius:20px; padding:2px; background:#c5c9d0; }.toggle::before{content:'';display:block;width:14px;height:14px;border-radius:50%;background:white;}.toggle.on{background:#1765ce}.toggle.on::before{margin-left:auto}
.desktop-fields { display:grid; grid-template-columns:minmax(0,1.7fr) minmax(0,1fr); gap:8px; }
.fake-field { position:relative; min-width:0; display:grid; gap:6px; margin:8px 0; padding:10px; font-size:11px; line-height:1.6; overflow-wrap:anywhere; }
.fake-field>span:first-child { display:flex; align-items:center; justify-content:space-between; gap:5px; }.fake-field>.pin{position:absolute;right:7px;top:7px}.desktop-fields .fake-field{padding-top:30px}
.fake-input { display:block; border:1px solid #cbd3df; border-radius:4px; padding:7px; background:#fff; color:#53667f; font-size:10px; }
.fake-button { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:5px 10px; border:1px solid #cfd3dc; border-radius:5px; background:#fff; font-size:10px; line-height:1.5; text-align:center; }
.primary { background:#1765ce; border-color:#1765ce; color:white; }.primary .pin { background:white; color:#1765ce; }
.dialog-footer { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; margin-top:18px; }
.protocol-card + .protocol-card { margin-top:12px; }
.pin { display:inline-grid; flex:0 0 21px; place-items:center; width:21px; height:21px; border-radius:50%; background:#1765ce; color:white; font:700 11px/1 sans-serif; }
.ghost-lines { display:grid; gap:14px; padding:22px 6px; }.ghost-lines span{width:75%;height:8px;border-radius:9px;background:#e0e3eb}.ghost-lines span+span{width:48%}
.guide-explanation { margin-top:24px; min-width:0; }.guide-progress{color:var(--vp-c-brand-1);font-size:12px;font-weight:700}.guide-explanation h4{margin:8px 0 12px;font-size:19px;line-height:1.5}.guide-explanation p{margin:0 0 16px;font-size:14px;line-height:1.8}
.guide-callouts { display:grid;gap:14px;list-style:none;padding:0;margin:18px 0; }.guide-callouts li{display:flex;align-items:flex-start;gap:10px;margin:0;font-size:14px;line-height:1.7}.guide-callouts .pin{margin-top:2px}
.guide-explanation .guide-reminder { margin-top:22px;padding-left:12px;border-left:2px solid var(--vp-c-divider);color:var(--vp-c-text-2);font-size:12px; }
figcaption { padding:13px 20px;border-top:1px solid var(--vp-c-divider);color:var(--vp-c-text-2);font-size:12px;line-height:1.7; }
.mobile-body { display:grid;grid-template-columns:minmax(0,290px) minmax(0,1fr);gap:26px;align-items:center; }.mobile-body .guide-explanation{margin-top:0}
.phone { position:relative;padding:12px 12px 28px;border:5px solid #30343c;border-radius:30px;background:#f3f3fa;min-height:440px; }.phone-status{display:flex;justify-content:space-between;padding:0 6px;font-size:10px;font-weight:700}.android-nav{display:flex;align-items:center;gap:8px;min-height:64px;font-size:13px;line-height:1.5}.android-nav>strong{flex:1;min-width:0;overflow-wrap:anywhere}.android-nav>span:first-child{font-size:25px}.edit-icon{display:flex;gap:3px;align-items:center;color:#1765ce}.wifi-emblem{text-align:center;font-size:50px;line-height:1.5;color:#1765ce}.network-name{text-align:center;font-size:16px}.phone-home{position:absolute;bottom:8px;left:33%;width:34%;height:4px;border-radius:8px;background:#30343c}.phone .fake-field>span:first-child{font-size:11px}
@container (max-width:420px) {
  .desktop-layout { grid-template-columns:minmax(0,1fr); }.desktop-sidebar{display:none}.desktop-sidebar:has(.target){display:block;padding:8px 12px}.desktop-sidebar .sidebar-item:not(.target),.sidebar-search{display:none}.desktop-main{padding:12px}.desktop-main h4{font-size:17px}.desktop-fields{grid-template-columns:minmax(0,1fr)}.desktop-fields .fake-field{padding-top:10px;padding-right:35px}
}
@media(max-width:640px){.guide-body{padding:24px 18px}.mobile-body{grid-template-columns:minmax(0,1fr);gap:24px}.phone{width:290px;max-width:100%;justify-self:center}.guide-stages button{flex-direction:column;align-items:flex-start;padding:12px 9px;font-size:12px}.guide-toolbar{padding-inline:16px}}
</style>
