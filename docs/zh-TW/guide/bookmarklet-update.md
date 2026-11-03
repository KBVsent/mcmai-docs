---
title: 書籤更新教學
description: McMai 日服與國際服書籤更新流程，包含電腦 Chrome、iPhone Safari、Android Chrome 的安裝與使用圖解。
---

<script setup>
import BookmarkletGuide from '../../.vitepress/theme/components/BookmarkletGuide.vue'
import UploaderProgressDemo from '../../.vitepress/theme/components/UploaderProgressDemo.vue'
</script>

書籤更新適用於日服與國際服。瀏覽器登入官方 maimai NET 後，書籤使用目前登入階段讀取成績並上傳至 McMai，無需向 McMai 提交 SEGA ID 與密碼。

## 一、產生書籤 {#generate}

1. 向 Bot 傳送 `/綁定`，開啟回傳的綁定連結。
2. 選擇「日服」或「國際服」，將更新方式切換為「書籤」。
3. 點選「產生書籤」。手機使用者點選「複製書籤程式碼」，電腦使用者可直接使用綁定頁的拖曳按鈕。

日服與國際服共用同一書籤。完整程式碼與目前 McMai 帳號關聯，需從自己的綁定頁取得。圖解中的程式碼為佔位說明，不能用於安裝。

::: warning 書籤程式碼保管
程式碼包含向該 McMai 帳號上傳成績的憑證，不應轉傳或出現在公開截圖中。「重新產生」會立即使舊書籤失效，已安裝的瀏覽器需更新程式碼。
:::

## 二、安裝與使用 {#install}

[電腦 Chrome（Windows / macOS）](#desktop) · [iPhone Safari](#ios) · [Android Chrome](#android)

圖解的介面語言可單獨選擇。安裝完成後，每次更新均需在同一瀏覽器登入 maimai NET，再執行書籤。

### 電腦：Chrome {#desktop}

Windows 與 macOS 的操作相同，書籤列快捷鍵分別為 `Ctrl+Shift+B` 與 `⌘+Shift+B`。可從綁定頁拖曳安裝；無法拖曳時，使用圖解第 3 步的手動方式。

<BookmarkletGuide platform="desktop" />

手動安裝時，程式碼應填入**書籤的網址欄**。Chrome 可能移除直接貼至瀏覽器網址列的 `javascript:` 前綴，導致程式碼無法執行。

### iPhone：Safari {#ios}

圖解以底部標籤頁列配置為例。先建立一般網頁書籤，再以完整程式碼替換網址。其他配置可在頁面選單找到加入書籤與書籤列表入口。

<BookmarkletGuide platform="ios" />

更新時，在已登入的 NET 頁面開啟書籤列表，點選 McMai 書籤。Safari 網址列的建議項目可能無法執行該書籤。

### Android：Chrome {#android}

先將目前網頁加入書籤，再編輯名稱與網址。範例將名稱設為 `McMai`，供之後在網址列檢索。

<BookmarkletGuide platform="android" />

更新時，在已登入的 NET 頁面向網址列輸入書籤名稱，選擇帶星形圖示的書籤建議項目。直接從書籤管理列表開啟時，可能只會開啟連結而不執行更新。

## 三、登入 NET 並確認結果 {#result}

依區服，在已安裝書籤的瀏覽器開啟並登入：

| 區服 | 官方 NET |
| --- | --- |
| 日服 | [maimaidx.jp](https://maimaidx.jp/maimai-mobile/) |
| 國際服 | [maimaidx-eng.com](https://maimaidx-eng.com/maimai-mobile/) |

在 NET 執行書籤後，右下角顯示圓形懸浮按鈕，左側膠囊顯示目前階段。抓取時外圈依頁面數顯示進度；準備、上傳與解析時顯示旋轉圓弧。完成後顯示結果面板。

<UploaderProgressDemo />

所需時間受網路與 NET 回應速度影響，完成狀態以實際結果面板為準。

更新完成後，向 Bot 傳送 `/切換伺服器 jp` 或 `/切換伺服器 intl`，再傳送 `/b50` 查詢成績。

## 再次更新 {#next-time}

1. 在已安裝書籤的瀏覽器登入對應區服的 maimai NET。
2. 依裝置對應方式執行書籤，等待上傳完成。

現有書籤可重複使用，無需每次重新產生。更換瀏覽器或重新產生書籤後需重新安裝。

## 常見問題 {#faq}

### 點選後未出現上傳進度

確認目前頁面為已登入的 maimai NET，儲存的網址包含從 `javascript:` 開始的完整程式碼。iPhone 從 Safari 書籤列表執行；Android Chrome 從網址列的星形書籤建議項目執行。

### 內建瀏覽器無法執行

QQ、LINE、微信等 App 的內建瀏覽器可能限制書籤腳本。使用 Safari、Chrome 等獨立瀏覽器，重新登入 NET 後執行。

### 頁面提示書籤失效或權限停用

重新產生後，舊書籤立即失效。向 Bot 重新傳送 `/綁定`，查看目前書籤或產生新程式碼，再更新瀏覽器儲存的網址。若提示權限停用，請聯絡管理員。

### 區服或帳號不符

書籤使用目前瀏覽器登入的 NET 帳號。執行前確認帳號與區服；查詢成績時，確認 Bot 已切換至對應區服。

## 瀏覽器操作參考 {#references}

- [Chrome 電腦快捷鍵](https://support.google.com/chrome/answer/157179?hl=en)
- [Safari 加入與編輯書籤](https://support.apple.com/en-gb/guide/iphone/iph42ab2f3a7/ios)
- [Android Chrome 加入與編輯書籤](https://support.google.com/chrome/answer/188842?co=GENIE.Platform%3DAndroid&hl=en)

---

相關：[帳號與伺服器](/zh-TW/commands/account) · [查分指南](/zh-TW/guide/score-tracking) · [中國服 NET 更新教學](/zh-TW/guide/cn-net-update)
