<script setup lang="ts">
/**
 * 首页底部的双栏区块：左边是提交动态，右边是插槽内容（社区交流）。
 *
 * 社区链接仍旧写在 index.md 里 —— 它们是内容不是组件状态，留在 markdown
 * 才好维护。这里只负责把两块并排摆好。
 */
import CommitFeed from './CommitFeed.vue'
</script>

<template>
  <section class="hc-root">
    <div class="hc-main">
      <CommitFeed />
    </div>
    <aside class="hc-aside">
      <slot />
    </aside>
  </section>
</template>

<style scoped>
.hc-root {
  display: grid;
  /* 动态那栏条目多、文字长，给它更大的份额 */
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 48px;
  margin: 44px 0 8px;
}

.hc-aside {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/*
 * 右栏来自 markdown，会带上 VitePress 的 .vp-doc 排版：h2 有巨大的上边距和
 * 一条分隔线，和左栏的小标题完全对不齐。这里把它压成同一档。
 */
.hc-aside :deep(h2) {
  margin: 0 0 4px;
  padding: 0;
  border-top: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.hc-aside :deep(h2 .header-anchor) {
  display: none;
}

/* 撑满右栏剩余高度，三颗胶囊在其中均匀铺开，和左栏的紧凑列表形成疏密对比 */
.hc-aside :deep(ul) {
  flex: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

/*
 * 圆角 20px、文字居中、左右 padding 20px —— 与首页顶部那两颗行动按钮取同一套参数，
 * 让这三颗读起来是同一个家族的元件。整颗都可点，不是只有链接那几个字。
 */
.hc-aside :deep(li) {
  position: relative;
  margin: 0;
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.18s ease, transform 0.18s ease, background-color 0.18s ease;
}

.hc-aside :deep(li:hover) {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  transform: translateY(-2px);
}

.hc-aside :deep(a) {
  font-weight: 500;
  text-decoration: none;
}

/*
 * 让整颗胶囊都可点。只能借 ::before —— VitePress 已经用 a::after 放外链箭头了，
 * 占用它的结果是箭头被 inset:0 推到卡片左上角，覆盖层也没建起来。
 */
.hc-aside :deep(a)::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .hc-aside :deep(li) {
    transition: none;
  }

  .hc-aside :deep(li:hover) {
    transform: none;
  }
}

@media (max-width: 860px) {
  .hc-root {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  /* 堆叠之后右栏不再需要撑高，胶囊回到固定间距 */
  .hc-aside :deep(ul) {
    display: block;
  }

  .hc-aside :deep(li + li) {
    margin-top: 12px;
  }
}
</style>
