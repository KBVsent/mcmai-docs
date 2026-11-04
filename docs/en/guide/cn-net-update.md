---
title: CN NET Update Guide
description: Update McMai CN NET scores through WeChat authorization, with proxy settings for iOS, Android, Windows, and macOS, entry link setup, and troubleshooting.
---

<script setup>
import CnNetIosGuide from '../../.vitepress/theme/components/CnNetIosGuide.vue'
import CnNetProxyGuide from '../../.vitepress/theme/components/CnNetProxyGuide.vue'
</script>

CN NET scores can be updated through NET WeChat authorization on the binding page. Initial setup requires a proxy configuration and a saved WeChat entry link. Each update requires a new authorization.

## Preparation {#prepare}

1. Send `/bind` to the bot and open the returned binding link.
2. Select NET WeChat authorization for CN to obtain the WeChat entry link.
3. Authorize with the WeChat account associated with the game account.

Use the WeChat entry link shown on the current account's binding page. The interface language in each illustration can be selected separately.

## 1. Configure the proxy {#proxy}

[iPhone / iPad](#ios) · [Android (Pixel)](#android) · [Windows 11](#windows) · [macOS](#macos) · [Clash](#clash)

Configure the proxy on the device used for WeChat authorization. Phones can use a manual Wi-Fi proxy or a client compatible with Clash configurations. Select one method. Record any existing proxy settings before changing them, and restore them after the update.

::: info Desktop scope
The Windows and macOS illustrations cover system proxy settings. The complete desktop WeChat authorization flow has not been tested on a physical device. When opening the entry in WeChat on a phone, configure the phone's proxy; computer proxy settings do not apply to the phone.
:::

### iPhone / iPad: manual Wi-Fi proxy {#ios}

Connect to Wi-Fi and temporarily disable cellular data and Wi-Fi Assist to prevent a switch to cellular during authorization. Wi-Fi Assist is usually near the bottom of Settings → Cellular (or Mobile Data).

<CnNetIosGuide />

Other websites may be unavailable while this Wi-Fi proxy is enabled. After the authorization page confirms handoff, [disable the proxy](#finish) and return to the binding page. A different Wi-Fi network requires its own configuration.

### Android: Google Pixel {#android}

The illustration uses Google Pixel. Connect to Wi-Fi and temporarily disable mobile data and automatic network switching. Menu labels and locations vary between manufacturers.

<CnNetProxyGuide platform="android" />

If the network settings have no proxy option, consult the device manufacturer's instructions or use a compatible Clash client. See [Google's Pixel instructions](https://support.google.com/pixelphone/answer/9655181?hl=en) for the settings path.

### Windows 11: system proxy {#windows}

Open Settings → Network & internet → Proxy and configure Manual proxy setup. Windows 10 may use a different layout.

<CnNetProxyGuide platform="windows" />

See [Microsoft's proxy instructions](https://support.microsoft.com/en-us/windows/experience/connectivity-networking/use-a-proxy-server-in-windows) for the settings path.

### macOS: network proxy {#macos}

Open System Settings → Network, select the active network service, then open Details → Proxies. The illustration uses Wi-Fi. Older macOS versions may use a different path.

<CnNetProxyGuide platform="macos" />

See [Apple's proxy settings reference](https://support.apple.com/en-gb/guide/mac-help/mchlp2591/mac) for the settings path and field descriptions.

### Clash: import the configuration {#clash}

1. Select the import button under proxy setup on the binding page. If the client does not open, copy the Clash configuration URL and select Import from URL in the client.
2. Select the imported McMai configuration, enable the proxy, and grant the system network permissions requested by the client.
3. Return to the binding page and check the proxy detection result.

The configuration must be enabled after import. It routes the authorization callback through the proxy; other traffic follows the configuration's routing rules. Option names vary between clients.

## 2. Save the WeChat entry link {#wechat-entry}

1. Copy the entry link from Save WeChat entry on the binding page.
2. Send it to WeChat File Transfer (文件传输助手 in the Chinese interface) and retain the message for subsequent updates.

::: warning Entry link access
Anyone holding the entry link can use their own WeChat account to write scores to the associated McMai account. Do not forward the link or include it in public screenshots. If disclosed, reset the entry on the binding page and save the new link. The previous link becomes invalid immediately.
:::

## 3. Authorize in WeChat {#authorize}

1. Enable the configured proxy: select Manual for the Wi-Fi network, or enable the McMai configuration in Clash.
2. Open the entry link in WeChat File Transfer and follow the authorization prompts.
3. Wait for the page to confirm handoff. Authorization has then been submitted to the update service; score retrieval and processing continue afterward.

## 4. Disable the proxy and check the result {#finish}

After handoff, disable the proxy used for the update or restore the previous configuration:

- **iPhone / iPad:** open Configure Proxy for the current Wi-Fi network, select Off, and save.
- **Android:** select None / No proxy for the current Wi-Fi network and save.
- **Windows / macOS:** disable the system proxy enabled for this update.
- **Clash:** stop the proxy or switch back to the previous configuration.

Restore cellular data and automatic network switching if they were disabled. Check the update status at the top of the binding page. After completion, send `/switchserver cn` to the bot, followed by `/b50` to view the scores.

## Subsequent updates {#next-time}

1. Enable the configured proxy.
2. Open the saved entry link in WeChat and authorize again.
3. Disable the proxy after handoff and check the result on the binding page.

The entry link can be reused until it is reset. Save the replacement link after a reset. Update the relevant network settings when changing Wi-Fi networks or proxy parameters.

## Troubleshooting {#faq}

### Proxy not detected

Check that the server and port are correct and the settings have been saved. For Wi-Fi, connect to the configured network and disable mobile data or automatic switching that could bypass the proxy. For Clash, check that both the McMai configuration and proxy function are enabled.

### Websites unavailable with the Wi-Fi proxy enabled

This proxy is limited to update authorization, so other websites may be unavailable. Disable it after WeChat handoff, then check the binding page. If WeChat authorization also fails, check the proxy settings and reopen the entry.

### Update still running after authorization

The service continues retrieving and processing NET data after handoff. The final status on the binding page determines whether the update succeeded. If it fails, follow the displayed instructions to authorize again.

### MAID updates

MAID remains available for CN updates. See [CN MAID Updates](/en/commands/account#maid).

The two methods carry different data, and some features follow whichever method you used last: NET updates include play history for [`/recent`](/en/commands/score#recent-plays) and [`/ralog`](/en/commands/score#rating-history), while MAID updates include the play counts used by [PC50](/en/commands/b50#pc50).

---

Related: [Score Tracking Guide](/en/guide/score-tracking) · [Account & Server](/en/commands/account)
