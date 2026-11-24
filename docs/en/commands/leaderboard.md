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
| `/rank 潘多拉` |
| `/rank 11451 purple` |
| `/rank 11451 white jp` |
| `/rank 11451 purple cn` |

::: tip What the image includes
The chart's score distribution (global or this group).
:::

---

## Group Song Ranking

Query the achievement rate ranking for players in the current group.

**Command:** `/grank <song ID or name> [difficulty] [region] [page]`

Same parameters as `/rank`. Add a page number at the end to see lower ranks. The region parameter also accepts `all`, which lists scores from third-party sources such as [LXNS](/en/commands/account#lxns) and [custom data sources](/en/guide/custom-data-source) alongside the China, Japan, and International Servers: when a player has China, Japan, or International Server scores, those take precedence; only otherwise is the third-party source used, and the source is marked on the board.

**Examples:**

| Command |
|---------|
| `/grank 11451` |
| `/grank 潘多拉 purple` |
| `/grank 11451 white cn` |
| `/grank 11451 all` |
| `/grank 11451 2` |

::: tip Pages
`/grank` and `/grating` show 10 players per page, and the image tells you the command for the next page. On platforms that support buttons, tap the button to turn pages. Your own rank and the players around you appear only on page 1.
:::

---

## Group Rating Ranking

Query the Rating ranking of players in the current group.

**Command:** `/grating [region] [page]`

| Parameter | Description | Options |
|-----------|-------------|---------|
| region | Filter by region (optional); `all` also counts scores from third-party sources, with the same rules as [Group Song Ranking](#group-song-ranking) | `cn`, `jp`, `intl` (or their Chinese names), `all` |
| page | 10 players per page (optional) | `2` |

**Examples:**

| Command |
|---------|
| `/grating` |
| `/grating jp` |
| `/grating 国服` |
| `/grating all` |
| `/grating jp 2` |

::: tip What the image includes
The group's Rating distribution, plus overview stats such as total players, average, highest, and median.
:::

::: tip Only records from the current version count
Each player on the board shows when they last updated their records. Players who haven't updated since their server's latest major version launched are left out of the ranking, the distribution, and the player count; the image notes how many were left out. If your own records are out of date, update them to get back on the board.
:::

---

## Join Group Leaderboard

You join the current group's leaderboard automatically when you update your data or query B50, B40, AP50, or PC50 in the group. Use this command to rejoin after leaving, or to join without running a query.

**Command:** `/gjoin`

---

## Leave Group Leaderboard

Remove yourself from the current group's leaderboard.

**Command:** `/gleave`

---

## Group Leaderboard Management (Owner / Admins)

Group owners or admins can remove a member from this group's leaderboard, or restore them.

::: info QQ platform only
This feature is available only to group owners / admins on the QQ platform.
:::

**Commands:** `/gban <#query ID or #username>`, `/gunban <#query ID or #username>`

**Note:** Copy the target member's `#`-prefixed query ID or username exactly as shown on the group leaderboard. A removed member cannot rejoin on their own; an admin must restore them with `/gunban`.

**Examples:**

| Command | Description |
|---------|-------------|
| `/gban #mc00000` | Remove the member from this group's leaderboard |
| `/gban #Sakura` | Same, using a username |
| `/gunban #mc00000` | Restore the member to this group's leaderboard |
