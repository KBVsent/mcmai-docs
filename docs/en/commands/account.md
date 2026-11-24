# Account & Server

## Bind Account

**Command:** `/bind`

**Note:** This generates a dedicated binding link. Open it in your browser, select your server, and follow the instructions on the page. Binding a SEGA ID or authorizing LXNS updates your scores right away, and you can tick an option to switch McMai's current region to that server at the same time.

The binding link is only sent where only you can see it: a direct message, a button in a QQ group that only you can tap, or the private reply to Discord's `/bind` slash command. In other group chats, the bot asks you to send `/bind` in a direct message.

| Server | Method |
|--------|--------|
| Japan | Bind your SEGA ID, or update with a [bookmarklet](/en/guide/bookmarklet-update) |
| International | Bind your SEGA ID, submit a [sign-in token](#intl-token), or update with a [bookmarklet](/en/guide/bookmarklet-update) |
| China | Set up [NET WeChat authorization](/en/guide/cn-net-update), [send your MAID](#maid), or authorize [LXNS](#lxns) |

All three regions can also upload score files through a [custom data source](/en/guide/custom-data-source).

::: warning Note
The binding link is valid for 10 minutes, and each `/bind` generates a new link. Do not share it with anyone.
:::

::: tip Managing linked accounts
The binding page lists the game accounts linked in each region. Tap one to make it the current account (same as [`/aime`](#aime)). When you no longer need an account, you can unbind it on its own from the binding page: your score data is kept after unlinking, and updating with the same account again links it back. Unbinding an account updated with a password or LXNS may also delete the saved password or LXNS authorization; the confirmation dialog lists the exact effects.
:::

---

## International Server Sign-in Token {#intl-token}

International Server players who sign in to maimai DX NET with X, Facebook, or LINE and have no SEGA ID password can bind with a sign-in token instead, then use `/update` as usual.

Send `/bind`, choose "International" → "Token" on the binding page, and paste the cookie containing `clal`. To find out how to get it, tap "Ask ChatGPT how to get it" next to the input box and ask for the steps for your device.

::: warning Signing out invalidates the token
Signing out of maimai DX NET on any device invalidates the token, and you will need to submit it again. The token is equivalent to your login credentials; do not share it with anyone.
:::

---

## Update Scores with a Bookmarklet

Japan and International Server scores can be updated using the browser's logged-in NET session without submitting a SEGA ID or password to McMai.

Send `/bind`, select the region and the "Bookmarklet" method on the binding page, then generate and install the bookmarklet. Run it on a logged-in maimai NET page.

The [Bookmarklet Update Guide](/en/guide/bookmarklet-update) includes illustrated instructions for desktop Chrome, iPhone Safari, and Android Chrome.

The code contains account upload credentials. Regenerating it immediately invalidates the previous code.

---

## China Server MAID Updates {#maid}

Send your MAID (an 84-character string starting with `SGWCMAID`) to the bot in a direct message or mention the bot in a group, or paste it under "China" → "MAID" on the binding page, to update your China Server scores. Play counts used by China Server [PC50](/en/commands/b50#pc50) are only available from MAID updates.

::: details How to get your MAID?
1. Open the "舞萌 | 中二" (Maimai | Chunithm) official WeChat account
2. Tap "获取二维码" (Get QR Code)
3. A QR code page will open
4. Long-press the QR code to scan, then copy the `SGWCMAID` string that appears
:::

---

## LXNS {#lxns}

China Server players can authorize LXNS (落雪查分器) to use B50 and other queries with their scores on LXNS. Send `/bind`, choose "China" → "LXNS" on the binding page, and tap "Authorize on LXNS" to complete the authorization.

- Querying your own scores automatically syncs new scores from LXNS. You can also send `/update` to sync immediately.
- The LXNS account is listed together with your other China Server accounts. Switch with [`/aime`](#aime) or on the binding page.
- LXNS data has no play records or play counts, so `/recent`, `/ralog`, and `/pc50` are unavailable.
- LXNS data is not counted on leaderboards by default. Add the [`all` parameter](/en/commands/leaderboard#group-song-ranking) to the group ranking and group Rating ranking to include it.

When the authorization expires, the bot asks you to send `/bind` to authorize again. Scores already synced are kept.

---

## Cross-Platform Data Sync

Once the same game account (the same card) is bound on different platforms, its data is shared automatically: **update your scores once on any platform and they show up on the others**, so there is no need to update separately on each platform.

::: tip Tip
Sharing is keyed on the game account, not the platform identity. Accounts bound to different cards stay separate and are not shared.
:::

---

## Auto-Update on Score Queries {#auto-update}

When you query your own scores and your data is more than 1 hour old, the bot updates it first and then shows the result. LXNS is not subject to the 1-hour limit: any new scores are synced whenever you query.

**Command:** `/autoupdate [on|off]`

- No argument: view the current status. On by default.
- Applies to data from a linked SEGA account (Japan or International Server), an International Server sign-in token, or LXNS. Data from the bookmarklet, China Server NET and MAID, and custom data sources must be updated manually the usual way.
- Only triggered when you query yourself; querying another player does not update their data. Song searches and Today's Fortune do not trigger it.
- On the Japan and International Servers, viewing `/recent` and `/ralog` also triggers an auto-update.

**Examples:**

| Command | Description |
|---------|-------------|
| `/autoupdate` | View the current status |
| `/autoupdate off` | Turn it off; use `/update` to update manually when needed |
| `/autoupdate on` | Turn it back on |

::: warning Do not sign in to NET during updates
When updating through a SEGA account or sign-in token (including auto-updates), do not sign in to maimai DX NET manually while the update is queued or running. After the update finishes, recent play records continue to be fetched in the background, so also stay signed out for the next few minutes.
:::

---

## Deregister Account

Clear all your login credentials and score records.

**Command:** `/deregister [confirm]`

::: danger Irreversible
Deregistering permanently clears the following, and it **cannot be undone**:

- SEGA account login credentials (SEGA ID & password, or sign-in token)
- LXNS authorization and your custom data source upload token
- Your score records on all regions

To prevent mistakes, a two-step confirmation is required: first send `/deregister` to review what will be deleted, then send `/deregister confirm` to execute. The confirmation request is valid for **5 minutes**; after that you must start over. You can't deregister while a score update is in progress; wait for it to finish, then send the command again.
:::

To remove just one game account and keep your other data, unbind that account on its own from the binding page. See [Managing linked accounts](#bind-account).

**Examples:**

| Command | Description |
|---------|-------------|
| `/deregister` | Review what will be deleted and start a deregistration request |
| `/deregister confirm` | Confirm and execute the deregistration (valid for 5 minutes) |

---

## Switch Server

Switch your current game region.

**Command:** `/switchserver <server>`

**Parameters:**

| Parameter | Description |
|-----------|-------------|
| `cn` | China Server |
| `jp` | Japan Server |
| `intl` | International Server |

**Examples:**

| Command |
|---------|
| `/switchserver jp` |
| `/switchserver cn` |
| `/switchserver intl` |

---

## Switch Account {#aime}

Switch between the game accounts linked in your current region. Data updated through different methods (such as China Server NET and MAID, LXNS, or a custom data source) each forms its own account and does not overwrite the others. Queries use the currently selected account.

**Command:** `/aime [number]`

**Alias:** `account`

**Description:**

- `/aime`: Lists the accounts in your current region, marking the current account along with its Rating, update method, and last update time.
- `/aime <number>`: Switches to the account with the given number.
- On the Japan Server with a SEGA ID bound, the list also includes Aime cards under that SEGA ID that have not been updated yet. If you select one of these cards, the next `/update` updates that card and then switches to it automatically.

After you update your scores through a method, you are switched to that method's account automatically. You can also tap an account in the account list on the binding page to switch.

**Examples:**

| Command | Description |
|---------|-------------|
| `/aime` | View the account list for your current region |
| `/aime 2` | Switch to account #2 |

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
| `reset` | Reset all query permissions to default (all allowed); takes no target |

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
| `/privacy reset` | Reset all query permissions to default |

---

## Friend Management

Manage your McMai friend list, used for PK features.

**Command:** `/friend [action] [param]`

**Actions:**

| Action | Description | Param |
|--------|-------------|-------|
| `list` | View friend list | — |
| `add` | Add a friend | `#username` or `#query ID`, optionally followed by a slot number (1–3) to overwrite that slot |
| `del` / `remove` | Remove a friend | Slot number (1–3) |

**Examples:**

| Command | Description |
|---------|-------------|
| `/friend list` | View friend list |
| `/friend add #Sakura` | Add friend named Sakura |
| `/friend add #Sakura 1` | Add Sakura to slot 1 |
| `/friend del 1` | Remove friend in slot 1 |
