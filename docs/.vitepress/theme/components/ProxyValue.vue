<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { CN_NET_PROXY } from './cn-net-proxy'
import type { GuideLocale } from './cn-net-ios-copy'

const props = defineProps<{ kind: keyof typeof CN_NET_PROXY; locale: GuideLocale }>()
const labels = {
  zh: { host: '服务器', port: '端口', copy: '复制', copied: '已复制', failed: '复制失败，可选中字段内容后手动复制。' },
  'zh-TW': { host: '伺服器', port: '埠', copy: '複製', copied: '已複製', failed: '複製失敗，可選取欄位內容後手動複製。' },
  en: { host: 'Server', port: 'Port', copy: 'Copy', copied: 'Copied', failed: 'Copy failed. Select the field value and copy it manually.' },
  ja: { host: 'サーバ', port: 'ポート', copy: 'コピー', copied: 'コピー済み', failed: 'コピーできませんでした。欄の値を選択して手動でコピーしてください。' },
}
const copy = computed(() => labels[props.locale])
const field = ref<HTMLInputElement>()
const state = ref<'idle' | 'copying' | 'copied' | 'failed'>('idle')
let timer: ReturnType<typeof setTimeout> | undefined
let disposed = false

async function copyValue() {
  clearTimeout(timer)
  state.value = 'copying'
  try {
    await navigator.clipboard.writeText(CN_NET_PROXY[props.kind])
    if (disposed) return
    state.value = 'copied'
    timer = setTimeout(() => { state.value = 'idle' }, 2000)
  } catch {
    if (disposed) return
    state.value = 'failed'
    field.value?.focus()
    field.value?.select()
  }
}

onBeforeUnmount(() => {
  disposed = true
  clearTimeout(timer)
})
</script>

<template>
  <span class="proxy-value copyable" :data-proxy-value="kind">
    <input ref="field" :value="CN_NET_PROXY[kind]" :aria-label="copy[kind]" readonly spellcheck="false" @focus="field?.select()" @click="field?.select()" />
    <button type="button" :aria-label="`${copy.copy} · ${copy[kind]}`" :title="state === 'copied' ? copy.copied : state === 'failed' ? copy.failed : `${copy.copy} · ${copy[kind]}`" :disabled="state === 'copying'" :data-copied="state === 'copied' || undefined" @click="copyValue">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path v-if="state === 'copied'" d="m5 12 4 4L19 6" />
        <template v-else><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" /></template>
      </svg>
    </button>
    <span class="copy-feedback" role="status">{{ state === 'copied' ? `${copy[kind]} · ${copy.copied}` : state === 'failed' ? copy.failed : '' }}</span>
  </span>
</template>

<style scoped>
.proxy-value.copyable { position: relative; display: flex; align-items: center; gap: 5px; min-width: 0; }
.proxy-value input { width: 100%; flex: 1; min-width: 0; padding: 0; border: 0; border-radius: 2px; background: transparent; color: inherit; font: inherit; line-height: inherit; text-align: inherit; }
.proxy-value button { display: grid; place-items: center; flex: 0 0 22px; width: 22px; height: 22px; padding: 3px; border: 0; border-radius: 4px; background: #1765ce0d; color: #1765ce; cursor: pointer; }
.proxy-value button:hover { background: #1765ce20; }
.proxy-value button[data-copied] { color: #16804a; }
.proxy-value button:disabled { cursor: wait; }
.proxy-value button svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.proxy-value input:focus-visible, .proxy-value button:focus-visible { outline: 2px solid #1765ce; outline-offset: 2px; }
.copy-feedback { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
