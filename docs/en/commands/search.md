# Song Search

## Search by Title / Alias / ID

Search for songs by title, alias, or ID.

**Command:** `/查歌 <keyword>`

**Examples:**

| Command |
|---------|
| `/查歌 潘多拉` |
| `/查歌 11451` |

---

## Exact ID Lookup

Query detailed chart info (difficulty, constant, charter, etc.) by song ID.

**Command:** `/id <song ID>`

**Example:**

| Command |
|---------|
| `/id 11451` |

---

## Search by Level Constant

Find songs within a specified constant range, with paging support.

**Command:** `/定数查歌 <constant> [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Constant | Single value or range (`min-max`) | `13.7`, `14.0-14.7` |
| Page | Page number (optional, default 1) | `2` |

**Examples:**

| Command |
|---------|
| `/定数查歌 14.0` |
| `/定数查歌 13.7-14.0` |
| `/定数查歌 14.0 2` |

---

## Search by BPM

Find songs within a specified BPM range, with paging support.

**Command:** `/BPM查歌 <BPM> [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| BPM | Single value or range (`min-max`) | `180`, `160-200` |
| Page | Page number (optional, default 1) | `2` |

**Examples:**

| Command |
|---------|
| `/BPM查歌 180` |
| `/BPM查歌 160-200` |

---

## Search by Composer

Search songs by composer / arranger name.

**Command:** `/曲师查歌 <composer> [page]`

**Examples:**

| Command |
|---------|
| `/曲师查歌 t+pazolite` |
| `/曲师查歌 xi 2` |

---

## Search by Charter

Search songs by chart designer name.

**Command:** `/谱师查歌 <charter> [page]`

**Examples:**

| Command |
|---------|
| `/谱师查歌 Jack 2` |
