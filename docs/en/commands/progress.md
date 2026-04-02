# Progress

## Level Progress

Query achievement progress for all songs at a specified level, filterable by achievement/sync target and completion status.

**Command:** `/进度 <level or constant> <achievement/sync target> <completed/unfinished> [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level or constant | `12`, `13+`, `14.0`, etc. | `13+` |
| Achievement/sync target | Target achievement or sync threshold | `99.5`, `fc`, `ap`, `SSS` |
| Completed/unfinished | `已完成` or `未完成` | `已完成` |
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

**Examples:**

| Command |
|---------|
| `/进度 13+ SSS` |
| `/进度 14 fc` |
| `/进度 13+ SS 2` |
| `/进度 14 ap 已完成 2` |

---

## Genre Progress

Query progress by song genre (pop, Touhou Project, etc.).

**Command:** `/分类进度 <genre> <achievement/sync target> <completed/unfinished> [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Genre | Genre name | `动漫`, `东方` |
| Achievement/sync target | Target achievement or sync threshold | `99.5`, `fc`, `ap`, `SSS` |
| Completed/unfinished | `已完成` or `未完成` | `已完成` |
| Page | Optional, default page 1 | `2` |

**Examples:**

| Command |
|---------|
| `/分类进度 动漫 SSS` |
| `/分类进度 东方 SS 2` |
| `/分类进度 舞萌 fc 已完成 2` |

---

## Score List

Query your full score list for a specified level or constant.

**Command:** `/分数列表 <level or constant> [filter] [page]`

| Parameter | Description | Options |
|-----------|-------------|---------|
| Level or constant | Required | `13`, `14+`, `14.0` |
| Filter | Optional, filter by FC/AP | `fc`, `fc+` (or `fcp`), `ap`, `寸` |
| Page | Optional, default page 1 | `2` |

**Examples:**

| Command |
|---------|
| `/分数列表 13+` |
| `/分数列表 14 fc` |
| `/分数列表 14 ap 2` |
