import type { GuideLocale } from './cn-net-ios-copy'

export type UploadPhase = 'prepare' | 'fetching' | 'uploading' | 'parsing'

export const bindingUi: Record<GuideLocale, Record<"title" | "jp" | "intl" | "cn" | "account" | "bookmark" | "step1" | "step2" | "step3" | "step4" | "next" | "desktop" | "ios" | "android" | "drag" | "bookmarkTitle", string>> = {
  "zh": {
    "title": "与我签订契约",
    "jp": "日服",
    "intl": "国际服",
    "cn": "国服",
    "account": "账号密码",
    "bookmark": "书签",
    "step1": "生成书签",
    "step2": "复制代码",
    "step3": "添加到浏览器",
    "step4": "在 maimai NET 上使用",
    "next": "下一步",
    "desktop": "电脑",
    "ios": "iPhone",
    "android": "Android",
    "drag": "将下方按钮拖到书签栏",
    "bookmarkTitle": "McMai 更新成绩"
  },
  "zh-TW": {
    "title": "與我簽訂契約",
    "jp": "日服",
    "intl": "國際服",
    "cn": "國服",
    "account": "帳號密碼",
    "bookmark": "書籤",
    "step1": "產生書籤",
    "step2": "複製程式碼",
    "step3": "加入瀏覽器",
    "step4": "在 maimai NET 上使用",
    "next": "下一步",
    "desktop": "電腦",
    "ios": "iPhone",
    "android": "Android",
    "drag": "將下方按鈕拖曳到書籤列",
    "bookmarkTitle": "McMai 更新成績"
  },
  "en": {
    "title": "Seal a Contract with Me",
    "jp": "Japan",
    "intl": "International",
    "cn": "China",
    "account": "SEGA ID & password",
    "bookmark": "Bookmarklet",
    "step1": "Generate a bookmarklet",
    "step2": "Copy the code",
    "step3": "Add to browser",
    "step4": "Use on maimai NET",
    "next": "Next",
    "desktop": "Desktop",
    "ios": "iPhone",
    "android": "Android",
    "drag": "Drag the button below onto the bookmarks bar",
    "bookmarkTitle": "McMai Update"
  },
  "ja": {
    "title": "僕と契約しよう",
    "jp": "日本版",
    "intl": "国際版",
    "cn": "中国版",
    "account": "ID・パスワード",
    "bookmark": "ブックマークレット",
    "step1": "ブックマークレットを発行",
    "step2": "コードをコピー",
    "step3": "ブラウザに登録",
    "step4": "maimai NET で使用",
    "next": "次へ",
    "desktop": "パソコン",
    "ios": "iPhone",
    "android": "Android",
    "drag": "下のボタンをブックマークバーにドラッグします",
    "bookmarkTitle": "McMai 成績更新"
  }
}

export const uploaderUi: Record<GuideLocale, Record<"title" | "prepare" | "fetching" | "uploading" | "parsing" | "language" | "fetchingHint" | "spinningHint" | "example", string>> = {
  "zh": {
    "title": "McMai 成绩更新",
    "prepare": "准备中",
    "fetching": "抓取中",
    "uploading": "上传中",
    "parsing": "解析中",
    "language": "界面语言",
    "fetchingHint": "抓取时，外圈按已读取页面数显示进度。",
    "spinningHint": "准备、上传和解析时，外圈显示旋转圆弧。",
    "example": "状态示意，无实际上传。"
  },
  "zh-TW": {
    "title": "McMai 成績更新",
    "prepare": "準備中",
    "fetching": "抓取中",
    "uploading": "上傳中",
    "parsing": "解析中",
    "language": "介面語言",
    "fetchingHint": "抓取時，外圈依已讀取頁面數顯示進度。",
    "spinningHint": "準備、上傳與解析時，外圈顯示旋轉圓弧。",
    "example": "狀態示意，無實際上傳。"
  },
  "en": {
    "title": "McMai Score Update",
    "prepare": "Preparing",
    "fetching": "Fetching",
    "uploading": "Uploading",
    "parsing": "Processing",
    "language": "Interface language",
    "fetchingHint": "During fetching, the ring shows progress based on the number of pages retrieved.",
    "spinningHint": "During preparation, upload, and processing, the ring displays a rotating arc.",
    "example": "State illustration; no data is uploaded."
  },
  "ja": {
    "title": "McMai 成績更新",
    "prepare": "準備中",
    "fetching": "取得中",
    "uploading": "アップロード中",
    "parsing": "解析中",
    "language": "画面の表示言語",
    "fetchingHint": "取得中は、読み込み済みページ数に応じて外周の進捗が変化します。",
    "spinningHint": "準備・アップロード・解析中は外周の円弧が回転します。",
    "example": "状態の説明用で、実際のアップロードは行いません。"
  }
}
