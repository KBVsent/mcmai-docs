/**
 * 首页功能演示（HomeChatShowcase.vue）的文案与演示图数据。
 *
 * 单独成文件，是为了让构建脚本也能读：config.mts 的 buildEnd 用它给各语言首页的
 * 原始 Markdown（/index.md 等，供 LLM 读取）补上功能介绍，transformHead 用它生成首页的结构化数据。
 * 这里只放纯数据，不要引入 vue / vitepress 的运行时。
 */
import manifest from './showcase-manifest.json'

export type Callout = {
  /** 标注指向的位置：距图片框顶部的像素（按 HomeChatShowcase.vue 的 IMAGE_WIDTH，即 340px 宽计算） */
  y: number
  text: string
}

/** 一问一答：用户发的指令与 Bot 回复的图 */
export type Step = {
  command: string
  image: { src: string; full: string; alt: string; width: number; height: number }
  callouts?: Callout[]
}

export type Scene = Step & {
  key: string
  title: string
  desc: string
  link: string
  /** 同一场景里接着演示的第二轮（如 B50 之后和好友 PK） */
  then?: Step
}

export type Copy = {
  eyebrow: string
  title: string
  sub: string
  botName: string
  online: string
  /** 聊天窗标题栏的小标签，说明画面是演示 */
  demo: string
  inputPlaceholder: string
  viewFull: string
  learnMore: string
  /** 首屏预告态的提示语 */
  cue: string
  regionsLabel: string
  regions: string[]
  platformsLabel: string
  /** 预告态底部「多区服」卡片，入场后变成区服 / 平台标签 */
  regionTitle: string
  regionDesc: string
  scenes: Scene[]
}

/**
 * 演示图由插件仓库的 scripts/render_doc_showcase.py 用占位数据生成（--docs 直接拷到 public/images/showcase/）。
 * 每张图有全图 <key>.webp、聊天框用的截取图 <key>-showcase.webp 与预模糊海报 <key>-poster.webp，
 * 尺寸读脚本写的 showcase-manifest.json（--docs 拷到本目录），重新出图后这里不用改。
 *
 * 重新出图时文件名不变，地址一律带上 manifest 里的内容摘要（?v=）：否则浏览器 / CDN 缓存的旧图
 * 会配上新的宽高，比如截取图改长后，框按新高度排版、图还是旧的短图，下半截一片空白。
 */
export type ShotKey = 'b50' | 'pk50' | 'search' | 'grank' | 'plate' | 'scorelist'
type ShotFile = { file: string; width: number; height: number; hash: string }
export const SHOTS = manifest as unknown as Record<ShotKey, { full: ShotFile; showcase: ShotFile; poster: ShotFile }>

export const shotUrl = (f: ShotFile) => `/images/showcase/${f.file}?v=${f.hash}`

function shot(key: ShotKey, alt: string): NonNullable<Step['image']> {
  const { full, showcase } = SHOTS[key]
  return {
    src: shotUrl(showcase),
    full: shotUrl(full),
    alt,
    width: showcase.width,
    height: showcase.height,
  }
}

/**
 * 各图标注的纵向位置（340px 宽下，距图片顶部），各语言共用，文案见 COPY 里同序的 callouts。
 * 图是脚本出的，重新出图后版面有变动要跟着重量。落在图片框外的标注由导览（planTour）
 * 带着图片滚进来，所以按 y 升序排。
 */
const Y: Record<ShotKey, number[]> = {
  // B50 / PK50 也是整张图，导览滚到底部的 ANALYSIS 区
  b50: [30, 209, 330, 480, 600, 632, 664], // 顶板 / Rating 行 / B35 / B15 / 单曲 Rating 柱状图 / 评级等统计 / 能力雷达
  pk50: [61, 151, 349, 492, 540], // 总分与胜负 / B35 对比卡片 / B15 / 单曲 Rating 差 / 胜负曲数与平均达成率
  // 查歌是整张长图，靠导览逐块介绍：曲目信息 / 定数表 / 分数线 / 谱面结构 / 关联谱面 / 定数变化 / 别名 / 收藏品
  search: [100, 250, 410, 530, 628, 751, 852, 928],
  grank: [90, 212, 445], // 自己那一行 / 群友各行 / 全群统计
  plate: [47, 142, 227], // 各难度进度 / 等级分组 / 封面上的评级
  scorelist: [50, 190], // 成绩分布 / 卡片区
}

function marks(key: ShotKey, texts: string[]): Callout[] {
  return texts.map((text, i) => ({ y: Y[key][i], text }))
}

export const PLATFORMS = ['QQ', 'Discord', 'LINE']

/**
 * 本模块替代了原先首页的 6 张功能卡片。定位是「私人助理 + 和好友互动」，主推的 5 个场景：
 * B50 与好友 PK（同一场景连播两轮）/ 查歌 / 群排行 / 牌子进度 / 分数列表；
 * 「多区服」放在下方的区服、平台标签里。
 */
export const COPY: Record<string, Copy> = {
  'zh-CN': {
    eyebrow: '核心功能',
    title: '下机就查，不服就 PK',
    sub: '该隐是你随叫随到的 maimai 助理：私聊里复盘每一次推分，群里拉上好友比排名，用分数说话。',
    botName: '该隐',
    online: '在线',
    demo: '演示',
    inputPlaceholder: '发送消息…',
    viewFull: '查看完整图',
    learnMore: '了解用法',
    cue: '向下滑动，观看演示',
    regionsLabel: '区服',
    regions: ['国服', '日本服', '国际服'],
    platformsLabel: '平台',
    regionTitle: '多区服支持',
    regionDesc: '同时支持国服（CN）、日本服（JP）、国际服（INTL）三区数据查询与分析。',
    scenes: [
      {
        key: 'b50', title: 'B50 与好友 PK', desc: '晒出你的 B50，再约好友 PK 一决高下。',
        command: '/b50', link: '/commands/b50',
        image: shot('b50', 'McMai 生成的 B50 成绩图'),
        callouts: marks('b50', [
          '顶板：名牌、昵称与 Rating',
          'Rating 构成与近 30 天走势',
          '逐首显示达成率、单曲 Rating 与 DX 分',
          'B15：新版本曲目单独计入',
          '每首的单曲 Rating 柱状图',
          '评级、连击、同步、DX 星统计',
          '能力雷达：各类谱面的实力倾向',
        ]),
        then: {
          command: '/pk50 #mochi', image: shot('pk50', 'McMai 生成的 PK50 对战图'),
          callouts: marks('pk50', [
            '双方 Rating 对比，胜负与分差',
            '同一首歌，双方成绩并排对比',
            '新版本 B15 同样逐首对比',
            '逐首 Rating 差：蓝领先，红落后',
            '胜负曲数与平均达成率对比',
          ]),
        },
      },
      {
        key: 'search', title: '查歌', desc: '歌名、别名、ID 都能查，还能按定数、BPM 找歌。',
        command: '/查歌 潘多拉', link: '/commands/search',
        image: shot('search', 'McMai 生成的查歌结果图'),
        callouts: marks('search', [
          '曲目信息：曲师、BPM、收录版本',
          '各难度的结构定数与物量',
          '谱师与各评级可得的单曲 Rating',
          '谱面结构：各维度雷达与特征标签',
          '结构相近的关联谱面',
          '历代版本的定数变化',
          '这首歌的别名，查歌时都能用',
          '打这首歌可获得的收藏品',
        ]),
      },
      {
        key: 'rank', title: '群排行', desc: '这首歌在群里谁打得最好？单曲排名和群 Rating 榜一目了然。',
        command: '/群排行 潘多拉', link: '/commands/leaderboard',
        image: shot('grank', 'McMai 生成的群排行图'),
        callouts: marks('grank', ['你的名次单独高亮', '群友的达成率、DX 分与评级', '全群成绩分布与平均达成率']),
      },
      {
        key: 'plate', title: '牌子进度', desc: '离下一块牌子还差哪些歌，一张图列清楚。',
        command: '/进度 丸将', link: '/commands/progress',
        image: shot('plate', 'McMai 生成的丸将完成表'),
        callouts: marks('plate', ['四个难度的完成进度', '按等级列出牌子要求的全部曲目', '每首的评级标在封面上']),
      },
      {
        key: 'scores', title: '分数列表', desc: '按等级、评级、FC、版本筛选全部成绩，还能按 Rating 排序。',
        command: '/分数列表 14 fc', link: '/commands/progress',
        image: shot('scorelist', 'McMai 生成的分数列表图'),
        callouts: marks('scorelist', ['评级 / 连击 / 同步 / DX 星分布', '符合条件的成绩，分页列出']),
      },
    ],
  },
  'zh-TW': {
    eyebrow: '核心功能',
    title: '下機就查，不服就 PK',
    sub: '該隱是你隨叫隨到的 maimai 助理：私訊裡回顧每一次推分，群組裡拉上好友比排名，用分數說話。',
    botName: '該隱',
    online: '線上',
    demo: '示意',
    inputPlaceholder: '傳送訊息…',
    viewFull: '查看完整圖',
    learnMore: '了解用法',
    cue: '向下滑動，觀看演示',
    regionsLabel: '區服',
    regions: ['大陸區', '日本區', '國際區'],
    platformsLabel: '平台',
    regionTitle: '多區服支援',
    regionDesc: '同時支援大陸區（CN）、日本區（JP）、國際區（INTL）三區資料查詢與分析。',
    scenes: [
      {
        key: 'b50', title: 'B50 與好友 PK', desc: '曬出你的 B50，再約好友 PK 一決高下。',
        command: '/b50', link: '/zh-TW/commands/b50',
        image: shot('b50', 'McMai 生成的 B50 成績圖'),
        callouts: marks('b50', [
          '頂板：名牌、暱稱與 Rating',
          'Rating 構成與近 30 天走勢',
          '逐首顯示達成率、單曲 Rating 與 DX 分數',
          'B15：新版本曲目單獨計入',
          '每首的單曲 Rating 柱狀圖',
          '評級、連擊、同步、DX 星統計',
          '能力雷達：各類譜面的實力傾向',
        ]),
        then: {
          command: '/pk50 #mochi', image: shot('pk50', 'McMai 生成的 PK50 對戰圖'),
          callouts: marks('pk50', [
            '雙方 Rating 對比，勝負與分差',
            '同一首歌，雙方成績並排對比',
            '新版本 B15 同樣逐首對比',
            '逐首 Rating 差：藍領先，紅落後',
            '勝負曲數與平均達成率對比',
          ]),
        },
      },
      {
        key: 'search', title: '查歌', desc: '歌名、別名、ID 都能查，還能依定數、BPM 找歌。',
        command: '/查歌 潘朵拉悖論', link: '/zh-TW/commands/search',
        image: shot('search', 'McMai 生成的查歌結果圖'),
        callouts: marks('search', [
          '曲目資訊：曲師、BPM、收錄版本',
          '各難度的結構定數與物量',
          '譜師與各評級可得的單曲 Rating',
          '譜面結構：各維度雷達與特徵標籤',
          '結構相近的關聯譜面',
          '歷代版本的定數變化',
          '這首歌的別名，查歌時都能用',
          '遊玩這首歌可獲得的收藏品',
        ]),
      },
      {
        key: 'rank', title: '群組排行', desc: '這首歌群組裡誰最強？單曲排名和群組 Rating 榜一目瞭然。',
        command: '/群排行 潘朵拉悖論', link: '/zh-TW/commands/leaderboard',
        image: shot('grank', 'McMai 生成的群組排行圖'),
        callouts: marks('grank', ['你的名次單獨標示', '成員的達成率、DX 分數與評級', '全群組成績分布與平均達成率']),
      },
      {
        key: 'plate', title: '牌子進度', desc: '離下一塊牌子還差哪些歌，一張圖列清楚。',
        command: '/進度 丸將', link: '/zh-TW/commands/progress',
        image: shot('plate', 'McMai 生成的丸將完成表'),
        callouts: marks('plate', ['四個難度的完成進度', '依等級列出牌子要求的全部曲目', '每首的評級標在封面上']),
      },
      {
        key: 'scores', title: '分數列表', desc: '依等級、評級、FC、版本篩選全部成績，還能依 Rating 排序。',
        command: '/分數列表 14 fc', link: '/zh-TW/commands/progress',
        image: shot('scorelist', 'McMai 生成的分數列表圖'),
        callouts: marks('scorelist', ['評級 / 連擊 / 同步 / DX 星分布', '符合條件的成績，分頁列出']),
      },
    ],
  },
  'en-US': {
    eyebrow: 'Features',
    title: 'Check scores. Challenge friends.',
    sub: 'Cain is your on-call maimai assistant: review every score push in private chat, and take on your friends in group rankings.',
    botName: 'Cain',
    online: 'Online',
    demo: 'Demo',
    inputPlaceholder: 'Message…',
    viewFull: 'View full image',
    learnMore: 'Learn how',
    cue: 'Scroll to watch the demo',
    regionsLabel: 'Regions',
    regions: ['China', 'Japan', 'International'],
    platformsLabel: 'Platforms',
    regionTitle: 'Multi-Region Support',
    regionDesc: 'Scores and analysis for the China, Japan, and International Servers.',
    scenes: [
      {
        key: 'b50', title: 'B50 & Friend PK', desc: 'Show off your B50, then PK your friends.',
        command: '/b50', link: '/en/commands/b50',
        image: shot('b50', 'B50 result image generated by McMai'),
        callouts: marks('b50', [
          'Profile card: name plate, nickname & Rating',
          'Rating breakdown & 30-day trend',
          'Achievement, song Rating & DX score for every chart',
          'B15: top 15 new-version songs',
          'Song Rating of every chart',
          'Rank, combo, sync, DX stats',
          'Skill radar by chart type',
        ]),
        then: {
          command: '/pk50 #mochi', image: shot('pk50', 'PK50 battle image generated by McMai'),
          callouts: marks('pk50', [
            'Total Rating side by side: winner and gap',
            'Both players’ scores on each chart',
            'New-version B15, compared song by song',
            'Per-song gap: blue leads',
            'Wins & average achievement',
          ]),
        },
      },
      {
        key: 'search', title: 'Song Search', desc: 'Search by title, alias, or ID, or by level constant and BPM.',
        command: '/search PP', link: '/en/commands/search',
        image: shot('search', 'Song search result generated by McMai'),
        callouts: marks('search', [
          'Song info: artist, BPM, version',
          'Structure constant & notes per difficulty',
          'Charter and song Rating at each rank',
          'Chart structure: radar and feature tags',
          'Charts with a similar structure',
          'Level constant across versions',
          'Aliases you can search by',
          'Collectibles this song unlocks',
        ]),
      },
      {
        key: 'rank', title: 'Group Ranking', desc: 'Who plays this song best in your group? Find out here.',
        command: '/grank PP', link: '/en/commands/leaderboard',
        image: shot('grank', 'Group ranking image generated by McMai'),
        callouts: marks('grank', ['Your own rank is highlighted', 'Each member’s achievement, DX score & rank', 'Group-wide rank breakdown and average']),
      },
      {
        key: 'plate', title: 'Plate Progress', desc: 'See which songs stand between you and your next plate.',
        command: '/progress circle sss', link: '/en/commands/progress',
        image: shot('plate', 'Plate progress image generated by McMai'),
        callouts: marks('plate', ['Progress for each difficulty', 'Every song the plate requires, grouped by level', 'Each song’s rank shown on its jacket']),
      },
      {
        key: 'scores', title: 'Score List', desc: 'Filter all your scores by level, rank, FC, or version.',
        command: '/scorelist 14 fc', link: '/en/commands/progress',
        image: shot('scorelist', 'Score list image generated by McMai'),
        callouts: marks('scorelist', ['Rank / combo / sync / DX star breakdown', 'Every matching score, page by page']),
      },
    ],
  },
  'ja-JP': {
    eyebrow: '主な機能',
    title: 'スコアはすぐ確認、決着は PK で',
    sub: 'Cain は、いつでも呼べる maimai アシスタント。個別チャットではスコアの振り返り、グループではフレンドとランキングで勝負。',
    botName: 'Cain',
    online: 'オンライン',
    demo: 'デモ',
    inputPlaceholder: 'メッセージを入力…',
    viewFull: '全体を見る',
    learnMore: '使い方を見る',
    cue: 'スクロールしてデモを再生',
    regionsLabel: 'サーバー',
    regions: ['中国版', '日本版', 'インターナショナル版'],
    platformsLabel: 'プラットフォーム',
    regionTitle: 'マルチサーバー対応',
    regionDesc: '中国版・日本版・インターナショナル版のスコア確認とプレイデータ分析に対応。',
    scenes: [
      {
        key: 'b50', title: 'B50 とフレンド PK', desc: 'B50 を見せたら、フレンドと PK で勝負。',
        command: '/b50', link: '/ja/commands/b50',
        image: shot('b50', 'McMai が生成した B50 成績画像'),
        callouts: marks('b50', [
          'プロフィール：ネームプレート・ニックネーム・Rating',
          'Rating の内訳と直近 30 日の推移',
          '曲ごとの達成率・単曲 Rating・DX スコア',
          'B15：新曲枠の上位 15 曲',
          '曲ごとの単曲 Rating',
          '評価・コンボ・シンク・DX',
          '譜面タイプ別の実力レーダー',
        ]),
        then: {
          command: '/pk50 #mochi', image: shot('pk50', 'McMai が生成した PK50 対戦画像'),
          callouts: marks('pk50', [
            '合計 Rating の比較と勝敗',
            '同じ譜面のスコアを並べて比較',
            '新バージョン B15 も 1 曲ずつ比較',
            '曲ごとの Rating 差（青がリード）',
            '勝ち曲数と平均達成率の比較',
          ]),
        },
      },
      {
        key: 'search', title: '楽曲検索', desc: '曲名・別名・ID で検索、定数や BPM での絞り込みも。',
        command: '/曲検索 パンドラパラドックス', link: '/ja/commands/search',
        image: shot('search', 'McMai が生成した楽曲検索の結果画像'),
        callouts: marks('search', [
          '楽曲情報：アーティスト・BPM・収録バージョン',
          '難易度ごとの構造定数とノーツ数',
          '譜面作者と評価ごとの単曲 Rating',
          '譜面構造：レーダーと特徴タグ',
          '構造が近い関連譜面',
          'バージョンごとの定数推移',
          '検索に使えるエイリアス',
          'この曲で獲得できるコレクション',
        ]),
      },
      {
        key: 'rank', title: 'グループランキング', desc: 'この曲、グループで一番うまいのは誰？',
        command: '/グルラン パンドラパラドックス', link: '/ja/commands/leaderboard',
        image: shot('grank', 'McMai が生成したグループランキング画像'),
        callouts: marks('grank', ['自分の順位をハイライト表示', 'メンバーごとの達成率・DX スコア・評価', 'グループ全体の評価分布と平均達成率']),
      },
      {
        key: 'plate', title: 'プレート進捗', desc: '次のプレートまで残りどの曲か、1 枚の画像でまとめて確認。',
        command: '/進捗 丸将', link: '/ja/commands/progress',
        image: shot('plate', 'McMai が生成したプレート進捗画像'),
        callouts: marks('plate', ['難易度ごとの達成状況', 'プレート対象曲をレベル別に一覧', '各曲の評価をジャケット上に表示']),
      },
      {
        key: 'scores', title: 'スコアリスト', desc: 'レベル・評価・FC・バージョンで全スコアを絞り込み。',
        command: '/スコアリスト 14 fc', link: '/ja/commands/progress',
        image: shot('scorelist', 'McMai が生成したスコアリスト画像'),
        callouts: marks('scorelist', ['評価・コンボ・シンク・DX スター分布', '条件に合うスコアをページごとに一覧']),
      },
    ],
  },
}
