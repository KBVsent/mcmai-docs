import { computed, ref, type Ref } from 'vue'
import { useData } from 'vitepress'
import { LANG_KEY, UPDATES_API, pickText, typeLabelOf, type Localized, type Payload } from '../updates-data'

export type { Localized, Payload, ReleaseEntry, StreamEntry } from '../updates-data'
export { TYPE_LABELS } from '../updates-data'

export const SUPPORTED = Object.keys(LANG_KEY)

/**
 * 模块级缓存：首页和更新记录页都要这份数据，同一次访问里切换页面不该再请求一次。
 * 失败时清掉，好让下一个挂载的组件能重试。
 */
let inflight: Promise<Payload> | null = null

function load(): Promise<Payload> {
  if (!inflight) {
    inflight = fetch(UPDATES_API)
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
  const { lang, frontmatter } = useData()
  const locale = computed(() => (SUPPORTED.includes(lang.value) ? lang.value : 'en-US'))
  const key = computed(() => LANG_KEY[locale.value])

  // 构建时写进页面的快照（目前只有更新记录页有）：服务端渲染直接出内容，挂载后再换成接口的最新数据
  const snapshot = (frontmatter.value.updatesSnapshot as Payload | undefined) ?? null
  const data = ref<Payload | null>(snapshot) as Ref<Payload | null>
  const status = ref<'loading' | 'ready' | 'failed'>(snapshot ? 'ready' : 'loading')

  async function fetchUpdates(): Promise<Payload | null> {
    try {
      const fresh = await load()
      // 接口的数字类字段可能临时为 null（上游 stats 还在计算）：此时保留快照里的值，不让图凭空消失
      const prev = data.value
      data.value = {
        ...fresh,
        total: fresh.total ?? prev?.total ?? null,
        heatmap: fresh.heatmap ?? prev?.heatmap ?? null,
      }
      status.value = 'ready'
      return data.value
    } catch {
      // 有快照就继续显示快照，不换成报错
      status.value = data.value ? 'ready' : 'failed'
      return data.value
    }
  }

  /** 取本地化文本；缺失时退回简中再退回英文，绝不显示空白 */
  function pick(node: Localized | null | undefined): string {
    return pickText(node, key.value)
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
    return typeLabelOf(type, locale.value)
  }

  return { locale, data, status, fetchUpdates, pick, relative, absolute, typeLabel, dateFmt }
}
