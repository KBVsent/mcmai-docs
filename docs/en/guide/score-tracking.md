---
title: maimai DX Score Tracking Guide
description: Use McMai on QQ, LINE, or Discord to update and query maimai DX scores for the CN, JP, and INTL regions, including top scores, song records, and progress.
---

# maimai DX Score Tracking Guide

McMai is a free score tracking and analytics bot for maimai DX players. It works as a maimai score tracker on Discord, LINE, and QQ, and supports play data from the CN, JP, and INTL regions without requiring a separate score-tracker website.

## What can you check?

| Goal | McMai feature | Details |
|------|---------------|---------|
| Review overall performance | Generate summaries of your highest-rated charts | [Top score analysis](/en/commands/b50) |
| Check a song record | View achievement, DX score, and FC/FS status | [Score query](/en/commands/score) |
| Find songs and charts | Search by title, alias, artist, BPM, or chart constant | [Song search](/en/commands/search) |
| Track completion | Review level, category, and completion progress | [Progress](/en/commands/progress) |
| Compare players | Browse leaderboards or compare with friends | [Leaderboards](/en/commands/leaderboard) |

## Regions and update methods

| Region | How to update data |
|--------|--------------------|
| CN | Send the `SGWCMAID` content obtained from the player QR code in the official 舞萌｜中二 WeChat account |
| JP | Use the binding page from `/bind`, or update with the bookmarklet without submitting a password |
| INTL | Use the binding page from `/bind`, or update with the bookmarklet without submitting a password |

See [Account & Server](/en/commands/account) for complete binding, bookmarklet, and region-switching instructions.

## Start tracking

1. Add and open McMai on QQ, LINE, or Discord.
2. Update your play data using the method for your region.
3. Select CN, JP, or INTL with `/switchserver`.
4. Send `/b50` to review your top scores, or `/info <song ID or title>` to query one song.

If you have not added the bot yet, begin with [Getting Started](/en/guide/getting-started). Use the [Command Reference](/en/commands/basic) to find other features and parameters.

::: info Privacy note
JP and INTL players can use the bookmarklet update method without submitting a SEGA ID or password to McMai.
:::
