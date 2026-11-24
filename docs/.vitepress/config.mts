import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type HeadConfig, type Plugin } from 'vitepress'
import { defineTeekConfig } from "vitepress-theme-teek/config";
import { docsIndexFile, publicPath, siteOrigin } from './site-url'
import { COPY, PLATFORMS } from './theme/showcase-copy'
import { LANG_KEY, UPDATES_API, localizePayload, pickText, typeLabelOf, type Payload } from './theme/updates-data'

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
let sitemapUrls: string[] = []
const pageTitles = new Map<string, string>()

const seoLocales = [
  {
    prefix: 'zh-TW/',
    indexLabels: ['McMai 文件索引', '教學', '指令參考', '其他頁面'],
    hreflang: 'zh-TW',
    updateLabels: { recent: '最近更新', changelog: '更新日誌', all: '查看全部更新紀錄' },
    resultLabel: (command: string) => `\`${command}\` 的結果圖包含：`,
    fallbackDescription: (title: string) =>
      `${title}：查看 McMai maimai DX 成績查詢工具的功能說明、指令用法與範例。`,
  },
  {
    prefix: 'en/',
    indexLabels: ['McMai documentation index', 'Guides', 'Command reference', 'Other pages'],
    hreflang: 'en-US',
    updateLabels: { recent: 'Recent updates', changelog: 'Changelog', all: 'See all updates' },
    resultLabel: (command: string) => `The \`${command}\` result image shows:`,
    fallbackDescription: (title: string) =>
      `${title}: Learn how to use this McMai feature, including commands, options, and examples.`,
  },
  {
    prefix: 'ja/',
    indexLabels: ['McMai ドキュメント一覧', 'ガイド', 'コマンドリファレンス', 'その他のページ'],
    hreflang: 'ja-JP',
    updateLabels: { recent: '最近の更新', changelog: '更新履歴', all: 'すべての更新履歴を見る' },
    resultLabel: (command: string) => `\`${command}\` の結果画像の内容：`,
    fallbackDescription: (title: string) =>
      `${title}：McMai の maimai DX サポート機能、コマンド、オプション、使用例を紹介します。`,
  },
  {
    prefix: '',
    indexLabels: ['McMai 文档索引', '教程', '指令参考', '其他页面'],
    hreflang: 'zh-CN',
    updateLabels: { recent: '最近更新', changelog: '更新日志', all: '查看全部更新记录' },
    resultLabel: (command: string) => `\`${command}\` 的结果图包含：`,
    fallbackDescription: (title: string) =>
      `${title}：查看 McMai 的 maimai DX 功能说明、指令用法与示例。`,
  },
] as const

function contentPath(relativePath: string) {
  const locale = seoLocales.find(({ prefix }) => prefix && relativePath.startsWith(prefix))
  return locale ? relativePath.slice(locale.prefix.length) : relativePath
}

function localizedSourcePath(prefix: string, relativePath: string) {
  return `${prefix}${contentPath(relativePath)}`
}

/**
 * 首页的功能演示是组件渲染的，源 Markdown 里没有这些内容。给 LLM 读的 /index.md 等
 * 在 frontmatter 后补一段由演示文案生成的功能介绍，和页面上的顺序一致（hero → 功能 → 社区）。
 */
function homeFeaturesMarkdown(locale: (typeof seoLocales)[number]) {
  const copy = COPY[locale.hreflang]
  const colon = locale.hreflang === 'en-US' ? ': ' : '：'
  const blocks = [`## ${copy.eyebrow}${colon}${copy.title}`, copy.sub]
  for (const scene of copy.scenes) {
    blocks.push(`### ${scene.title}`, scene.desc)
    for (const step of [scene, scene.then]) {
      if (!step) continue
      const shows = (step.callouts ?? []).map(({ text }) => `- ${text}`)
      blocks.push([locale.resultLabel(step.command), '', ...shows].join('\n'))
    }
    blocks.push(`[${copy.learnMore}](${siteOrigin}${scene.link}.md)`)
  }
  blocks.push(
    `### ${copy.regionTitle}`,
    copy.regionDesc,
    `- ${copy.regionsLabel}${colon}${copy.regions.join(' / ')}\n- ${copy.platformsLabel}${colon}${PLATFORMS.join(' / ')}`,
  )
  return blocks.join('\n\n')
}

async function homeMarkdown(markdown: string, locale: (typeof seoLocales)[number]) {
  const frontmatter = /^---\n[\s\S]*?\n---\n/.exec(markdown)?.[0] ?? ''
  const body = markdown.slice(frontmatter.length).trimStart()
  const blocks = [homeFeaturesMarkdown(locale)]
  // 页面上功能演示下面是「最近动态」，这里放最近几条更新日志（比逐条提交更有信息量）
  const updates = await loadUpdatesSnapshot()
  if (updates?.changelog.length) {
    const { recent, all } = locale.updateLabels
    blocks.push(
      `## ${recent}`,
      releasesMarkdown(updates, locale, 5),
      `[${all}](${siteOrigin}/${locale.prefix}updates.md)`,
    )
  }
  return `${frontmatter}\n${blocks.join('\n\n')}\n\n${body}`
}

/** 更新记录页的 md：组件占位换成完整的更新日志 */
async function updatesMarkdown(markdown: string, locale: (typeof seoLocales)[number]) {
  const updates = await loadUpdatesSnapshot()
  if (!updates?.changelog.length) return markdown
  const changelog = `## ${locale.updateLabels.changelog}\n\n${releasesMarkdown(updates, locale)}`
  return markdown.replace('<UpdateLog />', changelog)
}

/**
 * 给 LLM 读的 md（/index.md、/updates.md 等）：多数页面原样输出源文件，
 * 首页和更新记录页的内容由组件渲染，这里补成文字。构建（buildEnd）和开发服务器（llmMarkdownDev）共用。
 */
async function llmMarkdown(page: string, source: string) {
  const markdown = await readFile(source, 'utf8')
  const home = seoLocales.find(({ prefix }) => page === `${prefix}index.md`)
  if (home) return homeMarkdown(markdown, home)
  const updates = seoLocales.find(({ prefix }) => page === `${prefix}updates.md`)
  if (updates) return updatesMarkdown(markdown, updates)
  return markdown
}

/** 开发服务器默认把 .md 当静态文件原样返回；首页和更新记录页改成和线上一样的内容 */
function llmMarkdownDev(): Plugin {
  return {
    name: 'mcmai-llm-markdown',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 页面组件本身也是从同一地址加载的（/index.md、/index.md?import&t=…）：
        // 带查询参数或由 <script> / import() 发出的请求交还给 Vite，只接管直接打开或抓取 md 的请求
        const [rawPath, query] = (req.url ?? '').split('?')
        if (query !== undefined || req.headers['sec-fetch-dest'] === 'script') return next()
        const path = decodeURIComponent(rawPath).replace(/^\//, '')
        const generated = seoLocales.some(({ prefix }) => path === `${prefix}index.md` || path === `${prefix}updates.md`)
        if (!generated) return next()
        try {
          const body = await llmMarkdown(path, resolve(docsRoot, path))
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.setHeader('Cache-Control', 'no-cache')
          res.end(body)
        } catch (err) {
          next(err)
        }
      })
    },
  }
}

/**
 * 更新记录来自接口，页面上是浏览器里请求的。构建时取一份快照（整个构建只取一次），
 * 用于更新记录页的静态 HTML 和给 LLM 的 md。取不到不影响构建，页面退回纯客户端加载。
 */
let updatesSnapshot: Promise<Payload | null> | undefined
let updatesSnapshotAt = 0
/** 开发服务器常驻，快照隔一阵重新取；一次构建远用不了这么久 */
const UPDATES_SNAPSHOT_TTL = 5 * 60_000
function loadUpdatesSnapshot() {
  if (Date.now() - updatesSnapshotAt > UPDATES_SNAPSHOT_TTL) {
    updatesSnapshot = undefined
    updatesSnapshotAt = Date.now()
  }
  updatesSnapshot ??= fetch(UPDATES_API, { signal: AbortSignal.timeout(15_000) })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json() as Promise<Payload>
    })
    .catch((err) => {
      console.warn(`[mcmai] 更新记录快照获取失败，更新记录只在浏览器里加载：${err}`)
      return null
    })
  return updatesSnapshot
}

function releasesMarkdown(payload: Payload, locale: (typeof seoLocales)[number], limit = Infinity) {
  const key = LANG_KEY[locale.hreflang]
  return payload.changelog.slice(0, limit).map((r) => {
    const desc = pickText(r.desc, key)
    const head = `### ${pickText(r.title, key)}\n\n${r.date} · ${typeLabelOf(r.type, locale.hreflang)}`
    return desc ? `${head}\n\n${desc}` : head
  }).join('\n\n')
}

/** 首页的结构化数据：站点本身，加上 McMai 的功能列表（和演示里的场景一致） */
function homeJsonLd(locale: (typeof seoLocales)[number], url: string, description: string) {
  const copy = COPY[locale.hreflang]
  const colon = locale.hreflang === 'en-US' ? ': ' : '：'
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin}/#website`,
        url: `${siteOrigin}/`,
        name: 'McMai',
        inLanguage: seoLocales.map(({ hreflang }) => hreflang),
      },
      {
        '@type': 'SoftwareApplication',
        name: 'McMai',
        url,
        description,
        inLanguage: locale.hreflang,
        applicationCategory: 'UtilitiesApplication',
        image: `${siteOrigin}/logo.png`,
        featureList: [
          ...copy.scenes.map(({ title, desc }) => `${title}${colon}${desc}`),
          `${copy.regionTitle}${colon}${copy.regionDesc}`,
        ],
        isPartOf: { '@id': `${siteOrigin}/#website` },
      },
    ],
  }
  // 防止文案里出现 </script> 之类提前结束标签
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

// Teek 主题配置（文档模式：禁用博客风格首页，使用 VitePress 原生首页）
const teekConfig = defineTeekConfig({
  teekHome: false,
  toComment: {
    enabled: false,
  },
  footerInfo: {
    theme: {
      show: false,
    },
    copyright: {
      show: false,
    },
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "McMai",
  description: "McMai 为该隐 Bot 提供 maimai DX 查分、B50 分析与进度追踪等辅助功能",
  extends: teekConfig,
  sitemap: {
    hostname: siteOrigin,
    xmlns: {
      news: false,
      xhtml: false,
      image: false,
      video: false,
    },
    transformItems: (items) => {
      sitemapUrls = items.map(({ url }) => new URL(url, siteOrigin).href)
      return items.map(({ url, lastmod }) => ({ url, lastmod }))
    },
  },
  async buildEnd({ outDir, srcDir, pages }) {
    await Promise.all(pages.map(async (page) => {
      const destination = resolve(outDir, page)
      await mkdir(dirname(destination), { recursive: true })
      await writeFile(destination, await llmMarkdown(page, resolve(srcDir, page)))
    }))
    for (const { prefix, indexLabels } of seoLocales) {
      const [heading, guides, commands, other] = indexLabels
      const sections = new Map<string, string[]>([[guides, []], [commands, []], [other, []]])
      for (const page of [...pages].sort()) {
        const path = contentPath(page)
        if (page !== prefix + path) continue
        const section = path.startsWith('guide/') ? guides : path.startsWith('commands/') ? commands : other
        sections.get(section)!.push(`- [${pageTitles.get(page) ?? path}](${new URL(page, siteOrigin).href})`)
      }
      const blocks = [`# ${heading}`]
      for (const [label, links] of sections) {
        if (links.length) blocks.push(`## ${label}\n\n${links.join('\n')}`)
      }
      await writeFile(resolve(outDir, prefix, docsIndexFile), blocks.join('\n\n') + '\n')
    }
    await writeFile(resolve(outDir, 'sitemap.txt'), `${sitemapUrls.join('\n')}\n`, 'utf8')
  },
  async transformPageData(pageData) {
    if (pageData.isNotFound) return

    const locale = seoLocales.find(({ prefix }) =>
      prefix ? pageData.relativePath.startsWith(prefix) : true,
    )!

    // 更新记录页：带上构建时的快照，静态 HTML 里就有更新日志（useUpdates 读取，挂载后换成最新数据）
    if (pageData.relativePath === `${locale.prefix}updates.md`) {
      const updates = await loadUpdatesSnapshot()
      if (updates) pageData.frontmatter.updatesSnapshot = localizePayload(updates, locale.hreflang)
    }

    if (pageData.frontmatter.description) return

    return {
      description: locale.fallbackDescription(pageData.title),
    }
  },
  transformHead({ pageData, title, description }) {
    if (pageData.isNotFound || !pageData.relativePath.endsWith('.md')) return
    pageTitles.set(pageData.relativePath, pageData.title)

    const canonicalUrl = `${siteOrigin}${publicPath(pageData.relativePath)}`
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: 'McMai' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:image', content: `${siteOrigin}/logo.png` }],
    ]
    const alternates: HeadConfig[] = []

    for (const locale of seoLocales) {
      const sourcePath = localizedSourcePath(locale.prefix, pageData.relativePath)
      if (!existsSync(resolve(docsRoot, sourcePath))) continue

      alternates.push([
        'link',
        {
          rel: 'alternate',
          hreflang: locale.hreflang,
          href: `${siteOrigin}${publicPath(sourcePath)}`,
        },
      ])
    }

    if (alternates.length > 1) head.push(...alternates)

    if (alternates.length > 1 && contentPath(pageData.relativePath) === 'index.md') {
      head.push([
        'link',
        { rel: 'alternate', hreflang: 'x-default', href: `${siteOrigin}/` },
      ])
    }

    const home = seoLocales.find(({ prefix }) => pageData.relativePath === `${prefix}index.md`)
    if (home) head.push(['script', { type: 'application/ld+json' }, homeJsonLd(home, canonicalUrl, description)])

    return head
  },
  vite: { plugins: [llmMarkdownDev()] },
  head: [['link', { rel: 'icon', href: '/logo.png' }]],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: '通过 QQ、LINE 或 Discord 上的该隐 Bot，使用 McMai 提供的 maimai DX 查分、B50 与进度追踪功能，支持国服、日本服和国际服。',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '查分指南', link: '/guide/score-tracking' },
          { text: '指令参考', link: '/commands/basic' },
          { text: '更新记录', link: '/updates' },
        ],
        sidebar: {
          '/guide/': [
            {
              text: '指南',
              items: [
                { text: '快速开始', link: '/guide/getting-started' },
                { text: 'maimai 查分指南', link: '/guide/score-tracking' },
                { text: '国服 NET 更新教程', link: '/guide/cn-net-update' },
                { text: '书签更新教程', link: '/guide/bookmarklet-update' },
                { text: '自定义数据源', link: '/guide/custom-data-source' },
                { text: 'QQ Bot 使用小提示', link: '/guide/qqbot-tips' },
                { text: '用户名与好友系统', link: '/guide/identity-and-friends' },
              ],
            },
          ],
          '/commands/': [
            {
              text: '指令参考',
              items: [
                { text: '基础功能', link: '/commands/basic' },
                { text: '账号与服务器', link: '/commands/account' },
                { text: '成绩查询', link: '/commands/score' },
                { text: 'Best 50 功能', link: '/commands/b50' },
                { text: '排行榜', link: '/commands/leaderboard' },
                { text: '查歌搜索', link: '/commands/search' },
                { text: '谱面分析与练习', link: '/commands/analysis' },
                { text: '定数与表格', link: '/commands/tables' },
                { text: '进度查询', link: '/commands/progress' },
                { text: '个人设置', link: '/commands/settings' },
              ],
            },
          ],
        },
      },
    },

    en: {
      label: 'English',
      lang: 'en-US',
      description: 'Use Cain on QQ, LINE, or Discord to access maimai DX score tracking, B50 analysis, and progress features powered by McMai for China, Japan, and International Server players.',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Getting Started', link: '/en/guide/getting-started' },
          { text: 'Score Tracking', link: '/en/guide/score-tracking' },
          { text: 'Commands', link: '/en/commands/basic' },
          { text: 'Updates', link: '/en/updates' },
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Getting Started', link: '/en/guide/getting-started' },
                { text: 'Score Tracking Guide', link: '/en/guide/score-tracking' },
                { text: 'China Server NET Update Guide', link: '/en/guide/cn-net-update' },
                { text: 'Bookmarklet Update Guide', link: '/en/guide/bookmarklet-update' },
                { text: 'Custom Data Source', link: '/en/guide/custom-data-source' },
                { text: 'Username & Friend System', link: '/en/guide/identity-and-friends' },
              ],
            },
          ],
          '/en/commands/': [
            {
              text: 'Command Reference',
              items: [
                { text: 'Basic', link: '/en/commands/basic' },
                { text: 'Account & Server', link: '/en/commands/account' },
                { text: 'Score Query', link: '/en/commands/score' },
                { text: 'Best 50', link: '/en/commands/b50' },
                { text: 'Leaderboard', link: '/en/commands/leaderboard' },
                { text: 'Song Search', link: '/en/commands/search' },
                { text: 'Chart Analysis & Practice', link: '/en/commands/analysis' },
                { text: 'Level Tables', link: '/en/commands/tables' },
                { text: 'Progress', link: '/en/commands/progress' },
                { text: 'Settings', link: '/en/commands/settings' },
              ],
            },
          ],
        },
      },
    },

    ja: {
      label: '日本語',
      lang: 'ja-JP',
      description: 'QQ・LINE・Discord の Bot「Cain」を通じて、McMai が提供する maimai DX のスコア確認・B50 分析・進捗管理を利用できます。中国版・日本版・インターナショナル版に対応しています。',
      themeConfig: {
        nav: [
          { text: 'ホーム', link: '/ja/' },
          { text: 'はじめに', link: '/ja/guide/getting-started' },
          { text: 'スコア確認', link: '/ja/guide/score-tracking' },
          { text: 'コマンド一覧', link: '/ja/commands/basic' },
          { text: '更新履歴', link: '/ja/updates' },
        ],
        sidebar: {
          '/ja/guide/': [
            {
              text: 'ガイド',
              items: [
                { text: 'はじめに', link: '/ja/guide/getting-started' },
                { text: 'スコア確認・成績管理ガイド', link: '/ja/guide/score-tracking' },
                { text: '中国版 NET 更新ガイド', link: '/ja/guide/cn-net-update' },
                { text: 'ブックマークレット更新ガイド', link: '/ja/guide/bookmarklet-update' },
                { text: 'カスタムデータソース', link: '/ja/guide/custom-data-source' },
                { text: 'ユーザー名とフレンドシステム', link: '/ja/guide/identity-and-friends' },
              ],
            },
          ],
          '/ja/commands/': [
            {
              text: 'コマンド一覧',
              items: [
                { text: '基本機能', link: '/ja/commands/basic' },
                { text: 'アカウントとサーバー', link: '/ja/commands/account' },
                { text: 'スコア照会', link: '/ja/commands/score' },
                { text: 'Best 50', link: '/ja/commands/b50' },
                { text: 'ランキング', link: '/ja/commands/leaderboard' },
                { text: '楽曲検索', link: '/ja/commands/search' },
                { text: '譜面分析と練習', link: '/ja/commands/analysis' },
                { text: '譜面定数表', link: '/ja/commands/tables' },
                { text: '進捗照会', link: '/ja/commands/progress' },
                { text: '個人設定', link: '/ja/commands/settings' },
              ],
            },
          ],
        },
      },
    },

    'zh-TW': {
      label: '繁體中文',
      lang: 'zh-TW',
      description: '透過 QQ、LINE 或 Discord 上的該隱 Bot，使用 McMai 提供的 maimai DX 成績查詢、B50 與進度追蹤功能，支援大陸區、日本區及國際區。',
      themeConfig: {
        nav: [
          { text: '首頁', link: '/zh-TW/' },
          { text: '快速開始', link: '/zh-TW/guide/getting-started' },
          { text: '查分指南', link: '/zh-TW/guide/score-tracking' },
          { text: '指令參考', link: '/zh-TW/commands/basic' },
          { text: '更新紀錄', link: '/zh-TW/updates' },
        ],
        sidebar: {
          '/zh-TW/guide/': [
            {
              text: '指南',
              items: [
                { text: '快速開始', link: '/zh-TW/guide/getting-started' },
                { text: 'maimai 查分指南', link: '/zh-TW/guide/score-tracking' },
                { text: '大陸區 NET 更新教學', link: '/zh-TW/guide/cn-net-update' },
                { text: '書籤更新教學', link: '/zh-TW/guide/bookmarklet-update' },
                { text: '自訂資料來源', link: '/zh-TW/guide/custom-data-source' },
                { text: '使用者名稱與好友系統', link: '/zh-TW/guide/identity-and-friends' },
              ],
            },
          ],
          '/zh-TW/commands/': [
            {
              text: '指令參考',
              items: [
                { text: '基礎功能', link: '/zh-TW/commands/basic' },
                { text: '帳號與伺服器', link: '/zh-TW/commands/account' },
                { text: '成績查詢', link: '/zh-TW/commands/score' },
                { text: 'Best 50 功能', link: '/zh-TW/commands/b50' },
                { text: '排行榜', link: '/zh-TW/commands/leaderboard' },
                { text: '查歌搜尋', link: '/zh-TW/commands/search' },
                { text: '譜面分析與練習', link: '/zh-TW/commands/analysis' },
                { text: '定數與表格', link: '/zh-TW/commands/tables' },
                { text: '進度查詢', link: '/zh-TW/commands/progress' },
                { text: '個人設定', link: '/zh-TW/commands/settings' },
              ],
            },
          ],
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'McMai',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/KBVsent' },
    ],
    footer: {
      copyright: 'Copyright © 2026 <a href="https://github.com/KBVsent" target="_blank">KBVsent</a> · McMai is an unofficial tool · <a href="/en/privacy">Privacy Policy</a> · <a href="/en/terms">Terms of Service</a>',
    },
    search: {
      provider: 'local',
    },
  },
})
