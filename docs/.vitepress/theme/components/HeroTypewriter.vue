<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

type HeroCopy = {
  phrases: string[]
  summary: string
  hint: string
}

const COPY: Record<string, HeroCopy> = {
  'zh-CN': {
    phrases: ['多区服数据查询', '成绩统计与分析', '排行榜与进度追踪', 'SNS 内即开即用'],
    summary: '多区服数据查询、成绩统计与分析、排行榜与进度追踪、SNS 内即开即用',
    hint: 'maimai DX 查分 Bot，支持国服、日服和国际服，可在 QQ、LINE 与 Discord 使用。',
  },
  'zh-TW': {
    phrases: ['多區服資料查詢', '成績統計與分析', '排行榜與進度追蹤', 'SNS 內即開即用'],
    summary: '多區服資料查詢、成績統計與分析、排行榜與進度追蹤、SNS 內即開即用',
    hint: 'maimai DX 成績查詢 Bot，支援中國版、日本版及國際版，可在 QQ、LINE 與 Discord 使用。',
  },
  'en-US': {
    phrases: ['Multi-region data', 'Score analytics', 'Rankings & progress', 'Built for social chat'],
    summary: 'Multi-region data, score analytics, rankings and progress, built for social chat',
    hint: 'A maimai DX score bot for CN, JP, and INTL players on QQ, LINE, and Discord.',
  },
  'ja-JP': {
    phrases: ['マルチサーバー照会', 'スコア統計・分析', 'ランキング・進捗管理', 'SNS ですぐ使える'],
    summary: 'マルチサーバー照会、スコア統計・分析、ランキング・進捗管理、SNS ですぐ使える',
    hint: '中国版・日本版・国際版に対応し、QQ・LINE・Discord で使える maimai DX スコア照会 Bot です。',
  },
}

const { frontmatter, lang } = useData()
const copy = computed(() => COPY[lang.value] ?? COPY['en-US'])
const heroName = computed(() => frontmatter.value.hero?.name ?? 'McMai')
const tagline = computed(() => frontmatter.value.hero?.tagline ?? '')
const displayed = ref(copy.value.phrases[0])

let phraseIndex = 0
let deleting = false
let timer: ReturnType<typeof setTimeout> | undefined
let motionQuery: MediaQueryList | undefined
let reduceMotion = false

const chars = (value: string) => Array.from(value)

function clearTimer() {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

function schedule(delay: number) {
  clearTimer()
  if (reduceMotion || document.hidden) return
  timer = setTimeout(tick, delay)
}

function tick() {
  const phrases = copy.value.phrases
  const target = chars(phrases[phraseIndex] ?? phrases[0])
  const current = chars(displayed.value)

  if (!deleting) {
    if (current.length < target.length) {
      displayed.value = target.slice(0, current.length + 1).join('')
      schedule(60)
      return
    }
    deleting = true
    schedule(1800)
    return
  }

  if (current.length > 0) {
    displayed.value = current.slice(0, -1).join('')
    schedule(35)
    return
  }

  deleting = false
  phraseIndex = (phraseIndex + 1) % phrases.length
  schedule(250)
}

function reset() {
  clearTimer()
  phraseIndex = 0
  deleting = false
  displayed.value = copy.value.phrases[0]
  schedule(1800)
}

function handleVisibilityChange() {
  if (document.hidden) clearTimer()
  else schedule(300)
}

function handleMotionChange(event: MediaQueryListEvent | MediaQueryList) {
  reduceMotion = event.matches
  reset()
}

watch(copy, reset)

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion = motionQuery.matches
  motionQuery.addEventListener?.('change', handleMotionChange)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  reset()
})

onUnmounted(() => {
  clearTimer()
  motionQuery?.removeEventListener?.('change', handleMotionChange)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <h1 class="mcmai-hero-heading">
    <span class="mcmai-hero-name-wrap" tabindex="0" aria-describedby="mcmai-hero-hint">
      <span class="mcmai-hero-name">{{ heroName }}</span>
      <span id="mcmai-hero-hint" class="mcmai-hero-hint" role="tooltip">{{ copy.hint }}</span>
    </span>
    <span class="mcmai-hero-typewriter" aria-hidden="true">
      <span>{{ displayed }}</span><span class="mcmai-hero-cursor">|</span>
    </span>
    <span class="mcmai-sr-only">{{ copy.summary }}</span>
  </h1>
  <p v-if="tagline" class="mcmai-hero-tagline">{{ tagline }}</p>
</template>

<style scoped>
.mcmai-hero-heading {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.mcmai-hero-name,
.mcmai-hero-typewriter {
  width: 100%;
  max-width: 392px;
  margin: 0 auto;
  letter-spacing: -0.4px;
  line-height: 40px;
  font-size: 32px;
  font-weight: 700;
}

.mcmai-hero-name {
  display: block;
  width: fit-content;
  background-image: linear-gradient(to right, #99d3fb, #a1b8fc, #ebc4fb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.mcmai-hero-name-wrap {
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 8px;
  cursor: help;
  outline: none;
}

.mcmai-hero-name-wrap .mcmai-hero-name {
  margin: 0;
}

.mcmai-hero-name-wrap:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 26%, transparent);
}

.mcmai-hero-hint {
  position: absolute;
  left: 50%;
  top: calc(100% + 8px);
  z-index: 4;
  width: max-content;
  max-width: min(320px, calc(100vw - 40px));
  padding: 8px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
  color: var(--vp-c-text-2);
  -webkit-text-fill-color: currentColor;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.55;
  text-align: left;
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate(-50%, -4px);
  transition: opacity 0.16s ease, transform 0.16s ease, visibility 0.16s;
}

.mcmai-hero-name-wrap:focus-visible .mcmai-hero-hint {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}

@media (hover: hover) {
  .mcmai-hero-name-wrap:hover .mcmai-hero-hint {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }
}

.mcmai-hero-typewriter {
  display: block;
  min-height: 1em;
  color: var(--vp-c-text-1);
  font-size: clamp(26px, 8vw, 32px);
  white-space: nowrap;
}

.mcmai-hero-cursor {
  display: inline-block;
  margin-left: 0.06em;
  color: #f472b6;
  font-weight: 500;
  animation: mcmai-cursor-pulse 0.8s steps(1, end) infinite;
}

.mcmai-hero-tagline {
  max-width: 392px;
  margin: 0 auto;
  padding-top: 8px;
  line-height: 28px;
  font-size: 18px;
  font-weight: 500;
  white-space: pre-wrap;
  color: var(--vp-c-text-2);
}

.mcmai-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes mcmai-cursor-pulse {
  0%, 48% { opacity: 1; }
  49%, 100% { opacity: 0; }
}

@media (min-width: 640px) {
  .mcmai-hero-name,
  .mcmai-hero-typewriter {
    max-width: 576px;
    line-height: 56px;
    font-size: 48px;
  }

  .mcmai-hero-tagline {
    max-width: 576px;
    padding-top: 12px;
    line-height: 32px;
    font-size: 20px;
  }
}

@media (min-width: 960px) {
  .mcmai-hero-name,
  .mcmai-hero-typewriter {
    margin: 0;
    line-height: 64px;
    font-size: 56px;
  }

  .mcmai-hero-name {
    width: fit-content;
  }

  .mcmai-hero-name-wrap {
    margin: 0;
  }

  .mcmai-hero-hint {
    left: calc(100% + 12px);
    top: 50%;
    transform: translate(-4px, -50%);
  }

  .mcmai-hero-name-wrap:focus-visible .mcmai-hero-hint {
    transform: translate(0, -50%);
  }

  .mcmai-hero-tagline {
    margin: 0;
    line-height: 36px;
    font-size: 24px;
  }
}

@media (hover: hover) and (min-width: 960px) {
  .mcmai-hero-name-wrap:hover .mcmai-hero-hint {
    transform: translate(0, -50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mcmai-hero-cursor {
    display: none;
    animation: none;
  }

  .mcmai-hero-hint {
    transition: none;
  }
}
</style>
