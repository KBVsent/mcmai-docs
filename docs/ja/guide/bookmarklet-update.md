---
title: ブックマークレット更新ガイド
description: McMai 日本版・国際版のブックマークレット更新手順。パソコンの Chrome、iPhone の Safari、Android の Chrome での登録と実行を図解。
---

<script setup>
import BookmarkletGuide from '../../.vitepress/theme/components/BookmarkletGuide.vue'
import UploaderProgressDemo from '../../.vitepress/theme/components/UploaderProgressDemo.vue'
</script>

ブックマークレット更新は日本版と国際版に対応します。公式 maimai NET にログインしたブラウザのセッションでスコアを取得し、McMai にアップロードします。SEGA ID とパスワードを McMai に送信する必要はありません。

## 1. ブックマークレットの発行 {#generate}

1. Bot に `/連携` を送り、返された連携リンクを開きます。
2. 日本版または国際版を選び、更新方式をブックマークレットに切り替えます。
3. ブックマークレットを発行します。スマートフォンではコードをコピーし、パソコンでは連携ページのドラッグ用ボタンも利用できます。

日本版と国際版は同じブックマークレットを使用します。完全なコードは現在の McMai アカウントに対応する連携ページから取得します。図中のコードは説明用で、登録には使用できません。

::: warning コードの管理
コードには対象の McMai アカウントへスコアを送信する認証情報が含まれます。他人への転送や公開画像への掲載は避けてください。再発行すると古いコードは直ちに無効になるため、登録済みの各ブラウザでコードの更新が必要です。
:::

## 2. 登録と実行 {#install}

[パソコンの Chrome（Windows / macOS）](#desktop) · [iPhone の Safari](#ios) · [Android の Chrome](#android)

図解の画面表示言語は個別に選択できます。更新時は、登録したブラウザで maimai NET にログインしてから実行します。

### パソコン：Chrome {#desktop}

Windows と macOS の操作は共通です。ブックマークバーの表示は Windows が `Ctrl+Shift+B`、macOS が `⌘+Shift+B` です。連携ページからドラッグして登録し、ドラッグできない場合は図解のステップ 3 で手動登録します。

<BookmarkletGuide platform="desktop" />

手動登録では**ブックマークの URL 欄**にコードを貼り付けます。Chrome のアドレスバーに直接貼り付けると、先頭の `javascript:` が削除され、実行できない場合があります。

### iPhone：Safari {#ios}

図解は下部タブバーの例です。通常のページをブックマークに追加し、URL を完全なコードに置き換えます。ほかのレイアウトではページメニューからブックマーク操作を開けます。

<BookmarkletGuide platform="ios" />

ログイン済み NET ページを開いた状態で、ブックマーク一覧から McMai を実行します。Safari のアドレスバーの候補では実行できない場合があります。

### Android：Chrome {#android}

表示中のページをブックマークし、名前と URL を編集します。例ではアドレスバーから探せるよう、名前を `McMai` にしています。

<BookmarkletGuide platform="android" />

ログイン済み NET ページでアドレスバーに名前を入力し、星のアイコンが付いたブックマーク候補を選びます。ブックマーク管理画面から開くと、更新が実行されずリンク先への移動になる場合があります。

## 3. NET へのログインと結果確認 {#result}

登録したブラウザで対象地域の公式 NET を開き、ログインします。

| 地域 | 公式 NET |
| --- | --- |
| 日本版 | [maimaidx.jp](https://maimaidx.jp/maimai-mobile/) |
| 国際版 | [maimaidx-eng.com](https://maimaidx-eng.com/maimai-mobile/) |

NET で実行すると、右下に円形ボタンが表示され、その左側に現在の状態が表示されます。取得中はページ数に応じて外周の進捗が変化し、準備・アップロード・解析中は円弧が回転します。完了後は結果パネルが表示されます。

<UploaderProgressDemo />

所要時間はネットワークと NET の応答速度によって変わります。完了は実際の結果パネルで確認します。

更新後は Bot に `/鯖変更 jp` または `/鯖変更 intl`、続いて `/b50` を送信してスコアを確認できます。

## 次回の更新 {#next-time}

1. 登録済みブラウザで対象地域の maimai NET にログインします。
2. 端末に対応する方法でブックマークレットを実行し、完了を待ちます。

登録済みのものは繰り返し使用できます。ブラウザの変更やコードの再発行後は登録し直します。

## よくある問題 {#faq}

### 進捗が表示されない

現在のページがログイン済みの maimai NET であることと、保存した URL に `javascript:` から始まる完全なコードがあることを確認します。iPhone は Safari の一覧から、Android Chrome はアドレスバーの星付き候補から実行します。

### アプリ内ブラウザでは実行できない

QQ、LINE、WeChat などのアプリ内ブラウザはスクリプトを制限する場合があります。Safari や Chrome など独立したブラウザで NET にログインし直して実行します。

### 無効なコード・権限停止と表示される

再発行した場合、以前のコードは直ちに無効になります。Bot に再度 `/連携` を送り、現在のコードを確認するか再発行して、保存済み URL を更新します。権限停止の表示は管理者へ確認してください。

### アカウントや地域が異なる

ブラウザでログイン中の NET アカウントが使用されます。実行前にアカウントと地域を確認し、Bot で照会する際も対応する地域を選択します。

## ブラウザ操作の参考 {#references}

- [Chrome のパソコン向けショートカット](https://support.google.com/chrome/answer/157179?hl=en)
- [Safari のブックマーク追加と編集](https://support.apple.com/en-gb/guide/iphone/iph42ab2f3a7/ios)
- [Android Chrome のブックマーク追加と編集](https://support.google.com/chrome/answer/188842?co=GENIE.Platform%3DAndroid&hl=en)

---

関連：[アカウントとサーバー](/ja/commands/account) · [スコア確認ガイド](/ja/guide/score-tracking) · [中国版 NET 更新ガイド](/ja/guide/cn-net-update)
