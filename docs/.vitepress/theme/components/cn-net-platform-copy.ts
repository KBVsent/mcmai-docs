import { CN_NET_PROXY } from './cn-net-proxy'

import type { GuideLocale } from './cn-net-ios-copy'

export type ProxyPlatform = 'windows' | 'macos' | 'android'
type Step = { title: string; description: string; notes: string[] }
type PlatformCopy = { title: string; restore: string; steps: [Step, Step, Step] }
type Ui = {
  settings: string; systemSettings: string; findSetting: string; system: string
  networkInternet: string; personalization: string; autoProxy: string; autoDetect: string
  manualProxy: string; useProxy: string; setup: string; editProxy: string; proxyIp: string
  cancel: string; search: string; network: string; general: string; details: string
  proxies: string; webProxy: string; secureProxy: string; ok: string; internet: string
  networkDetails: string; connected: string; advanced: string; proxyHostname: string; proxyPort: string; save: string
}

export const platformUi: Record<GuideLocale, Ui> = {
  zh: {
    save:'保存',
    settings:'设置',systemSettings:'系统设置',findSetting:'查找设置',system:'系统',networkInternet:'网络和 Internet',personalization:'个性化',autoProxy:'自动设置代理',autoDetect:'自动检测设置',manualProxy:'手动设置代理',useProxy:'使用代理服务器',setup:'设置',editProxy:'编辑代理服务器',proxyIp:'代理 IP 地址',cancel:'取消',search:'搜索',network:'网络',general:'通用',details:'详细信息',proxies:'代理',webProxy:'网页代理',secureProxy:'安全网页代理',ok:'好',internet:'互联网',networkDetails:'网络详情',connected:'已连接',advanced:'高级选项',proxyHostname:'代理主机名',proxyPort:'代理端口',
  },
  'zh-TW': {
    save:'儲存',
    settings:'設定',systemSettings:'系統設定',findSetting:'尋找設定',system:'系統',networkInternet:'網路和網際網路',personalization:'個人化',autoProxy:'自動 Proxy 設定',autoDetect:'自動偵測設定',manualProxy:'手動 Proxy 設定',useProxy:'使用 Proxy 伺服器',setup:'設定',editProxy:'編輯 Proxy 伺服器',proxyIp:'Proxy IP 位址',cancel:'取消',search:'搜尋',network:'網路',general:'一般',details:'詳細資訊',proxies:'代理伺服器',webProxy:'網頁代理伺服器',secureProxy:'安全網頁代理伺服器',ok:'好',internet:'網際網路',networkDetails:'網路詳細資料',connected:'已連線',advanced:'進階選項',proxyHostname:'Proxy 主機名稱',proxyPort:'Proxy 通訊埠',
  },
  en: {
    save:'Save',
    settings:'Settings',systemSettings:'System Settings',findSetting:'Find a setting',system:'System',networkInternet:'Network & internet',personalization:'Personalization',autoProxy:'Automatic proxy setup',autoDetect:'Automatically detect settings',manualProxy:'Manual proxy setup',useProxy:'Use a proxy server',setup:'Set up',editProxy:'Edit proxy server',proxyIp:'Proxy IP address',cancel:'Cancel',search:'Search',network:'Network',general:'General',details:'Details',proxies:'Proxies',webProxy:'Web proxy',secureProxy:'Secure web proxy',ok:'OK',internet:'Internet',networkDetails:'Network details',connected:'Connected',advanced:'Advanced options',proxyHostname:'Proxy hostname',proxyPort:'Proxy port',
  },
  ja: {
    save:'保存',
    settings:'設定',systemSettings:'システム設定',findSetting:'設定の検索',system:'システム',networkInternet:'ネットワークとインターネット',personalization:'個人用設定',autoProxy:'自動プロキシ セットアップ',autoDetect:'設定を自動的に検出する',manualProxy:'手動プロキシ セットアップ',useProxy:'プロキシ サーバーを使う',setup:'セットアップ',editProxy:'プロキシ サーバーの編集',proxyIp:'プロキシ IP アドレス',cancel:'キャンセル',search:'検索',network:'ネットワーク',general:'一般',details:'詳細',proxies:'プロキシ',webProxy:'Web プロキシ',secureProxy:'保護された Web プロキシ',ok:'OK',internet:'インターネット',networkDetails:'ネットワークの詳細',connected:'接続済み',advanced:'詳細設定',proxyHostname:'プロキシのホスト名',proxyPort:'プロキシポート',
  },
}

export const platformCopy: Record<GuideLocale, Record<ProxyPlatform, PlatformCopy> & {language:string}> = {
  zh: {
    language:'界面语言',
    windows: {
      title:'Windows 11 手动代理图解',
      restore:"更新结束后关闭“使用代理服务器”并保存，或恢复原配置。",
      steps:[
        {title:'打开代理页面',description:"打开 Windows 11“设置”。",notes:['选择左侧“网络和 Internet”。','在右侧向下找到并打开“代理”。']},
        {title:'设置手动代理',description:"在“代理”页面找到“手动设置代理”。",notes:['点击“使用代理服务器”右侧的“设置”。']},
        {title:'填写并保存',description:"在“编辑代理服务器”窗口中，填写下列代理参数。",notes:['开启“使用代理服务器”。',`在“代理 IP 地址”填入 ${CN_NET_PROXY.host}，省略 https:// 前缀。`,`在“端口”单独填入 ${CN_NET_PROXY.port}。`,'点击“保存”。']},
      ],
    },
    macos: {
      title:'macOS 手动代理图解',
      restore:"更新结束后关闭本次开启的 HTTP 和 HTTPS 代理，或恢复原配置。",
      steps:[
        {title:'打开网络详情',description:"打开“系统设置”→“网络”。图解以 Wi-Fi 为例。",notes:['选择“网络”，再选择正在使用的网络服务。','点击“详细信息”。']},
        {title:'进入代理设置',description:'在该网络服务的详细信息中找到“代理”。窗口内容可能需要向下滚动。',notes:["选择“代理”。"]},
        {title:'填写两组代理',description:"HTTP 与 HTTPS 两组代理使用相同的服务器和端口。",notes:['开启“网页代理 (HTTP)”和“安全网页代理 (HTTPS)”。',`在两组的“服务器”中填写 ${CN_NET_PROXY.host}。`,`在两组的“端口”中填写 ${CN_NET_PROXY.port}。无需开启密码认证。`,'点击“好”确认；如果系统继续显示“应用”，再点击应用。']},
      ],
    },
    android: {
      title:'Android（Google Pixel）Wi-Fi 代理图解',
      restore:"授权交接完成后，将当前 Wi-Fi 的“代理”设为“无”并保存。",
      steps:[
        {title:'找到当前 Wi-Fi',description:"打开“设置”→“网络和互联网”→“互联网”。",notes:["点击已连接的网络或右侧齿轮。McMai Wi-Fi 为示例名称。"]},
        {title:'编辑网络',description:"在网络详情页进入编辑页面，再展开“高级选项”。部分版本直接显示代理设置。",notes:['点击右上角铅笔图标，打开编辑页面。']},
        {title:'填写并保存',description:"在“高级选项”中填写手动代理参数。",notes:['将“代理”设为“手动”。',`在“代理主机名”填入 ${CN_NET_PROXY.host}，不添加 https:// 或端口。`,`在“代理端口”填入 ${CN_NET_PROXY.port}。`,'点击“保存”，返回绑定页检查代理后继续微信授权。']},
      ],
    },
  },
  'zh-TW': {
    language:'介面語言',
    windows: {
      title:'Windows 11 手動代理圖解',restore:"更新結束後關閉「使用 Proxy 伺服器」並儲存，或恢復原設定。",
      steps:[
        {title:'開啟代理頁面',description:"開啟 Windows 11「設定」。",notes:['選擇左側「網路和網際網路」。','在右側向下找到並開啟 Proxy。']},
        {title:'設定手動代理',description:"在 Proxy 頁面找到「手動 Proxy 設定」。",notes:['點選「使用 Proxy 伺服器」右側的「設定」。']},
        {title:'填寫並儲存',description:"在「編輯 Proxy 伺服器」視窗填入下列代理參數。",notes:['開啟「使用 Proxy 伺服器」。',`在「Proxy IP 位址」填入 ${CN_NET_PROXY.host}，省略 https:// 前綴。`,`在「埠」單獨填入 ${CN_NET_PROXY.port}。`,'點選「儲存」。']},
      ],
    },
    macos: {
      title:'macOS 手動代理圖解',restore:"更新結束後關閉此次開啟的 HTTP 與 HTTPS 代理，或恢復原設定。",
      steps:[
        {title:'開啟網路詳細資訊',description:"開啟「系統設定」→「網路」。圖解以 Wi-Fi 為例。",notes:['選擇「網路」，再選擇正在使用的網路服務。','點選「詳細資訊」。']},
        {title:'進入代理設定',description:'在該網路的詳細資訊中找到「代理伺服器」。可能需要向下捲動。',notes:["選擇「代理伺服器」。"]},
        {title:'填寫兩組代理',description:"HTTP 與 HTTPS 兩組代理使用相同的伺服器與埠。",notes:['開啟「網頁代理伺服器 (HTTP)」與「安全網頁代理伺服器 (HTTPS)」。',`在兩組的「伺服器」填入 ${CN_NET_PROXY.host}。`,`在兩組的「埠」填入 ${CN_NET_PROXY.port}。不需開啟密碼認證。`,'點選「好」確認；若系統繼續顯示「套用」，再點選套用。']},
      ],
    },
    android: {
      title:'Android（Google Pixel）Wi-Fi 代理圖解',restore:"授權交接完成後，將目前 Wi-Fi 的 Proxy 設為「無」並儲存。",
      steps:[
        {title:'找到目前 Wi-Fi',description:"開啟「設定」→「網路和網際網路」→「網際網路」。",notes:['點選目前網路或右側齒輪，開啟詳細資料。McMai Wi-Fi 僅為範例名稱。']},
        {title:'編輯網路',description:'在網路詳細資料點選編輯圖示，再展開「進階選項」。部分版本會直接在網路設定顯示 Proxy。',notes:['點選右上角鉛筆圖示，開啟編輯頁面。']},
        {title:'填寫並儲存',description:"在「進階選項」填寫手動代理參數。",notes:['將 Proxy 設為「手動」。',`在「Proxy 主機名稱」填入 ${CN_NET_PROXY.host}，不加入 https:// 或埠。`,`在「Proxy 通訊埠」填入 ${CN_NET_PROXY.port}。`,'點選「儲存」，回綁定頁確認代理後繼續微信授權。']},
      ],
    },
  },
  en: {
    language:'Interface language',
    windows: {
      title:'Windows 11 manual proxy illustrations',restore:"After the update, turn off Use a proxy server and save, or restore the previous configuration.",
      steps:[
        {title:'Open Proxy',description:"Open Windows 11 Settings.",notes:['Select Network & internet in the sidebar.','Scroll to Proxy on the right and open it.']},
        {title:'Set up manually',description:"Locate Manual proxy setup on the Proxy page.",notes:['Choose Set up beside Use a proxy server.']},
        {title:'Fill in and save',description:"In Edit proxy server, enter the proxy parameters shown below.",notes:['Turn on Use a proxy server.',`Enter ${CN_NET_PROXY.host} in Proxy IP address, without the https:// prefix.`,`Enter ${CN_NET_PROXY.port} in the separate Port field.`,'Choose Save.']},
      ],
    },
    macos: {
      title:'macOS manual proxy illustrations',restore:"After the update, disable the HTTP and HTTPS proxies enabled for it, or restore the previous configuration.",
      steps:[
        {title:'Open network details',description:"Open System Settings → Network. The illustration uses Wi-Fi.",notes:['Select Network, then your active network service.','Choose Details.']},
        {title:'Open Proxies',description:'Find Proxies in the service details. You may need to scroll down.',notes:["Choose Proxies."]},
        {title:'Set both proxies',description:"Use the same server and port for the HTTP and HTTPS proxy settings.",notes:['Enable Web proxy (HTTP) and Secure web proxy (HTTPS).',`Enter ${CN_NET_PROXY.host} in both Server fields.`,`Enter ${CN_NET_PROXY.port} in both Port fields. Leave password authentication off.`,'Choose OK; if your system also shows Apply, choose it afterward.']},
      ],
    },
    android: {
      title:'Android (Google Pixel) Wi-Fi proxy illustrations',restore:"After authorization handoff, set Proxy to None for the current Wi-Fi network and save.",
      steps:[
        {title:"Connected Wi-Fi",description:"Open Settings → Network & internet → Internet.",notes:['Open its details by tapping the network or its gear icon. McMai Wi-Fi is an example network name.']},
        {title:'Edit the network',description:'Tap Edit in the network details, then expand Advanced options. Some versions show proxy settings directly in the network settings.',notes:['Tap the pencil icon in the upper-right corner to edit.']},
        {title:'Fill in and save',description:"Enter the manual proxy parameters in Advanced options.",notes:['Set Proxy to Manual.',`Enter ${CN_NET_PROXY.host} in Proxy hostname, without https:// or a port suffix.`,`Enter ${CN_NET_PROXY.port} in Proxy port.`,'Tap Save, return to the binding page to check the proxy, then continue with WeChat authorization.']},
      ],
    },
  },
  ja: {
    language:'画面の表示言語',
    windows: {
      title:'Windows 11 手動プロキシの図解',restore:"更新後は「プロキシ サーバーを使う」をオフにして保存するか、元の設定に戻します。",
      steps:[
        {title:'プロキシ画面を開く',description:"Windows 11 の「設定」を開きます。",notes:['左側で「ネットワークとインターネット」を選びます。','右側を下へスクロールし「プロキシ」を開きます。']},
        {title:'手動設定を開く',description:"プロキシ画面の「手動プロキシ セットアップ」を確認します。",notes:['「プロキシ サーバーを使う」の横の「セットアップ」を選びます。']},
        {title:'入力して保存',description:"「プロキシ サーバーの編集」に、以下の設定値を入力します。",notes:['「プロキシ サーバーを使う」をオンにします。',`「プロキシ IP アドレス」に${CN_NET_PROXY.host} を入力します。https:// は省略します。`,`「ポート」に${CN_NET_PROXY.port}を入力します。`,'「保存」を選びます。']},
      ],
    },
    macos: {
      title:'macOS 手動プロキシの図解',restore:"更新後は今回有効にした HTTP と HTTPS のプロキシをオフにするか、元の設定に戻します。",
      steps:[
        {title:'ネットワークの詳細',description:"「システム設定」→「ネットワーク」を開きます。図解は Wi-Fi の例です。",notes:['「ネットワーク」を選び、使用中のネットワークサービスを選びます。','「詳細」を選びます。']},
        {title:'プロキシを開く',description:'ネットワークの詳細で「プロキシ」を探します。下へスクロールする必要がある場合があります。',notes:["「プロキシ」を選びます。"]},
        {title:'両方に入力する',description:"HTTP と HTTPS の両方に同じサーバとポートを設定します。",notes:['「Web プロキシ (HTTP)」と「保護された Web プロキシ (HTTPS)」をオンにします。',`両方の「サーバ」に${CN_NET_PROXY.host}を入力します。`,`両方の「ポート」に${CN_NET_PROXY.port}を入力します。パスワード認証はオフのままにします。`,'「OK」で確定します。「適用」も表示される場合は続けて押します。']},
      ],
    },
    android: {
      title:'Android（Google Pixel）Wi-Fi プロキシの図解',restore:"認証の引き継ぎ完了後は、接続中の Wi-Fi のプロキシを「なし」にして保存します。",
      steps:[
        {title:'接続中の Wi-Fi',description:"「設定」→「ネットワークとインターネット」→「インターネット」を開きます。",notes:['ネットワーク名または歯車をタップして詳細を開きます。McMai Wi-Fi は例の名前です。']},
        {title:'ネットワークを編集',description:'ネットワークの詳細で編集アイコンをタップし「詳細設定」を開きます。バージョンによってはネットワーク設定に直接プロキシ項目があります。',notes:['右上の鉛筆アイコンから編集画面を開きます。']},
        {title:'入力して保存',description:"詳細設定で手動プロキシの値を入力します。",notes:['プロキシを「手動」にします。',`「プロキシのホスト名」に${CN_NET_PROXY.host}を入力します。https:// やポート番号は付けません。`,`「プロキシポート」に${CN_NET_PROXY.port}を入力します。`,'「保存」を押し、連携ページでプロキシを確認してから WeChat 認証へ進みます。']},
      ],
    },
  },
}
