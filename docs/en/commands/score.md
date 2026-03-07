# Score Queries

## Personal Song Data

Query personal play details for a song, including achievement rate, DX score, FC/FS status.

**Command:** `/info <song ID or name>`

| Parameter | Description |
|-----------|-------------|
| Song ID or name | Numeric ID or song title/alias |

Add `#username` to query another player's data.

**Examples:**

| Command |
|---------|
| `/info 11451` |
| `/info 11451 #Sakura` |

---

## Global Song Statistics

Query platform-wide statistics for a song, including average achievement rate and distribution.

**Command:** `/ginfo <song ID or name> [difficulty]`

| Parameter | Description | Default |
|-----------|-------------|---------|
| Song ID or name | Numeric ID or song title | — |
| Difficulty | `绿`, `黄`, `红`, `紫`, `白` | 紫 (Master) |

**Examples:**

| Command |
|---------|
| `/ginfo 11451` |
| `/ginfo 11451 白` |

---

## Score Tolerance Calculator

Calculate the number of allowable mistakes for a given difficulty and target score.

**Command:** `/分数线 <difficulty> <song ID> <target%>`

| Parameter | Description |
|-----------|-------------|
| Difficulty | `绿`, `黄`, `红`, `紫`, `白` |
| Song ID | Numeric ID |
| Target % | Target achievement rate, e.g. `101.0` |

**Examples:**

| Command |
|---------|
| `/分数线 紫 11451 101.0` |
| `/分数线 白 11451 100.5` |

---

## Chart Statistics

Query AP rate, FC rate, play rate and other statistics for a song's charts.

**Command:** `/谱面统计 <song ID or name> [region]`

| Parameter | Description | Options |
|-----------|-------------|---------|
| Song ID or name | Numeric ID or title/alias | — |
| Region | Filter by region (optional) | `cn`, `jp`, `intl` |

**Examples:**

| Command |
|---------|
| `/谱面统计 11451` |
| `/谱面统计 11451 jp` |
| `/谱面统计 11451 cn` |
