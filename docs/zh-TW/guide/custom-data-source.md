---
title: 自訂資料來源
description: 將 maimai 成績上傳至 McMai 自訂資料來源：網頁上傳步驟、規範格式 mcmai-scores 的欄位與曲目定位規則，以及 API 上傳的身分驗證、限制與錯誤碼。
---

自訂資料來源用於匯入其他來源的成績，例如由其他工具匯出、再轉換為規範格式的成績。大陸區、日本區、國際區各有一個自訂資料來源帳號，與該區服的其他帳號一樣，可用 `/選卡` 或綁定頁的帳號列表切換。

::: info 使用前須知
- **成績與選填的資料。** 可附帶頭像、稱號、旅行夥伴等[資料](#profile)。暱稱與遊玩記錄不收，帳號名稱顯示為「自訂」；Rating 由 McMai 依成績與定數重新計算。
- **整份取代。** 每次上傳都會取代該帳號的全部成績與資料，檔案中沒有的譜面會被刪除、沒有的資料會被清空；上傳空列表即清空成績。
- **排行榜。** 不計入全域排行；`/群排行`、`/群rating` 的區服參數寫 `all` 時計入，並標註來源。
- **只收規範格式。** McMai 不轉換其他查分器或工具的匯出檔案，上傳前需轉換為[規範格式](#format)。
:::

## 一、網頁上傳 {#web}

1. 向 Bot 傳送 `/綁定`，開啟回傳的綁定連結。
2. 選擇成績所屬的區服標籤，將更新方式切換為「自訂」。
3. 選擇成績檔案（JSON，不超過 2.5 MiB），也可以直接拖曳進來。
4. 如需上傳後在 McMai 中直接查看這些成績，勾選「上傳後在 McMai 中切換到自訂資料來源帳號」。
5. 點選「上傳成績」，等待處理完成。

結果頁顯示寫入的譜面數、未寫入的列與未寫入的資料。寫入成功且有成績時產生 B50 圖。檔案中的 `catalog` 須與所在標籤一致，否則整份不予受理。兩次上傳至少間隔 60 秒，見[限制與錯誤碼](#limits)。

## 二、規範格式 {#format}

規範格式是一個 JSON 物件，`format` 固定為 `mcmai-scores`：

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

### 頂層欄位 {#top-level}

| 欄位 | 必填 | 說明 |
| --- | --- | --- |
| `format` | 是 | 固定為 `mcmai-scores` |
| `version` | 是 | 整數 `1` |
| `catalog` | 是 | `cn`、`jp`、`intl`。決定曲名依哪個區服的曲庫辨識，以及寫入哪個區服的帳號 |
| `exported_at` | 否 | 成績的匯出時間，ISO 8601 格式且須帶時區，如 `2026-11-19T08:30:00Z`。用作成績的更新時間，未填寫或晚於上傳時間時以上傳時間計 |
| `profile` | 否 | 帳號資料，見[資料欄位](#profile) |
| `scores` | 是 | 成績陣列，最多 8000 筆 |

表中未列出的鍵會被忽略。

### 成績欄位 {#scores}

| 欄位 | 必填 | 說明 |
| --- | --- | --- |
| `title` | 二選一 | 曲名，依 `catalog` 區服的曲庫辨識，規則見[譜面定位](#locate)。最長 256 個字元 |
| `type` | 使用 `title` 時 | `standard`、`dx`、`utage`，不區分大小寫；`sd`、`std` 視同 `standard` |
| `song_id` | 二選一 | 樂曲編號，整數 |
| `level_index` | 是 | 難度，0 到 4 依序為 Basic、Advanced、Expert、Master、Re:Master。宴譜寫 0，雙人宴譜的第二位置寫 1 |
| `level` | 否 | 顯示等級，如 `14+`，最長 8 個字元。用於區分同名的宴譜變體 |
| `achievements` | 是 | 達成率，百分數，最多 4 位小數，如 `100.5123`。範圍 0 到 101，宴譜到 202 |
| `dx_score` | 是 | DX 分數，非負整數 |
| `fc` | 否 | `fc`、`fcp`、`ap`、`app`。空字串或 `null` 視為沒有 |
| `fs` | 否 | `sync`、`fs`、`fsp`、`fdx`、`fdxp`，也接受 `fsd`、`fsdp`。空字串或 `null` 視為沒有 |
| `play_count` | 否 | 該譜面的遊玩次數，未填寫記為 0。有遊玩次數時可使用 `/pc50` |

`fc`、`fs` 區分大小寫。同一個檔案中不能有兩列指向同一張譜面：`song_id` 與 `level_index` 相同，或 `title`、`type`、`level_index`、`level` 都相同。

### 資料欄位 {#profile}

`profile` 中的欄位都是選填，顯示在 B50 與 `/查看頂板` 中，不影響成績與 Rating。

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

| 欄位 | 說明 |
| --- | --- |
| `play_count` | 遊玩次數 |
| `current_play_count` | 本版本遊玩次數 |
| `total_awake` | 覺醒數 |
| `mai_mile` | 里程 |
| `partner_present` | 禮物數 |
| `course_rank` | 段位編號，見[段位與階級](#ranks) |
| `class_rank` | 階級編號，見[段位與階級](#ranks) |
| `icon`、`nameplate`、`frame`、`title` | 頭像、名牌板、背景板、稱號。填名稱，也可填整數編號 |
| `partner` | 夥伴，`{"name": 名稱}` 或 `{"id": 編號}`，可加上 `rate`（親密度） |
| `characters` | 旅行夥伴，最多 5 個，第一個為隊長。每個為 `{"name": 名稱}` 或 `{"id": 編號}`，加上必填的 `level` |

除收藏品引用外，數值均為非負整數。暱稱、Rating、小組等未列出的鍵會被忽略。

收藏品名稱的要求：

- 填遊戲中顯示的日文名或大陸區名稱，與 `catalog` 無關。
- 比對時忽略大小寫、全半形與多餘空白，其餘須完全一致。名稱中的版本後綴不能省略，如 `ソルト（ふぇすてぃばる）`。
- 圖片路徑、資源雜湊等其他寫法無法辨識。
- 同一角色的不同版本可能同名，這時無法確定是哪一個，結果中標為 `ambiguous`，請改用編號。

稱號的稀有度依收藏品資料決定，不需要填寫。

未填寫 `frame` 或 `frame` 無法辨識時，B50 不顯示頂板，只顯示簡易的玩家資訊，`/查看頂板` 無法產生。計數、`partner`、`characters` 只顯示在頂板上，這時不寫入，結果中標為 `needs_frame`。

### 段位與階級 {#ranks}

`course_rank` 與 `class_rank` 只能填編號。

段位：

| 編號 | 段位 | 編號 | 段位 |
| --- | --- | --- | --- |
| 0 | 初心者 | | |
| 1 | 初段 | 12 | 真初段 |
| 2 | 二段 | 13 | 真二段 |
| 3 | 三段 | 14 | 真三段 |
| 4 | 四段 | 15 | 真四段 |
| 5 | 五段 | 16 | 真五段 |
| 6 | 六段 | 17 | 真六段 |
| 7 | 七段 | 18 | 真七段 |
| 8 | 八段 | 19 | 真八段 |
| 9 | 九段 | 20 | 真九段 |
| 10 | 十段 | 21 | 真十段 |
| 11 | 皆傳 | 22 | 真皆傳 |
| | | 23 | 裏皆傳 |

階級：表中數字為編號，如 SS3 為 17，LEGEND 為 25。

| 階級 | 5 | 4 | 3 | 2 | 1 |
| --- | --- | --- | --- | --- | --- |
| B | 0 | 1 | 2 | 3 | 4 |
| A | 5 | 6 | 7 | 8 | 9 |
| S | 10 | 11 | 12 | 13 | 14 |
| SS | 15 | 16 | 17 | 18 | 19 |
| SSS | 20 | 21 | 22 | 23 | 24 |

### 譜面定位 {#locate}

每列用以下兩種方式之一指定譜面：

- **曲名**：`title` + `type` + `level_index`，必要時加上 `level`。
- **編號**：`song_id` + `level_index`。兩種都寫時以編號為準，不核對曲名。

依曲名辨識時：

1. 先在 `catalog` 指定的曲庫中尋找曲名與類型完全一致的譜面。
2. 找不到時忽略大小寫、全半形與多餘空白再找一次，結果唯一才採用。例如 `Link(CoF)` 能辨識為 `Link(COF)`。
3. 同名同類型有多首時依 `level` 篩選，篩不出唯一一首時略過這一列。目前只有 `[宴]Wonderland Wars　オープニング`、`[協]青春コンプレックス` 兩組宴譜需要帶 `level`。宴譜的等級結尾有無 `?` 均可。
4. 曲名為空或只有空白時，辨識為曲名是一個全形空格的那首歌。

::: tip 兩首 Link
曲庫中有兩首標準譜面的 Link，遊戲中都顯示為 `Link`。第二首請寫作 `Link(COF)`。寫作 `Link` 時，McMai 依序以 Re:Master（只有第一首有）、`level`（Advanced、Expert 兩首等級不同）、DX 分數是否超過第一首的上限判斷；仍無法判斷時略過這一列。寫 `song_id` 則不受影響。
:::

### 驗證結果 {#validation}

上傳的檔案經過兩層驗證。

**結構驗證**檢查欄位型別、取值範圍與重複列。未通過時整份不予受理、不寫入任何成績，並列出前 20 個問題，位置寫作 `scores[12].achievements`、`profile.characters[0].level` 這樣的形式：

| 代碼 | 意義 |
| --- | --- |
| `not_object` | 應為物件 |
| `enum` | 取值不在允許範圍內，如 `format`、`catalog`、`type`、`fc`、`fs` |
| `datetime` | 時間格式不正確或缺少時區 |
| `required` | 缺少必填欄位 |
| `type` | 型別不正確，如數字寫成了字串 |
| `too_many` | `scores` 超過 8000 筆，或 `characters` 超過 5 個 |
| `locator` | 缺少 `title` 或 `song_id`；`partner`、`characters` 中缺少 `id` 或 `name` |
| `range` | 超出取值範圍 |
| `scaled` | 達成率大於 1000，疑似乘了 10000，應填百分數 |
| `precision` | 達成率超過 4 位小數 |
| `duplicate` | 與前面的列指向同一張譜面 |

**曲庫驗證**只略過有問題的列，其餘照常寫入。結果中依原因列出略過的列數，以及前 10 列的位置和曲名：

| 原因 | 意義 |
| --- | --- |
| `unknown` | 曲庫中找不到該曲目或譜面 |
| `ambiguous` | 同名譜面無法區分，請帶上 `level` 或 `song_id` |
| `link_ambiguous` | 無法判斷是哪首 Link，請改寫為 `Link(COF)` 或帶上 `song_id` |
| `dx_over` | DX 分數超過該譜面的上限（物量乘 3）。宴譜不檢查 |
| `ach_over` | 非宴譜的達成率超過 101% |
| `duplicate_chart` | 多列對應同一張譜面，這些列都不寫入 |

曲庫隨遊戲更新，新曲在 McMai 更新曲庫前會被略過，曲庫更新後重新上傳即可寫入。

**收藏品驗證**只清空無法寫入的資料欄位，成績與其他欄位照常寫入。結果中列出這些欄位的位置：

| 原因 | 意義 |
| --- | --- |
| `unknown` | 收藏品資料中找不到該編號或名稱 |
| `ambiguous` | 名稱對應多個收藏品，請改用編號 |
| `needs_frame` | 未填寫 `frame` 或 `frame` 無法辨識，只顯示在頂板上的欄位不寫入 |

`characters` 中有一個無法辨識時，整組旅行夥伴都不寫入。

## 三、API 上傳 {#api}

由程式定期上傳時，可使用上傳權杖呼叫 API，無須開啟綁定頁。

### 上傳權杖 {#token}

在綁定頁任一區服的「自訂」中點選「核發權杖」。權杖以 `mcext_` 開頭，三個區服通用，依上傳內容中的 `catalog` 寫入對應區服。

- 權杖只在核發時顯示一次，請立即儲存。遺失後點選「重設權杖」，舊權杖立即失效。
- 「刪除權杖」後無法再透過 API 上傳，已上傳的成績保留。
- 權杖只能用於上傳成績與查詢上傳結果，不應出現在公開的程式碼或截圖中。

::: warning 解綁後的關聯
在綁定頁解綁自訂資料來源帳號後，只要權杖仍有效，下一次 API 上傳會重新關聯這個帳號。不再使用時請一併刪除權杖。
:::

### 上傳成績 {#upload}

```
POST https://sync.moev.cc/api/v1/ext/scores
Authorization: Bearer <上傳權杖>
Content-Type: application/json
```

請求內容直接是規範格式的 JSON 物件，不使用 multipart 表單或檔案上傳。程式可在記憶體中產生成績後直接送出，無須先儲存為檔案：

```python
import requests

doc = {"format": "mcmai-scores", "version": 1, "catalog": "jp", "scores": scores}
r = requests.post(
    "https://sync.moev.cc/api/v1/ext/scores",
    headers={"Authorization": f"Bearer {token}"},
    json=doc,
)
```

`requests` 的 `json=` 參數會自動設定 `Content-Type: application/json`。使用 curl 送出已儲存的 JSON 時，`@scores.json` 表示讀取該檔案的內容作為請求內容：

```bash
curl -X POST https://sync.moev.cc/api/v1/ext/scores \
  -H "Authorization: Bearer $MCMAI_EXT_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @scores.json
```

伺服器端先做結構驗證，通過後排隊處理，並在請求中最多等待 20 秒：

- 20 秒內處理完：回傳 `200`，內容與[查詢結果](#task)相同，另帶 `task_id`。處理失敗同樣回傳 `200`，`status` 為 `failed`。
- 未等到結果：回傳 `202` 與 `{"task_id": "…"}`，之後用任務編號查詢。

API 上傳會將自訂資料來源帳號關聯到權杖所屬的使用者，但不切換 McMai 中目前使用的區服。

### 查詢結果 {#task}

```
GET https://sync.moev.cc/api/v1/ext/tasks/<task_id>
Authorization: Bearer <上傳權杖>
```

`status` 為 `pending`、`processing` 時仍在處理，請間隔幾秒再查。處理完成時：

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
      "unknown": {"count": 2, "samples": [{"path": "scores[3]", "title": "曲名"}]}
    },
    "profile_dropped": [{"path": "profile.icon", "code": "ambiguous"}]
  }
}
```

| 欄位 | 說明 |
| --- | --- |
| `written` | 寫入的譜面數 |
| `dropped` | 曲庫驗證略過的列，依[原因](#validation)分組。`samples` 最多 10 筆，`title` 為檔案中的曲名，只寫了 `song_id` 時為 `null` |
| `profile_dropped` | 收藏品驗證清空的資料欄位，格式為 `{"path", "code"}`，代碼見[驗證結果](#validation) |
| `empty` | 為 `true` 時表示該帳號現在沒有成績 |
| `rating_before`、`rating_after` | 上傳前後的 Rating |

處理失敗時 `status` 為 `failed`，`error_code` 為 `update_failed`，表示伺服器端處理出錯，可稍後重試。

### 限制與錯誤碼 {#limits}

- 同一使用者同時只能有一個處理中的任務，網頁上傳也計算在內。
- 兩次上傳至少間隔 60 秒。網頁上傳與 API 上傳共用計時，從上一次自訂資料來源上傳起算。
- 請求內容不超過 2.5 MiB，成績不超過 8000 筆。

出錯時回傳 `{"error_code": "…"}`：

| 狀態碼 | `error_code` | 說明 |
| --- | --- | --- |
| 400 | `ext_invalid` | 結構驗證未通過，`errors` 列出前 20 個問題，格式為 `{"path", "code"}`，代碼見[驗證結果](#validation) |
| 400 | `bad_json` | 請求內容不是 JSON 物件 |
| 401 | `bad_token` | 權杖缺失、格式不對、已重設或已刪除 |
| 404 | `not_found` | 查詢的任務不存在，或不是這個權杖的使用者上傳的 |
| 409 | `task_in_progress` | 已有處理中的任務，附帶它的 `task_id` |
| 413 | `payload_too_large` | 請求內容超過 2.5 MiB |
| 415 | `bad_content_type` | `Content-Type` 不是 `application/json` |
| 429 | `too_many_requests` | 距上次上傳不足 60 秒，`retry_after` 與回應標頭 `Retry-After` 提供需等待的秒數 |
| 503 | `bind_disabled` | 服務暫停受理，請稍後再試 |
