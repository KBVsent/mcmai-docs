# Chart Analysis & Practice

McMai analyzes the structure of every chart and combines it with your scores to show your Chart Affinity, recommend practice charts, and suggest [Rating targets](/en/commands/tables#rating-targets).

## Chart Structure

These terms appear on search results, chart analysis, and practice picks:

| Term | Meaning |
|------|---------|
| Nine axes | Nine aspects of a chart: Hand Speed, Stamina, Movement, Coordination, Slide Accuracy, Slide Reading, Touch, Rhythm Reading, and Visual Reading. Measured against the full chart library and shown as a radar |
| Structure constant | A constant derived from the chart's content, shown in the center of the radar. It reflects only the difficulty of the content itself, not individual differences. The note distribution table on `/search` results lists it next to the fitted constant; songs without a fitted constant show only the structure constant |
| Chart tags | Patterns that appear in the chart, such as Jacks or Trill, ordered by how much of the chart's length they take up |
| Associated charts | Other charts with a similar structure |

---

## Chart Analysis

Shows the structure of every difficulty of a song in one image. No linked scores needed.

**Command:** `/chartanalysis <song ID or name>`

**Examples:**

| Command |
|---------|
| `/chartanalysis 11451` |
| `/chartanalysis 系ぎて` |

::: tip
The bottom of the image gives a practice command for the song's main pattern (e.g. `/practice Jacks`). On platforms with buttons you can also tap the "Practice" button. The "Chart Analysis" button on `/search` results opens this image.
:::

---

## Practice Picks

Recommends practice charts based on your Chart Affinity, showing each chart's nine-axis structure and your current score. Picks rotate daily. You can only check your own.

**Command:** `/practice [ability or pattern] [difficulty range]`

**Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| Ability or pattern | Optional. An ability is one of the nine axes; a pattern is a chart tag shown on `/info` or `/chartanalysis`. Defaults to your two relatively weaker abilities | `Hand Speed`, `Jacks` |
| Difficulty range | Optional. Levels or constants joined with `-`; a single value means one level. Estimated from your scores by default | `12-13`, `13`, `13.5-14.0` |

The ability or pattern and the range can go in either order. Numbers without a decimal point are read as levels, so `12-13` means levels 12, 12+, and 13.

**Examples:**

| Command | Description |
|---------|-------------|
| `/practice` | Picks for your relative weak spots |
| `/practice Hand Speed` | Hand Speed only |
| `/practice Jacks 13` | Level 13 charts with jacks |
| `/practice 12-13` | Picks from levels 12–13 |

::: tip Works without linked scores
Practicing a pattern (e.g. `/practice Jacks`) or giving a difficulty range doesn't require linked scores, so new players can use it too.
:::

::: tip Calibration picks
Chart Affinity needs enough score samples. Until then, `/practice` recommends a set of calibration charts instead. Once you've played them and updated your scores, Chart Affinity appears on your B50 when the samples are sufficient, and this command switches to practice picks. Calibration charts only add samples; they say nothing about your strengths or weaknesses.
:::

---

## Chart Affinity

With enough scores, the analysis panel of your B50 image shows a Chart Affinity radar. Its size reflects your overall level, the shape shows your relative performance on each type of chart, and your relative weak spots are marked.

- It's calculated only from your own best scores (all available scores, not just your B50), comparing your performance across chart types with each other rather than with other players.
- Only relative weak spots are marked, not strengths. Touch isn't assessed.
- It's hidden when there aren't enough samples; send `/practice` for calibration charts.
- Once established, it's used to rank `/practice` and [`/risescore picks`](/en/commands/tables#rating-targets), and to choose the chart in [`/maitoday`](/en/commands/basic#today-s-fortune).
