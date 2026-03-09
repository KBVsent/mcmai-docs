# Username & Friend System

## Why Does This System Exist?

On the QQ platform, the Bot has a limitation: **it cannot read @ mention data from messages**. This means you cannot query another player's scores by simply mentioning them, as you might on other platforms.

At the same time, the internal user IDs used by McMai are not visible to regular users and are inconvenient to type manually.

To solve this, McMai introduces a **username** and **QQ number binding** system: once you set a username (or bind your QQ number), others can use `#username` or `#QQnumber` to target you in queries.

However, usernames can be hard to remember or may change over time — that's where the **friend system** comes in. Add frequently queried players as friends, then reference them with `#friend1` at any time, with no need to memorize their username, and updates to their username won't affect you.

---

## Username

### What is a username for?

Once you set a username, you have a recognizable identity in McMai:

- **Others can query your data using `#username`**, e.g. `/b50 #MaiPlayer`
- Others can add you as a friend using your username

::: tip
Username is the primary way for others to find and query you on QQ. If you want groupmates to query you or challenge you to a PK, set a username first.
:::

### How to set a username?

**Command:** `/用户名 <username>`

**Rules:**
- 5–10 characters long
- May contain Chinese characters, letters, and digits, but cannot be purely numeric
- Must be globally unique
- After setting, you must wait **3 days** before changing it again — choose carefully

| Command | Description |
|---------|-------------|
| `/用户名 MaiPlayer` | Set username to MaiPlayer |
| `/用户名 清除` | Delete current username |
| `/用户名` | View current username and QQ binding status |

---

## QQ Number Binding

### What is QQ number binding for?

QQ number binding is an alternative identity method alongside usernames, primarily for **CN server users**:

- After binding, the Bot can fetch your CN server data via the **Diving Fish score tracker** — some features require this binding to work
- Others can query you or add you as a friend using `#QQnumber`, as a fallback when you have no username

::: tip CN Users Only
JP / INTL users bind their accounts via SEGA ID and do not need to bind a QQ number.
:::

### How to bind a QQ number?

Pass your QQ number (5–11 digits) as the argument — the system automatically detects it as a QQ binding, not a username.

**Command:** `/用户名 <QQ number>`

| Command | Description |
|---------|-------------|
| `/用户名 123456789` | Bind QQ number 123456789 |
| `/用户名 解绑qq` | Unbind QQ number |

---

## Friend System

### What is the friend system for?

While usernames solve the "how to find someone" problem, they still have drawbacks:

- Usernames may be long or hard to remember
- If someone changes their username, you need to learn the new one

The friend system is designed for exactly this. Save up to **3 players** in friend slots, then:

- **Query friends directly with `#friend1`, `#friend2`, `#friend3`** — no need to remember usernames
- Use `/info` to view your own scores and all your friends' scores at a glance
- **If a friend changes their username, your friend reference still works** — the system always tracks the account
- Challenge any friend to a B50 PK comparison at any time

### How to manage friends?

**Command:** `/好友`

| Command | Description |
|---------|-------------|
| `/好友 列表` | View your 3 friend slots |
| `/好友 添加 #username` | Add a friend by username (auto-fills first empty slot) |
| `/好友 添加 #username 2` | Add a friend to a specific slot (overwrites existing) |
| `/好友 添加 #QQnumber` | Add a friend by QQ number |
| `/好友 删除 1` | Remove friend in slot 1 |

### How to use friend slots in queries?

Once friends are added, use `#friendN` in any command that supports a target:

| Example | Description |
|---------|-------------|
| `/b50 #friend1` | View friend 1's Best 50 |
| `/info` | View your own and all friends' score overview |
| `/pk50 #friend1` | PK against friend 1 |

::: tip Multilingual Support
Friend slots also support Chinese (`#好友1`) and Japanese (`#フレンド1`) notation — all equivalent.
:::

---

## Score PK (pk50)

`/pk50` compares your Best 50 against another player: it takes your B50 songs as the baseline, finds those songs in the target's scores, calculates both players' ratings on the matched charts, and determines the winner.

**Command:** `/pk50 <target>`

| Example | Description |
|---------|-------------|
| `/pk50 #MaiPlayer` | PK against a player by username |
| `/pk50 #friend1` | PK against friend 1 |

::: warning Note
Both players must have updated B50 data (`/更新b50` or `/更新记录`) before initiating a PK, and the target's B50 privacy must be set to public.
:::

---

## Specifying a Query Target

Most McMai commands support an optional target at the end to query a specific player instead of yourself:

| Syntax | Description |
|--------|-------------|
| (empty) | Query yourself (default) |
| `#username` | Query by username |
| `#QQnumber` | Query by QQ number (target must have QQ bound) |
| `#friend1` / `#friend2` / `#friend3` | Query the player in the corresponding friend slot |

Resolution priority: `#friendN` > `#username` > `#QQnumber` > default (self)
