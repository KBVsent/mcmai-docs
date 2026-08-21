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

## Update Scores with a Bookmarklet

You can update your scores without handing over your SEGA ID and password. Install a bookmarklet, click it on a maimai NET page you are already logged into, and your scores upload to McMai.

Available for the **JP and INTL regions**. CN players update via MAID and do not need this.

::: tip Why no password is needed
Fetching runs inside your own browser using the session you are already logged into. Your SEGA ID and password never reach the bot.
:::

**Getting started:** Send `/bind` in chat to get your link, then click "Rather not hand over your password? Use a bookmarklet" at the bottom of the page.

Binding page: [id.moev.cc](https://id.moev.cc) (generating a bookmarklet requires the verification code the bot sends you)

### How it works

| Step | What to do |
|------|------|
| 1. Generate | Enter your verification code on the binding page to issue your personal bookmarklet |
| 2. Install | On desktop, drag it to the bookmarks bar; on mobile, copy the code and create a bookmark |
| 3. Log in | Open the JP or INTL site in your **system browser** and sign in |
| 4. Click it | Run it from any maimai NET page; fetching takes a dozen seconds or so |

The page has detailed instructions split by Desktop / iPhone / Android — just follow the tab for your device.

::: warning Things to watch out for
- Each bookmarklet is **unique to you**. Regenerating invalidates the old one immediately, and every device needs reinstalling.
- Do not paste the code into the address bar. Chrome strips the leading `javascript:` and you end up with a broken bookmark.
- Browsers built into SNS apps cannot run bookmarklets. Use your system browser instead.
- On iPhone, open it from the **bookmarks list**; on Android, type the name in the address bar and tap the **bookmark suggestion**. The two are exactly opposite.
- Verification codes are single-use. To view or regenerate the bookmarklet later, send `/bind` again.
:::

---

## Cross-Platform Data Sync

Once the same game account (the same card) is bound on different platforms, its data is shared automatically: **update your scores once on any platform and they show up on the others**, so there is no need to update separately on each platform.

::: tip Tip
Sharing is keyed on the game account, not the platform identity. Accounts bound to different cards stay separate and are not shared.
:::

---

## Unbind Account

Unbind your current SEGA account and clear your score records across **all regions**.

**Command:** `/unbind [confirm]`

::: danger Irreversible
Unbinding permanently clears the following, and it **cannot be undone**:

- SEGA account binding info (segaid & password)
- Your score records on all regions (CN / JP / INTL)

To prevent mistakes, a two-step confirmation is required: first send `/unbind` to review what will be deleted, then send `/unbind confirm` to execute. The confirmation request is valid for **5 minutes**; after that you must start over.
:::

**Examples:**

| Command | Description |
|---------|-------------|
| `/unbind` | Review what will be deleted and start an unbind request |
| `/unbind confirm` | Confirm and execute the unbind (valid for 5 minutes) |

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

## Switch Aime Card

View or switch the Aime card slot on your Japan-server account.

::: info Japan server only
This feature is available only to Japan-server (JP) users who have bound a Japan-server account.
:::

**Command:** `/aime [card number]`

**Description:**

- `/aime`: Lists all Aime cards on your account, marking the currently selected one along with its Rating and card type (standard / free).
- `/aime <number>`: Switches to the card with the given number.
- If your account has only one card, no switching is needed.

The change takes effect the next time you run `/update`.

**Examples:**

| Command | Description |
|---------|-------------|
| `/aime` | View all Aime cards on your account |
| `/aime 2` | Switch to card #2 |

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
