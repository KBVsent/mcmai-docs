# Song Search

## Search by Title / Alias / ID

Search for songs by title, alias, or ID.

**Command:** `/search <keyword>`

**Examples:**

| Command |
|---------|
| `/search 11451` |

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

**Command:** `/dssearch <constant> [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| Constant | Single value or range (`min-max`) | `13.7`, `14.0-14.7` |
| Page | Page number (optional, default 1) | `2` |

**Examples:**

| Command |
|---------|
| `/dssearch 14.0` |
| `/dssearch 13.7-14.0` |
| `/dssearch 14.0 2` |

---

## Search by BPM

Find songs within a specified BPM range, with paging support.

**Command:** `/bpmsearch <BPM> [page]`

| Parameter | Description | Example |
|-----------|-------------|---------|
| BPM | Single value or range (`min-max`) | `180`, `160-200` |
| Page | Page number (optional, default 1) | `2` |

**Examples:**

| Command |
|---------|
| `/bpmsearch 180` |
| `/bpmsearch 160-200` |

---

## Search by Composer

Search songs by composer / arranger name.

**Command:** `/artistsearch <composer> [page]`

**Examples:**

| Command |
|---------|
| `/artistsearch t+pazolite` |
| `/artistsearch xi 2` |

---

## Search by Charter

Search songs by chart designer name.

**Command:** `/designsearch <charter> [page]`

**Examples:**

| Command |
|---------|
| `/designsearch Jack 2` |

---

## Version Search

Filter songs by game version or release date, with paging support.

**Command:** `/versearch <version keyword> [page]`

| Input | Description | Example |
|-------|-------------|---------|
| `new` / `latest` | Songs added in the most recent update for your server | `/versearch new` |
| Date | Songs released on the specified date (`YYYYMMDD` or `YYYY-MM-DD`) | `/versearch 2025-01-09` |
| English version name | Songs belonging to the corresponding game version | `/versearch circle`, `/versearch prism` |
| Version name substring | Version name keyword (case-insensitive) | `/versearch buddies`, `/versearch 2025` |

**Examples:**

| Command |
|---------|
| `/versearch new` |
| `/versearch 2025-01-09` |
| `/versearch circle` |
| `/versearch prism 2` |
