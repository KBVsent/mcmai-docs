# Progress

## Level Progress / Plate Progress

Query achievement progress for a specified level or version plate, filterable by completion status and with paging support.

**Command:** `/progress <level/constant/plate> <target> [completed/unfinished/unplayed] [page]`

### Level Mode

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level or constant | `12`, `13+`, `14.0`, etc. | `13+` |
| Achievement/sync target | Target achievement rate, FC/AP, or grade name | `99.5`, `fc`, `ap`, `SSS` |
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

**Examples:**

| Command |
|---------|
| `/progress 13+ SSS` |
| `/progress 14 fc` |
| `/progress 13+ SS completed` |
| `/progress 14 ap unfinished 2` |

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

Query progress by song genre.

**Command:** `/genreprog <genre> <achievement/sync target> [completed/unfinished/unplayed] [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Genre | Genre name | `anime`, `touhou`, `maimai`, `vocaloid`, `game`, `chunithm`, `utage` |
| Achievement/sync target | Target rate or grade | `99.5`, `fc`, `ap`, `SSS` |
| Completed/unfinished/unplayed | Optional, filter by status | `completed`, `unfinished`, `unplayed` |
| Page | Optional, default page 1 | `2` |

**Examples:**

| Command |
|---------|
| `/genreprog anime SSS` |
| `/genreprog touhou SS 2` |
| `/genreprog maimai fc completed 2` |

---

## Score List

Query your full score list for a specified level or constant, with multi-dimensional filtering and sorting.

**Command:** `/scorelist [level or constant] [filters...] [sort] [page]`

**Filters (stackable):**

| Type | Values |
|------|--------|
| Combo | `ap`, `fc`, `fc+` / `fcp`, `寸` (near miss) |
| Sync | `fs`, `fs+` / `fsp`, `fdx`, `fdx+` / `fdxp` |
| Grade | `sss+`, `sss`, `ss+`, `ss`, `s+`, `s`, `a`, `aa`, `aaa`, `b`, `bb`, `bbb`, etc. |
| Chart type | `dx`, `sd` |
| New / old | `new` (new version), `old` (old version) |
| DX star level | `1star` – `6star` |

Prefix a filter with `=` for exact match (Combo/Sync only), e.g. `=fc` shows only charts that are exactly FC (not yet FC+).

**Sort:** `sort:X` (ascending) or `sort:X+` / `sort:X-` (specify direction)

Sortable fields: `ra` (Rating contribution), `acc` (achievement rate), `dx` (DX score), `ds` (constant)

**Examples:**

| Command | Description |
|---------|-------------|
| `/scorelist 13+` | List all 13+ scores |
| `/scorelist 14 fc` | Filter FC and above |
| `/scorelist 14 =fc` | Show only exactly FC (not FC+) |
| `/scorelist 14 ap 2` | Filter AP and above, page 2 |
| `/scorelist 14 dx sss` | DX charts with SSS and above |
| `/scorelist 14 sort:ra-` | Sort by Rating contribution descending |
| `/scorelist 14 1star` | Filter DX star level 1 |
