<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { bindingUi } from './bookmarklet-preview-copy'
import type { GuideLocale } from './cn-net-ios-copy'

const props = defineProps<{ locale: GuideLocale }>()
const ui = computed(() => bindingUi[props.locale])
</script>

<template>
  <div class="binding-preview">
    <img class="binding-background" :src="withBase('/images/bind-bookmark-background.webp')" alt="" loading="lazy" />
    <div class="binding-shade"></div>
    <div class="binding-column">
      <h5>{{ ui.title }}</h5>
      <div class="binding-window">
        <div class="server-tabs"><span class="selected">{{ ui.jp }}</span><span>{{ ui.intl }}</span><span>{{ ui.cn }}</span></div>
        <div class="method-tabs"><span>{{ ui.account }}</span><span class="selected">{{ ui.bookmark }}</span></div>
        <div class="collapsed-step"><b class="completed">✓</b><span>{{ ui.step1 }}</span><span>⌄</span></div>
        <div class="collapsed-step"><b class="completed">✓</b><span>{{ ui.step2 }}</span><span>⌄</span></div>
        <div class="open-step">
          <div class="step-heading"><b>3</b><span>{{ ui.step3 }}</span><span>⌃</span></div>
          <div class="device-tabs"><span class="selected">{{ ui.desktop }}</span><span>{{ ui.ios }}</span><span>{{ ui.android }}</span></div>
          <p>{{ ui.drag }}</p>
          <div class="drop-well">
            <div class="bookmark-pill">
              <svg class="grip" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="4" r="1" /><circle cx="11" cy="4" r="1" /><circle cx="5" cy="8" r="1" /><circle cx="11" cy="8" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="11" cy="12" r="1" /></svg>
              <svg viewBox="0 0 24 24" fill="none"><path d="M6 4h12v17l-6-4-6 4Z" /></svg>
              <span>{{ ui.bookmarkTitle }}</span>
            </div>
            <b class="annotation">1</b>
          </div>
          <div class="binding-next">{{ ui.next }} <span>→</span></div>
        </div>
        <div class="collapsed-step"><b>4</b><span>{{ ui.step4 }}</span><span>⌄</span></div>
      </div>
    </div>
    <svg class="drag-arrow" viewBox="0 0 40 64" fill="none"><path d="M20 60V5m-9 12 9-12 9 12" /></svg>
  </div>
</template>

<style scoped>
.binding-preview { position: relative; container-type: inline-size; min-height: 510px; padding: 36px 20px 24px; overflow: hidden; isolation: isolate; background: #141423; color: #fff; }
.binding-background, .binding-shade { position: absolute; z-index: -1; inset: 0; width: 100%; height: 100%; }
.binding-background { object-fit: cover; object-position: 70% center; }
.binding-shade { background: linear-gradient(90deg, #1414233d, #14142316 70%, #14142330); }
.binding-column { position: relative; width: 340px; max-width: 76%; }
h5 { margin: 0 0 30px 5px; font-size: 18px; line-height: 1.4; font-weight: 700; letter-spacing: .06em; color: white; text-shadow: 0 2px 8px #0009; }
.binding-window { position: relative; padding: 29px 11px 11px; border: 1px solid #ffffff38; border-radius: 24px; background: linear-gradient(#ffffff16, #ffffff03 60%), #1e1c2466; backdrop-filter: blur(12px) saturate(160%) brightness(.8); box-shadow: 0 18px 35px #0006, inset 0 1px #ffffff30; }
.server-tabs { position: absolute; top: -19px; left: 12px; right: 12px; display: flex; align-items: center; justify-content: center; padding: 4px; gap: 4px; border: 1px solid #ffffff38; border-radius: 999px; background: #26222de0; box-shadow: 0 4px 10px #0004; }
.server-tabs span, .method-tabs span, .device-tabs span { min-width: 0; flex: 1; padding: 6px 7px; border-radius: 999px; text-align: center; overflow-wrap: anywhere; font-size: 10px; line-height: 1.6; color: #ffffffb8; }
.selected { background: linear-gradient(#ffffff30, #ffffff12); box-shadow: inset 0 1px #ffffff40, 0 2px 5px #0003; color: white !important; }
.method-tabs, .device-tabs { display: flex; gap: 3px; padding: 3px; border-radius: 999px; background: #0004; box-shadow: inset 0 1px 2px #0004, inset 0 -1px #ffffff14; }
.method-tabs { margin-bottom: 12px; }
.collapsed-step, .step-heading { display: flex; align-items: center; gap: 9px; min-height: 38px; padding: 4px 7px; font-size: 11px; line-height: 1.6; }
.collapsed-step > span:nth-child(2), .step-heading > span:nth-child(2) { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.collapsed-step b, .step-heading b { display: grid; flex: 0 0 22px; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #0003; color: #ffffffb8; font-size: 10px; }
.collapsed-step .completed { background: linear-gradient(#ffffff30, #ffffff00), #e45a5e; color: white; }
.open-step { margin: 3px 0; padding: 3px 6px 10px; border-radius: 17px; background: #ffffff19; }
.step-heading { padding-inline: 1px; font-weight: 650; }
.step-heading b { background: linear-gradient(#ffffff30, #ffffff16); box-shadow: inset 0 1px #ffffff35, 0 3px 6px #0004; color: #fff; }
.device-tabs { margin: 6px 0 10px; }
.open-step p { margin: 10px 4px; font-size: 10px; line-height: 1.7; color: #ffffffc9; }
.drop-well { position: relative; display: flex; justify-content: center; margin: 0 2px; padding: 15px 9px; border-radius: 13px; background: #00000038; box-shadow: inset 0 1px 2px #0005, inset 0 -1px #ffffff14; outline: 1px dashed #ffffff38; outline-offset: -1px; }
.bookmark-pill { display: flex; align-items: center; gap: 6px; min-width: 0; padding: 8px 12px 8px 8px; border-radius: 999px; background: linear-gradient(#ffffff33, #ffffff1a); box-shadow: inset 0 1px #ffffff4d, inset 0 -1px #ffffff0f, 0 5px 13px #0005; font-size: 11px; line-height: 1.6; font-weight: 600; }
.bookmark-pill svg { flex: 0 0 14px; width: 14px; height: 14px; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.bookmark-pill .grip { color: #ffffff80; stroke: none; }
.bookmark-pill span { min-width: 0; overflow-wrap: anywhere; }
.annotation { position: absolute; top: -8px; right: 3px; display: grid; place-items: center; width: 21px; height: 21px; border-radius: 50%; background: #1765ce; color: #fff; font: 700 11px/1 sans-serif; box-shadow: 0 0 0 2px #fff; }
.binding-next { display: flex; justify-content: center; align-items: center; gap: 8px; margin: 12px 2px 0; padding: 7px 12px; border-radius: 999px; background: linear-gradient(#ffffff2b, #ffffff00), #e45a5e; box-shadow: inset 0 1px #ffffff5c, 0 3px 8px #0003; font-size: 11px; font-weight: 600; }
.drag-arrow { position: absolute; top: 7px; left: 29%; width: 22px; height: 50px; stroke: #f4a3a6; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 1px 3px #000); }
@container (max-width: 390px) {
  .binding-column { max-width: 100%; width: 100%; }
  h5 { font-size: 15px; }
  .drag-arrow { left: 48%; }
}
</style>
