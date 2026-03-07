# Progress

## Level Progress

Query achievement progress for all songs at a specified level, filterable by grade and category.

**Command:** `/进度 <level or constant> <grade> [filter] [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level or constant | `12`, `13+`, `14.0`, etc. | `13+` |
| Grade | Target grade | `SSS`, `SS`, `S`, `A`, etc. |
| Filter | Optional, filter by `ap`, `fc`, etc. | `fc` |
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
| `/进度 14 SSS+ fc` |
| `/进度 13+ SS 2` |

---

## Genre Progress

Query progress by song genre (pop, Touhou Project, etc.).

**Command:** `/分类进度 <genre> <grade> [filter] [page]`

| Parameter | Description |
|-----------|-------------|
| Genre | Genre name |
| Grade | Target grade (same as level progress) |
| Filter | Optional, `ap`, `fc`, etc. |
| Page | Optional, default page 1 |

**Examples:**

| Command |
|---------|
| `/分类进度 流行与动漫 SSS` |
| `/分类进度 东方Project SS` |

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
