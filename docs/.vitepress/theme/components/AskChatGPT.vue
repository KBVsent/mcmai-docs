<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import { docsIndexFile, siteOrigin } from '../../site-url'
import { assistantCopy } from './doc-assistant-copy'

const { page, lang, localeIndex, frontmatter } = useData()
const panel = ref<HTMLElement>()
const selected = ref(0)
const text = computed(() => assistantCopy[lang.value] ?? assistantCopy['zh-CN'])
const home = computed(() => frontmatter.value.layout === 'home')
const article = computed(() => /(?:^|\/)(guide|commands)\//.test(page.value.relativePath))
const topics = computed(() => article.value ? [text.value.current, ...text.value.topics] : text.value.topics)
const topic = computed(() => topics.value[selected.value])
const href = computed(() => {
  if (!topic.value) return
  const prefix = localeIndex.value === 'root' ? '' : localeIndex.value + '/'
  const lines = [topic.value.question, '', text.value.sourceInstruction, '',
    `${text.value.index}: ${new URL(prefix + docsIndexFile, siteOrigin)}`]
  if (article.value) lines.push(`${text.value.article}: ${page.value.title}\n${new URL(page.value.relativePath, siteOrigin)}`)
  const url = new URL('https://chatgpt.com/')
  url.searchParams.set('prompt', lines.join('\n'))
  return url.href
})

watch(() => page.value.relativePath, () => {
  panel.value?.hidePopover?.()
  selected.value = 0
})
</script>

<template>
  <div v-if="home || article" class="doc-assistant">
    <button class="launcher" :aria-label="text.launcher" type="button" popovertarget="mcmai-doc-assistant">
      <span class="orb-core"><img :src="withBase('/logo.png')" alt="" /></span>
      <span class="launcher-label" aria-hidden="true">{{ text.launcher }}</span>
    </button>
    <section id="mcmai-doc-assistant" ref="panel" popover="auto" aria-labelledby="assistant-heading">
      <header>
        <h2 id="assistant-heading">{{ text.heading }}</h2>
        <button class="close" type="button" popovertarget="mcmai-doc-assistant" popovertargetaction="hide" :aria-label="text.close">×</button>
      </header>
      <div class="choices">
        <button v-for="(item, i) in topics" :key="item.label" type="button" :aria-pressed="selected === i" @click="selected = i">
          <span>{{ item.label }}</span><span class="choice-mark" aria-hidden="true">{{ selected === i ? '✓' : '' }}</span>
        </button>
      </div>
      <div aria-live="polite">
        <div v-if="topic" class="preview">
          <h3>{{ text.preview }}</h3>
          <p>{{ topic.question }}</p>
          <a :href="href" target="_blank" rel="noopener noreferrer">{{ text.open }} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.doc-assistant {
  display: grid;
  width: 37px;
  justify-content: center;
  color: var(--vp-c-text-1);
}
.launcher {
  position: relative;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  box-shadow: 0 3px 12px rgb(70 57 135 / 20%);
  anchor-name: --mcmai-assistant;
}
.launcher::before {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  background: conic-gradient(from 25deg, #6d5efc, #22d3ee, #b8a7ff 58%, #ff74aa, #6d5efc);
}
.orb-core {
  z-index: 1;
  display: grid;
  place-items: center;
  width: 37px;
  height: 37px;
  border: 2px solid var(--vp-c-bg);
  border-radius: 50%;
  background: linear-gradient(145deg, var(--vp-c-brand-soft), transparent), var(--vp-c-bg);
}
.orb-core img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}
.launcher-label {
  position: absolute;
  right: calc(100% + 9px);
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-1);
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.5;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
}
.launcher:hover .launcher-label,
.launcher:focus-visible .launcher-label { opacity: 1; }
.doc-assistant:has(:popover-open) .launcher-label { visibility: hidden; }

@media (prefers-reduced-motion: no-preference) {
  .launcher { animation: orb-arrive 680ms 180ms backwards; }
  .launcher::before { animation: orb-turn 1.35s 280ms ease-out; }
  .launcher-label { animation: label-intro 3.4s 450ms backwards; }
  #mcmai-doc-assistant:popover-open { animation: panel-arrive 170ms ease-out; }
}
@keyframes orb-arrive {
  0% { opacity: 0; transform: translateY(10px) scale(.82); }
  65% { opacity: 1; transform: translateY(-3px) scale(1.05); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes orb-turn { from { transform: rotate(-210deg); } to { transform: rotate(0); } }
@keyframes label-intro {
  0%, 100% { opacity: 0; transform: translateX(4px); }
  12%, 83% { opacity: 1; transform: translateX(0); }
}
@keyframes panel-arrive {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: none; }
}
#mcmai-doc-assistant {
  position: fixed;
  inset: auto max(24px, env(safe-area-inset-right)) 155px auto;
  position-anchor: --mcmai-assistant;
  width: min(350px, calc(100vw - 24px));
  max-height: calc(100dvh - 205px);
  margin: 0;
  overflow: auto;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: var(--vp-shadow-3);
}
@supports (bottom: anchor(top)) {
  #mcmai-doc-assistant {
    bottom: calc(anchor(top) + 10px);
  }
}
header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
h2 { font-size: 17px; font-weight: 650; }
.close { width: 36px; height: 36px; font-size: 22px; }
.choices { display: grid; gap: 6px; margin-top: 10px; }
.choices button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 14px;
  text-align: start;
}
.choices button[aria-pressed="true"], .choices button:hover { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.choice-mark { color: var(--vp-c-brand-1); font-weight: 700; }
.preview { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--vp-c-divider); }
h3 { font-size: 12px; font-weight: 600; color: var(--vp-c-text-2); }
p { margin: 4px 0 12px; line-height: 1.55; font-size: 14px; }
.preview a {
  display: block;
  padding: 10px;
  border-radius: 8px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
@media (max-width: 767px) {
  #mcmai-doc-assistant { right: max(12px, env(safe-area-inset-right)); }
}
@media (max-height: 640px) {
  #mcmai-doc-assistant {
    bottom: max(12px, env(safe-area-inset-bottom));
    max-height: calc(100dvh - max(12px, env(safe-area-inset-bottom)) - 12px);
  }
}
</style>
