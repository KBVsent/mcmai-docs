# Leaderboard

## Global Song Ranking

Query the global achievement rate ranking for a specific song across all players.

**Command:** `/rank <song ID or name> [difficulty] [region]`

**Parameters:**

| Parameter | Description | Default |
|-----------|-------------|---------|
| Song ID or name | Numeric ID or song title/alias | — |
| Difficulty | `green`, `yellow`, `red`, `purple`, `white` | `purple` (Master) |
| Region | `cn`, `jp`, `intl` | All regions |

**Examples:**

| Command |
|---------|
| `/rank 11451` |
| `/rank 11451 purple` |
| `/rank 11451 white jp` |
| `/rank 11451 purple cn` |

---

## Group Song Ranking

Query the achievement rate ranking for players in the current group.

**Command:** `/grank <song ID or name> [difficulty] [region]`

Same parameters as `/rank`.

**Examples:**

| Command |
|---------|
| `/grank 11451` |
| `/grank 11451 white cn` |

---

## Group Rating Ranking

Query the Rating ranking of players in the current group.

**Command:** `/grating [region]`

| Parameter | Description | Options |
|-----------|-------------|---------|
| region | Filter by region (optional) | `cn`, `jp`, `intl` |

**Examples:**

| Command |
|---------|
| `/grating` |
| `/grating jp` |

---

## Join Group Leaderboard

Add yourself to the current group's leaderboard. Your data will appear in `/grank` and `/grating` after joining.

**Command:** `/gjoin`

---

## Leave Group Leaderboard

Remove yourself from the current group's leaderboard.

**Command:** `/gleave`
