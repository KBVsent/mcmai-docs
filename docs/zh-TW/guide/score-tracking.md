---
title: maimai 查分與成績查詢指南
description: 使用 McMai 在 QQ、LINE 和 Discord 查詢 maimai 中國版、日本版及國際版成績，了解資料更新、區服切換、B50、單曲成績和進度查詢。
---

# maimai 查分與成績查詢指南

McMai 是一款面向 maimai DX 玩家的免費成績查詢 Bot。你可以在 QQ、LINE 或 Discord 更新並查詢中國版（CN）、日本版（JP）及國際版（INTL）的遊玩資料，無需開啟獨立查分網頁。

## 可以查詢哪些內容？

| 需求 | McMai 功能 | 詳細說明 |
|------|------------|----------|
| 查看綜合表現 | 生成 B50、B40 等上位成績圖 | [B50 查詢與生成](/zh-TW/commands/b50) |
| 查詢單曲成績 | 查看達成率、DX 分與 FC/FS 狀態 | [成績查詢](/zh-TW/commands/score) |
| 尋找歌曲和譜面 | 按曲名、別名、曲師、BPM 或定數搜尋 | [查歌搜尋](/zh-TW/commands/search) |
| 追蹤完成進度 | 查看等級、分類與完成表 | [進度查詢](/zh-TW/commands/progress) |
| 比較玩家成績 | 查看排行榜或使用好友 PK | [排行榜](/zh-TW/commands/leaderboard) |

## 支援的區服和更新方式

| 區服 | 資料更新方式 |
|------|--------------|
| 中國版（CN） | 將舞萌｜中二公眾號「玩家二維碼」解析出的 `SGWCMAID` 內容傳送給 Bot |
| 日本版（JP） | 透過 `/綁定` 使用綁定頁更新，或使用無需提交密碼的書籤更新方式 |
| 國際版（INTL） | 透過 `/綁定` 使用綁定頁更新，或使用無需提交密碼的書籤更新方式 |

帳號綁定、書籤更新及區服切換的完整說明見[帳號與伺服器](/zh-TW/commands/account)。

## 開始查分

1. 在 QQ、LINE 或 Discord 加入並開啟 McMai。
2. 依照所在區服完成一次資料更新。
3. 使用 `/切換伺服器 cn`、`/切換伺服器 jp` 或 `/切換伺服器 intl` 選擇區服。
4. 傳送 `/b50` 查看上位成績，或傳送 `/info <曲目ID或曲名>` 查詢單曲成績。

如果尚未加入 Bot，請先閱讀[快速開始](/zh-TW/guide/getting-started)；需要查找其他功能和參數時，請開啟[指令參考](/zh-TW/commands/basic)。

::: info 隱私提示
日本版和國際版玩家也可以選擇書籤方式更新成績，無需向 McMai 提交 SEGA ID 和密碼。
:::
