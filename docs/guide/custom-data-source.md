---
title: 自定义数据源
description: 将 maimai 成绩上传至 McMai 自定义数据源：网页上传步骤、规范格式 mcmai-scores 的字段与曲目定位规则，以及 API 上传的鉴权、限制与错误码。
---

自定义数据源用于导入其他来源的成绩，例如由其他工具导出、再转换为规范格式的成绩。国服、日服、国际服各有一个自定义数据源账号，与该区服的其他账号一样，可用 `/选卡` 或绑定页的账号列表切换。

::: info 使用前须知
- **只收成绩。** 不含玩家资料与游玩记录，Rating 由 McMai 按成绩与定数重新计算。
- **整份替换。** 每次上传都会替换该账号的全部成绩，文件中没有的谱面会被删除；上传空列表即清空。
- **排行榜。** 不计入全局排行；`/群排行`、`/群rating` 的区服参数写 `all` 时计入，并标注来源。
- **只收规范格式。** McMai 不转换其他查分器或工具的导出文件，上传前需转换为[规范格式](#format)。
:::

## 一、网页上传 {#web}

1. 向 Bot 发送 `/绑定`，打开返回的绑定链接。
2. 选择成绩所属的区服标签，将更新方式切换为「自定义」。
3. 选择成绩文件（JSON，不超过 2 MiB），也可以直接拖入。
4. 如需上传后在 McMai 中直接查看这些成绩，勾选「上传后在 McMai 中切换到自定义数据源账号」。
5. 点击「上传成绩」，等待处理完成。

结果页显示写入的谱面数与未写入的行。写入成功且有成绩时生成 B50 图。文件中的 `catalog` 须与所在标签一致，否则整份不予受理。

## 二、规范格式 {#format}

规范格式是一个 JSON 对象，`format` 固定为 `mcmai-scores`：

```json
{
  "format": "mcmai-scores",
  "version": 1,
  "catalog": "jp",
  "exported_at": "2026-11-19T08:30:00Z",
  "scores": [
    {"title": "Link(COF)", "type": "standard", "level_index": 3,
     "achievements": 100.5123, "dx_score": 1700, "fc": "ap", "fs": "fsp", "play_count": 12},
    {"title": "[宴]Wonderland Wars　オープニング", "type": "utage", "level_index": 0, "level": "14",
     "achievements": 101.0, "dx_score": 1500}
  ]
}
```

### 顶层字段 {#top-level}

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `format` | 是 | 固定为 `mcmai-scores` |
| `version` | 是 | 整数 `1` |
| `catalog` | 是 | `cn`、`jp`、`intl`。决定曲名按哪个区服的曲库识别，以及写入哪个区服的账号 |
| `exported_at` | 否 | 成绩的导出时间，ISO 8601 格式且须带时区，如 `2026-11-19T08:30:00Z`。用作成绩的更新时间，不写或晚于上传时间时按上传时间计 |
| `scores` | 是 | 成绩数组，最多 8000 条 |

表中未列出的键会被忽略。

### 成绩字段 {#scores}

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 二选一 | 曲名，最长 256 个字符 |
| `type` | 用 `title` 时 | `standard`、`dx`、`utage`，不区分大小写；`sd`、`std` 视同 `standard` |
| `song_id` | 二选一 | 官方乐曲编号。同一首歌的 DX 谱面编号比标准谱面多 10000，宴谱为六位数 |
| `level_index` | 是 | 难度，0 到 4 依次为 Basic、Advanced、Expert、Master、Re:Master。宴谱写 0，双人宴谱的第二位置写 1 |
| `level` | 否 | 显示等级，如 `14+`，最长 8 个字符。用于区分同名的宴谱变体 |
| `achievements` | 是 | 达成率，百分数，最多 4 位小数，如 `100.5123`。范围 0 到 101，宴谱到 202 |
| `dx_score` | 是 | DX 分数，非负整数 |
| `fc` | 否 | `fc`、`fcp`、`ap`、`app`。空字符串或 `null` 视为没有 |
| `fs` | 否 | `sync`、`fs`、`fsp`、`fdx`、`fdxp`，也接受 `fsd`、`fsdp`。空字符串或 `null` 视为没有 |
| `play_count` | 否 | 该谱面的游玩次数，不写记为 0 |

`fc`、`fs` 区分大小写。同一个文件中不能有两行指向同一张谱面：`song_id` 与 `level_index` 相同，或 `title`、`type`、`level_index`、`level` 都相同。

### 谱面定位 {#locate}

每行用以下两种方式之一指定谱面：

- **曲名**：`title` + `type` + `level_index`，必要时加 `level`。
- **编号**：`song_id` + `level_index`。两种都写时以编号为准，不核对曲名。

按曲名识别时：

1. 先在 `catalog` 指定的曲库中找曲名与类型完全一致的谱面。
2. 找不到时忽略大小写、全半角与多余空白再找一次，结果唯一才采用。例如 `Link(CoF)` 能识别为 `Link(COF)`。
3. 同名同类型有多首时按 `level` 筛选，筛不出唯一一首时跳过这一行。目前只有 `[宴]Wonderland Wars　オープニング`、`[協]青春コンプレックス` 两组宴谱需要带 `level`。宴谱的等级末尾有无 `?` 均可。
4. 曲名为空或只有空白时，识别为曲名是一个全角空格的那首歌。

::: tip 两首 Link
曲库中有两首标准谱面的 Link，游戏中都显示为 `Link`。第二首请写作 `Link(COF)`。写作 `Link` 时，McMai 依次按 Re:Master（只有第一首有）、`level`（Advanced、Expert 两首等级不同）、DX 分数是否超过第一首的上限判断；仍无法判断时跳过这一行。写 `song_id` 则不受影响。
:::

### 校验结果 {#validation}

上传的文件经过两层校验。

**结构校验**检查字段类型、取值范围与重复行。不通过时整份不予受理、不写入任何成绩，并列出前 20 个问题，位置写作 `scores[12].achievements` 这样的形式：

| 代码 | 含义 |
| --- | --- |
| `not_object` | 应为对象 |
| `enum` | 取值不在允许范围内，如 `format`、`catalog`、`type`、`fc`、`fs` |
| `datetime` | 时间格式不正确或缺少时区 |
| `required` | 缺少必填字段 |
| `type` | 类型不正确，如数字写成了字符串 |
| `too_many` | `scores` 超过 8000 条 |
| `locator` | 缺少 `title` 或 `song_id` |
| `range` | 超出取值范围 |
| `scaled` | 达成率大于 1000，疑似乘了 10000，应填百分数 |
| `precision` | 达成率超过 4 位小数 |
| `duplicate` | 与前面的行指向同一张谱面 |

**曲库校验**只跳过有问题的行，其余照常写入。结果中按原因列出跳过的行数，以及前 10 行的位置和曲名：

| 原因 | 含义 |
| --- | --- |
| `unknown` | 曲库中找不到该曲目或谱面 |
| `ambiguous` | 同名谱面无法区分，请带上 `level` 或 `song_id` |
| `link_ambiguous` | 无法判断是哪首 Link，请改写为 `Link(COF)` 或带上 `song_id` |
| `dx_over` | DX 分数超过该谱面的上限（物量乘 3）。宴谱不检查 |
| `ach_over` | 非宴谱的达成率超过 101% |
| `duplicate_chart` | 多行对应同一张谱面，这些行都不写入 |

曲库随游戏更新，新曲在 McMai 更新曲库前会被跳过，曲库更新后重新上传即可写入。

## 三、API 上传 {#api}

由程序定期上传时，可使用上传令牌调用 API，无需打开绑定页。

### 上传令牌 {#token}

在绑定页任一区服的「自定义」中点击「签发令牌」。令牌以 `mcext_` 开头，三个区服通用，按上传内容中的 `catalog` 写入对应区服。

- 令牌只在签发时显示一次，请立即保存。遗失后点击「重置令牌」，旧令牌立即失效。
- 「删除令牌」后无法再通过 API 上传，已上传的成绩保留。
- 令牌只能用于上传成绩与查询上传结果，不应出现在公开的代码或截图中。

::: warning 解绑后的关联
在绑定页解绑自定义数据源账号后，只要令牌仍有效，下一次 API 上传会重新关联这个账号。不再使用时请一并删除令牌。
:::

### 上传成绩 {#upload}

```
POST https://sync.moev.cc/api/v1/ext/scores
Authorization: Bearer <上传令牌>
Content-Type: application/json
```

请求体直接是规范格式的 JSON 对象，不使用 multipart 表单或文件上传。程序可在内存中生成成绩后直接发送，无需先保存为文件：

```python
import requests

doc = {"format": "mcmai-scores", "version": 1, "catalog": "jp", "scores": scores}
r = requests.post(
    "https://sync.moev.cc/api/v1/ext/scores",
    headers={"Authorization": f"Bearer {token}"},
    json=doc,
)
```

`requests` 的 `json=` 参数会自动设置 `Content-Type: application/json`。使用 curl 发送已保存的 JSON 时，`@scores.json` 表示读取该文件的内容作为请求体：

```bash
curl -X POST https://sync.moev.cc/api/v1/ext/scores \
  -H "Authorization: Bearer $MCMAI_EXT_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @scores.json
```

服务端先做结构校验，通过后排队处理，并在请求中最多等待 20 秒：

- 20 秒内处理完：返回 `200`，内容与[查询结果](#task)相同，另带 `task_id`。处理失败同样返回 `200`，`status` 为 `failed`。
- 未等到结果：返回 `202` 与 `{"task_id": "…"}`，之后用任务号查询。

API 上传会将自定义数据源账号关联到令牌所属的用户，但不切换 McMai 中当前使用的区服。

### 查询结果 {#task}

```
GET https://sync.moev.cc/api/v1/ext/tasks/<task_id>
Authorization: Bearer <上传令牌>
```

`status` 为 `pending`、`processing` 时仍在处理，请间隔几秒再查。处理完成时：

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
    }
  }
}
```

| 字段 | 说明 |
| --- | --- |
| `written` | 写入的谱面数 |
| `dropped` | 曲库校验跳过的行，按[原因](#validation)分组。`samples` 最多 10 条，`title` 为文件中的曲名，只写了 `song_id` 时为 `null` |
| `empty` | 为 `true` 时表示该账号现在没有成绩 |
| `rating_before`、`rating_after` | 上传前后的 Rating |

处理失败时 `status` 为 `failed`，`error_code` 为 `update_failed`，表示服务端处理出错，可稍后重试。

### 限制与错误码 {#limits}

- 同一用户同时只能有一个处理中的任务，网页上传也计算在内。
- 两次上传至少间隔 60 秒，间隔从上一次自定义数据源上传算起，网页上传也计入。
- 请求体不超过 2 MiB，成绩不超过 8000 条。

出错时返回 `{"error_code": "…"}`：

| 状态码 | `error_code` | 说明 |
| --- | --- | --- |
| 400 | `ext_invalid` | 结构校验未通过，`errors` 列出前 20 个问题，格式为 `{"path", "code"}`，代码见[校验结果](#validation) |
| 400 | `bad_json` | 请求体不是 JSON 对象 |
| 401 | `bad_token` | 令牌缺失、格式不对、已重置或已删除 |
| 404 | `not_found` | 查询的任务不存在，或不是这个令牌的用户上传的 |
| 409 | `task_in_progress` | 已有处理中的任务，附带它的 `task_id` |
| 413 | `payload_too_large` | 请求体超过 2 MiB |
| 415 | `bad_content_type` | `Content-Type` 不是 `application/json` |
| 429 | `too_many_requests` | 距上次上传不足 60 秒，`retry_after` 与响应头 `Retry-After` 给出需等待的秒数 |
| 503 | `bind_disabled` | 服务暂停受理，请稍后再试 |
