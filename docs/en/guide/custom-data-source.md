---
title: Custom Data Source
description: Upload maimai scores to a McMai custom data source, with web upload steps, the fields and chart matching rules of the mcmai-scores standard format, and API authentication, limits, and error codes.
---

The custom data source imports scores from other sources, such as scores exported by another tool and converted to the standard format. CN, JP, and INTL each have one custom data source account. Like the other accounts in that region, it can be selected with `/aime` or from the account list on the binding page.

::: info Notes
- **Scores and an optional profile.** Profile fields such as icon, title, and tour members can be included; see [Profile fields](#profile). Nicknames and play records are not accepted, and the account name is shown as “Custom”. McMai recalculates Rating from the scores and chart constants.
- **Full replacement.** Each upload replaces all scores and the profile of the account. Charts missing from the file are deleted, profile fields missing from the file are cleared, and uploading an empty list clears the scores.
- **Leaderboards.** Scores are excluded from global leaderboards. They count in `/grank` and `/grating` when the region parameter is `all`, labeled with their source.
- **Standard format only.** McMai does not convert export files from other score trackers or tools. Files must be converted to the [standard format](#format) before uploading.
:::

## 1. Web upload {#web}

1. Send `/bind` to the bot and open the returned binding link.
2. Select the region tab the scores belong to, and set the update method to “Custom”.
3. Select the score file (JSON, up to 2.5 MiB), or drag it in.
4. To view these scores in McMai right after uploading, check “Switch McMai to the custom data source account after uploading”.
5. Click “Upload scores” and wait for processing to finish.

The result page shows the number of charts written, the rows that were not written, and the profile fields that were not written. When writing succeeds and the account has scores, a B50 image is generated. The file's `catalog` must match the selected tab; otherwise the whole file is rejected. Uploads must be at least 60 seconds apart; see [Limits and error codes](#limits).

## 2. Standard format {#format}

The standard format is a JSON object with `format` set to `mcmai-scores`:

```json
{
  "format": "mcmai-scores",
  "version": 1,
  "catalog": "jp",
  "exported_at": "2026-11-19T08:30:00Z",
  "profile": {"play_count": 4321, "frame": "ヒメヒナちほー その1", "title": "ニック 推し",
              "characters": [{"id": 555401, "level": 928}]},
  "scores": [
    {"title": "Link(COF)", "type": "standard", "level_index": 3,
     "achievements": 100.5123, "dx_score": 1700, "fc": "ap", "fs": "fsp", "play_count": 12},
    {"title": "[宴]Wonderland Wars　オープニング", "type": "utage", "level_index": 0, "level": "14",
     "achievements": 101.0, "dx_score": 1500}
  ]
}
```

### Top-level fields {#top-level}

| Field | Required | Description |
| --- | --- | --- |
| `format` | Yes | Always `mcmai-scores` |
| `version` | Yes | The integer `1` |
| `catalog` | Yes | `cn`, `jp`, or `intl`. Determines which region's song catalog is used to match titles, and which region's account the scores are written to |
| `exported_at` | No | Export time of the scores, in ISO 8601 with a time zone, such as `2026-11-19T08:30:00Z`. Used as the scores' update time. If omitted or later than the upload time, the upload time is used |
| `profile` | No | Account profile; see [Profile fields](#profile) |
| `scores` | Yes | Array of scores, up to 8000 entries |

Keys not listed in the table are ignored.

### Score fields {#scores}

| Field | Required | Description |
| --- | --- | --- |
| `title` | This or `song_id` | Song title, matched against the catalog of the `catalog` region; see [Chart matching](#locate). Up to 256 characters |
| `type` | When `title` is used | `standard`, `dx`, or `utage`, case-insensitive. `sd` and `std` are treated as `standard` |
| `song_id` | This or `title` | Song ID, an integer |
| `level_index` | Yes | Difficulty, 0 to 4 for Basic, Advanced, Expert, Master, and Re:Master. Use 0 for Utage charts, and 1 for the second position of a two-player Utage chart |
| `level` | No | Displayed level, such as `14+`, up to 8 characters. Distinguishes Utage variants with the same title |
| `achievements` | Yes | Achievement as a percentage with up to 4 decimal places, such as `100.5123`. Range 0 to 101, or up to 202 for Utage |
| `dx_score` | Yes | DX score, a non-negative integer |
| `fc` | No | `fc`, `fcp`, `ap`, or `app`. An empty string or `null` means none |
| `fs` | No | `sync`, `fs`, `fsp`, `fdx`, or `fdxp`. `fsd` and `fsdp` are also accepted. An empty string or `null` means none |
| `play_count` | No | Play count for the chart. Defaults to 0 if omitted. With play counts, `/pc50` is available |

`fc` and `fs` are case-sensitive. A file cannot contain two rows pointing to the same chart: the same `song_id` and `level_index`, or the same `title`, `type`, `level_index`, and `level`.

### Profile fields {#profile}

All fields in `profile` are optional. They are shown on the B50 image and in `/topboard`, and do not affect scores or Rating.

```json
"profile": {
  "play_count": 4321, "current_play_count": 210,
  "total_awake": 1500, "mai_mile": 23000, "partner_present": 12,
  "course_rank": 15, "class_rank": 11,
  "icon": "女の子", "nameplate": "QuiQ", "frame": "ヒメヒナちほー その1", "title": "ニック 推し",
  "partner": {"name": "ちびみるく", "rate": 100},
  "characters": [{"name": "ポリー", "level": 928}, {"name": "ソルト（ふぇすてぃばる）", "level": 931}]
}
```

| Field | Description |
| --- | --- |
| `play_count` | Play Count |
| `current_play_count` | Version Play Count |
| `total_awake` | Awakenings |
| `mai_mile` | Miles |
| `partner_present` | Gifts |
| `course_rank` | Dan number; see [Dan and class](#ranks) |
| `class_rank` | Class number; see [Dan and class](#ranks) |
| `icon`, `nameplate`, `frame`, `title` | Icon, plate, frame, and title, given by name. An integer ID also works |
| `partner` | Partner, as `{"name": name}` or `{"id": ID}`, optionally with `rate` (affinity) |
| `characters` | Tour members, up to 5, the first being the leader. Each is `{"name": name}` or `{"id": ID}`, plus the required `level` |

Apart from collection references, all values are non-negative integers. Nickname, Rating, circle, and other unlisted keys are ignored.

Collection names must meet these rules:

- Use the Japanese name shown in game or the CN name, regardless of `catalog`.
- Names are compared ignoring case, full-width/half-width differences, and extra whitespace; everything else must match exactly. Version suffixes such as the one in `ソルト（ふぇすてぃばる）` cannot be left out.
- Image paths, resource hashes, and other forms are not recognized.
- Different versions of the same character may share a name. When the item cannot be determined, the result reports `ambiguous`; use the ID instead.

A title's rarity comes from the collection data and does not need to be given.

Without a recognizable `frame`, the B50 image shows a simple player header instead of the full profile board, and `/topboard` cannot generate an image. The counts, `partner`, and `characters` appear only on the profile board, so they are not written in that case and are reported as `needs_frame`.

### Dan and class {#ranks}

`course_rank` and `class_rank` accept numbers only.

Dan:

| Number | Dan | Number | Dan |
| --- | --- | --- | --- |
| 0 | Beginner | | |
| 1 | Shodan | 12 | Shin Shodan |
| 2 | Nidan | 13 | Shin Nidan |
| 3 | Sandan | 14 | Shin Sandan |
| 4 | Yondan | 15 | Shin Yondan |
| 5 | Godan | 16 | Shin Godan |
| 6 | Rokudan | 17 | Shin Rokudan |
| 7 | Nanadan | 18 | Shin Nanadan |
| 8 | Hachidan | 19 | Shin Hachidan |
| 9 | Kyuudan | 20 | Shin Kyuudan |
| 10 | Juudan | 21 | Shin Juudan |
| 11 | Kaiden | 22 | Shin Kaiden |
| | | 23 | Ura Kaiden |

Class: the numbers in the table are the values to write. For example, SS3 is 17 and LEGEND is 25.

| Class | 5 | 4 | 3 | 2 | 1 |
| --- | --- | --- | --- | --- | --- |
| B | 0 | 1 | 2 | 3 | 4 |
| A | 5 | 6 | 7 | 8 | 9 |
| S | 10 | 11 | 12 | 13 | 14 |
| SS | 15 | 16 | 17 | 18 | 19 |
| SSS | 20 | 21 | 22 | 23 | 24 |

### Chart matching {#locate}

Each row identifies its chart in one of two ways:

- **Title**: `title` + `type` + `level_index`, plus `level` when needed.
- **ID**: `song_id` + `level_index`. If both are given, the ID takes precedence and the title is not checked.

When matching by title:

1. McMai first looks for a chart with exactly the same title and type in the catalog given by `catalog`.
2. If none is found, it searches again ignoring case, full-width/half-width differences, and extra whitespace, and accepts the result only if it is unique. For example, `Link(CoF)` matches `Link(COF)`.
3. If several songs share the same title and type, they are filtered by `level`. If that does not narrow it down to one song, the row is skipped. Currently only two Utage groups need `level`: `[宴]Wonderland Wars　オープニング` and `[協]青春コンプレックス`. A trailing `?` on an Utage level is optional.
4. An empty or whitespace-only title matches the song whose title is a single full-width space.

::: tip The two Links
The catalog has two standard charts titled Link, both displayed as `Link` in game. Write the second one as `Link(COF)`. When written as `Link`, McMai decides by Re:Master (only the first has one), then `level` (the two differ at Advanced and Expert), then whether the DX score exceeds the first song's maximum. If it still cannot decide, the row is skipped. Rows with `song_id` are unaffected.
:::

### Validation results {#validation}

Uploaded files go through two levels of validation.

**Structural validation** checks field types, value ranges, and duplicate rows. If it fails, the whole file is rejected, no scores are written, and the first 20 problems are listed, with locations written as `scores[12].achievements` or `profile.characters[0].level`:

| Code | Meaning |
| --- | --- |
| `not_object` | Should be an object |
| `enum` | Value not allowed, such as for `format`, `catalog`, `type`, `fc`, or `fs` |
| `datetime` | Invalid time format or missing time zone |
| `required` | Missing required field |
| `type` | Wrong type, such as a number written as a string |
| `too_many` | `scores` has more than 8000 entries, or `characters` has more than 5 |
| `locator` | Missing `title` or `song_id`; or missing `id` or `name` in `partner` or `characters` |
| `range` | Out of range |
| `scaled` | Achievement above 1000, likely multiplied by 10000. Use a percentage |
| `precision` | Achievement has more than 4 decimal places |
| `duplicate` | Points to the same chart as an earlier row |

**Catalog validation** skips only the problematic rows and writes the rest as usual. The result lists the number of skipped rows by reason, along with the location and title of the first 10:

| Reason | Meaning |
| --- | --- |
| `unknown` | Song or chart not found in the catalog |
| `ambiguous` | Charts with the same title cannot be distinguished. Add `level` or `song_id` |
| `link_ambiguous` | Cannot tell which Link is meant. Write it as `Link(COF)` or add `song_id` |
| `dx_over` | DX score exceeds the chart's maximum (note count × 3). Not checked for Utage |
| `ach_over` | Achievement above 101% on a non-Utage chart |
| `duplicate_chart` | Multiple rows map to the same chart. None of them are written |

The catalog follows game updates. New songs are skipped until McMai updates its catalog; uploading again after the update writes them.

**Collection validation** clears only the profile fields it cannot write; scores and other fields are written as usual. The result lists the locations of those fields:

| Reason | Meaning |
| --- | --- |
| `unknown` | ID or name not found in the collection data |
| `ambiguous` | The name refers to several items. Use the ID |
| `needs_frame` | `frame` is missing or unrecognized, so fields shown only on the profile board are not written |

If any entry in `characters` cannot be recognized, none of the tour members are written.

## 3. API upload {#api}

For scheduled uploads from a program, the API can be called with an upload token, without opening the binding page.

### Upload token {#token}

On the binding page, click “Issue token” under “Custom” in any region. Tokens start with `mcext_`, work for all three regions, and write to the region given by the `catalog` in the uploaded JSON.

- The token is shown only once when issued. Save it right away. If lost, click “Reset token”; the old token is invalidated immediately.
- After “Delete token”, API uploads are no longer possible. Uploaded scores are kept.
- The token can only upload scores and query upload results. It should not appear in public code or screenshots.

::: warning Linking after unbinding
After the custom data source account is unbound on the binding page, the next API upload links it again as long as the token is valid. Delete the token as well once it is no longer used.
:::

### Upload scores {#upload}

```
POST https://sync.moev.cc/api/v1/ext/scores
Authorization: Bearer <upload token>
Content-Type: application/json
```

The request body is the standard format JSON object itself, not a multipart form or file upload. A program can build the scores in memory and send them directly, without saving a file first:

```python
import requests

doc = {"format": "mcmai-scores", "version": 1, "catalog": "jp", "scores": scores}
r = requests.post(
    "https://sync.moev.cc/api/v1/ext/scores",
    headers={"Authorization": f"Bearer {token}"},
    json=doc,
)
```

The `json=` argument of `requests` sets `Content-Type: application/json` automatically. When sending saved JSON with curl, `@scores.json` reads the file's content as the request body:

```bash
curl -X POST https://sync.moev.cc/api/v1/ext/scores \
  -H "Authorization: Bearer $MCMAI_EXT_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @scores.json
```

The server runs structural validation first, queues the file once it passes, and waits up to 20 seconds within the request:

- Finished within 20 seconds: returns `200` with the same content as [querying the result](#task), plus `task_id`. A failed task also returns `200`, with `status` set to `failed`.
- No result yet: returns `202` with `{"task_id": "…"}`. Query the result with the task ID later.

An API upload links the custom data source account to the user who owns the token, but does not switch the region currently in use in McMai.

### Query the result {#task}

```
GET https://sync.moev.cc/api/v1/ext/tasks/<task_id>
Authorization: Bearer <upload token>
```

A `status` of `pending` or `processing` means the task is still running; query again after a few seconds. When finished:

```json
{
  "status": "done",
  "kind": "ext_upload",
  "server": "ext_jp",
  "result": {
    "rating_before": 15180,
    "rating_after": 15246,
    "new_records": 5,
    "bound": true,
    "written": 1203,
    "dropped": {
      "unknown": {"count": 2, "samples": [{"path": "scores[3]", "title": "Song title"}]}
    },
    "profile_dropped": [{"path": "profile.icon", "code": "ambiguous"}]
  }
}
```

| Field | Description |
| --- | --- |
| `written` | Number of charts written |
| `dropped` | Rows skipped by catalog validation, grouped by [reason](#validation). `samples` has up to 10 entries. `title` is the title in the file, or `null` if only `song_id` was given |
| `profile_dropped` | Profile fields cleared by collection validation, as `{"path", "code"}`. See [validation results](#validation) for the codes |
| `empty` | `true` means the account now has no scores |
| `rating_before`, `rating_after` | Rating before and after the upload |

If processing fails, `status` is `failed` and `error_code` is `update_failed`, meaning a server-side error occurred. Try again later.

### Limits and error codes {#limits}

- Each user can have only one task in progress at a time, including web uploads.
- Uploads must be at least 60 seconds apart. Web and API uploads share one timer, counted from the previous custom data source upload.
- The request body must not exceed 2.5 MiB, and scores must not exceed 8000 entries.

Errors return `{"error_code": "…"}`:

| Status | `error_code` | Description |
| --- | --- | --- |
| 400 | `ext_invalid` | Structural validation failed. `errors` lists the first 20 problems as `{"path", "code"}`. See [validation results](#validation) for the codes |
| 400 | `bad_json` | The request body is not a JSON object |
| 401 | `bad_token` | Token missing, malformed, reset, or deleted |
| 404 | `not_found` | The task does not exist or was not uploaded by this token's user |
| 409 | `task_in_progress` | A task is already in progress. Its `task_id` is included |
| 413 | `payload_too_large` | The request body exceeds 2.5 MiB |
| 415 | `bad_content_type` | `Content-Type` is not `application/json` |
| 429 | `too_many_requests` | Less than 60 seconds since the last upload. `retry_after` and the `Retry-After` response header give the seconds to wait |
| 503 | `bind_disabled` | The service is temporarily not accepting uploads. Try again later |
