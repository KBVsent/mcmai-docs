<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

type Suggestion = {
  locale: string
  href: string
  message: string
  action: string
  dismissLabel: string
}

const SUGGESTIONS: Record<string, Suggestion> = {
  'zh-TW': {
    locale: 'zh-TW',
    href: '/zh-TW/',
    message: '此頁面提供繁體中文版。',
    action: '切換至繁體中文',
    dismissLabel: '關閉語言建議',
  },
  'ja-JP': {
    locale: 'ja-JP',
    href: '/ja/',
    message: '日本語版をご利用いただけます。',
    action: '日本語で表示',
    dismissLabel: '言語の案内を閉じる',
  },
  'en-US': {
    locale: 'en-US',
    href: '/en/',
    message: 'This page is available in English.',
    action: 'View in English',
    dismissLabel: 'Dismiss language suggestion',
  },
}

const STORAGE_KEY = 'mcmai-language-suggestion-v2'
const { page } = useData()
const suggestion = ref<Suggestion>()
const visible = ref(false)

function detectSuggestion() {
  const language = (navigator.languages?.[0] || navigator.language || '').toLowerCase()

  if (
    language.startsWith('zh-tw') ||
    language.startsWith('zh-hk') ||
    language.startsWith('zh-mo') ||
    language.startsWith('zh-hant')
  ) {
    return SUGGESTIONS['zh-TW']
  }

  if (language.startsWith('ja')) return SUGGESTIONS['ja-JP']
  if (language.startsWith('zh')) return undefined
  return SUGGESTIONS['en-US']
}

function wasDismissed(locale: string) {
  try {
    return localStorage.getItem(STORAGE_KEY) === locale
  } catch {
    return false
  }
}

function remember(locale: string) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Storage may be unavailable in restrictive in-app browsers.
  }
}

function updateVisibility() {
  visible.value = false
  suggestion.value = undefined

  if (page.value.relativePath !== 'index.md') return

  const detected = detectSuggestion()
  if (!detected || wasDismissed(detected.locale)) return

  suggestion.value = detected
  requestAnimationFrame(() => {
    if (page.value.relativePath === 'index.md') visible.value = true
  })
}

function dismiss() {
  if (suggestion.value) remember(suggestion.value.locale)
  visible.value = false
}

function chooseLanguage() {
  if (!suggestion.value) return
  remember(suggestion.value.locale)
  window.location.assign(suggestion.value.href)
}

onMounted(updateVisibility)
watch(() => page.value.relativePath, updateVisibility)
</script>

<template>
  <Teleport to="body">
    <Transition name="mcmai-language-suggestion">
      <aside
        v-if="visible && suggestion"
        class="language-suggestion"
        :aria-label="suggestion.message"
        data-nosnippet
      >
        <span class="language-suggestion__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.25" />
            <path d="M3.9 12h16.2M12 3.75c2.15 2.2 3.3 5.03 3.3 8.25S14.15 18.05 12 20.25C9.85 18.05 8.7 15.22 8.7 12S9.85 5.95 12 3.75Z" />
          </svg>
        </span>

        <span class="language-suggestion__message">{{ suggestion.message }}</span>

        <button class="language-suggestion__action" type="button" @click="chooseLanguage">
          {{ suggestion.action }}
          <span aria-hidden="true">→</span>
        </button>

        <button
          class="language-suggestion__dismiss"
          type="button"
          :aria-label="suggestion.dismissLabel"
          @click="dismiss"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5.5 5.5 9 9m0-9-9 9" />
          </svg>
        </button>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.language-suggestion {
  position: fixed;
  top: calc(var(--vp-nav-height, 64px) + 18px);
  left: 50%;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: max-content;
  max-width: min(680px, calc(100vw - 40px));
  min-height: 56px;
  padding: 9px 10px 9px 13px;
  border: 1px solid transparent;
  border-radius: 18px;
  background:
    linear-gradient(115deg, color-mix(in srgb, var(--vp-c-bg) 96%, #99d3fb), color-mix(in srgb, var(--vp-c-bg) 94%, #ebc4fb)) padding-box,
    linear-gradient(115deg, #99d3fb, #a1b8fc, #ebc4fb) border-box;
  box-shadow: 0 16px 42px rgb(79 70 229 / 18%), 0 4px 12px rgb(15 23 42 / 10%);
  color: var(--vp-c-text-2);
  transform: translateX(-50%);
}

.language-suggestion__icon {
  display: grid;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(135deg, rgb(153 211 251 / 24%), rgb(235 196 251 / 30%));
  color: var(--vp-c-brand-1);
}

.language-suggestion__icon svg {
  width: 21px;
  height: 21px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.65;
}

.language-suggestion__message {
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

.language-suggestion__action,
.language-suggestion__dismiss {
  appearance: none;
  border: 0;
  font: inherit;
  cursor: pointer;
}

.language-suggestion__action {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  padding: 9px 14px;
  border-radius: 999px;
  background: rgb(244 114 182 / 12%);
  color: #c1377e;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;
  transition: background-color 0.16s ease, color 0.16s ease;
}

.language-suggestion__action:hover {
  background: rgb(244 114 182 / 20%);
  color: #a8306f;
}

.language-suggestion__dismiss {
  display: grid;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  padding: 0;
  place-items: center;
  border-radius: 9px;
  background: transparent;
  color: var(--vp-c-text-3);
  transition: background-color 0.16s ease, color 0.16s ease;
}

.language-suggestion__dismiss:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.language-suggestion__dismiss svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.7;
}

.dark .language-suggestion {
  box-shadow: 0 14px 36px rgb(0 0 0 / 28%);
}

.dark .language-suggestion__action {
  background: rgb(244 114 182 / 16%);
  color: #fe9ac6;
}

.mcmai-language-suggestion-enter-active,
.mcmai-language-suggestion-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.mcmai-language-suggestion-enter-from,
.mcmai-language-suggestion-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px) scale(0.98);
}

@media (max-width: 640px) {
  .language-suggestion {
    top: calc(var(--vp-nav-height, 64px) + 8px);
    left: 50%;
    width: calc(100vw - 20px);
    max-width: none;
    gap: 8px;
    transform: translateX(-50%);
  }

  .language-suggestion__message {
    flex: 1 1 auto;
    font-size: 12px;
  }

  .language-suggestion__action {
    padding-inline: 9px;
  }
}

@media (max-width: 390px) {
  .language-suggestion__icon {
    display: none;
  }

  .language-suggestion__message {
    font-size: 11px;
  }

  .language-suggestion__action {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .language-suggestion,
  .language-suggestion__action,
  .language-suggestion__dismiss {
    transition: none;
  }
}
</style>
