# Progress

## Level Progress / Plate Progress

Query achievement progress or score stats for a specified level or version plate, with filters and paging.

**Command:** `/progress <level or plate> [target] [filter] [page]`

There are three modes: a level plus a target gives **level progress**, a level alone gives **level stats**, and a plate character plus a plate type gives **plate progress**.

### Level Mode

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level | `1`–`15`, optionally with `+` | `13+` |
| Target | Grade name, FC / sync target, or DX star level | `SSS`, `fc`, `5star` |
| Completed/unfinished/unplayed | Optional, filter by status | `completed`, `unfinished`, `unplayed` |
| Page | Optional, default page 1 | `2` |

**Grade Reference:**

| Grade | Achievement Rate |
|-------|-----------------|
| `S` | ≥ 97.0000% |
| `S+` | ≥ 98.0000% |
| `SS` | ≥ 99.0000% |
| `SS+` | ≥ 99.5000% |
| `SSS` | ≥ 100.0000% |
| `SSS+` | = 101.0000% |

**Sync/FC keywords:** `fc`, `fc+`, `ap`, `ap+`, `fs`, `fs+`, `fdx`, `fdx+`

**DX star target:** `1star` – `7star` (e.g. `5star` means DX star ≥ 5; `7star` is theoretical DXScore 100%)

**Examples:**

| Command |
|---------|
| `/progress 13+ SSS` |
| `/progress 14 fc` |
| `/progress 14 5star` |
| `/progress 13+ SS completed` |
| `/progress 14 ap unfinished 2` |

::: tip What the image shows
A completion ring and a difficulty × constant completion matrix; unfinished charts show how far they are from the target.
:::

### Level Stats Mode

Leave out the target to see score stats for that level.

**Format:** `/progress <level> [played/unplayed] [page]`

The stats cover play coverage and average achievement, grade / combo / sync / DX star distributions (unplayed charts included), and the play count and average achievement for each difficulty × constant. Add `played` or `unplayed` to page through those charts.

**Examples:**

| Command | Description |
|---------|-------------|
| `/progress 13+` | Score stats for 13+ |
| `/progress 13+ played` | 13+ charts you've played |
| `/progress 13+ unplayed 2` | 13+ charts you haven't played, page 2 |

### Plate Mode

Query completion progress for a version plate (e.g. `circle sss`, `prism ap`).

**Format:** `/progress <version> <plate level>`

| Plate Level | Requirement |
|-------------|-------------|
| `fc` | FC all songs |
| `sss` | SSS all songs |
| `ap` | AP all songs |
| `fdx` | FDX all songs |

Use English version name aliases such as `circle`, `prism`, `plus`, `buddies`, `festival`, `universe`, `splash`, and `dx`.

**Examples:**

| Command |
|---------|
| `/progress circle sss` |
| `/progress plus fc` |
| `/progress prism ap 2` |

::: tip
For plate progress, use the English version alias with a plate level, e.g. `/progress circle sss`.
:::

---

## Genre Progress

Query progress or score stats by song genre.

**Command:** `/genreprog <genre> [target] [filter] [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Genre | Genre name | `anime`, `touhou`, `maimai`, `vocaloid`, `game`, `chunithm`, `utage` |
| Target | Optional. Grade name or FC / sync target; leave it out for the genre's score stats (same as [Level Stats Mode](#level-stats-mode)) | `SSS`, `fc`, `ap` |
| Filter | Optional. With a target: `completed`, `unfinished`, `unplayed`; without a target: `played`, `unplayed` | `completed` |
| Page | Optional, default page 1 | `2` |

**Examples:**

| Command |
|---------|
| `/genreprog anime SSS` |
| `/genreprog touhou SS 2` |
| `/genreprog maimai fc completed 2` |
| `/genreprog anime` |
| `/genreprog utage played` |

---

## Score List

Query your full score list for a specified level or constant, with multi-dimensional filtering and sorting.

**Command:** `/scorelist [level or constant] [filters...] [sort] [page]`

**Filters (stackable):**

| Type | Values |
|------|--------|
| Combo | `ap`, `ap+` / `app`, `fc`, `fc+` / `fcp`, `cun` (near miss) |
| Sync | `fs`, `fs+` / `fsp`, `fdx`, `fdx+` / `fdxp` |
| Grade | `sss+`, `sss`, `ss+`, `ss`, `s+`, `s`, `a`, `aa`, `aaa`, `b`, `bb`, `bbb`, etc. |
| Chart type | `dx`, `sd` |
| New / old | `new` (new version), `old` (old version) |
| DX star level | `1star` – `7star` (`7star` = theoretical DXScore 100%) |
| Game version | Plate character (e.g. `双`, `鏡`, `丸`) or English version alias (e.g. `buddies`, `prism`; use `deluxe` for the original でらっくす, since bare `dx` means DX charts); Plus versions end with `+`, e.g. `buddies+` |

**Operators (Combo / Sync / Grade only):**

| Form | Meaning |
|------|---------|
| Bare (e.g. `fc`, `sss`) | Combo / Sync include higher tiers (`fc` includes FC+, AP, etc.); Grade is an exact match (`sss` means SSS only, not SSS+) |
| `=` (e.g. `=fc`) | Exact match, e.g. `=fc` shows only charts that are exactly FC (not yet FC+) |
| `>=` (e.g. `>=s`) | This tier and above, e.g. `>=s` shows S and higher |

If an argument isn't recognized, the bot tells you which one and suggests what you may have meant. The result image lists the conditions you queried and breaks down the matching scores by grade, combo, sync, and DX stars.

**Sort:** `sort:X` (descending by default), or `sort:X+` (ascending) / `sort:X-` (descending)

Sortable fields: `ra` (Rating contribution), `acc` (achievement rate), `dx` (DX score), `ds` (constant)

**Examples:**

| Command | Description |
|---------|-------------|
| `/scorelist 13+` | List all 13+ scores |
| `/scorelist 14 fc` | Filter FC and above |
| `/scorelist 14 =fc` | Show only exactly FC (not FC+) |
| `/scorelist 14 ap 2` | Filter AP and above, page 2 |
| `/scorelist 14 dx sss` | DX charts with exactly SSS (not SSS+) |
| `/scorelist 14 dx >=sss` | DX charts with SSS and above |
| `/scorelist >=s` | All scores at S and above |
| `/scorelist 14 sort:ra-` | Sort by Rating contribution descending |
| `/scorelist 14 1star` | Filter DX star level 1 |
| `/scorelist buddies` | Filter songs from the BUDDiES version |
| `/scorelist buddies+` | Filter songs from the BUDDiES PLUS version |
| `/scorelist deluxe` | Filter songs from the original でらっくす version |
