---
description: Generate maimai DX level constant, dan-i, and completion tables with McMai, and find the charts that raise your rating most, including new-version mode and rating targets.
---

# Level Tables

## Level Constant Table

Query the constant table (as an image) for a specified level.

**Command:** `/rating <level> [server]`

**Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level | 1–15, optionally with `+` | `13+`, `14` |
| Server | Region (optional) | `cn`, `jp`, `intl` |

**Examples:**

| Command |
|---------|
| `/rating 13+` |
| `/rating 14` |
| `/rating 14 jp` |

---

## Dan-i Table

Query the songs in a specified Dan-i (rank) course, with your scores on each. You can only query your own.

**Command:** `/dancourse <rank name> [server] [version]`

**Parameters:**

| Parameter | Description |
|-----------|-------------|
| Rank name | e.g. `真初段`, `真十段`, `真皆伝` |
| Server | Optional, `cn`, `jp`, `intl` (or `国服`, `日服`, `国际服`). View another server's courses |
| Version | Optional, view a past version's courses (defaults to the current version). Use a plate character (such as `鏡`, `丸`) or an English version name (such as `prism`, `circle+`); for the China Server you can also use the year (such as `2025` or `舞萌DX2025`) |

Server and version can go in either order.

**Examples:**

| Command | Description |
|---------|-------------|
| `/dancourse 真十段` | 真十段 for the current version |
| `/dancourse 真皆伝 jp` | 真皆伝 on the Japan Server, current version |
| `/dancourse 真八段 jp circle` | 真八段 from the Japan Server's CiRCLE version |
| `/dancourse 真十段 cn 2025` | 真十段 from the China Server's 舞萌DX 2025 |

::: tip Available versions
- **Japan and International Servers**: SPLASH PLUS and later.
- **China Server**: 舞萌DX 2023 and later. China Server courses use its actual songs, which differ from the Japan Server version of the same name.

If the version you enter isn't available, the bot lists the versions that server offers.
:::

::: tip Cross-server tables
The server argument only chooses which server's courses to show. Your scores always come from the server you selected with `/switchserver`. Charts that exist on that server but haven't been released on yours are marked "N/A", separately from charts you haven't played.
:::

---

## Completion Table

View completion progress for a grade evaluation or plate.

**Command:** `/plate <grade or plate> [plate level] [filters] [server] [#username]`

**Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| Grade or plate | Numeric level (`13`, `14+`), optionally followed by `fc`, `fcp`, `ap`, or `app` to mark FC/AP status instead; or a version name (`circle`, `plus`, etc.) or plate character (`真`, `丸`, etc.) | `13+`, `13 ap` |
| Plate level | Required for plate mode (`fc`, `sss`, `ap`, `fdx`, or `极`, `将`, `神`, `舞舞`); for the 霸者 plate, just write `霸者` | `sss` |
| Filters | Optional, plate mode only. A level (`13`, `12+`; several allowed) or a difficulty (`basic`, `advanced`, `expert`, `master`, `remaster`; `remaster` only for the `maimai` and `ba` plates) | `expert` |
| Server | Optional, view another server's table (`cn`, `jp`, `intl`). Can go anywhere in the arguments | `jp` |
| #username | Query another player (requires their permission) | `#Sakura` |

A plate character and its plate level can be written together, e.g. `/plate 丸将`. With filters, the image shows only the matching charts, and the remaining count covers only that range.

**Examples:**

| Command |
|---------|
| `/plate 13` |
| `/plate 13 ap` |
| `/plate 14 #Sakura` |
| `/plate plus fc` |
| `/plate circle sss` |
| `/plate 丸将` |
| `/plate circle sss #Sakura` |
| `/plate 霸者` |
| `/plate festival sss jp` |
| `/plate festival sss expert 12+` |
| `/plate maimai sss 13` |

::: tip maimai and ba plates
Without a level, charts at Lv.13 and below list only the ones you haven't finished. Add a level to see its full list, e.g. `/plate maimai sss 13`.
:::

::: tip Cross-server tables
The server argument only chooses which server's song list to show. Scores always come from the server the queried player selected with `/switchserver`. For example, an International Server player sending `/plate festival sss jp` sees the Japan Server's FESTiVAL plate songs, filled in with their International Server scores. Charts that exist on that server but haven't been released on the scores' server are marked "N/A", separately from charts not yet played.
:::

---

## Rating Improvement

Query which songs you should play to improve your current Rating.

**Command:** `/risescore <level or constant> <score> [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level or constant | Target level or constant | `14`, `13.7` |
| Score | Target score value | `10` |
| Page | Optional, for pagination | `2` |

Add `#username` to query another player (requires them to allow B50 queries).

**Examples:**

| Command |
|---------|
| `/risescore 14 5` |
| `/risescore 13.7 9 2` |

::: tip
The result image distinguishes two kinds of boost: **Rating** is the points your overall game Rating gains once you hit the target for that difficulty; **single-song ra** is the points that chart's single-song ra gains (for players who have already reached their theoretical Rating).
:::

::: tip The image also shows
- **Rating trend** (on the China Server, requires NET updates): the top of the image shows your last 30 days: net Rating change, Rating-up plays and days, best single day and best single play, and a Rating curve marking each gain. When querying another player, this part appears only if they allow score queries.
- **Personalized pick**: one recommended chart to raise your Rating. For more, see [Rating Targets](#rating-targets) below.
:::

### New-Version Rating Mode

Shows which songs added in your server's latest version can raise your Rating. This mode renders a single image and is not paginated.

**Command:** `/risescore new`

Adding `new` anywhere in the arguments enters this mode; all other arguments are ignored.

### Rating Targets

Based on your scores, recommends 3 Rating targets each from old-version and new-version charts, showing the target rank, how much your Rating would rise, and why each was picked (e.g. "Lower chart load for its constant", "Common in B50 at your rating", "Fits your Chart Affinity"). Charts that need extra care are also tagged, such as "Low note count" or "Concentrated BREAKs".

**Command:** `/risescore picks`

Adding `picks` anywhere in the arguments enters this mode; all other arguments are ignored.

::: tip
- Targets are sorted by Rating increase and relative difficulty; reaching them isn't guaranteed. Once your [Chart Affinity](/en/commands/analysis#chart-affinity) is established it's taken into account; otherwise only chart difficulty is adjusted for.
- When there are enough candidates, the picks rotate daily.
- You need a fair number of scores near your level to get picks. If you don't have enough yet, use `/risescore <level> <score>` instead, or send `/practice` for calibration charts.
:::
