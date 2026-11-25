---
description: 幾分鐘上手 McMai：在 QQ、LINE 或 Discord 新增該隱 Bot，綁定 SEGA ID，或用大陸區 NET、MAID、落雪查分器更新 maimai 資料，開始查詢 B50 與成績。
---

# 快速開始

McMai 是提供成績查詢、B50 分析與進度追蹤等功能的 maimai DX 輔助插件，支援大陸區、日本區與國際區。你在 QQ、Discord 或 LINE 上互動的 Bot 名為「該隱」，透過該隱即可使用 McMai 提供的這些功能。

## 新增該隱 Bot {#新增-bot}

該隱可在 QQ、Discord 和 LINE 使用，**掃描下方 QR Code，或點擊按鈕**即可使用：

| QQ | Discord | LINE |
| :---: | :---: | :---: |
| <img src="/QQBot.png" alt="該隱 QQ Bot QR Code" width="200" /> | <img src="/Discord.png" alt="該隱 Discord Bot QR Code" width="200" /> | <img src="/Line.jpg" alt="該隱 LINE 官方帳號 QR Code" width="200" /> |
| 加好友<br>或將其拉入群組使用 | 邀請 Bot 加入你的伺服器<br>或作為個人安裝 | 加入官方帳號好友<br>或將其邀請進群組使用 |
| [🔗 點擊新增](https://qun.qq.com/qunpro/robot/qunshare?robot_appid=102076996&robot_uin=3889001355) | [🔗 點擊邀請](https://discord.com/oauth2/authorize?client_id=1455121113758830763) | [🔗 點擊新增](https://line.me/R/ti/p/@819jucvv) |

## 加入官方群組

也可以直接加入官方群組，**無需安裝即可使用 Bot**，同時歡迎在群內交流與回饋意見：

| QQ 群 | Discord 官方伺服器 | LINE 群組 |
| :---: | :---: | :---: |
| <img src="/QQ_Group.png" alt="McMai QQ 官方群 QR Code" width="200" /> | <img src="/Discord_Guild.png" alt="McMai Discord 官方伺服器 QR Code" width="200" /> | <img src="/Line_Group.png" alt="McMai LINE 官方群組 QR Code" width="200" /> |
| 官方交流群 1006348059 | 加入官方伺服器<br>無需安裝直接使用 | 加入官方群組<br>群內已有 Bot 可直接使用 |
| [🔗 點擊加入](https://qun.qq.com/universal-share/share?ac=1&authKey=a%2B7GQ%2FsIH%2FMzeTpaTR70%2FdDEvTk4%2Firp8W%2FvL1JvLBtM7AuNog3vs9S7uApshxyL&busi_data=eyJncm91cENvZGUiOiIxMDA2MzQ4MDU5IiwidG9rZW4iOiJnRFhqczMxYlZzQTVSNm9SZ1ZkOU1WNjJobTd4QzdyR3lyS1lwb0JOTlZTYmlSeVU1SnNKV2Z1bTVLYjBvR3BJIiwidWluIjoiMTQ4MTYxODMxOSJ9&data=m-7IeXvdz1a8EKGoCkMeid1DwluG3vH6z1sdNVC641CqCINiRQEE7WY-rowa5ZqB2blPVRLHqmPina6U02PZSw&svctype=4&tempid=h5_group_info) | [🔗 點擊加入](https://discord.gg/fvAU8sTcWz) | [🔗 點擊加入](https://line.me/ti/g/EKt3QG4bbX) |

## 綁定帳號 & 更新資料

使用 Bot 進行個人資料查詢前，需先完成帳號綁定並更新資料。

**日本區 / 國際區用戶**

1. 使用 `/綁定` 指令綁定 SEGA ID（國際區也可以提交[登入權杖](/zh-TW/commands/account#intl-token)）
2. 綁定頁提交後會立即更新一次成績；之後可使用 `/更新記錄` 更新，查詢自己的成績時也會[自動更新](/zh-TW/commands/account#auto-update)

**大陸區用戶**

可選擇以下任一方式更新資料：

- **NET 微信授權**：使用 `/綁定` 指令，在綁定頁選擇「大陸區」→「NET」，設定步驟見[大陸區 NET 更新教學](/zh-TW/guide/cn-net-update)
- **MAID**：直接發送 MAID（`SGWCMAID` 開頭的 84 位字串）
- **落雪查分器**：使用 `/綁定` 指令，在綁定頁選擇「大陸區」→「落雪」完成授權，見[落雪查分器](/zh-TW/commands/account#lxns)

::: details 如何取得 MAID？
1. 進入「舞萌 | 中二」公眾號
2. 點擊「獲取二維碼」
3. 開啟 QR Code 頁面
4. 長按掃描，複製出現的 `SGWCMAID` 開頭字串
:::

綁定頁預設會同時切換 McMai 的目前區服。需要手動切換時，使用以下指令：

| 指令 | 說明 |
|------|------|
| `/切換伺服器 jp` | 切換至日本區 |
| `/切換伺服器 intl` | 切換至國際區 |
| `/切換伺服器 cn` | 切換至大陸區（預設）|

## 基本使用

完成綁定後，可以嘗試以下常用指令：

| 指令 | 說明 |
|------|------|
| `/幫助` | 查看所有可用指令 |
| `/b50` | 查詢你的 Best 50 成績 |
| `/今日舞萌` | 查看今日運勢 |

## 下一步

- 查看 [使用者名稱與好友系統](/zh-TW/guide/identity-and-friends) 了解如何設定使用者名稱和管理好友
- 查看 [指令參考](/zh-TW/commands/basic) 了解所有可用指令
