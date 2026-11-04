# Account & Server

## Bind Account

**Command:** `/bind`

**Note:** This generates a dedicated binding link (or QR code). Open it in your browser, select your server, and follow the instructions on the page.

| Server | Method |
|--------|--------|
| JP / INTL | Bind your SEGA ID, or update with a [bookmarklet](/en/guide/bookmarklet-update) |
| CN | Set up [NET WeChat authorization](/en/guide/cn-net-update), or [send your MAID](#maid) |

::: warning Note
Each execution of `/bind` generates a new verification code. Complete the binding promptly.
:::

---

## Update Scores with a Bookmarklet

JP and INTL scores can be updated using the browser's logged-in NET session without submitting a SEGA ID or password to McMai.

Send `/bind`, select the region and Bookmarklet method on the binding page, then generate and install the bookmarklet. Run it on a logged-in maimai NET page.

The [Bookmarklet Update Guide](/en/guide/bookmarklet-update) includes illustrated instructions for desktop Chrome, iPhone Safari, and Android Chrome.

The code contains account upload credentials. Regenerating it immediately invalidates the previous code.

---

## CN MAID Updates {#maid}

Send your MAID (an 84-character string starting with `SGWCMAID`) to the bot in a direct message, or mention the bot in a group, to update your CN scores. Play counts used by [PC50](/en/commands/b50#pc50) are only available from MAID updates.

::: details How to get your MAID?
1. Open the "舞萌 | 中二" (Maimai | Chunithm) official WeChat account
2. Tap "获取二维码" (Get QR Code)
3. A QR code page will open
4. Long-press the QR code to scan, then copy the `SGWCMAID` string that appears
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

**Command:** `/setname [username|clear]`

**Examples:**

| Command | Description |
|---------|-------------|
| `/setname Sakura` | Set username to Sakura |
| `/setname` | View current username (or your query ID if none is set) |
| `/setname clear` | Clear username |

**Username rules:** letters, digits, Chinese characters, and Japanese kana (hiragana / katakana); not all digits; up to 10 characters. Half-width katakana and full-width letters or digits are converted automatically. Names that look confusingly similar to an existing username can't be used.

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
| `b50` | Best 50 and other similar queries, plus PK and Rating improvement queries |
| `score` | Score (info), recent plays, and Rating history queries |
| `progress` | Completion table, progress, genre progress, and score list queries |

::: tip
Disabling `all` (master switch) prevents others from accessing any of your data, overriding all individual settings. Leaderboards are not affected by privacy settings.
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
