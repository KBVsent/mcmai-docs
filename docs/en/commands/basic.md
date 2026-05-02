# Basic Functions

## Help

View a list of all available commands (rendered as an image).

**Command:** `/help`

---

## Today's Fortune

View today's maimai fortune, randomly generated each day.

**Command:** `/maitoday`

---

## Random Song

Randomly recommend a song. Can be filtered by type, difficulty color, or level.

**Command:** `/randommusic [type] [color] [level]`

**Parameters:**

| Parameter | Description | Options |
|-----------|-------------|---------|
| type | Song type (optional) | `dx`, `sd` |
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
