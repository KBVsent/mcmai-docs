---
title: 书签更新教程
description: McMai 日服与国际服书签更新流程，包含电脑 Chrome、iPhone Safari、Android Chrome 的安装和使用图解。
---

<script setup>
import BookmarkletGuide from '../.vitepress/theme/components/BookmarkletGuide.vue'
import UploaderProgressDemo from '../.vitepress/theme/components/UploaderProgressDemo.vue'
</script>

书签更新适用于日服和国际服。浏览器登录官方 maimai NET 后，书签读取当前登录会话中的成绩并上传至 McMai，无需向 McMai 提交 SEGA ID 和密码。

## 一、生成书签 {#generate}

1. 向 Bot 发送 `/绑定`，打开返回的绑定链接。
2. 选择「日服」或「国际服」，将更新方式切换为「书签」。
3. 点击「生成书签」。手机用户点击「复制书签代码」，电脑用户可直接使用绑定页的拖拽按钮。

日服和国际服共用同一个书签。完整代码与当前 McMai 账号关联，需从自己的绑定页获取。图解中的代码为占位说明，不能用于安装。

::: warning 书签代码保管
书签代码包含向该 McMai 账号上传成绩的凭证，不应转发或出现在公开截图中。「重新生成」会立即使旧书签失效，已安装的浏览器需更新书签代码。
:::

## 二、安装并使用 {#install}

[电脑 Chrome（Windows / macOS）](#desktop) · [iPhone Safari](#ios) · [Android Chrome](#android)

图解的界面语言可单独选择。安装完成后，每次更新均需在同一浏览器中登录 maimai NET，再执行书签。

### 电脑：Chrome {#desktop}

Windows 和 macOS 的操作相同，书签栏快捷键分别为 `Ctrl+Shift+B` 和 `⌘+Shift+B`。可从绑定页拖拽安装；无法拖拽时，使用图解第 3 步的手动方式。

<BookmarkletGuide platform="desktop" />

手动安装时，代码应填写在**书签的网址栏**。Chrome 可能移除直接粘贴到浏览器地址栏中的 `javascript:` 前缀，导致代码无法执行。

### iPhone：Safari {#ios}

图解以底部标签栏布局为例。先创建普通网页书签，再将其网址替换为完整代码。其他布局可在页面菜单中找到添加书签和书签列表入口。

<BookmarkletGuide platform="ios" />

更新时，在已登录的 NET 页面打开书签列表并点击 McMai 书签。Safari 的地址栏建议项可能无法执行该书签。

### Android：Chrome {#android}

先将当前网页加入书签，再编辑名称和网址。示例将书签命名为 `McMai`，用于后续在地址栏中检索。

<BookmarkletGuide platform="android" />

更新时，在已登录的 NET 页面向地址栏输入书签名，选择带星形图标的书签建议项。直接从书签管理列表打开时，可能只会打开链接而不执行更新。

## 三、登录 NET 并确认结果 {#result}

根据区服，在安装了书签的浏览器中打开并登录：

| 区服 | 官方 NET |
| --- | --- |
| 日服 | [maimaidx.jp](https://maimaidx.jp/maimai-mobile/) |
| 国际服 | [maimaidx-eng.com](https://maimaidx-eng.com/maimai-mobile/) |

在 NET 页面执行书签后，右下角显示圆形悬浮按钮，左侧胶囊显示当前阶段。抓取时外圈按页面数显示进度；准备、上传和解析时显示旋转圆弧。完成后显示结果面板。

<UploaderProgressDemo />

用时受网络和 NET 响应速度影响，完成状态以实际结果面板为准。

更新完成后，向 Bot 发送 `/切换服务器 jp` 或 `/切换服务器 intl`，再发送 `/b50` 查询成绩。

## 再次更新 {#next-time}

1. 在安装了书签的浏览器中登录对应区服的 maimai NET。
2. 按设备对应的方式执行书签，等待上传完成。

已有书签可重复使用，无需每次重新生成。更换浏览器或重新生成书签后，需重新安装。

## 常见问题 {#faq}

### 点击后没有出现上传进度

检查当前页面是否为已登录的 maimai NET，以及保存的网址是否包含从 `javascript:` 开始的完整代码。iPhone 从 Safari 书签列表运行；Android Chrome 从地址栏的星形书签建议项运行。

### 内置浏览器无法执行

QQ、LINE、微信等应用的内置浏览器可能限制书签脚本。使用 Safari、Chrome 等独立浏览器，重新登录 NET 后执行。

### 页面提示书签失效或权限停用

重新生成后，旧书签立即失效。向 Bot 重新发送 `/绑定`，查看当前书签或生成新代码，再更新浏览器中保存的网址。页面提示权限停用时，联系管理员处理。

### 区服或账号不符

书签使用当前浏览器登录的 NET 账号。执行前检查登录账号和区服；查询成绩时，确认 Bot 已切换到对应区服。

## 浏览器操作参考 {#references}

- [Chrome 电脑快捷键](https://support.google.com/chrome/answer/157179?hl=en)
- [Safari 添加与编辑书签](https://support.apple.com/en-gb/guide/iphone/iph42ab2f3a7/ios)
- [Android Chrome 添加与编辑书签](https://support.google.com/chrome/answer/188842?co=GENIE.Platform%3DAndroid&hl=en)

---

相关：[账号与服务器](/commands/account) · [maimai 查分指南](/guide/score-tracking) · [国服 NET 更新教程](/guide/cn-net-update)
