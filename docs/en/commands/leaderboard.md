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

::: tip
The `/rank` and `/grank` images now include the chart's **score distribution** (global and this group).
:::

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

::: tip
The group Rating ranking image now includes the group's Rating **distribution**, plus overview stats such as total players, average, highest, and median.
:::

---

## Join Group Leaderboard

Add yourself to the current group's leaderboard. Your data will appear in `/grank` and `/grating` after joining.

**Command:** `/gjoin`

---

## Leave Group Leaderboard

Remove yourself from the current group's leaderboard.

**Command:** `/gleave`

---

## Group Leaderboard Management (Owner / Admins)

Group owners or admins can remove a member from this group's leaderboard, or restore them.

::: info QQ Official groups only
This feature is available only to group owners / admins on the QQ Official platform.
:::

**Commands:** `/gban <#query ID or #username>`, `/gunban <#query ID or #username>`

**Aliases:** gban = `踢出群榜` = `移出群榜`; gunban = `恢复群榜` = `移回群榜`

**Note:** Copy the target member's `#`-prefixed query ID or username exactly as shown on the group leaderboard. A removed member cannot rejoin on their own; an admin must restore them with `/gunban`.

**Examples:**

| Command | Description |
|---------|-------------|
| `/gban #mc00000` | Remove the member from this group's leaderboard |
| `/gban #Sakura` | Same, using a username |
| `/gunban #mc00000` | Restore the member to this group's leaderboard |
