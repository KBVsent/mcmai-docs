# Getting Started

McMai is a full-featured maimai DX assistant Bot plugin supporting CN, JP, and INTL region data queries.

## Add the Bot

McMai is available on QQ and Discord. Scan the corresponding QR code below to get started:

| QQ | Discord |
| :---: | :---: |
| <img src="/QQBot.png" alt="McMai QQ Bot QR Code" width="200" /> | <img src="/Discord.png" alt="McMai Discord Bot QR Code" width="200" /> |
| Add the bot as a friend<br>or invite it to a group | Invite the bot to your server<br>or install it as a user app |

More platforms (Telegram, etc.) will be supported in the future.

## Bind Your Account & Update Data

You need to bind your account and update data before using personal data queries.

**JP / INTL Users**

1. Use `/bind` to bind your SEGA ID
2. After binding, use `/update` to sync your data

**CN Users**

Directly send your MAID (an 84-character string starting with `SGWCMAID`) to update your data.

::: details How to get your MAID?
1. Open the "舞萌 | 中二" (Maimai | Chunithm) official WeChat account
2. Tap "获取二维码" (Get QR Code)
3. A QR code page will open
4. Long-press the QR code to scan, then copy the `SGWCMAID` string that appears
:::

After binding, switch to your region's server:

| Command | Description |
|---------|-------------|
| `/switchserver jp` | Switch to JP server |
| `/switchserver intl` | Switch to INTL server |
| `/switchserver cn` | Switch to CN server (default) |

::: tip CN Users
CN users can bind a QQ account via `/setname [your QQ]` to use data from the Diving Fish score tracker. Some features may be limited.
:::

## Basic Usage

Once set up, try these common commands:

| Command | Description |
|---------|-------------|
| `/help` | View all available commands |
| `/b50` | Generate your Top 50 chart |
| `/maitoday` | View today's fortune & recommended songs |

## Next Steps

- See [Username & Friend System](/en/guide/identity-and-friends) to learn how to set up a username and manage friends
- See [Command Reference](/en/commands/basic) for all available commands
