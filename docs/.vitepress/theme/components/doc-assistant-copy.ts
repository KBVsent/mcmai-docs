type Topic = { label: string; question: string }
type Copy = {
  launcher: string
  heading: string
  close: string
  preview: string
  open: string
  index: string
  article: string
  sourceInstruction: string
  current: Topic
  topics: Topic[]
}

export const assistantCopy: Record<string, Copy> = {
  'zh-CN': {
    launcher: '文档助手', heading: '你想了解什么？', close: '关闭', preview: '准备好的问题', open: '在 ChatGPT 中继续',
    index: '文档索引', article: '当前文档',
    sourceInstruction: '请用简体中文回答。请从索引中选读相关文档，附上依据的页面。若信息不足，请先问我。',
    current: { label: '帮我看懂这一页', question: '这篇文档能帮我完成什么？请举一个实际例子，并告诉我从哪一步开始。' },
    topics: [
      { label: '绑定账号或更新成绩', question: '我要绑定账号并更新 maimai 成绩。请先问我的区服和设备，再告诉我适合的操作步骤。' },
      { label: '查询 B50 或单曲成绩', question: '我想查自己的 B50 或一首歌的成绩。分别该发什么指令？请各给一个例子，并说明查不到成绩时先检查什么。' },
      { label: '按用途找指令', question: '我知道自己想做什么，但不知道对应的 McMai 指令。请先问我想做什么，再根据文档给我一条能发给 Bot 的示例。' },
    ],
  },
  'zh-TW': {
    launcher: '文件助手', heading: '你想了解什麼？', close: '關閉', preview: '準備好的問題', open: '前往 ChatGPT 繼續',
    index: '文件索引', article: '目前的文件',
    sourceInstruction: '請用繁體中文回答。請從索引中選讀相關文件，並附上參考頁面。若資訊不足，請先問我。',
    current: { label: '幫我看懂這一頁', question: '這篇文件能幫我完成什麼？請舉一個實際例子，並告訴我從哪一步開始。' },
    topics: [
      { label: '綁定帳號或更新成績', question: '我要綁定帳號並更新 maimai 成績。請先問我的遊戲版本和裝置，再告訴我適合的操作步驟。' },
      { label: '查詢 B50 或單曲成績', question: '我想查自己的 B50 或一首歌的成績。分別該用什麼指令？請各舉一例，並說明查不到成績時要先檢查什麼。' },
      { label: '依用途找指令', question: '我知道自己想做什麼，但不知道對應的 McMai 指令。請先問我的需求，再依文件給我一個能傳給 Bot 的指令範例。' },
    ],
  },
  'en-US': {
    launcher: 'Docs assistant', heading: 'What would you like to do?', close: 'Close', preview: 'Your question', open: 'Continue in ChatGPT',
    index: 'Documentation index', article: 'Current page',
    sourceInstruction: 'Answer in English. Use the index to read the relevant documentation and link to your sources. Ask me if you need more details.',
    current: { label: 'Help me understand this page', question: 'What can I do with this guide? Walk me through one practical example and tell me where to start.' },
    topics: [
      { label: 'Link an account or update scores', question: 'How do I link my account and update my maimai scores? Ask which region and device I use, then give me the steps that apply.' },
      { label: 'Look up my B50 or a song score', question: 'Which commands show my B50 and my score for a specific song? Give an example of each and tell me what to check if no scores appear.' },
      { label: 'Find the right command', question: 'Help me find the McMai command for my task. Ask what I want to do, then use the docs to give me an example I can send to the bot.' },
    ],
  },
  'ja-JP': {
    launcher: 'ガイドアシスタント', heading: '何をしたいですか？', close: '閉じる', preview: '質問内容', open: 'ChatGPT で続ける',
    index: 'ドキュメント一覧', article: '現在のページ',
    sourceInstruction: '日本語で答えてください。一覧から関連するドキュメントを読み、参照したページのリンクを添えてください。必要な情報があれば先に質問してください。',
    current: { label: 'このページの使い方を知りたい', question: 'このページの内容を使って何ができますか？具体例を一つ挙げて、最初の手順から教えてください。' },
    topics: [
      { label: 'アカウント連携・スコア更新', question: 'アカウントを連携して maimai のスコアを更新したいです。利用している地域と端末を先に確認して、手順を案内してください。' },
      { label: 'B50・楽曲別スコアの確認', question: '自分の B50 と特定の楽曲のスコアを調べるコマンドを、それぞれ使用例とともに教えてください。結果が出ない場合は何を確認すればよいですか？' },
      { label: '目的に合うコマンドを探す', question: 'やりたいことに合う McMai コマンドを探しています。まず目的を聞いてから、ドキュメントをもとに Bot に送れる例を教えてください。' },
    ],
  },
}
