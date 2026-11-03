import type { GuideLocale } from './cn-net-ios-copy'

export type BookmarkletPlatform = 'desktop' | 'ios' | 'android'
type Step = { title: string; description: string; notes: string[] }
type Steps = [Step, Step, Step, Step]
type Copy = { language: string; caption: string } & Record<BookmarkletPlatform, Steps>

const zhUi = {
  bookmarkTitle: 'McMai 更新成绩', bookmarksLists: '书签和清单', showBar: '显示书签栏', dropHere: '拖到书签栏', addToBrowser: '添加到浏览器', editBookmark: '编辑书签', name: '名称', url: '网址', cancel: '取消', save: '保存', codePlaceholder: '完整书签代码（示意）', addBookmark: '添加书签', readingList: '加入阅读列表', bookmarks: '书签', done: '完成', favorites: '收藏夹', edit: '编辑', copy: '复制', location: '位置', mobileBookmarks: '移动设备书签', folder: '文件夹',
}
export const bookmarkletUi: Record<GuideLocale, typeof zhUi> = {
  zh: zhUi,
  'zh-TW': {
    bookmarkTitle:'McMai 更新成績',bookmarksLists:'書籤和清單',showBar:'顯示書籤列',dropHere:'拖曳至書籤列',addToBrowser:'加入瀏覽器',editBookmark:'編輯書籤',name:'名稱',url:'網址',cancel:'取消',save:'儲存',codePlaceholder:'完整書籤程式碼（示意）',addBookmark:'加入書籤',readingList:'加入閱讀列表',bookmarks:'書籤',done:'完成',favorites:'喜好項目',edit:'編輯',copy:'拷貝',location:'位置',mobileBookmarks:'行動裝置書籤',folder:'資料夾',
  },
  en: {
    bookmarkTitle:'McMai Update',bookmarksLists:'Bookmarks and lists',showBar:'Show bookmarks bar',dropHere:'Drop on bookmarks bar',addToBrowser:'Add to browser',editBookmark:'Edit bookmark',name:'Name',url:'URL',cancel:'Cancel',save:'Save',codePlaceholder:'Full bookmarklet code (example)',addBookmark:'Add Bookmark',readingList:'Add to Reading List',bookmarks:'Bookmarks',done:'Done',favorites:'Favorites',edit:'Edit',copy:'Copy',location:'Location',mobileBookmarks:'Mobile bookmarks',folder:'Folder',
  },
  ja: {
    bookmarkTitle:'McMai 成績更新',bookmarksLists:'ブックマークとリスト',showBar:'ブックマーク バーを表示',dropHere:'ブックマークバーにドロップ',addToBrowser:'ブラウザに追加',editBookmark:'ブックマークを編集',name:'名前',url:'URL',cancel:'キャンセル',save:'保存',codePlaceholder:'完全なコード（説明用）',addBookmark:'ブックマークを追加',readingList:'リーディングリストに追加',bookmarks:'ブックマーク',done:'完了',favorites:'お気に入り',edit:'編集',copy:'コピー',location:'場所',mobileBookmarks:'モバイルのブックマーク',folder:'フォルダ',
  },
}

export const bookmarkletCopy: Record<GuideLocale, Copy> = {
  zh: {
    language:'界面语言',caption:'界面示意，菜单名称和位置可能随版本变化。图中代码仅用于标示网址字段，安装需使用绑定页生成的完整代码。',
    desktop:[
      {title:'显示书签栏',description:'以电脑 Chrome 为例，打开右上角菜单中的“书签和清单”。',notes:['启用“显示书签栏”。Windows 快捷键为 Ctrl+Shift+B，macOS 为 ⌘+Shift+B。']},
      {title:'拖入书签',description:'在绑定页“添加到浏览器”步骤中选择“电脑”。',notes:['按住绑定页的“McMai 更新成绩”按钮。','将按钮拖至浏览器书签栏后松开。添加成功后可直接进入第 4 步。']},
      {title:'手动添加（可选）',description:'无法拖拽时，先将任意网页加入书签，再打开该书签的编辑窗口。',notes:['名称可设为 McMai。','将原网址完整替换为绑定页复制的书签代码，保留开头的 javascript:。','点击“保存”。']},
      {title:'运行更新',description:'在同一浏览器中登录对应区服的 maimai NET，停留在 NET 页面。',notes:['点击书签栏中的 McMai 书签。右下角显示圆形悬浮按钮，外圈和左侧状态胶囊显示更新进度，完成后查看结果面板。']},
    ],
    ios:[
      {title:'添加书签',description:'Safari 图解采用底部标签栏布局。先打开任意网页。',notes:['长按底部的书签图标。','选择“添加书签”，保存到收藏夹。其他布局可从页面菜单添加书签。']},
      {title:'打开编辑',description:'打开 Safari 书签列表，找到刚保存的网页。',notes:['长按该书签。','在菜单中选择“编辑”。']},
      {title:'替换网址',description:'在书签编辑页面中修改名称和网址。',notes:['名称可设为 McMai。','删除原网址，粘贴绑定页复制的完整代码，保留开头的 javascript:。','点击“保存”或“完成”。']},
      {title:'运行更新',description:'在 Safari 中登录对应区服的 maimai NET，并停留在该页面。',notes:['打开书签列表。','点击 McMai 书签执行更新。从书签列表运行，不在地址栏粘贴代码。']},
    ],
    android:[
      {title:'收藏当前页',description:'在 Android Chrome 中打开任意网页。',notes:['点击地址栏旁的 ⋮ 菜单。','点击星形收藏图标，将当前页加入书签。']},
      {title:'编辑书签',description:'进入 ⋮ →“书签”，找到刚保存的网页。',notes:['点击该书签右侧的 ⋮。','选择“编辑”。']},
      {title:'替换网址',description:'在编辑页面中填写书签名称和代码。',notes:['名称设为 McMai，便于在地址栏中检索。','删除原网址，粘贴绑定页复制的完整代码，保留开头的 javascript:。','返回上一页保存修改；显示“保存”按钮的版本点击保存。']},
      {title:'运行更新',description:'在 Chrome 中登录对应区服的 maimai NET，并停留在该页面。',notes:['在地址栏输入书签名 McMai。','点击带星形图标的书签建议项。放大镜图标对应搜索项。']},
    ],
  },
  'zh-TW': {
    language:'介面語言',caption:'介面示意，選單名稱與位置可能隨版本變更。圖中程式碼僅標示網址欄位，安裝需使用綁定頁產生的完整程式碼。',
    desktop:[
      {title:'顯示書籤列',description:'以電腦 Chrome 為例，開啟右上角選單中的「書籤和清單」。',notes:['啟用「顯示書籤列」。Windows 快捷鍵為 Ctrl+Shift+B，macOS 為 ⌘+Shift+B。']},
      {title:'拖入書籤',description:'在綁定頁「加入瀏覽器」步驟選擇「電腦」。',notes:['按住綁定頁的「McMai 更新成績」按鈕。','將按鈕拖曳至瀏覽器書籤列後放開。加入成功後可直接進入第 4 步。']},
      {title:'手動加入（選用）',description:'無法拖曳時，先將任意網頁加入書籤，再開啟該書籤的編輯視窗。',notes:['名稱可設為 McMai。','將原網址完整替換為綁定頁複製的程式碼，保留開頭的 javascript:。','點選「儲存」。']},
      {title:'執行更新',description:'在同一瀏覽器登入對應區服的 maimai NET，停留在 NET 頁面。',notes:['點選書籤列中的 McMai 書籤。右下角顯示圓形懸浮按鈕，外圈與左側狀態膠囊顯示更新進度，完成後查看結果面板。']},
    ],
    ios:[
      {title:'加入書籤',description:'Safari 圖解採底部標籤頁列配置。先開啟任意網頁。',notes:['長按底部的書籤圖示。','選擇「加入書籤」，儲存至喜好項目。其他配置可從頁面選單加入書籤。']},
      {title:'開啟編輯',description:'開啟 Safari 書籤列表，找到剛儲存的網頁。',notes:['長按該書籤。','在選單選擇「編輯」。']},
      {title:'替換網址',description:'在書籤編輯頁面修改名稱與網址。',notes:['名稱可設為 McMai。','刪除原網址，貼上綁定頁複製的完整程式碼，保留開頭的 javascript:。','點選「儲存」或「完成」。']},
      {title:'執行更新',description:'在 Safari 登入對應區服的 maimai NET，並停留在該頁面。',notes:['開啟書籤列表。','點選 McMai 書籤執行更新。從書籤列表執行，不在網址列貼上程式碼。']},
    ],
    android:[
      {title:'收藏目前頁面',description:'在 Android Chrome 開啟任意網頁。',notes:['點選網址列旁的 ⋮ 選單。','點選星形收藏圖示，將目前頁面加入書籤。']},
      {title:'編輯書籤',description:'進入 ⋮ →「書籤」，找到剛儲存的網頁。',notes:['點選該書籤右側的 ⋮。','選擇「編輯」。']},
      {title:'替換網址',description:'在編輯頁面填寫書籤名稱與程式碼。',notes:['名稱設為 McMai，便於在網址列檢索。','刪除原網址，貼上綁定頁複製的完整程式碼，保留開頭的 javascript:。','返回上一頁儲存修改；顯示「儲存」按鈕的版本點選儲存。']},
      {title:'執行更新',description:'在 Chrome 登入對應區服的 maimai NET，並停留在該頁面。',notes:['在網址列輸入書籤名稱 McMai。','點選帶星形圖示的書籤建議項目。放大鏡圖示對應搜尋項目。']},
    ],
  },
  en: {
    language:'Interface language',caption:'Illustrative interface; labels and positions vary by version. The code shown marks the URL field. Installation requires the full code generated on the binding page.',
    desktop:[
      {title:'Show bookmarks bar',description:'In desktop Chrome, open Bookmarks and lists from the upper-right menu.',notes:['Enable Show bookmarks bar. The shortcut is Ctrl+Shift+B on Windows or ⌘+Shift+B on macOS.']},
      {title:'Drag the bookmarklet',description:'Select Computer in the binding page’s Add to browser step.',notes:['Press and hold the McMai Update button on the binding page.','Drag it onto the bookmarks bar and release. After adding it, proceed to step 4.']},
      {title:'Manual alternative',description:'If dragging is unavailable, bookmark any webpage and open that bookmark’s edit dialog.',notes:['Set the name to McMai.','Replace the entire URL with the code copied from the binding page, including the javascript: prefix.','Choose Save.']},
      {title:'Run the update',description:'Log in to the appropriate maimai NET region in the same browser and keep the NET page open.',notes:['Select the McMai bookmarklet on the bookmarks bar. A circular button appears at the lower right, with a progress ring and a status pill on its left. Check the result panel after completion.']},
    ],
    ios:[
      {title:'Add a bookmark',description:'The Safari illustration uses the bottom tab bar layout. Open any webpage.',notes:['Touch and hold the bookmarks icon in the bottom toolbar.','Choose Add Bookmark and save to Favorites. Other layouts provide this action in the page menu.']},
      {title:'Open the editor',description:'Open Safari’s bookmarks list and locate the page just saved.',notes:['Touch and hold the bookmark.','Choose Edit from the menu.']},
      {title:'Replace the URL',description:'Edit the bookmark’s name and URL.',notes:['Set the name to McMai.','Delete the original URL and paste the full code from the binding page, including javascript:.','Choose Save or Done.']},
      {title:'Run the update',description:'Log in to the appropriate maimai NET region in Safari and keep the NET page open.',notes:['Open the bookmarks list.','Tap the McMai bookmarklet to run it. Use the bookmarks list; do not paste the code into the address bar.']},
    ],
    android:[
      {title:'Bookmark a page',description:'Open any webpage in Chrome on Android.',notes:['Open the ⋮ menu beside the address bar.','Tap the star to bookmark the current page.']},
      {title:'Edit the bookmark',description:'Open ⋮ → Bookmarks and locate the saved page.',notes:['Open ⋮ beside that bookmark.','Choose Edit.']},
      {title:'Replace the URL',description:'Enter the bookmark name and code in the editor.',notes:['Set the name to McMai so it can be found in the address bar.','Delete the original URL and paste the full code from the binding page, including javascript:.','Go back to save the changes. On versions with a Save button, use that button.']},
      {title:'Run the update',description:'Log in to the appropriate maimai NET region in Chrome and keep the NET page open.',notes:['Type the bookmark name McMai in the address bar.','Select the bookmark suggestion with a star icon. A magnifying glass identifies a search suggestion.']},
    ],
  },
  ja: {
    language:'画面の表示言語',caption:'画面は模式図です。名称や位置はバージョンによって異なります。図中のコードは URL 欄を示す説明用です。登録には連携ページで発行した完全なコードを使用します。',
    desktop:[
      {title:'バーを表示',description:'パソコンの Chrome で右上メニューから「ブックマークとリスト」を開きます。',notes:['「ブックマーク バーを表示」を有効にします。ショートカットは Windows が Ctrl+Shift+B、macOS が ⌘+Shift+B です。']},
      {title:'ドラッグして登録',description:'連携ページのブラウザへの追加手順で「パソコン」を選びます。',notes:['連携ページの「McMai 成績更新」ボタンを押したままにします。','ブックマークバーにドラッグして放します。登録後はステップ 4 に進みます。']},
      {title:'手動登録（任意）',description:'ドラッグできない場合は、任意のページをブックマークし、その編集画面を開きます。',notes:['名前を McMai にします。','元の URL 全体を連携ページからコピーしたコードに置き換えます。先頭の javascript: も含めます。','「保存」を選びます。']},
      {title:'更新を実行',description:'同じブラウザで対象地域の maimai NET にログインし、NET のページを開いた状態にします。',notes:['ブックマークバーの McMai を選びます。右下の円形ボタンの外周と左側の状態表示で進捗を確認できます。完了後は結果パネルを確認します。']},
    ],
    ios:[
      {title:'ブックマーク追加',description:'図は Safari の下部タブバーの例です。任意の Web ページを開きます。',notes:['下部のブックマークアイコンを長押しします。','「ブックマークを追加」を選び、お気に入りに保存します。ほかのレイアウトではページメニューから追加できます。']},
      {title:'編集を開く',description:'Safari のブックマーク一覧で保存したページを探します。',notes:['該当のブックマークを長押しします。','メニューから「編集」を選びます。']},
      {title:'URL を置換',description:'ブックマークの名前と URL を編集します。',notes:['名前を McMai にします。','元の URL を削除し、連携ページのコードを javascript: から末尾まで貼り付けます。','「保存」または「完了」を選びます。']},
      {title:'更新を実行',description:'Safari で対象地域の maimai NET にログインし、そのページを開いた状態にします。',notes:['ブックマーク一覧を開きます。','McMai をタップして実行します。一覧から開き、アドレスバーへのコード貼り付けは行いません。']},
    ],
    android:[
      {title:'ページを登録',description:'Android の Chrome で任意のページを開きます。',notes:['アドレスバー横の ⋮ を開きます。','星のアイコンでページをブックマークします。']},
      {title:'ブックマーク編集',description:'⋮ →「ブックマーク」で保存したページを探します。',notes:['該当のブックマーク右側の ⋮ を開きます。','「編集」を選びます。']},
      {title:'URL を置換',description:'編集画面で名前とコードを入力します。',notes:['アドレスバーで検索できるよう、名前を McMai にします。','元の URL を削除し、連携ページのコードを javascript: から末尾まで貼り付けます。','前の画面に戻って保存します。「保存」ボタンがあるバージョンではそのボタンを押します。']},
      {title:'更新を実行',description:'Chrome で対象地域の maimai NET にログインし、そのページを開いた状態にします。',notes:['アドレスバーにブックマーク名 McMai を入力します。','星のアイコンが付いたブックマーク候補を選びます。虫眼鏡のアイコンは検索候補です。']},
    ],
  },
}
