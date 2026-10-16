# Level Tables

## Level Constant Table

Query the constant table (as an image) for a specified level or constant.

**Command:** `/rating <level or constant> [server]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level or constant | Level (`13`, `14+`) or constant range | `13+`, `14.0` |
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

| Parameter | Description |
|-----------|-------------|
| Rank name | e.g. `真初段`, `真十段`, `真皆伝` |
| Server | Optional, `cn`, `jp`, `intl`. View another server's courses |
| Version | Optional, view a past version's courses (defaults to the current version). Use a version name such as `prism`, `circle`, or `circle+` |

Server and version can go in either order.

**Examples:**

| Command | Description |
|---------|-------------|
| `/dancourse 真十段` | 真十段 for the current version |
| `/dancourse 真皆伝 jp` | 真皆伝 on the JP server, current version |
| `/dancourse 真八段 jp circle` | 真八段 from JP's CiRCLE version |

::: tip Available versions
- **JP / INTL**: SPLASH PLUS and later.
- **CN**: 舞萌DX 2023 and later. CN courses use the actual CN songs, which differ from the same-named JP version.

If the version you enter isn't available, the bot lists the versions that server offers.
:::

::: tip Cross-server tables
The server argument only chooses which server's courses to show. Your scores always come from the server you selected with `/switchserver`. Charts that exist on that server but haven't been released on yours are marked "N/A", separately from charts you haven't played.
:::

---

## Completion Table

View completion progress for a grade evaluation or plate.

**Command:** `/plate <grade or plate> [plate level] [server] [#username]`

**Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| Grade or plate | Numeric level (`13`, `14+`) or version name (`circle`, `plus`, etc.) | `13+` |
| Plate level | Required for plate mode (`fc`, `sss`, `ap`, `fdx`) | `sss` |
| Server | Optional, view another server's table (`cn`, `jp`, `intl`). Can go anywhere in the arguments | `jp` |
| #username | Query another player (requires their permission) | `#Sakura` |

**Version name aliases:** `magical` (MAGiCAL), `circle` (丸), `plus` (真), `prism` (鏡), `buddies` (双), `festival` (祭), `universe` (宙), `splash` (爽), `dx` (熊), and their `p` variants (e.g. `circlep`, `prismp`).

**Examples:**

| Command |
|---------|
| `/plate 13` |
| `/plate 14 #Sakura` |
| `/plate plus fc` |
| `/plate circle sss` |
| `/plate circle sss #Sakura` |
| `/plate festival sss jp` |

::: tip Cross-server tables
The server argument only chooses which server's song list to show. Scores always come from the server the queried player selected with `/switchserver`. For example, an INTL player sending `/plate festival sss jp` sees JP's FESTiVAL plate songs, filled in with their INTL scores. Charts that exist on that server but haven't been released on the scores' server are marked "N/A", separately from charts not yet played.
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
- **Rating trend** (JP / INTL only): the top of the image shows your last 30 days: net Rating change, Rating-up plays and days, best single day and best single play, and a Rating curve marking each gain. When querying another player, this part appears only if they allow score queries.
- **Personalized pick**: one recommended chart to raise your Rating. For more, see [Rating Targets](#rating-targets) below.
:::

### New-Version Rating Mode

Shows which songs added in your server's latest version can raise your Rating. This mode renders a single image and is not paginated.

**Command:** `/risescore new`

Adding `new` anywhere in the arguments enters this mode; all other arguments are ignored.

### Rating Targets

Based on your scores, recommends 3 Rating targets each from old-version and new-version charts, showing the target rank, how much your Rating would rise, and why each was picked (e.g. "0.20% to SSS", "Easier for its constant", "Fits your Chart Affinity").

**Command:** `/risescore picks`

Adding `picks` anywhere in the arguments enters this mode; all other arguments are ignored.

::: tip
- Targets are sorted by Rating increase and relative difficulty; reaching them isn't guaranteed. Once your [Chart Affinity](/en/commands/analysis#chart-affinity) is established it's taken into account; otherwise only chart difficulty is adjusted for.
- You need a fair number of scores near your level to get picks. If you don't have enough yet, use `/risescore <level> <score>` instead, or send `/practice` for calibration charts.
:::
