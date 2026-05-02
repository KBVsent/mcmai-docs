# Level Tables

## Level Constant Table

Query the constant table (as an image) for a specified level or constant.

**Command:** `/rating <level or constant> [server]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level or constant | Level (`13`, `14+`) or constant range | `13+`, `14.0` |
| Server | Region (optional) | `cn`, `jp`, `intl` |

**Examples:**

| Command |
|---------|
| `/rating 13+` |
| `/rating 14` |
| `/rating 14 jp` |

---

## Dan-i Table

Query the course requirements for a specified Dan-i (rank) stage.

**Command:** `/dancourse <rank name> [server] [#username]`

| Parameter | Description |
|-----------|-------------|
| Rank name | e.g. `真初段`, `真十段`, `真皆伝` |
| Server | `cn`, `jp`, `intl` (optional) |
| #username | Optional, query another player's progress |

**Examples:**

| Command |
|---------|
| `/dancourse 真十段` |
| `/dancourse 真十段 #Sakura` |
| `/dancourse 真皆伝 jp` |

---

## Completion Table

View completion progress for a grade evaluation or plate.

**Command:** `/plate <grade or plate> [plate level] [#username]`

**Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| Grade or plate | Numeric level (`13`, `14+`) or version name (`circle`, `plus`, etc.) | `13+` |
| Plate level | Required for plate mode (`fc`, `sss`, `ap`, `fdx`) | `sss` |
| #username | Query another player (requires their permission) | `#Sakura` |

**Version name aliases:** `circle` (丸), `plus` (真), `prism` (鏡), `buddies` (双), `festival` (祭), `universe` (宙), `splash` (爽), `dx` (熊), and their `p` variants (e.g. `circlep`, `prismp`).

**Examples:**

| Command |
|---------|
| `/plate 13` |
| `/plate 14 #Sakura` |
| `/plate plus fc` |
| `/plate circle sss` |
| `/plate circle sss #Sakura` |

---

## Rating Improvement

Query which songs you should play to improve your current Rating.

**Command:** `/risescore <level or constant> <score> [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level or constant | Target level or constant | `14`, `13.7` |
| Score | Target score value | `10` |
| Page | Optional, for pagination | `2` |

**Examples:**

| Command |
|---------|
| `/risescore 14 5` |
| `/risescore 13.7 9 2` |
