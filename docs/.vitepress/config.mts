import { defineConfig } from 'vitepress'
import { defineTeekConfig } from "vitepress-theme-teek/config";

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
  base: '/mcmai-docs/',
  extends: teekConfig,
  head: [['link', { rel: 'icon', href: '/logo.png' }]],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '指令参考', link: '/commands/basic' },
        ],
        sidebar: {
          '/guide/': [
            {
              text: '指南',
              items: [{ text: '快速开始', link: '/guide/getting-started' }],
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
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Getting Started', link: '/en/guide/getting-started' },
          { text: 'Commands', link: '/en/commands/basic' },
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Guide',
              items: [{ text: 'Getting Started', link: '/en/guide/getting-started' }],
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
      themeConfig: {
        nav: [
          { text: 'ホーム', link: '/ja/' },
          { text: 'はじめに', link: '/ja/guide/getting-started' },
          { text: 'コマンド一覧', link: '/ja/commands/basic' },
        ],
        sidebar: {
          '/ja/guide/': [
            {
              text: 'ガイド',
              items: [{ text: 'はじめに', link: '/ja/guide/getting-started' }],
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
      themeConfig: {
        nav: [
          { text: '首頁', link: '/zh-TW/' },
          { text: '快速開始', link: '/zh-TW/guide/getting-started' },
          { text: '指令參考', link: '/zh-TW/commands/basic' },
        ],
        sidebar: {
          '/zh-TW/guide/': [
            {
              text: '指南',
              items: [{ text: '快速開始', link: '/zh-TW/guide/getting-started' }],
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
      copyright: 'Copyright © 2026 <a href="https://github.com/KBVsent" target="_blank">KBVsent</a>',
    },
    search: {
      provider: 'local',
    },
  },
})
