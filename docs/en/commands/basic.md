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
| `zh` (or `cn`) | Simplified Chinese (default) |
| `zh-Hant` (or `tw`) | Traditional Chinese (Taiwan) |
| `zh-Hant-HK` (or `hk`) | Traditional Chinese (Hong Kong) |
| `en` (or `english`) | English |
| `ja` (or `jp`) | Japanese |

Run without arguments to view your current language setting.

**Examples:**

| Command | Description |
|---------|-------------|
| `/lang` | View current language |
| `/lang en` | Switch to English |
| `/lang ja` | Switch to Japanese |

::: tip Discord users
On Discord, if the bot can't tell your language yet (it replies in English by default), replies with buttons also show a 🌐 language dropdown. Pick your language there; it works the same as `/lang`.
:::

---

## Server Status

View the real-time online status and heartbeat monitoring of each maimai DX region.

**Command:** `/status`

---

## Region-Exclusive Features

List the commands that are exclusive to the region you are currently on.

**Command:** `/serverfeat`

**Notes:** Some features are only available in specific regions. This command lists the exclusive commands available on your current region; if there are none, it points you to `/switchserver` to change region.

| Region | Exclusive command |
|--------|-------------------|
| Japan (JP) | `/aime` — view / switch Aime card slots<br>`/recent` — play history by credit<br>`/ralog` — Rating curve and Rating-up history |
| International (INTL) | `/recent` — play history by credit<br>`/ralog` — Rating curve and Rating-up history |
| China (CN) | `/pc50` — top 50 scores by play count |
