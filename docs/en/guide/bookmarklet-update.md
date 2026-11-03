---
title: Bookmarklet Update Guide
description: Install and use the McMai bookmarklet for JP and INTL scores, with illustrations for desktop Chrome, iPhone Safari, and Android Chrome.
---

<script setup>
import BookmarkletGuide from '../../.vitepress/theme/components/BookmarkletGuide.vue'
import UploaderProgressDemo from '../../.vitepress/theme/components/UploaderProgressDemo.vue'
</script>

Bookmarklet updates support the JP and INTL regions. After login to the official maimai NET site, the bookmarklet retrieves scores using the browser's current session and uploads them to McMai. A SEGA ID and password do not need to be submitted to McMai.

## 1. Generate the bookmarklet {#generate}

1. Send `/bind` to the bot and open the returned binding link.
2. Select JP or INTL and choose Bookmarklet as the update method.
3. Generate the bookmarklet. On a phone, copy its code. On a computer, the binding page also provides a draggable button.

The same bookmarklet works for JP and INTL. Its full code is associated with the current McMai account and must be obtained from that account's binding page. The code in the illustrations is a placeholder and cannot be used for installation.

::: warning Bookmarklet credentials
The code contains credentials for uploading scores to the associated McMai account. Do not share it or include it in public screenshots. Regenerating invalidates the previous bookmarklet immediately; update its code in every browser where it is installed.
:::

## 2. Install and use {#install}

[Desktop Chrome (Windows / macOS)](#desktop) · [iPhone Safari](#ios) · [Android Chrome](#android)

The illustrated interface language can be selected separately. For each update, log in to maimai NET in the browser where the bookmarklet is installed, then run it.

### Computer: Chrome {#desktop}

Windows and macOS use the same process. Show the bookmarks bar with `Ctrl+Shift+B` on Windows or `⌘+Shift+B` on macOS. Install by dragging from the binding page, or use the manual alternative in illustration step 3.

<BookmarkletGuide platform="desktop" />

For manual installation, paste the code into the **bookmark's URL field**. Chrome may remove the `javascript:` prefix from code pasted directly into the browser address bar, preventing execution.

### iPhone: Safari {#ios}

The illustration uses the bottom tab bar layout. Save a normal webpage bookmark, then replace its URL with the full code. Other layouts provide bookmark actions in the page menu.

<BookmarkletGuide platform="ios" />

With the logged-in NET page open, run McMai from the bookmarks list. Safari's address bar suggestions may not execute the bookmarklet.

### Android: Chrome {#android}

Bookmark the current page, then edit its name and URL. The example uses `McMai` as the name so it can be located in the address bar.

<BookmarkletGuide platform="android" />

With the logged-in NET page open, type the bookmark name in the address bar and select the suggestion with a star icon. Opening it from the bookmark manager may navigate to the link without running the update.

## 3. Log in to NET and check the result {#result}

Open and log in to the appropriate region in the browser where the bookmarklet is installed:

| Region | Official NET |
| --- | --- |
| JP | [maimaidx.jp](https://maimaidx.jp/maimai-mobile/) |
| INTL | [maimaidx-eng.com](https://maimaidx-eng.com/maimai-mobile/) |

After running the bookmarklet on NET, a circular button appears at the lower right with a status pill on its left. During fetching, the outer ring shows progress by page count. During preparation, upload, and processing, it displays a rotating arc. A result panel appears on completion.

<UploaderProgressDemo />

Duration depends on the network and NET response times. Check the actual result panel for completion.

After completion, send `/switchserver jp` or `/switchserver intl` to the bot, followed by `/b50` to view the scores.

## Subsequent updates {#next-time}

1. Log in to the appropriate maimai NET region in the browser containing the bookmarklet.
2. Run it using the method for that device and wait for the upload to finish.

The installed bookmarklet can be reused. Reinstall it after changing browsers or regenerating its code.

## Troubleshooting {#faq}

### No upload progress appears

Check that the current page is a logged-in maimai NET page and that the saved URL contains the full code, starting with `javascript:`. On iPhone, use Safari's bookmarks list. On Android Chrome, use the address bar suggestion with a star icon.

### The in-app browser cannot run the bookmarklet

Browsers embedded in QQ, LINE, WeChat, and similar apps may restrict bookmarklet scripts. Use a separate browser such as Safari or Chrome, log in to NET again, and run the bookmarklet there.

### Invalid bookmarklet or disabled permissions

Regeneration immediately invalidates the old bookmarklet. Send `/bind` again to view the current bookmarklet or generate new code, then update the saved URL. Contact the administrator if the page reports disabled permissions.

### Wrong account or region

The bookmarklet uses the NET account currently logged in to the browser. Check the account and region before running it, and select the corresponding region in the bot before querying scores.

## Browser references {#references}

- [Chrome desktop keyboard shortcuts](https://support.google.com/chrome/answer/157179?hl=en)
- [Add and edit Safari bookmarks](https://support.apple.com/en-gb/guide/iphone/iph42ab2f3a7/ios)
- [Add and edit Android Chrome bookmarks](https://support.google.com/chrome/answer/188842?co=GENIE.Platform%3DAndroid&hl=en)

---

Related: [Account & Server](/en/commands/account) · [Score Tracking Guide](/en/guide/score-tracking) · [CN NET Update Guide](/en/guide/cn-net-update)
