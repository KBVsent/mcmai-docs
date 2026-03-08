# Account & Server

## Bind SEGA ID

Link your QQ account to your SEGA ID for querying maimai NET data.

Only JP and INTL users need to bind an account. CN users update data via MAID directly.

**Command:** `/绑定`

**Note:** This generates a dedicated binding link (or QR code). Open it in your browser to complete authorization.

::: warning Note
Each execution of `/绑定` generates a new verification code. Complete the binding promptly.
:::

---

## Switch Server

Switch your current game region.

**Command:** `/切服 <server>`

**Parameters:**

| Parameter | Description |
|-----------|-------------|
| `cn` | China server |
| `jp` | Japan server |
| `intl` | International server |

**Examples:**

| Command |
|---------|
| `/切服 jp` |
| `/切服 cn` |
| `/切服 intl` |

---

## Set Username

Set a username so others can query your data.

**Command:** `/用户名 [username|QQ|清除]`

**Examples:**

| Command | Description |
|---------|-------------|
| `/用户名 Sakura` | Set username to Sakura |
| `/用户名 123456789` | Link QQ number as username |
| `/用户名` | View current username |
| `/用户名 清除` | Clear username |

::: warning Note
When using a username as a query parameter, always prefix it with `#`.

For example: `/b50 #Sakura`, not `/b50 Sakura`.
:::

---

## Privacy Settings

Control whether others can query your game data.

**Command:** `/隐私设置 <action> [target]`

**Actions:**

| Action | Description |
|--------|-------------|
| `查看` | View current privacy settings |
| `开启` | Allow others to query the specified target |
| `关闭` | Block others from querying the specified target |
| `重置` | Reset the specified target to default (all allowed) |

**Targets:**

| Target | Description |
|--------|-------------|
| `查询` | Master switch — controls all query permissions |
| `b50查询` | Best 50 and other similar queries |
| `分数查询` | Score (info) queries |
| `进度查询` | Completion table / progress queries |

::: tip
Disabling `查询` (master switch) prevents others from accessing any of your data, overriding all individual settings.
:::

**Examples:**

| Command | Description |
|---------|-------------|
| `/隐私设置 查看` | View current privacy status |
| `/隐私设置 关闭 查询` | Block all queries from others |
| `/隐私设置 关闭 分数查询` | Block only score queries from others |
| `/隐私设置 开启 b50查询` | Re-allow Best 50 queries from others |
| `/隐私设置 重置 查询` | Reset all query permissions to default |

---

## Friend Management

Manage your McMai friend list, used for PK features.

**Command:** `/好友 [action] [param]`

**Aliases:** `friend`, `好友管理`

**Actions:**

| Action | Description | Param |
|--------|-------------|-------|
| `列表` | View friend list | — |
| `添加` | Add a friend | `#username` |
| `删除` | Remove a friend | `#username` or slot number |

**Examples:**

| Command | Description |
|---------|-------------|
| `/好友 列表` | View friend list |
| `/好友 添加 #Sakura` | Add friend named Sakura |
| `/好友 添加 #Sakura 1` | Add Sakura to slot 1 |
| `/好友 删除 1` | Remove friend in slot 1 |
