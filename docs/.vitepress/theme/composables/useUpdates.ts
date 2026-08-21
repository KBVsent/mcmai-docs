import { computed, ref, type Ref } from 'vue'
import { useData } from 'vitepress'

const API = 'https://mcmai-updates.moev.cc/api/updates'

export type Localized = Record<string, string>

export interface StreamEntry {
  seq: number
  date: string
  type: string
  title: Localized
}

export interface ReleaseEntry {
  id: string
  date: string
  type: string
  title: Localized
  desc: Localized | null
  commits: number[]
}

export interface Payload {
  total: number | null
  heatmap: { start: string; weeks: number[][] } | null
  stream: StreamEntry[]
  changelog: ReleaseEntry[]
}

/** 站点 locale → API 里的语言键 */
const LANG_KEY: Record<string, string> = {
  'zh-CN': 'zh',
  'zh-TW': 'zh-TW',
  'ja-JP': 'ja',
  'en-US': 'en',
}

/** 类型标签四语。首页与更新记录页共用，改一处即可 */
export const TYPE_LABELS: Record<string, Record<string, string>> = {
  'zh-CN': { feat: '新功能', fix: '修复', perf: '性能优化', refactor: '重构', chore: '细节优化', docs: '文档' },
  'zh-TW': { feat: '新功能', fix: '修復', perf: '效能優化', refactor: '重構', chore: '細節優化', docs: '文件' },
  'ja-JP': { feat: '新機能', fix: '修正', perf: '最適化', refactor: 'リファクタ', chore: '細部改善', docs: 'ドキュメント' },
  'en-US': { feat: 'Feature', fix: 'Fix', perf: 'Performance', refactor: 'Refactor', chore: 'Improvement', docs: 'Docs' },
}

export const SUPPORTED = Object.keys(LANG_KEY)

/**
 * 模块级缓存：首页和更新记录页都要这份数据，同一次访问里切换页面不该再请求一次。
 * 失败时清掉，好让下一个挂载的组件能重试。
 */
let inflight: Promise<Payload> | null = null

function load(): Promise<Payload> {
  if (!inflight) {
    inflight = fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json() as Promise<Payload>
      })
      .catch((err) => {
        inflight = null
        throw err
      })
  }
  return inflight
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

export function useUpdates() {
  const { lang } = useData()
  const locale = computed(() => (SUPPORTED.includes(lang.value) ? lang.value : 'en-US'))
  const key = computed(() => LANG_KEY[locale.value])

  const data = ref<Payload | null>(null) as Ref<Payload | null>
  const status = ref<'loading' | 'ready' | 'failed'>('loading')

  async function fetchUpdates(): Promise<Payload | null> {
    try {
      data.value = await load()
      status.value = 'ready'
      return data.value
    } catch {
      status.value = 'failed'
      return null
    }
  }

  /** 取本地化文本；缺失时退回简中再退回英文，绝不显示空白 */
  function pick(node: Localized | null | undefined): string {
    if (!node) return ''
    return node[key.value] || node.zh || node.en || ''
  }

  const rtf = computed(() => new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }))
  const dateFmt = computed(() => new Intl.DateTimeFormat(locale.value, { dateStyle: 'long', timeZone: 'UTC' }))

  function relative(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000
    for (const [unit, secs] of UNITS) {
      if (diff >= secs) return rtf.value.format(-Math.floor(diff / secs), unit)
    }
    return rtf.value.format(0, 'minute')
  }

  function absolute(iso: string): string {
    return dateFmt.value.format(new Date(iso))
  }

  /** 类型标签始终以文字出现，颜色只是辅助 —— 识别从不只靠颜色 */
  function typeLabel(type: string): string {
    const table = TYPE_LABELS[locale.value]
    return table[type] ?? table.chore
  }

  return { locale, data, status, fetchUpdates, pick, relative, absolute, typeLabel, dateFmt }
}
