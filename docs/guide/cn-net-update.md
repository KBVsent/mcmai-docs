---
title: 国服 NET 更新教程
description: McMai 国服 NET 微信授权更新流程，包含 iOS、Android、Windows、macOS 代理配置、微信入口保存与常见问题。
---

<script setup>
import CnNetIosGuide from '../.vitepress/theme/components/CnNetIosGuide.vue'
import CnNetProxyGuide from '../.vitepress/theme/components/CnNetProxyGuide.vue'
</script>

国服 NET 成绩可通过绑定页的「NET 微信授权」更新。首次使用需配置代理并保存微信入口，每次更新均需重新授权。

## 准备 {#prepare}

1. 向 Bot 发送 `/绑定`，打开返回的绑定链接。
2. 选择国服「NET 微信授权」，获取微信入口。
3. 使用对应游戏账号的微信完成授权。

微信入口以当前账号的绑定页为准。图解中的界面语言可单独切换。

## 一、配置代理 {#proxy}

[iPhone / iPad](#ios) · [Android（Pixel）](#android) · [Windows 11](#windows) · [macOS](#macos) · [Clash](#clash)

在进行微信授权的设备上配置代理。手机可使用 Wi-Fi 手动代理或兼容 Clash 配置的客户端，选择一种方式即可。已有代理配置时，修改前记录原设置，更新结束后恢复。

::: info 电脑端适用范围
Windows 和 macOS 图解说明电脑的系统代理设置，电脑微信的完整授权流程尚未实机验证。若使用手机微信打开入口，需在手机上配置代理；电脑代理不会应用到手机。
:::

### iPhone / iPad：Wi-Fi 手动代理 {#ios}

连接 Wi-Fi，暂时关闭蜂窝数据和「无线局域网助理」，防止授权时切换至移动网络。「无线局域网助理」通常位于「设置」→「蜂窝网络」页面底部。

<CnNetIosGuide />

Wi-Fi 代理开启期间，其他网站可能无法访问。授权页面显示交接完成后，[关闭代理](#finish)并返回绑定页查看结果。更换 Wi-Fi 后，需在新网络中重新配置。

### Android：Google Pixel {#android}

图解以 Google Pixel 为例。连接 Wi-Fi，暂时关闭移动数据和自动网络切换。其他品牌的菜单名称和位置可能不同。

<CnNetProxyGuide platform="android" />

网络设置中没有代理选项时，可查阅设备厂商说明，或使用兼容的 Clash 客户端。设置路径见 [Google Pixel 官方说明](https://support.google.com/pixelphone/answer/9655181?hl=en)。

### Windows 11：系统代理 {#windows}

打开「设置」→「网络和 Internet」→「代理」，在「手动设置代理」中配置。Windows 10 的界面布局可能不同。

<CnNetProxyGuide platform="windows" />

设置路径见 [Microsoft 官方说明](https://support.microsoft.com/en-us/windows/experience/connectivity-networking/use-a-proxy-server-in-windows)。

### macOS：网络代理 {#macos}

打开「系统设置」→「网络」，选择当前网络服务，进入「详细信息」→「代理」。图解以 Wi-Fi 为例，旧版 macOS 的入口可能不同。

<CnNetProxyGuide platform="macos" />

设置路径和字段说明见 [Apple 官方说明](https://support.apple.com/en-gb/guide/mac-help/mchlp2591/mac)。

### Clash：导入配置 {#clash}

1. 在绑定页「设置代理」中点击「一键导入配置」。无法打开客户端时，复制 Clash 配置地址，在客户端中选择「从 URL 导入」。
2. 选择导入的 McMai 配置，开启代理，并按客户端提示授予所需的系统网络权限。
3. 返回绑定页，检查代理检测结果。

配置需在导入后启用。绑定页提供的 Clash 配置仅代理授权回调，其他流量按配置中的规则处理。不同客户端的选项名称可能不同。

## 二、保存微信入口 {#wechat-entry}

1. 在绑定页「保存微信入口」中复制入口链接。
2. 将链接发送至微信「文件传输助手」，保留该消息供后续更新使用。

::: warning 入口链接保管
持有入口链接的人可使用自己的微信向该 McMai 账号写入成绩。入口不应转发或出现在公开截图中。链接泄露时，在绑定页「重置入口」并保存新链接；旧链接立即失效。
:::

## 三、在微信中授权 {#authorize}

1. 开启已配置的代理。Wi-Fi 方式选择「手动」；Clash 方式启用 McMai 配置。
2. 在微信「文件传输助手」中打开入口链接，按页面提示授权。
3. 等待页面显示「交接完成」。此时授权已提交至更新服务，成绩仍需读取和处理。

## 四、关闭代理并查看结果 {#finish}

授权交接完成后，关闭本次使用的代理或恢复原配置：

- **iPhone / iPad**：进入当前 Wi-Fi 的「配置代理」，选择「关闭」并存储。
- **Android**：将当前 Wi-Fi 的代理设为「无」或「不使用」，保存设置。
- **Windows / macOS**：关闭本次开启的系统代理。
- **Clash**：停止代理或切换回原配置。

恢复此前关闭的蜂窝数据、网络自动切换等设置，返回绑定页顶部查看更新状态。更新完成后，向 Bot 发送 `/切换服务器 cn`，再发送 `/b50` 查询成绩。

## 再次更新 {#next-time}

1. 开启已配置的代理。
2. 在微信中打开已保存的入口，重新授权。
3. 交接完成后关闭代理，返回绑定页查看结果。

入口链接可重复使用；重置后需保存新链接。更换 Wi-Fi 或修改代理参数后，需更新相应的网络设置。

## 常见问题 {#faq}

### 未检测到代理

检查服务器和端口是否填写正确、设置是否已保存。Wi-Fi 方式需连接已配置的网络，并关闭可能绕过代理的移动数据或自动网络切换。Clash 方式需确认 McMai 配置和代理功能均已启用。

### 开启 Wi-Fi 代理后网页无法访问

该代理仅用于更新授权，其他网站可能无法访问。微信授权交接完成后关闭代理，再查看绑定页结果。若微信授权也失败，检查代理设置后重新打开入口。

### 授权完成后仍在更新

交接完成后，服务继续读取和处理 NET 数据。更新是否成功，以绑定页最终状态为准。更新失败时，按页面提示重新授权。

### MAID 更新

国服仍支持 MAID 更新，相关说明见[账号与服务器](/commands/account)。

---

相关：[maimai 查分指南](/guide/score-tracking) · [账号与服务器](/commands/account)
