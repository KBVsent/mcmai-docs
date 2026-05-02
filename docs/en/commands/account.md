# Account & Server

## Bind SEGA ID

Link your QQ account to your SEGA ID for querying maimai NET data.

Only JP and INTL users need to bind an account. CN users update data via MAID directly.

**Command:** `/bind`

**Note:** This generates a dedicated binding link (or QR code). Open it in your browser to complete authorization.

::: warning Note
Each execution of `/bind` generates a new verification code. Complete the binding promptly.
:::

---

## Switch Server

Switch your current game region.

**Command:** `/switchserver <server>`

**Parameters:**

| Parameter | Description |
|-----------|-------------|
| `cn` | China server |
| `jp` | Japan server |
| `intl` | International server |

**Examples:**

| Command |
|---------|
| `/switchserver jp` |
| `/switchserver cn` |
| `/switchserver intl` |

---

## Set Username

Set a username so others can query your data using `#username`.

**Command:** `/setname [username|QQ number|clear|clearqq]`

**Examples:**

| Command | Description |
|---------|-------------|
| `/setname Sakura` | Set username to Sakura |
| `/setname` | View current username, query ID, and linked QQ |
| `/setname clear` | Clear username |
| `/setname 123456789` | Link a QQ number (5–11 digits) |
| `/setname clearqq` | Unlink the linked QQ number |

**Query ID:**

Every user has a system-assigned **query ID** (a short ID prefixed with `#mc`). Even without setting a username, others can query your data using this ID. After setting a username, both `#username` and the query ID work.

::: warning Note
When using a username as a query parameter, always prefix it with `#`.

For example: `/b50 #Sakura`, not `/b50 Sakura`.
:::

::: tip Review Process
Usernames go through a review after being set:

- **Pending**: Others can query using `#username`, but the username is partially masked in display
- **Approved**: Username is shown in full
- **Rejected**: Username is automatically deleted; you will need to set a new one

Usernames can only be changed once every **3 days**, so choose carefully.
:::

---

## Privacy Settings

Control whether others can query your game data.

**Command:** `/privacy <action> [target]`

**Actions:**

| Action | Description |
|--------|-------------|
| `show` / `status` | View current privacy settings |
| `on` / `allow` | Allow others to query the specified target |
| `off` | Block others from querying the specified target |
| `reset` | Reset the specified target to default (all allowed) |

**Targets:**

| Target | Description |
|--------|-------------|
| `all` / `query` | Master switch — controls all query permissions |
| `b50` | Best 50 and other similar queries |
| `score` | Score (info) queries |
| `progress` | Completion table / progress queries |

::: tip
Disabling `all` (master switch) prevents others from accessing any of your data, overriding all individual settings.
:::

**Examples:**

| Command | Description |
|---------|-------------|
| `/privacy show` | View current privacy status |
| `/privacy off all` | Block all queries from others |
| `/privacy off score` | Block only score queries from others |
| `/privacy on b50` | Re-allow Best 50 queries from others |
| `/privacy reset all` | Reset all query permissions to default |

---

## Friend Management

Manage your McMai friend list, used for PK features.

**Command:** `/friend [action] [param]`

**Actions:**

| Action | Description | Param |
|--------|-------------|-------|
| `list` | View friend list | — |
| `add` | Add a friend | `#username` |
| `del` / `remove` | Remove a friend | `#username` or slot number |

**Examples:**

| Command | Description |
|---------|-------------|
| `/friend list` | View friend list |
| `/friend add #Sakura` | Add friend named Sakura |
| `/friend add #Sakura 1` | Add Sakura to slot 1 |
| `/friend del 1` | Remove friend in slot 1 |
