# Leaderboard

## Global Song Ranking

Query the global achievement rate ranking for a specific song across all players.

**Command:** `/排行 <song ID or name> [difficulty] [region]`

**Parameters:**

| Parameter | Description | Default |
|-----------|-------------|---------|
| Song ID or name | Numeric ID or song title/alias | — |
| Difficulty | `绿`, `黄`, `红`, `紫`, `白` | 紫 (Master) |
| Region | `cn`, `jp`, `intl` | All regions |

**Examples:**

| Command |
|---------|
| `/排行 11451` |
| `/排行 11451 紫` |
| `/排行 11451 白 jp` |
| `/排行 11451 紫 cn` |

---

## Group Song Ranking

Query the achievement rate ranking for players in the current group.

**Command:** `/群排行 <song ID or name> [difficulty] [region]`

Same parameters as `/排行`.

**Examples:**

| Command |
|---------|
| `/群排行 11451` |
| `/群排行 11451 白 cn` |

---

## Group Rating Ranking

Query the Rating ranking of players in the current group.

**Command:** `/群rating [region]`

| Parameter | Description | Options |
|-----------|-------------|---------|
| region | Filter by region (optional) | `cn`, `jp`, `intl` |

**Examples:**

| Command |
|---------|
| `/群rating` |
| `/群rating jp` |

---

## Join Group Leaderboard

Add yourself to the current group's leaderboard. Your data will appear in `/群排行` and `/群rating` after joining.

**Command:** `/加入群榜`

---

## Leave Group Leaderboard

Remove yourself from the current group's leaderboard.

**Command:** `/退出群榜`
