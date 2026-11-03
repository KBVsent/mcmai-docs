import { CN_NET_PROXY } from './cn-net-proxy'

export type GuideLocale = 'zh' | 'zh-TW' | 'en' | 'ja'

export const languages: { value: GuideLocale; label: string }[] = [
  { value: 'zh', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
]

type GuideCopy = {
  language: string; follow: string; navigation: string; caption: string
  check: string; realDevice: string
  steps: { title: string; description: string; notes: string[] }[]
}
type InterfaceCopy = {
  wifi: string; network: string; autoJoin: string; proxy: string; configure: string
  off: string; manual: string; auto: string; server: string; port: string
  authentication: string; save: string
}

// Interface names are separate from explanations: readers may use a different device language.
export const interfaceCopy: Record<GuideLocale, InterfaceCopy> = {
  zh: { wifi: '无线局域网', network: '当前连接的网络', autoJoin: '自动加入', proxy: '代理', configure: '配置代理', off: '关闭', manual: '手动', auto: '自动', server: '服务器', port: '端口', authentication: '认证', save: '存储' },
  'zh-TW': { wifi: 'Wi-Fi', network: '目前連接的網路', autoJoin: '自動加入', proxy: '代理伺服器', configure: '設定代理伺服器', off: '關閉', manual: '手動', auto: '自動', server: '伺服器', port: '埠', authentication: '認證', save: '儲存' },
  en: { wifi: 'Wi-Fi', network: 'Connected network', autoJoin: 'Auto-Join', proxy: 'PROXY', configure: 'Configure Proxy', off: 'Off', manual: 'Manual', auto: 'Automatic', server: 'Server', port: 'Port', authentication: 'Authentication', save: 'Save' },
  ja: { wifi: 'Wi-Fi', network: '接続中のネットワーク', autoJoin: '自動接続', proxy: 'プロキシ', configure: 'プロキシを構成', off: 'オフ', manual: '手動', auto: '自動', server: 'サーバ', port: 'ポート', authentication: '認証', save: '保存' },
}

export const guideCopy: Record<GuideLocale, GuideCopy> = {
  zh: {
    language: '手机界面语言', follow: '跟随文档', navigation: '切换 iOS 图解步骤',
    caption: "界面示意。菜单名称和位置可能随系统版本变化。",
    realDevice: "此配置仅对当前 Wi-Fi 生效，更换网络后需重新配置。",
    check: "存储后返回绑定页查看代理检测结果。页面无法加载时，完成微信授权后关闭代理，再查看更新结果。",
    steps: [
      { title: '找到当前 Wi-Fi', description: "打开“设置”→“无线局域网”。勾号表示当前连接的网络。", notes: ["点击当前网络右侧的 ⓘ。McMai Wi-Fi 为示例名称。"] },
      { title: '进入代理设置', description: '在当前网络的详情页向下滚动，找到“HTTP 代理”。', notes: ["点击“配置代理”。"] },
      { title: '填写并存储', description: "选择手动代理，填写以下参数。", notes: ['选择“手动”。', `将 ${CN_NET_PROXY.host} 填入“服务器”，不要添加 https:// 或端口。`, `将 ${CN_NET_PROXY.port} 填入“端口”。认证保持关闭。`, '点击右上角“存储”。'] },
    ],
  },
  'zh-TW': {
    language: '手機介面語言', follow: '跟隨文件', navigation: '切換 iOS 圖解步驟',
    caption: "介面示意。選單名稱與位置可能隨系統版本變更。",
    realDevice: "此設定僅對目前 Wi-Fi 生效，更換網路後需重新設定。",
    check: "儲存後返回綁定頁查看代理偵測結果。頁面無法載入時，完成微信授權後關閉代理，再查看更新結果。",
    steps: [
      { title: '找到目前的 Wi-Fi', description: "開啟「設定」→「Wi-Fi」。勾號表示目前連接的網路。", notes: ["點選目前網路右側的 ⓘ。McMai Wi-Fi 為範例名稱。"] },
      { title: '進入代理設定', description: '在目前網路的詳細資訊頁向下捲動，找到「HTTP 代理伺服器」。', notes: ["點選「設定代理伺服器」。"] },
      { title: '填寫並儲存', description: "選擇手動代理，填寫以下參數。", notes: ['選擇「手動」。', `將 ${CN_NET_PROXY.host} 填入「伺服器」，不要加入 https:// 或埠。`, `將 ${CN_NET_PROXY.port} 填入「埠」。認證保持關閉。`, '點選右上角「儲存」。'] },
    ],
  },
  en: {
    language: 'Device UI language', follow: 'Match document', navigation: 'Choose an iOS illustration step',
    caption: "Illustrative interface. Labels and positions may vary by OS version.",
    realDevice: "This configuration applies to the current Wi-Fi network. Configure each network separately.",
    check: "After saving, check proxy detection on the binding page. If the page cannot load, complete WeChat authorization, disable the proxy after handoff, and check the update result.",
    steps: [
      { title: "Connected Wi-Fi", description: "Open Settings → Wi-Fi. A check marks the connected network.", notes: ["Tap ⓘ beside the connected network. McMai Wi-Fi is an example name."] },
      { title: 'Open proxy settings', description: 'Scroll down in the network details to the HTTP PROXY section.', notes: ["Tap Configure Proxy."] },
      { title: 'Fill in and save', description: "Select Manual and enter the following proxy parameters.", notes: ['Select Manual.', `Enter ${CN_NET_PROXY.host} in Server, without https:// or a port suffix.`, `Enter ${CN_NET_PROXY.port} in Port. Leave Authentication off.`, 'Tap Save in the upper-right corner.'] },
    ],
  },
  ja: {
    language: '端末の表示言語', follow: 'ドキュメントと同じ', navigation: 'iOS の図解ステップを選択',
    caption: "画面は模式図です。名称や位置は OS のバージョンによって異なる場合があります。",
    realDevice: "設定は接続中の Wi-Fi に適用されます。接続先を変更した場合は個別に設定します。",
    check: "保存後は連携ページで検出結果を確認します。ページが開けない場合は WeChat 認証を行い、引き継ぎ完了後にプロキシをオフにして更新結果を確認します。",
    steps: [
      { title: '接続中の Wi-Fi を探す', description: "「設定」→「Wi-Fi」を開きます。チェックマークが接続中のネットワークを示します。", notes: ["接続中のネットワーク右側の ⓘ をタップします。McMai Wi-Fi は例の名前です。"] },
      { title: 'プロキシ設定を開く', description: 'ネットワークの詳細画面を下へスクロールし、「HTTP プロキシ」を探します。', notes: ["「プロキシを構成」をタップします。"] },
      { title: '入力して保存する', description: "手動を選び、以下の設定値を入力します。", notes: ['「手動」を選びます。', `${CN_NET_PROXY.host}を「サーバ」にそのまま入力します。https:// やポート番号は追加しません。`, `${CN_NET_PROXY.port}を「ポート」に入力します。「認証」はオフのままにします。`, '右上の「保存」をタップします。'] },
    ],
  },
}
