/**
 * 更新记录的数据格式与取数。纯数据，不引入 vue / vitepress 运行时：
 * 浏览器端（useUpdates）和构建脚本（config.mts）共用。
 *
 * 构建时 config.mts 会取一份快照：
 * - 写进更新记录页的 frontmatter（updatesSnapshot），让更新日志直接出现在静态 HTML 里，
 *   不执行 JS 的爬虫也能读到；浏览器打开后照常请求接口换成最新数据；
 * - 写进给 LLM 读的 /updates.md 与各语言首页的 /index.md。
 */
export const UPDATES_API = 'https://mcmai-updates.moev.cc/api/updates'

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
export const LANG_KEY: Record<string, string> = {
  'zh-CN': 'zh',
  'zh-TW': 'zh-TW',
  'ja-JP': 'ja',
  'en-US': 'en',
}

/** 类型标签四语。首页、更新记录页与构建脚本共用，改一处即可 */
export const TYPE_LABELS: Record<string, Record<string, string>> = {
  'zh-CN': { feat: '新功能', fix: '修复', perf: '性能优化', refactor: '重构', chore: '细节优化', docs: '文档' },
  'zh-TW': { feat: '新功能', fix: '修復', perf: '效能優化', refactor: '重構', chore: '細節優化', docs: '文件' },
  'ja-JP': { feat: '新機能', fix: '修正', perf: '最適化', refactor: 'リファクタ', chore: '細部改善', docs: 'ドキュメント' },
  'en-US': { feat: 'Feature', fix: 'Fix', perf: 'Performance', refactor: 'Refactor', chore: 'Improvement', docs: 'Docs' },
}

/** 取本地化文本；缺失时退回简中再退回英文，绝不显示空白 */
export function pickText(node: Localized | null | undefined, key: string): string {
  if (!node) return ''
  return node[key] || node.zh || node.en || ''
}

export function typeLabelOf(type: string, locale: string): string {
  const table = TYPE_LABELS[locale] ?? TYPE_LABELS['en-US']
  return table[type] ?? table.chore
}

/**
 * 页面快照只留该页语言的文案，四语全带会让页面数据大几倍。
 * 结构不变（仍是 Localized），组件里的 pick 照常可用；首页动态不在这页显示，stream 不带。
 */
export function localizePayload(payload: Payload, locale: string): Payload {
  const key = LANG_KEY[locale] ?? 'en'
  const one = (node: Localized | null) => (node ? { [key]: pickText(node, key) } : null)
  return {
    total: payload.total,
    heatmap: payload.heatmap,
    stream: [],
    changelog: payload.changelog.map((r) => ({ ...r, title: one(r.title)!, desc: one(r.desc) })),
  }
}
