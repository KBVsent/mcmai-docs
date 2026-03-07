# Getting Started

McMai is a full-featured maimai DX assistant Bot plugin supporting CN, JP, and INTL region data queries.

## Add the Bot

McMai is available on the QQ bot platform. Scan the QR code below to add the bot as a friend or invite it to a group:

<img src="/QQBot.png" alt="McMai QQ Bot QR Code" width="200" />

More platforms (Telegram, Discord, etc.) will be supported in the future.

## Bind Your Account & Update Data

You need to bind your account and update data before using personal data queries.

**JP / INTL Users**

1. Use `/绑定` to bind your SEGA ID
2. After binding, use `/更新记录` to sync your data

**CN Users**

Directly send your MAID (an 84-character string starting with `SGWCMAID`) to update your data.

::: details How to get your MAID?
1. Open the "舞萌 | 中二" (Maimai | Chunithm) official WeChat account
2. Tap "获取二维码" (Get QR Code)
3. A QR code page will open
4. Long-press the QR code to scan, then copy the `SGWCMAID` string that appears
:::

After binding, switch to your region's server:

```
/切服 jp     # Switch to JP server
/切服 intl   # Switch to INTL server
/切服 cn     # Switch to CN server (default)
```

::: tip CN Users
CN users can bind a QQ account via `/用户名 [your QQ]` to use data from the Diving Fish score tracker. Some features may be limited.
:::

## Basic Usage

Once set up, try these common commands:

```
/帮助        # View all available commands
/b50         # Generate your Top 50 chart
/今日舞萌    # View today's fortune & recommended songs
```

## Next Steps

- See [Command Reference](/en/commands/basic) for all available commands
