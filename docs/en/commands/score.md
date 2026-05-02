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

## Score Tolerance

Query the deduction per note type for a given difficulty, and the DX score tolerance for each DX star level.

**Command:** `/scoreline <song ID> [difficulty]`

| Parameter | Description | Default |
|-----------|-------------|---------|
| Song ID | Numeric ID | — |
| Difficulty | `green`, `yellow`, `red`, `purple`, `white` | `purple` |

**Examples:**

| Command |
|---------|
| `/scoreline 11451` |
| `/scoreline 11820 white` |

---

## Chart Statistics

Query AP rate, FC rate, play rate and other statistics for a song's charts.

**Command:** `/rankstats <song ID or name> [region]`

| Parameter | Description | Options |
|-----------|-------------|---------|
| Song ID or name | Numeric ID or title/alias | — |
| Region | Filter by region (optional) | `cn`, `jp`, `intl` |

**Examples:**

| Command |
|---------|
| `/rankstats 11451` |
| `/rankstats 11451 jp` |
| `/rankstats 11451 cn` |
