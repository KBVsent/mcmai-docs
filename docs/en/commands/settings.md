# Personal Settings

## View Profile Card

View your profile card (a card-style image showing your best scores).

**Command:** `/topboard [region]`

| Parameter | Description |
|-----------|-------------|
| Region | Optional, specify region (`cn`, `jp`, `intl`) |

---

## Profile Display Settings

Customize the fields displayed on your profile card.

**Command:** `/topsetting <action> [field]`

**Actions:**

| Action | Description |
|--------|-------------|
| `status` (or no argument) | View current settings |
| `show` | Show the specified field |
| `hide` | Hide the specified field |
| `reset` | Reset all settings to default |

**Available Fields:**

| Field | Description |
|-------|-------------|
| `nickname` | In-game nickname |
| `playcount` | Total play count |
| `本版本游玩次数` | Play count for the current version |
| `awake` | Total awakenings |
| `mile` | maimai mileage |
| `gift` | Partner gift count |
| `circle` | Circle / group |
| `banner` | Top banner image |
| `all` | Operate on all fields at once |

**Examples:**

| Command | Description |
|---------|-------------|
| `/topsetting` | View current settings |
| `/topsetting show playcount` | Show play count |
| `/topsetting hide nickname` | Hide nickname |
| `/topsetting show banner` | Show top banner |
| `/topsetting hide all` | Hide all fields |
| `/topsetting reset` | Reset to default |

---

## Privacy Settings

Control others' ability to query your data. See also [Account & Server → Privacy Settings](/commands/account#privacy-settings).

**Command:** `/privacy <action> [target]`

**Targets:**

| Target | Description |
|--------|-------------|
| `all` / `query` | Master switch — controls all query permissions |
| `b50` | Best 50 and other similar queries |
| `score` | Score (info) queries |
| `progress` | Completion table / progress queries |

**Examples:**

| Command | Description |
|---------|-------------|
| `/privacy show` | View current permission config |
| `/privacy off all` | Block all queries from others |
| `/privacy off score` | Block only score queries from others |
| `/privacy reset all` | Reset all query permissions to default |
