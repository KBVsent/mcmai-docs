<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { useUpdates } from '../composables/useUpdates'

const COPY: Record<string, { title: string; viewAll: string; path: string }> = {
  'zh-CN': { title: '最近动态', viewAll: '查看全部', path: '/updates' },
  'zh-TW': { title: '最近動態', viewAll: '查看全部', path: '/zh-TW/updates' },
  'ja-JP': { title: '最近の動き', viewAll: 'すべて見る', path: '/ja/updates' },
  'en-US': { title: 'Recent activity', viewAll: 'View all', path: '/en/updates' },
}

const { locale, data, status, fetchUpdates, pick, relative, absolute, typeLabel } = useUpdates()
const t = computed(() => COPY[locale.value])
const link = computed(() => withBase(t.value.path))

onMounted(fetchUpdates)
</script>

<template>
  <!--
    首页失败时整块静默隐藏，不显示任何错误文字 —— 这是营销页面，
    一条「取不到数据」的提示比少一个模块更伤观感。更新记录页则会明说。
  -->
  <section v-if="status === 'ready' && data?.stream.length" class="cf-root">
    <div class="cf-head">
      <h2 class="cf-title">{{ t.title }}</h2>
      <a class="cf-more" :href="link">{{ t.viewAll }}<span aria-hidden="true"> →</span></a>
    </div>

    <ol class="cf-list">
      <li
        v-for="(s, i) in data.stream"
        :key="s.seq"
        class="cf-item"
        :style="{ '--cf-i': i }"
      >
        <span class="cf-dot" :data-type="s.type" :data-latest="i === 0 || undefined" aria-hidden="true" />
        <span class="cf-type">{{ typeLabel(s.type) }}</span>
        <span class="cf-text">{{ pick(s.title) }}</span>
        <time class="cf-time" :datetime="s.date" :title="absolute(s.date)">{{ relative(s.date) }}</time>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.cf-root {
  margin: 0;
}

.cf-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 4px;
}

.cf-title {
  font-size: 18px;
  font-weight: 600;
  /* 必须和右栏 markdown 里的 h2 取同一个值 —— 光让两个盒子 top 相等还不够，
     line-height 不同会让文字在各自盒内的位置错开，看上去就不在一条线上 */
  line-height: 1.4;
  letter-spacing: -0.01em;
  margin: 0;
  padding: 0;
  border: 0;
}

.cf-more {
  flex: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  white-space: nowrap;
}

.cf-more:hover {
  text-decoration: underline;
}

.cf-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/*
 * 时间线：圆点串在一条竖线上。刻意不做成徽章列表 —— 更新记录页已经是那个形态，
 * 首页需要的是「一直在推进」的流动感，而不是又一张卡片墙。
 */
.cf-item {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 9px 0 9px 20px;
  /* 逐条淡入，让这块在首页有「正在流动」的观感；--cf-i 由模板给出序号 */
  opacity: 0;
  animation: cf-enter 0.45s cubic-bezier(0.22, 0.68, 0.28, 1) forwards;
  animation-delay: calc(var(--cf-i, 0) * 70ms);
}

@keyframes cf-enter {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.cf-item::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--mc-timeline);
}

/* 首尾两段竖线收进去，避免线头突兀地悬在外面 */
.cf-item:first-child::before {
  top: 50%;
}

.cf-item:last-child::before {
  bottom: 50%;
}

.cf-dot {
  position: absolute;
  left: 0;
  top: 15px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--mc-neutral-fg);
  /* 描一圈页面底色让圆点浮起来；3px 会把竖线切得太碎，2px 刚好 */
  box-shadow: 0 0 0 2px var(--vp-c-bg);
}

.cf-dot[data-type='feat'] { background: var(--mc-feat-fg); }
.cf-dot[data-type='fix'] { background: var(--mc-fix-fg); }
.cf-dot[data-type='perf'] { background: var(--mc-perf-fg); }

/* 最新一条：向外扩散一圈同色光晕，点出「刚刚发生」 */
.cf-dot[data-latest]::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: inherit;
  animation: cf-pulse 2.4s cubic-bezier(0.22, 0.68, 0.28, 1) infinite;
}

@keyframes cf-pulse {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  70%,
  100% {
    transform: scale(2.8);
    opacity: 0;
  }
}

/* 有人对动效敏感，也有人只是关掉了它 —— 两种都直接给静止的最终态 */
@media (prefers-reduced-motion: reduce) {
  .cf-item {
    opacity: 1;
    animation: none;
  }

  .cf-dot[data-latest]::after {
    display: none;
  }
}

/* 类型以文字出现，圆点的颜色只是辅助 —— 不靠颜色单独区分 */
.cf-type {
  flex: none;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.cf-text {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 14px;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cf-time {
  flex: none;
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
  .cf-item {
    flex-wrap: wrap;
    gap: 4px 8px;
  }

  /* 窄屏让标题独占一行，类型与时间退到下面一行做脚注 */
  .cf-text {
    flex: 1 1 100%;
    order: -1;
    white-space: normal;
  }
}
</style>
