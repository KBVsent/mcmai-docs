<script setup lang="ts">
/**
 * 指令文档页里的结果示例卡片，用法：<ShowcaseFigure shot="search" />。
 * 左边是截取顶部的小缩略图，右边是指令与说明，点击卡片用 Teek 的图片预览打开全图；
 * 结果图都很长，原尺寸放进正文会把文字挤开，所以正文里只放缩略图。
 * 图、尺寸与防缓存摘要读演示图的 manifest，指令与 alt 跟首页演示共用一份文案（showcase-copy.ts），
 * 重新出图后不用改各页面。给 LLM 的 md 里，构建脚本会把这个标签换成 Markdown 图片（config.mts 的 llmMarkdown）。
 */
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { createImageViewer } from 'vitepress-theme-teek'
import { SHOT_CAPTION, findShot, type ShotKey } from '../showcase-copy'

const props = defineProps<{ shot: ShotKey }>()
const { lang } = useData()
const shot = computed(() => findShot(lang.value, props.shot))
const caption = computed(() => SHOT_CAPTION[lang.value] ?? SHOT_CAPTION['en-US'])

function open() {
  createImageViewer({ urlList: [withBase(shot.value.src)], initialIndex: 0, infinite: false })
}
</script>

<template>
  <figure class="mcmai-shot" @click="open">
    <!-- no-preview：缩略图是截取的，不让 Teek 的全局图片预览接管，统一由这里打开全图 -->
    <img
      class="mcmai-shot-thumb no-preview"
      :src="withBase(shot.thumb)"
      :alt="shot.alt"
      loading="lazy"
      decoding="async"
    />
    <figcaption class="mcmai-shot-body">
      <span class="mcmai-shot-label">{{ caption.label }}</span>
      <code class="mcmai-shot-command">{{ shot.command }}</code>
      <span class="mcmai-shot-note">{{ caption.note }}</span>
      <button type="button" class="mcmai-shot-open" @click.stop="open">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M11 8v6M8 11h6" /></svg>
        {{ shot.viewFull }}
      </button>
    </figcaption>
  </figure>
</template>

<style scoped>
.mcmai-shot {
  display: flex;
  align-items: stretch;
  gap: 16px;
  max-width: 560px;
  margin: 20px 0;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  cursor: zoom-in;
  transition: border-color 0.2s ease;
}

.mcmai-shot:hover {
  border-color: var(--vp-c-brand-2);
}

/* 截取图上端是标题区，缩略图从顶部裁，一眼能认出是哪种结果 */
.mcmai-shot-thumb {
  flex: none;
  width: 96px;
  height: 128px;
  margin: 0;
  object-fit: cover;
  object-position: top;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(15 23 42 / 16%);
  transition: transform 0.2s ease;
}

.mcmai-shot:hover .mcmai-shot-thumb {
  transform: scale(1.03);
}

.mcmai-shot-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
  padding: 2px 0;
}

.mcmai-shot-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-3);
}

.vp-doc .mcmai-shot-command {
  max-width: 100%;
  overflow-wrap: anywhere;
}

.mcmai-shot-note {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.mcmai-shot-open {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: auto;
  padding: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  cursor: zoom-in;
}

.mcmai-shot-open:hover {
  color: var(--vp-c-brand-2);
}

@media (prefers-reduced-motion: reduce) {
  .mcmai-shot,
  .mcmai-shot-thumb {
    transition: none;
  }
}
</style>
