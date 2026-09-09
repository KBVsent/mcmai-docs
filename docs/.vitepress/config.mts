import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { defineTeekConfig } from "vitepress-theme-teek/config";

const siteOrigin = 'https://mcmai.moev.cc'
const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const seoLocales = [
  {
    prefix: 'zh-TW/',
    hreflang: 'zh-TW',
    fallbackDescription: (title: string) =>
      `${title}：查看 McMai maimai DX 成績查詢工具的功能說明、指令用法與範例。`,
  },
  {
    prefix: 'en/',
    hreflang: 'en-US',
    fallbackDescription: (title: string) =>
      `${title}: Learn how to use this McMai feature, including commands, options, and examples.`,
  },
  {
    prefix: 'ja/',
    hreflang: 'ja-JP',
    fallbackDescription: (title: string) =>
      `${title}：McMai maimai DX スコア確認・成績管理 Bot の機能、コマンド、オプション、使用例を紹介します。`,
  },
  {
    prefix: '',
    hreflang: 'zh-CN',
    fallbackDescription: (title: string) =>
      `${title}：查看 McMai maimai DX 查分 Bot 的功能说明、指令用法与示例。`,
  },
] as const

function publicPath(relativePath: string) {
  const normalizedPath = relativePath.replace(/\\/g, '/')

  if (normalizedPath === 'index.md') return '/'
  if (normalizedPath.endsWith('/index.md')) {
    return `/${normalizedPath.slice(0, -'index.md'.length)}`
  }

  return `/${normalizedPath.replace(/\.md$/, '.html')}`
}

function contentPath(relativePath: string) {
  const locale = seoLocales.find(({ prefix }) => prefix && relativePath.startsWith(prefix))
  return locale ? relativePath.slice(locale.prefix.length) : relativePath
}

function localizedSourcePath(prefix: string, relativePath: string) {
  return `${prefix}${contentPath(relativePath)}`
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
  description: "maimai DX 一站式服务插件 - 数据查询、统计分析、图表生成",
  extends: teekConfig,
  sitemap: {
    hostname: siteOrigin,
  },
  transformPageData(pageData) {
    if (pageData.isNotFound || pageData.frontmatter.description) return

    const locale = seoLocales.find(({ prefix }) =>
      prefix ? pageData.relativePath.startsWith(prefix) : true,
    )!

    return {
      description: locale.fallbackDescription(pageData.title),
    }
  },
  transformHead({ pageData, title, description }) {
    if (pageData.isNotFound || !pageData.relativePath.endsWith('.md')) return

    const canonicalUrl = `${siteOrigin}${publicPath(pageData.relativePath)}`
    const head = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: 'McMai' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:image', content: `${siteOrigin}/logo.png` }],
    ]
    const alternates = []

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

    return head
  },
  head: [['link', { rel: 'icon', href: '/logo.png' }]],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: 'McMai 是支持国服、日服和国际服的 maimai DX 查分与 B50 Bot，可在 QQ、LINE 和 Discord 使用。',
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
      description: 'McMai is a maimai DX score tracker and analytics bot for CN, JP, and INTL players on QQ, LINE, and Discord.',
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
      description: 'McMai は、QQ・LINE・Discord で使える、中国版・日本版・国際版対応の maimai DX スコア確認・成績管理 Bot です。',
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
      description: 'McMai 是支援中國版、日本版及國際版的 maimai DX 成績查詢工具與 B50 Bot，可在 QQ、LINE 和 Discord 使用。',
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
