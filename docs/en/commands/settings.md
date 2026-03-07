# Personal Settings

## View Profile Card

View your profile card (a card-style image showing your best scores).

**Command:** `/查看顶板 [region]`

| Parameter | Description |
|-----------|-------------|
| Region | Optional, specify region (`cn`, `jp`, `intl`) |

---

## Profile Display Settings

Customize the fields displayed on your profile card.

**Command:** `/顶板样式 <action> <field>`

**Examples:**

| Command | Description |
|---------|-------------|
| `/顶板样式 查看` | View current settings |
| `/顶板样式 开启 游玩次数` | Show play count |
| `/顶板样式 关闭 昵称` | Hide nickname |

---

## Privacy Settings

Control others' ability to query your data.

**Command:** `/隐私设置 <action> <target>`

| Action | Description |
|--------|-------------|
| `查看` / `show` | View current permission config |
| `开启` / `allow` | Allow querying |
| `关闭` / `deny` | Deny querying |

**Examples:**

| Command | Description |
|---------|-------------|
| `/隐私设置 查看` | View current permissions |
| `/隐私设置 关闭 score` | Prevent others from querying your scores |
| `/隐私设置 开启 all` | Allow querying all data |
