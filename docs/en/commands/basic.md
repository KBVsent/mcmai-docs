# Basic Functions

## Help

View a list of all available commands.

**Command:** `/帮助`

---

## Today's Fortune

View today's maimai fortune, randomly generated each day.

**Command:** `/今日舞萌`

---

## Random Song

Randomly recommend a song. Can be filtered by type, difficulty color, or level.

**Command:** `/随机歌曲 [type] [color] [level]`

**Parameters:**

| Parameter | Description | Options |
|-----------|-------------|---------|
| type | Song type (optional) | `dx`, `sd` (or `标准`) |
| color | Difficulty color (optional) | `绿` (Green), `黄` (Yellow), `红` (Red), `紫` (Purple), `白` (White) |
| level | Level (optional) | `12`, `13+`, etc. |

**Examples:**

| Command |
|---------|
| `/随机歌曲 dx 紫 14` |
| `/随机歌曲 13+` |
| `/随机歌曲 sd` |

::: tip
Parameter order is flexible. You can combine them in any order, for example `/随机歌曲 14 dx` and `/随机歌曲 dx 14` produce the same result.
:::
