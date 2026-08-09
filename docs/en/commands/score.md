# Score Queries

## Personal Song Data

Query personal play details for a song, including achievement rate, DX score, FC/FS status.

**Command:** `/info <song ID or name>`

| Parameter | Description |
|-----------|-------------|
| Song ID or name | Numeric ID or song title/alias |

Add `#username` to query another player's data.

**Examples:**

| Command |
|---------|
| `/info 11451` |
| `/info 11451 #Sakura` |

---

## Score Tolerance

Query the deduction per note type for a given difficulty, the DX score tolerance for each DX star level, and the TAP-error tolerance for each rank.

**Command:** `/scoreline <song ID> [difficulty]`

| Parameter | Description | Default |
|-----------|-------------|---------|
| Song ID | Numeric ID | — |
| Difficulty | `green`, `yellow`, `red`, `purple`, `white` | `purple` |

**Examples:**

| Command |
|---------|
| `/scoreline 11451` |
| `/scoreline 11820 white` |

::: tip The image includes
- **DX star**: the DX score tolerance required to reach each DX star level.
- **Rank tolerance**: based on the theoretical 101% baseline, the maximum number of a single TAP Great / TAP Good / TAP Miss error tolerable throughout to still reach each rank (SSS+ / SSS / SS+ / SS / S+ / S); the three tiers are mutually exclusive.
:::

---

## Result Analysis (Read Score)

Send a result screenshot and the bot recognizes the achievement rate and note judgement breakdown, then **reconstructs the BREAK sub-breakdown** (Just / 50-drop / 100-drop, etc.) along with the per-note achievement loss.

**Command:** `/readscore`

**How to use:**

- Attach a result screenshot **together with** the command; or
- **Reply to** a message containing a result screenshot, then mention the bot and send the command.

**The result image includes:**

- The matched song, difficulty, DX star level and combo rank (FC / FC+ / AP / AP+)
- A judgement & loss table — each cell shows "count / total loss / loss per note"
- The reconstructed BREAK breakdown; if several mathematically equivalent solutions exist, all of them are listed

### Manual Correction Mode

When the image is too compressed and some numbers are misread, call the command without an image and supply the correct values as parameters.

**Command:** `/readscore id=<song ID> ach=<achievement> tap=<CP/P/GR/GD/MS> hold=... slide=... touch=... break=...`

| Parameter | Description | Required |
|-----------|-------------|----------|
| `id` | Numeric song ID | At least one of `id` or the note breakdown |
| `ach` | Achievement rate, 0–101, e.g. `100.8623` | Yes |
| `tap` / `hold` / `slide` / `break` | The five judgement counts per note type, in `CP/P/GR/GD/MS` order, separated by `/` | Yes |
| `touch` | Same format; may be omitted when the chart has no TOUCH notes (treated as all zeros) | Optional |

Parameter names are always in English (`ach` also accepts `acc`), and their order does not matter.

**Example:**

```
/readscore id=834 ach=100.8623 tap=380/0/0/0/0 hold=52/0/0/0/0 slide=90/0/0/0/0 touch=0/0/0/0/0 break=47/0/1/0/0
```

::: tip Improving recognition
- Send the **original file** whenever possible, and make sure the **note breakdown at the top of the game screen** is sharp and complete.
- When recognition fails the bot replies with a ready-made command containing the values it did read — copy it, fix the wrong numbers and resend. On Discord you can instead click the "✏️ Fix values" button.
:::

::: warning Limitations
- UTAGE charts are not supported.
- If the same note breakdown matches several songs in the database, use `id=` to specify the chart.
:::

---

## Chart Statistics

Query AP rate, FC rate, play rate and other statistics for a song's charts.

**Command:** `/rankstats <song ID or name> [region]`

| Parameter | Description | Options |
|-----------|-------------|---------|
| Song ID or name | Numeric ID or title/alias | — |
| Region | Filter by region (optional) | `cn`, `jp`, `intl` |

**Examples:**

| Command |
|---------|
| `/rankstats 11451` |
| `/rankstats 11451 jp` |
| `/rankstats 11451 cn` |
