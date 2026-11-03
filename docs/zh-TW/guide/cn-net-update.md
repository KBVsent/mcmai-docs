---
title: 中國服 NET 更新教學
description: McMai 中國服 NET 微信授權更新流程，包含 iOS、Android、Windows、macOS 代理設定、微信入口儲存與常見問題。
---

<script setup>
import CnNetIosGuide from '../../.vitepress/theme/components/CnNetIosGuide.vue'
import CnNetProxyGuide from '../../.vitepress/theme/components/CnNetProxyGuide.vue'
</script>

中國服 NET 成績可透過綁定頁的「NET 微信授權」更新。首次使用需設定代理並儲存微信入口，每次更新均需重新授權。

## 準備 {#prepare}

1. 向 Bot 傳送 `/綁定`，開啟回傳的綁定連結。
2. 選擇中國服「NET 微信授權」，取得微信入口。
3. 使用對應遊戲帳號的微信完成授權。

微信入口以目前帳號的綁定頁為準。圖解的介面語言可單獨切換。

## 一、設定代理 {#proxy}

[iPhone / iPad](#ios) · [Android（Pixel）](#android) · [Windows 11](#windows) · [macOS](#macos) · [Clash](#clash)

在進行微信授權的裝置上設定代理。手機可使用 Wi-Fi 手動代理或相容 Clash 設定的客戶端，擇一使用。已有代理設定時，修改前記錄原設定，更新結束後恢復。

::: info 電腦端適用範圍
Windows 與 macOS 圖解說明電腦的系統代理設定，電腦微信的完整授權流程尚未實機驗證。若以手機微信開啟入口，需在手機設定代理；電腦代理不會套用至手機。
:::

### iPhone / iPad：Wi-Fi 手動代理 {#ios}

連接 Wi-Fi，暫時關閉行動數據與「Wi-Fi 輔助」，防止授權時切換至行動網路。「Wi-Fi 輔助」通常位於「設定」→「行動服務」頁面底部。

<CnNetIosGuide />

Wi-Fi 代理開啟期間，其他網站可能無法存取。授權頁顯示交接完成後，[關閉代理](#finish)並返回綁定頁查看結果。更換 Wi-Fi 後需在新網路重新設定。

### Android：Google Pixel {#android}

圖解以 Google Pixel 為例。連接 Wi-Fi，暫時關閉行動數據與自動網路切換。其他品牌的選單名稱與位置可能不同。

<CnNetProxyGuide platform="android" />

網路設定沒有代理選項時，可查閱裝置廠商說明或使用相容的 Clash 客戶端。設定路徑見 [Google Pixel 官方說明](https://support.google.com/pixelphone/answer/9655181?hl=en)。

### Windows 11：系統代理 {#windows}

開啟「設定」→「網路和網際網路」→ Proxy，在「手動 Proxy 設定」中設定。Windows 10 的介面配置可能不同。

<CnNetProxyGuide platform="windows" />

設定路徑見 [Microsoft 官方說明](https://support.microsoft.com/en-us/windows/experience/connectivity-networking/use-a-proxy-server-in-windows)。

### macOS：網路代理 {#macos}

開啟「系統設定」→「網路」，選擇目前網路服務，進入「詳細資訊」→「代理伺服器」。圖解以 Wi-Fi 為例，舊版 macOS 的入口可能不同。

<CnNetProxyGuide platform="macos" />

設定路徑與欄位說明見 [Apple 官方說明](https://support.apple.com/en-gb/guide/mac-help/mchlp2591/mac)。

### Clash：匯入設定 {#clash}

1. 在綁定頁「設定代理」中點選「一鍵匯入設定」。無法開啟客戶端時，複製 Clash 設定網址，在客戶端選擇「從 URL 匯入」。
2. 選擇匯入的 McMai 設定，開啟代理，並依客戶端提示授予所需的系統網路權限。
3. 返回綁定頁，檢查代理偵測結果。

設定需在匯入後啟用。綁定頁提供的 Clash 設定只代理授權回呼，其他流量依設定中的規則處理。各客戶端的選項名稱可能不同。

## 二、儲存微信入口 {#wechat-entry}

1. 在綁定頁「儲存微信入口」中複製入口連結。
2. 將連結傳送至微信「檔案傳輸助手」（簡中介面為「文件传输助手」），保留訊息供後續更新使用。

::: warning 入口連結保管
持有入口連結的人可使用自己的微信，向該 McMai 帳號寫入成績。入口不應轉傳或出現在公開截圖中。連結外洩時，在綁定頁「重設入口」並儲存新連結；舊連結立即失效。
:::

## 三、在微信授權 {#authorize}

1. 開啟已設定的代理。Wi-Fi 方式選擇「手動」；Clash 方式啟用 McMai 設定。
2. 在微信「檔案傳輸助手」開啟入口連結，依頁面提示授權。
3. 等待頁面顯示「交接完成」。此時授權已提交至更新服務，成績仍需讀取與處理。

## 四、關閉代理並查看結果 {#finish}

授權交接完成後，關閉此次使用的代理或恢復原設定：

- **iPhone / iPad**：進入目前 Wi-Fi 的「設定代理伺服器」，選擇「關閉」並儲存。
- **Android**：將目前 Wi-Fi 的代理設為「無」或「不使用」，儲存設定。
- **Windows / macOS**：關閉此次開啟的系統代理。
- **Clash**：停止代理或切換回原設定。

恢復先前關閉的行動數據、自動網路切換等設定，返回綁定頁頂部查看更新狀態。更新完成後，向 Bot 傳送 `/切換伺服器 cn`，再傳送 `/b50` 查詢成績。

## 再次更新 {#next-time}

1. 開啟已設定的代理。
2. 在微信開啟已儲存的入口，重新授權。
3. 交接完成後關閉代理，返回綁定頁查看結果。

入口連結可重複使用，重設後需儲存新連結。更換 Wi-Fi 或修改代理參數後，需更新相應的網路設定。

## 常見問題 {#faq}

### 未偵測到代理

檢查伺服器與埠是否填寫正確、設定是否已儲存。Wi-Fi 方式需連接已設定的網路，並關閉可能繞過代理的行動數據或自動網路切換。Clash 方式需確認 McMai 設定與代理功能均已啟用。

### 開啟 Wi-Fi 代理後網頁無法存取

此代理僅供更新授權使用，其他網站可能無法存取。微信授權交接完成後關閉代理，再查看綁定頁結果。若微信授權也失敗，檢查代理設定後重新開啟入口。

### 授權完成後仍在更新

交接完成後，服務繼續讀取與處理 NET 資料。更新是否成功，以綁定頁最終狀態為準。更新失敗時，依頁面提示重新授權。

### MAID 更新

中國服仍支援 MAID 更新，相關說明見[帳號與伺服器](/zh-TW/commands/account)。

---

相關：[查分指南](/zh-TW/guide/score-tracking) · [帳號與伺服器](/zh-TW/commands/account)
