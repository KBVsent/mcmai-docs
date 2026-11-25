---
description: Basic McMai commands for maimai DX, including help, today's fortune, random songs, language switching, server status, and checking which commands your account cannot use.
---

# Basic Functions

## Help

View a list of all available commands (rendered as an image).

**Command:** `/help`

---

## Today's Fortune

View today's maimai fortune with its Do and Avoid lists, plus a recommended chart for the day.

**Command:** `/maitoday`

::: tip Personalized pick
If you have scores, the recommended chart is chosen from your scores and the day's Do and Avoid lists: a Rating target, practice, a new chart, an overreach, or a chill pick. Anything on the day's Avoid list is skipped. If your scores can't be read, a random chart from your server's song list is picked instead.
:::

---

## Random Song

Randomly recommend a song. Can be filtered by type, difficulty color, or level.

**Command:** `/randommusic [type] [color] [level]`

**Parameters:**

| Parameter | Description | Options |
|-----------|-------------|---------|
| type | Song type (optional) | `dx`, `sd` (or `standard`) |
| color | Difficulty color (optional) | `green`, `yellow`, `red`, `purple`, `white` |
| level | Level (optional) | `12`, `13+`, etc. |

**Examples:**

| Command |
|---------|
| `/randommusic dx purple 14` |
| `/randommusic 13+` |
| `/randommusic sd` |

::: tip
Parameter order is flexible. You can combine them in any order, for example `/randommusic 14 dx` and `/randommusic dx 14` produce the same result.

Songs are picked from your current server's song list (follows `/switchserver`).
:::

---

## Switch Language

Switch the Bot's reply language.

**Command:** `/lang [language code]`

**Parameters:**

| Code | Language |
|------|----------|
| `zh` (or `cn`, `简体`) | Simplified Chinese |
| `zh-Hant` (or `tw`, `繁体`) | Traditional Chinese (Taiwan) |
| `zh-Hant-HK` (or `hk`, `港繁`) | Traditional Chinese (Hong Kong) |
| `en` (or `english`) | English |
| `ja` (or `jp`, `日语`) | Japanese |

Run without arguments to view your current language setting.

When no language is set, the bot replies in your client's language. If that can't be determined, Discord defaults to English, LINE to Japanese, and QQ to Simplified Chinese.

**Examples:**

| Command | Description |
|---------|-------------|
| `/lang` | View current language |
| `/lang zh` | Switch to Simplified Chinese |
| `/lang en` | Switch to English |
| `/lang ja` | Switch to Japanese |

::: tip Discord users
On Discord, if the bot can't tell your language yet (it replies in English by default), replies with buttons also show a 🌐 language dropdown. Pick your language there; it works the same as `/lang`.
:::

---

## Server Status

View the real-time status of China Server maimai DX services, including the last 24 hours of availability for NET, the WeChat official account, and content delivery, plus cabinet self-check results and delivery progress.

**Command:** `/status`

---

## Region-Exclusive Features

Check which commands the current account's data cannot support.

**Command:** `/serverfeat`

**Notes:** Every command works in every region, but some depend on where the data comes from: `/recent` and `/ralog` need play records, `/pc50` needs play counts, and `/topboard` needs topboard information. This command lists what the current account (region and update method, such as "China Server · MAID") cannot do and how to fill the gap, and points you to `/aime` to switch accounts and `/switchserver` to change region.
