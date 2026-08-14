# はじめに

McMai は CN・JP・INTL 三サーバーのデータ照会をサポートする、全機能搭載の maimai DX 補助 Bot プラグインです。

## Bot を追加する

McMai は QQ・Discord・LINE で公開されています。**QR コードをスキャン、またはボタンをタップ**してご利用ください：

| QQ | Discord | LINE |
| :---: | :---: | :---: |
| <img src="/QQBot.png" alt="McMai QQ Bot QR コード" width="200" /> | <img src="/Discord.png" alt="McMai Discord Bot QR コード" width="200" /> | <img src="/Line.jpg" alt="McMai LINE 公式アカウント QR コード" width="200" /> |
| Bot を友達に追加<br>またはグループに招待 | Bot をサーバーに招待<br>または個人インストール | 公式アカウントを友だち追加<br>またはグループに招待 |
| [🔗 追加する](https://qun.qq.com/qunpro/robot/qunshare?robot_appid=102076996&robot_uin=3889001355) | [🔗 招待する](https://discord.com/oauth2/authorize?client_id=1455121113758830763) | [🔗 追加する](https://line.me/R/ti/p/@819jucvv) |

今後、Telegram などのプラットフォームへの対応も予定しています。

## 公式グループに参加する

公式グループに参加すれば、**インストール不要で Bot をそのまま利用**できます。交流やご意見もお気軽にどうぞ：

| QQ グループ | Discord 公式サーバー | LINE グループ |
| :---: | :---: | :---: |
| <img src="/QQ_Group.png" alt="McMai QQ 公式グループ QR コード" width="200" /> | <img src="/Discord_Guild.png" alt="McMai Discord 公式サーバー QR コード" width="200" /> | <img src="/Line_Group.png" alt="McMai LINE 公式グループ QR コード" width="200" /> |
| 公式交流グループ 1006348059 | 公式サーバーに参加<br>インストール不要ですぐ利用 | 公式グループに参加<br>グループ内の Bot をそのまま利用 |
| [🔗 参加する](https://qun.qq.com/universal-share/share?ac=1&authKey=a%2B7GQ%2FsIH%2FMzeTpaTR70%2FdDEvTk4%2Firp8W%2FvL1JvLBtM7AuNog3vs9S7uApshxyL&busi_data=eyJncm91cENvZGUiOiIxMDA2MzQ4MDU5IiwidG9rZW4iOiJnRFhqczMxYlZzQTVSNm9SZ1ZkOU1WNjJobTd4QzdyR3lyS1lwb0JOTlZTYmlSeVU1SnNKV2Z1bTVLYjBvR3BJIiwidWluIjoiMTQ4MTYxODMxOSJ9&data=m-7IeXvdz1a8EKGoCkMeid1DwluG3vH6z1sdNVC641CqCINiRQEE7WY-rowa5ZqB2blPVRLHqmPina6U02PZSw&svctype=4&tempid=h5_group_info) | [🔗 参加する](https://discord.gg/fvAU8sTcWz) | [🔗 参加する](https://line.me/ti/g/EKt3QG4bbX) |

## アカウント連携 & データ更新

個人データ照会機能を使うには、事前にアカウント連携とデータ更新が必要です。

**日本サーバー / 国際サーバー ユーザー**

1. `/連携` を使って SEGA ID を連携する
2. 連携完了後、`/データ更新` でデータを更新する

**CN サーバー ユーザー**

MAID（`SGWCMAID` で始まる 84 文字の文字列）を直接送信するだけでデータが更新されます。

::: details MAID の取得方法
1. WeChat で「舞萌 | 中二」公式アカウントを開く
2. 「获取二维码」（QR コード取得）をタップ
3. QR コードページが表示される
4. QR コードを長押しでスキャンし、表示される `SGWCMAID` 文字列をコピーする
:::

連携・更新後、対象サーバーに切り替えます：

| コマンド | 説明 |
|---------|------|
| `/鯖変更 jp` | 日本サーバーに切り替え |
| `/鯖変更 intl` | 国際サーバーに切り替え |
| `/鯖変更 cn` | 中国サーバーに切り替え（デフォルト）|

::: tip CN サーバー ユーザー
CN ユーザーは `/名前 [あなたの QQ]` で QQ を連携すると、Diving Fish スコアトラッカーのデータが利用可能になります。ただし一部機能が制限される場合があります。
:::

## 基本的な使い方

設定が完了したら、以下のコマンドをお試しください：

| コマンド | 説明 |
|---------|------|
| `/help` | 全コマンド一覧を表示 |
| `/b50` | Top 50 チャートを生成 |
| `/今日のmaimai` | 今日の運勢とおすすめ楽曲を表示 |

## 次のステップ

- [ユーザー名とフレンドシステム](/ja/guide/identity-and-friends) でユーザー名の設定とフレンド管理を確認する
- [コマンド一覧](/ja/commands/basic) ですべての利用可能なコマンドを確認する
