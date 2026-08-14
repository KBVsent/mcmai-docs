# Getting Started

McMai is a full-featured maimai DX assistant Bot plugin supporting CN, JP, and INTL region data queries.

## Add the Bot

McMai is available on QQ, Discord, and LINE. **Scan the QR code or tap the button** below to get started:

| QQ | Discord | LINE |
| :---: | :---: | :---: |
| <img src="/QQBot.png" alt="McMai QQ Bot QR Code" width="200" /> | <img src="/Discord.png" alt="McMai Discord Bot QR Code" width="200" /> | <img src="/Line.jpg" alt="McMai LINE Official Account QR Code" width="200" /> |
| Add the bot as a friend<br>or invite it to a group | Invite the bot to your server<br>or install it as a user app | Add the official account<br>or invite it to a group chat |
| [🔗 Add](https://qun.qq.com/qunpro/robot/qunshare?robot_appid=102076996&robot_uin=3889001355) | [🔗 Invite](https://discord.com/oauth2/authorize?client_id=1455121113758830763) | [🔗 Add](https://line.me/R/ti/p/@819jucvv) |

More platforms (Telegram, etc.) will be supported in the future.

## Join an Official Group

You can also join an official group to **use the bot without installing anything**, and share feedback with the community:

| QQ Group | Official Discord Server | LINE Group |
| :---: | :---: | :---: |
| <img src="/QQ_Group.png" alt="McMai Official QQ Group QR Code" width="200" /> | <img src="/Discord_Guild.png" alt="McMai Official Discord Server QR Code" width="200" /> | <img src="/Line_Group.png" alt="McMai Official LINE Group QR Code" width="200" /> |
| Official group 1006348059 | Join the official server<br>and use it without installing | Join the official group<br>where the bot is already available |
| [🔗 Join](https://qun.qq.com/universal-share/share?ac=1&authKey=a%2B7GQ%2FsIH%2FMzeTpaTR70%2FdDEvTk4%2Firp8W%2FvL1JvLBtM7AuNog3vs9S7uApshxyL&busi_data=eyJncm91cENvZGUiOiIxMDA2MzQ4MDU5IiwidG9rZW4iOiJnRFhqczMxYlZzQTVSNm9SZ1ZkOU1WNjJobTd4QzdyR3lyS1lwb0JOTlZTYmlSeVU1SnNKV2Z1bTVLYjBvR3BJIiwidWluIjoiMTQ4MTYxODMxOSJ9&data=m-7IeXvdz1a8EKGoCkMeid1DwluG3vH6z1sdNVC641CqCINiRQEE7WY-rowa5ZqB2blPVRLHqmPina6U02PZSw&svctype=4&tempid=h5_group_info) | [🔗 Join](https://discord.gg/fvAU8sTcWz) | [🔗 Join](https://line.me/ti/g/EKt3QG4bbX) |

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
