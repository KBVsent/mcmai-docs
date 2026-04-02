# Level Tables

## Level Constant Table

Query the constant table (as an image) for a specified level or constant.

**Command:** `/定数表 <level or constant> [server]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level or constant | Level (`13`, `14+`) or constant range | `13+`, `14.0` |
| Server | Region (optional) | `cn`, `jp`, `intl` |

**Examples:**

| Command |
|---------|
| `/定数表 13+` |
| `/定数表 14` |
| `/定数表 14 jp` |

---

## Dan-i Table

Query the course requirements for a specified Dan-i (rank) stage.

**Command:** `/段位表 <rank name> [server] [#username]`

| Parameter | Description |
|-----------|-------------|
| Rank name | e.g. `真初段`, `真十段`, `真皆伝` |
| Server | `cn`, `jp`, `intl` (optional) |
| #username | Optional, query another player's progress |

**Examples:**

| Command |
|---------|
| `/段位表 真十段` |
| `/段位表 真十段 #Sakura` |
| `/段位表 真皆伝 jp` |

---

## Completion Table

View completion progress for a grade evaluation or plate.

**Command:** `/完成表 <grade or plate> [plate level] [server] [#username]`

**Examples:**

| Command |
|---------|
| `/完成表 13` |
| `/完成表 14 #Sakura` |
| `/完成表 真 极` |
| `/完成表 舞将 jp #Sakura` |

---

## Rating Improvement

Query which songs you should play to improve your current Rating.

**Command:** `/上分 <level or constant> <score> [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Level or constant | Target level or constant | `14`, `13.7` |
| Score | Target score value | `10` |
| Page | Optional, for pagination | `2` |

**Examples:**

| Command |
|---------|
| `/上分 14 5` |
| `/上分 13.7 9 2` |
