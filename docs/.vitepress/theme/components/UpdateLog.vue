<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useUpdates } from '../composables/useUpdates'

const COPY: Record<string, Record<string, string>> = {
  'zh-CN': {
    totalLabel: '累计提交', heatmapNote: '过去一年的提交分布',
    less: '少', more: '多', changelog: '更新日志',
    loading: '正在加载更新记录…', failed: '暂时取不到更新记录，稍后再试',
    commitsUnit: '次提交', noCommit: '没有提交',
  },
  'zh-TW': {
    totalLabel: '累計提交', heatmapNote: '過去一年的提交分布',
    less: '少', more: '多', changelog: '更新日誌',
    loading: '正在載入更新紀錄…', failed: '暫時取不到更新紀錄，請稍後再試',
    commitsUnit: '次提交', noCommit: '沒有提交',
  },
  'ja-JP': {
    totalLabel: '累計コミット', heatmapNote: '過去 1 年間のコミット分布',
    less: '少', more: '多', changelog: '更新履歴',
    loading: '更新履歴を読み込み中…', failed: '更新履歴を取得できませんでした。しばらくしてからお試しください',
    commitsUnit: '件のコミット', noCommit: 'コミットなし',
  },
  'en-US': {
    totalLabel: 'Total commits', heatmapNote: 'Commit activity over the past year',
    less: 'Less', more: 'More', changelog: 'Changelog',
    loading: 'Loading update records…', failed: 'Update records are unavailable right now, please try again later',
    commitsUnit: 'commits', noCommit: 'No commits',
  },
}

/** 徽章列宽按语言固定，让后面的标题左缘对齐；取值 = 该语言最长标签的宽度 */
const BADGE_WIDTH: Record<string, string> = {
  'zh-CN': '5.6em',
  'zh-TW': '5.6em',
  'ja-JP': '8em',
  'en-US': '8.4em',
}

const { locale, data, status, fetchUpdates, pick, absolute, typeLabel, dateFmt } = useUpdates()
const t = computed(() => COPY[locale.value])
const badgeWidth = computed(() => BADGE_WIDTH[locale.value])

const scroller = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!(await fetchUpdates())) return
  // 52 周在多数屏幕上放不下，默认停在最左会先看到一年前的数据 —— 直接对齐到最新那一端
  await nextTick()
  if (scroller.value) scroller.value.scrollLeft = scroller.value.scrollWidth
})

// ---------------------------------------------------------------- 热力图

interface Cell {
  date: string
  count: number
  level: number
}

/**
 * 分档用非零值的分位数，而不是 max 的等分 —— 提交数是长尾分布，
 * 按 max 等分会把绝大多数日子压进第 1 档，图就成了一片同色。
 */
function levelize(counts: number[]): (n: number) => number {
  const nonzero = counts.filter((n) => n > 0).sort((a, b) => a - b)
  if (!nonzero.length) return () => 0
  const at = (q: number) => nonzero[Math.min(nonzero.length - 1, Math.floor(nonzero.length * q))]
  const [q1, q2, q3] = [at(0.25), at(0.5), at(0.75)]
  return (n: number) => (n === 0 ? 0 : n <= q1 ? 1 : n <= q2 ? 2 : n <= q3 ? 3 : 4)
}

const grid = computed<Cell[][]>(() => {
  const hm = data.value?.heatmap
  if (!hm) return []
  const start = new Date(`${hm.start}T00:00:00Z`)
  const level = levelize(hm.weeks.flat())

  return hm.weeks.map((days, w) =>
    days.map((count, d) => {
      const day = new Date(start)
      day.setUTCDate(day.getUTCDate() + w * 7 + d)
      return { date: day.toISOString().slice(0, 10), count, level: level(count) }
    }),
  )
})

/** 月份标签：某周的首日跨入新月份时打一个，位置按周索引定位 */
const monthLabels = computed(() => {
  const out: { col: number; text: string }[] = []
  let prev = -1
  const fmt = new Intl.DateTimeFormat(locale.value, { month: 'short', timeZone: 'UTC' })
  grid.value.forEach((week, i) => {
    const first = new Date(`${week[0].date}T00:00:00Z`)
    const m = first.getUTCMonth()
    // 首列不标，避免和左侧星期轴挤在一起
    if (m !== prev && i > 0) out.push({ col: i + 1, text: fmt.format(first) })
    prev = m
  })
  return out
})

/** 左轴只标周一/周三/周五，全标会糊成一片 */
const weekdayLabels = computed(() => {
  const fmt = new Intl.DateTimeFormat(locale.value, { weekday: 'short', timeZone: 'UTC' })
  // 2025-08-24 是星期日，用它当基准数出一周
  return [1, 3, 5].map((d) => ({
    row: d + 1,
    text: fmt.format(new Date(Date.UTC(2025, 7, 24 + d))),
  }))
})

/** 整张图给屏幕阅读器的一句话总述；逐格朗读 364 个单元格没人受得了 */
const heatmapSummary = computed(() => {
  const sum = grid.value.flat().reduce((n, c) => n + c.count, 0)
  return `${t.value.heatmapNote} — ${sum} ${t.value.commitsUnit}`
})

function cellTitle(c: Cell): string {
  const when = dateFmt.value.format(new Date(`${c.date}T00:00:00Z`))
  return c.count === 0 ? `${when} · ${t.value.noCommit}` : `${when} · ${c.count} ${t.value.commitsUnit}`
}
</script>

<template>
  <div class="ul-root" :style="{ '--ul-badge-w': badgeWidth }">
    <p v-if="status === 'loading'" class="ul-hint">{{ t.loading }}</p>
    <p v-else-if="status === 'failed'" class="ul-hint">{{ t.failed }}</p>

    <template v-else-if="data">
      <!-- 概览：唯一的 hero 数字 + 热力图 -->
      <section class="ul-overview">
        <div v-if="data.total !== null" class="ul-total">
          <span class="ul-total-value">{{ data.total.toLocaleString(locale) }}</span>
          <span class="ul-total-label">{{ t.totalLabel }}</span>
        </div>

        <figure v-if="grid.length" class="ul-heatmap" role="img" :aria-label="heatmapSummary">
          <figcaption class="ul-heatmap-note">{{ t.heatmapNote }}</figcaption>

          <div class="ul-heatmap-body">
            <!-- 星期轴留在滚动容器外，否则横向滚动时它会一起滑走 -->
            <div class="ul-axis">
              <div class="ul-axis-spacer" aria-hidden="true" />
              <div class="ul-weekdays">
                <span
                  v-for="w in weekdayLabels"
                  :key="w.row"
                  class="ul-weekday"
                  :style="{ gridRow: w.row }"
                  >{{ w.text }}</span
                >
              </div>
            </div>

            <div ref="scroller" class="ul-heatmap-scroll">
              <div class="ul-heatmap-inner">
                <div class="ul-months">
                  <span
                    v-for="m in monthLabels"
                    :key="m.col + m.text"
                    class="ul-month"
                    :style="{ gridColumn: m.col }"
                    >{{ m.text }}</span
                  >
                </div>

                <div class="ul-cells">
                  <div v-for="(week, wi) in grid" :key="wi" class="ul-week">
                    <div
                      v-for="cell in week"
                      :key="cell.date"
                      class="ul-cell"
                      :data-level="cell.level"
                      :title="cellTitle(cell)"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ul-legend">
            <span>{{ t.less }}</span>
            <i v-for="l in [0, 1, 2, 3, 4]" :key="l" class="ul-cell" :data-level="l" aria-hidden="true" />
            <span>{{ t.more }}</span>
          </div>
        </figure>
      </section>

      <!-- 更新日志 -->
      <section v-if="data.changelog.length" class="ul-section">
        <h2 class="ul-h">{{ t.changelog }}</h2>
        <ol class="ul-releases">
          <li v-for="r in data.changelog" :key="r.id" class="ul-release">
            <div class="ul-release-head">
              <span class="ul-badge" :data-type="r.type">{{ typeLabel(r.type) }}</span>
              <h3 class="ul-release-title">{{ pick(r.title) }}</h3>
              <time class="ul-date" :datetime="r.date">{{ absolute(r.date) }}</time>
            </div>
            <p v-if="pick(r.desc)" class="ul-release-desc">{{ pick(r.desc) }}</p>
          </li>
        </ol>
      </section>

    </template>
  </div>
</template>

<!--
  主题变量放在非 scoped 块：scoped 块里的 :global(.dark) 在本项目的编译链路下不产出规则，
  暗色会静默失效（空格子会亮成一片白）。选择器都带 .ul- 前缀，不会污染页面其它部分。
-->
<style>
.ul-root {
  --ul-l0: #ebedf0;
  --ul-l1: #ffc6e0;
  --ul-l2: #ff95c9;
  --ul-l3: #e471ac;
  --ul-l4: #c3518e;


  --ul-cell: 11px;
  --ul-gap: 3px;
}

.dark .ul-root {
  --ul-l0: #27272c;
  --ul-l1: #85235b;
  --ul-l2: #b74783;
  --ul-l3: #e471ac;
  --ul-l4: #ffacd3;

}

.dark .ul-root .ul-cell {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}
</style>

<style scoped>
/*
 * 热力图色阶：以站点品牌粉 (#f472b6, OKLCH H≈350) 为色相，按 OKLab 明度均匀取步。
 * 亮色由浅到深，暗色翻转锚点由深到浅 —— 两个方向都是「越显眼 = 提交越多」。
 * 明度单调性已验证：亮 ΔL 0.061/0.089/0.096/0.099，暗 ΔL 0.155/0.136/0.133/0.136。
 */
.ul-hint {
  color: var(--vp-c-text-2);
  font-size: 14px;
  padding: 24px 0;
}

/* ---------------------------------------------------------------- 概览 */

.ul-overview {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 28px 40px;
  padding: 24px;
  margin: 8px 0 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.ul-total {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* 全页唯一的 hero 数字。大数字用比例字形，tabular-nums 会让它看着松散 */
.ul-total-value {
  font-size: 48px;
  font-weight: 600;
  line-height: 1.1;
  color: var(--vp-c-text-1);
}

.ul-total-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* ---------------------------------------------------------------- 热力图 */

.ul-heatmap {
  flex: 1 1 640px;
  min-width: 0; /* 没有它，flex 子项不肯收缩，横向滚动就失效 */
  margin: 0;
}

.ul-heatmap-note {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
}

/* 52 周铺开约 730px，窄屏放不下，让图自己横向滚动而不是把页面撑宽 */
.ul-heatmap-scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}

.ul-heatmap-body {
  display: flex;
  gap: 6px;
}

.ul-axis {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 高度必须和月份行一致，否则星期标签会和格子行错开一档 */
.ul-axis-spacer {
  height: 13px;
}

.ul-heatmap-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: max-content;
}

.ul-months {
  display: grid;
  grid-template-columns: repeat(52, var(--ul-cell));
  gap: var(--ul-gap);
  height: 13px;
  font-size: 10px;
  line-height: 13px;
  color: var(--vp-c-text-3);
}

.ul-month {
  grid-row: 1;
  white-space: nowrap;
}

.ul-weekdays {
  display: grid;
  grid-template-rows: repeat(7, var(--ul-cell));
  gap: var(--ul-gap);
  font-size: 10px;
  color: var(--vp-c-text-3);
}

.ul-weekday {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  line-height: 1;
}

.ul-cells {
  display: flex;
  gap: var(--ul-gap);
}

.ul-week {
  /* 不加 flex:none 会被父容器压缩，宽度就和固定网格的月份轴对不上、标签还会被裁掉 */
  flex: none;
  display: flex;
  flex-direction: column;
  gap: var(--ul-gap);
}

.ul-cell {
  flex: none;
  width: var(--ul-cell);
  height: var(--ul-cell);
  border-radius: 2px;
  background: var(--ul-l0);
  /* 浅色格子在浅背景上几乎看不见，描一圈极淡的边把网格结构留住 */
  box-shadow: inset 0 0 0 1px rgba(27, 31, 35, 0.05);
}

.ul-cell[data-level='1'] { background: var(--ul-l1); }
.ul-cell[data-level='2'] { background: var(--ul-l2); }
.ul-cell[data-level='3'] { background: var(--ul-l3); }
.ul-cell[data-level='4'] { background: var(--ul-l4); }

/* 悬停时描边而不是变色 —— 变色会让人误读成另一个档位 */
.ul-cells .ul-cell:hover {
  outline: 2px solid var(--vp-c-text-1);
  outline-offset: 1px;
}

.ul-legend {
  display: flex;
  align-items: center;
  gap: var(--ul-gap);
  margin-top: 10px;
  font-size: 10px;
  color: var(--vp-c-text-3);
}

.ul-legend span:first-child { margin-right: 2px; }
.ul-legend span:last-child { margin-left: 2px; }

/* ---------------------------------------------------------------- 列表 */

.ul-section {
  margin: 40px 0;
}

.ul-h {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
  padding: 0;
  border: 0;
  letter-spacing: -0.01em;
}

.ul-badge {
  flex: none;
  box-sizing: border-box;
  min-width: var(--ul-badge-w);
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 7px;
  border-radius: 5px;
  white-space: nowrap;
  /* 文字始终在，颜色与形态都只是辅助 —— 类型识别从不只靠颜色 */
  background: var(--mc-neutral-bg);
  color: var(--mc-neutral-fg);
  /* 透明边框占位，让描边款和填充款盒子等高 */
  border: 1px solid transparent;
}

/* 用户直接感知的三类：各占一个色相 */
.ul-badge[data-type='feat'] { background: var(--mc-feat-bg); color: var(--mc-feat-fg); }
.ul-badge[data-type='fix'] { background: var(--mc-fix-bg); color: var(--mc-fix-fg); }
.ul-badge[data-type='perf'] { background: var(--mc-perf-bg); color: var(--mc-perf-fg); }

/* 内部改动的三类：不再占用色相，靠填充/描边/虚线三种形态互相区分 */
.ul-badge[data-type='refactor'] {
  background: none;
  border-color: var(--mc-neutral-line);
}

.ul-badge[data-type='docs'] {
  background: none;
  border-style: dashed;
  border-color: var(--mc-neutral-line);
}

.ul-date {
  flex: none;
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

/* 更新日志 */

.ul-releases {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ul-release {
  padding: 14px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.ul-release:last-child {
  border-bottom: 1px solid var(--vp-c-divider);
}

.ul-release-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ul-release-title {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  padding: 0;
  border: 0;
  line-height: 1.5;
}

.ul-release-desc {
  margin: 6px 0 0;
  padding-left: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .ul-overview {
    padding: 20px 16px;
    gap: 20px;
  }

  .ul-total-value {
    font-size: 40px;
  }

  /* 窄屏放弃日期列，标题需要横向空间 */
  .ul-release-head {
    flex-wrap: wrap;
  }
}
</style>
