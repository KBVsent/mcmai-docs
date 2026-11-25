<script setup lang="ts">
/**
 * 首页功能演示：用一段「中性」的聊天对话展示 McMai 的实际产出。
 *
 * 设计取舍：
 * - 外壳不模仿任何平台（QQ / Discord / LINE），只用文档站自己的视觉语言。
 *   三个平台对 b50、查歌、翻页都有按钮（源码 libraries/ui/tips*.py），
 *   形态各异但含义一致，这里统一画成中性胶囊。
 * - 语言：指令、提示语、按钮、图片标注都是 HTML，按站点语言切换；
 *   图片只做一版，图上随语言变化的文案由出图脚本换成骨架条占位（数字、术语、曲名照常），
 *   各部分是什么交给图旁的标注来讲。
 * - 只展示结果图，不画 Bot 回复里的按钮：按钮各平台形态不同，且对「看效果」没有帮助。
 *
 * 一轮演示的时间线（run()）：
 *   输入框逐字打出指令 → 发送（旧对话淡出、用户气泡弹出）
 *   → 「正在输入」 → 图片自上而下扫描显现 → 标注依次出现
 *   → 有标注落在图片框外时（如查歌整张长图），图片带着标注分段上滚，逐个介绍到最后一个（planTour），
 *     走完才算这一轮播完
 *
 * 桌面端是一个滚动驱动的「舞台」（.hcs-track 包着 sticky 的 .hcs）：
 *   首屏是一组功能卡片 → 下滑时卡片变形成舞台（hero 淡出）→ 吸附到位并固定，开始演示
 *   → 继续下滑时后面的内容像一张纸从下方盖上来，舞台带阻尼地跟随、变暗（自由滚动，不吸附）；
 *     离开途中往回滚，吸回舞台。
 *   吸附由脚本控制（参数见 SNAP），不用原生 scroll-snap。
 *   回到首屏会恢复成海报，下次进入从头演示。
 *
 * 性能约定（滚动时每帧都会跑）：
 *   - 几何量只在尺寸变化时测一次（computeGeom），滚动帧里只读 scrollY；
 *   - 不改 <html> 上的变量、不让 Vue 每帧重渲染，直接写相关元素的 style；
 *   - 只动 transform / opacity / clip-path，不用 filter、backdrop-filter。
 * 播放规则（桌面与窄屏一致，只是「到位」的判断不同）：
 *   - 到位才开始播：桌面端是吸附到全屏位置之后，窄屏是聊天窗基本完整进入视口；
 *   - 自动播放：每个场景回复完整出现后停留 T.autoplay，再切到下一个；
 *   - 用户点了某一项：这一项停留 T.userHold（更久），期间没有再点别的，就接着往下自动播；
 *   - 离开视口或切到别的标签页时不再切换场景，回来后接着播。
 */
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import { createImageViewer } from 'vitepress-theme-teek'
import { COPY, PLATFORMS, SHOTS, shotUrl, type Step } from '../showcase-copy'

/** 图片框宽度；--img-w 由模板注入 */
const IMAGE_WIDTH = 340

/**
 * 聊天区高度随视口计算：导航栏 64 + 聊天窗标题栏与输入栏约 117 + 模块上下内边距 48。
 * 这样滚到本模块时整块能放进一屏，高缩放 / 矮屏也一样。
 * 桌面端模块本身高度固定为「一屏减导航栏」，吸附到位时正好铺满。
 */
const BODY_MIN = 360
const BODY_MAX = 560
/** 聊天区内图片框以外的占用：上下内边距 26 + 用户气泡与间距 54 */
const BODY_CHROME = 80

/** 演示图的来源与缓存摘要见 showcase-copy.ts */
const B50_IMAGE = SHOTS.b50.showcase
/** 窄屏封面上摊开的三张图，后两张在两侧、B50 在中间压在最上面（按绘制顺序排） */
const FAN = (['search', 'grank', 'b50'] as const).map((key) => ({ key, src: shotUrl(SHOTS[key].showcase), ...SHOTS[key].showcase }))
/** 海报 / 卡片缩略图用的预模糊小图（90px 宽，已压暗），省掉运行时的 CSS blur */
const B50_POSTER = shotUrl(SHOTS.b50.poster)

/** 节奏参数（毫秒）。打字要快：演示的重点是回复，不是输入。 */
const T = {
  beforeType: 220,
  perChar: 42,
  beforeSend: 240,
  thinking: 380,
  reply: 1000,
  autoplay: 8000,
  /** 用户点选的场景：回复出现后停留更久，没有新的操作再继续自动播放 */
  userHold: 15000,
  /** 两轮的场景（B50 → PK）：第一轮回复出现后，隔这么久接着发第二条指令 */
  followUp: 2500,
  /** 长图导览（planTour）：回复出现后先停这么久，让首屏的标注读完再开始滚 */
  tourStart: 3200,
  /** 每段滚动的速度（毫秒 / 像素）与时长上下限 */
  tourPerPx: 5,
  tourMoveMin: 1000,
  tourMoveMax: 2000,
  /** 每段滚到位后停留，读新出现的标注 */
  tourDwell: 2600,
  /** 导览走完后再停这么久才切场景 */
  tourTail: 1600,
}

/** 标注离图片框上下边缘至少这么远才算「在框内」（标签半高约 14） */
const CALLOUT_MARGIN = 24
/** 导览把下一个标注滚到图片框内这个高度比例处 */
const TOUR_ANCHOR = 0.6
/** 滚到某处后离图片底部不足这么多像素，就直接滚到底 */
const TOUR_SNAP = 80

type TourStop = {
  /** 从回复出现起算，开始这一段滚动的时刻 */
  at: number
  /** 滚到的位置：图片与标注一起上移的像素（IMAGE_WIDTH 宽下） */
  pan: number
  ms: number
  /** 这一段滚完后出现过的标注数 */
  reveal: number
}
type Tour = { frame: number; initial: number; stops: TourStop[]; total: number }

/**
 * 长图导览：标注有落在图片框外的，回复出现后图片带着标注分段上滚，
 * 每段把下一个框外的标注滚进来，直到最后一个标注出现。callouts 须按 y 升序。
 * frame 为图片框高度，initial 为首屏就在框内的标注数，total 为整段导览的时长（没有导览时为 0）。
 */
function planTour(step: Step | null, frameMaxPx: number, still: boolean): Tour {
  if (!step) return { frame: 0, initial: 0, stops: [], total: 0 }
  const marks = step.callouts ?? []
  const img = step.image
  const imgH = (img.height / img.width) * IMAGE_WIDTH
  const frame = Math.min(imgH, frameMaxPx)
  const maxPan = Math.max(0, imgH - frame)
  const inFrame = (y: number, pan: number) => y - pan <= frame - CALLOUT_MARGIN
  let initial = marks.findIndex((c) => !inFrame(c.y, 0))
  if (initial < 0) initial = marks.length

  const stops: TourStop[] = []
  if (still) return { frame, initial, stops, total: 0 }
  let pan = 0
  let n = initial
  let t = T.tourStart
  while (n < marks.length) {
    let next = Math.min(maxPan, marks[n].y - frame * TOUR_ANCHOR)
    // 离底部只差一小段时直接滚到底，免得最后再补一段几十像素的小滚动
    if (maxPan - next < TOUR_SNAP) next = maxPan
    // 已经滚到底，剩下的标注落在图外，不画
    if (next <= pan) break
    const ms = Math.min(T.tourMoveMax, Math.max(T.tourMoveMin, (next - pan) * T.tourPerPx))
    let reveal = n
    while (reveal < marks.length && inFrame(marks[reveal].y, next)) reveal++
    stops.push({ at: t, pan: next, ms, reveal })
    t += ms + T.tourDwell
    pan = next
    n = reveal
  }
  return { frame, initial, stops, total: stops.length ? t : 0 }
}

const { lang } = useData()
const copy = computed(() => COPY[lang.value] ?? COPY['en-US'])

/** 左侧高亮的场景：点击后立即切换 */
const activeIndex = ref(0)
/** 聊天区正在展示的场景：发送那一刻才切换，所以打字时旧对话仍在 */
const shownIndex = ref<number | null>(null)
/** 聊天区正在展示的是场景的第几轮（0 = 主指令，1 = then） */
const shownStep = ref(0)
const shown = computed<Step | null>(() => {
  if (shownIndex.value === null) return null
  const scene = copy.value.scenes[shownIndex.value]
  return shownStep.value === 1 && scene.then ? scene.then : scene
})
/** 当前这轮之后场景里还有下一轮：此时不显示切换进度条，等下一轮放完再切场景 */
const hasFollowUp = computed(() => shownStep.value === 0 && !!(shownIndex.value !== null && copy.value.scenes[shownIndex.value].then))
const active = computed(() => copy.value.scenes[activeIndex.value])

/** idle：还没滚到这里，聊天区留空、输入框不聚焦 */
type Phase = 'idle' | 'input' | 'sent' | 'thinking' | 'reply'
const phase = ref<Phase>('idle')
const typed = ref('')
const sendPulse = ref(0)
/** 每轮递增，用作对话区 key，保证同一场景重播也会重新入场 */
const round = ref(0)
/**
 * 左侧当前项底部的进度条：从场景第一轮回复出现时开始，一直走到切换下一个场景。
 * 两轮的场景里进度条连续走过「间隔 + 第二轮 + 停留」，中途不重置。
 */
const barOn = ref(false)
const barMs = ref(8000)
const barKey = ref(0)
function startBar(ms: number) {
  barMs.value = ms
  barKey.value++
  barOn.value = true
}
/** 一轮从开始打字到回复出现的时长，与 run() 的时间线一致 */
const roundMs = (command: string) => T.beforeType + Array.from(command).length * T.perChar + T.beforeSend + T.reply

/** 当前场景是用户点选的：停留时间用 T.userHold；自动切到下一个场景时清除 */
let manual = false
/** 点选时舞台还没到位：先吸附，到位后从点选的这一项开始播 */
let pendingStart = false
/** 图片加载完成才开始扫描显现，避免动画放完图还没到 */
const imageLoaded = ref(false)
const reduceMotion = ref(false)

let timers: ReturnType<typeof setTimeout>[] = []
let autoplayTimer: ReturnType<typeof setTimeout> | undefined
let motionQuery: MediaQueryList | undefined

const chatEl = ref<HTMLElement | null>(null)
/** 可以播放：舞台已到位（桌面）或聊天窗基本完整可见（窄屏），且页面处于前台 */
const inView = ref(false)
let ioVisible = false
let started = false
let io: IntersectionObserver | undefined

/**
 * 吸附与阻尼参数。浏览器原生 scroll-snap 的吸附范围和力度都不能调，所以自己实现，
 * 取值参照 GSAP ScrollTrigger 的 pin + snap 常见配置与 iOS UIScrollView 的回弹：
 * - 固定段一屏（ScrollTrigger 常用 end: "+=100%"），见 CSS 的 .hcs-track.staged 高度
 * - idle：停止滚动 150ms 后才吸附（snap.delay 常用 0.1–0.2s）
 * - minDur / maxDur：吸附动画按距离换算 350–900ms，ease-in-out（snap.duration {min, max}）
 * - enter：从首屏往下滚过入场距离的 15% 就吸进舞台，否则弹回顶部；往上同理
 * - 只吸「进入」，不吸「离开」：在舞台里往下滚是自由滚动，后面的内容自然盖上来；
 *   离开途中往回滚过离场距离的 15%，视为重新进入，吸回舞台
 * - rubber / rubberMax：固定段内内容按 iOS 回弹公式 (1 - 1 / (x·c / d + 1))·d 跟随滚动，
 *   c = 0.55；d 取 120px 而不是一屏，位移封顶约 120px，只是视差，不阻止滚动
 */
const SNAP = { idle: 150, minDur: 350, maxDur: 900, enter: 0.15, rubber: 0.55, rubberMax: 120 }

/** 桌面端舞台模式（与 CSS 的 961px 断点一致）；减少动态效果时不做舞台 */
const stageMode = ref(false)
const staged = computed(() => stageMode.value && !reduceMotion.value)
const trackEl = ref<HTMLElement | null>(null)
let stageActive = false
let rafId = 0
let desktopQuery: MediaQueryList | undefined

/* 吸附控制器的状态 */
let lastY = 0
let scrollDir = 1
/** 本次滚动手势开始时的 scrollY；一次手势从首屏冲进舞台时不允许直接冲出去 */
let gestureStart: number | null = null
let idleTimer: ReturnType<typeof setTimeout> | undefined
let snapRaf = 0
let snapping = false
let touching = false

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2)
const smooth = (t: number) => t * t * (3 - 2 * t)

/* ---------- 卡片 → 舞台的变形（桌面端） ----------
 * 首屏是一组功能卡片（.hcs-teaser，只用来测量位置，本身不可见）：
 *   左侧四张卡（查歌 / 排行 / 进度 / 配置），右侧一张高的 B50 卡，底部一条「多区服」。
 * 入场过程中由 .hcs-ghost 按滚动进度在「卡片位置」和「舞台里的位置」之间插值：
 *   B50 卡展开成聊天窗（真实聊天窗用 clip-path 跟着露出），其余卡片飞进左侧功能列表，
 *   多区服条变成区服 / 平台标签，标题从卡片上方移到左栏顶部。
 * 进度到 1 时 ghost 与真实元素位置、样式完全重合，直接换成真实元素。
 * 所有位置都相对 .hcs-container 测量，与滚动无关，只在尺寸变化时重新测。
 */
type Box = { x: number; y: number; w: number; h: number }
type MorphLayout = { from: Box[]; to: Box[]; metaFrom: Box; metaTo: Box; headDy: number }

const containerEl = ref<HTMLElement | null>(null)
const teaserEl = ref<HTMLElement | null>(null)
const sideEl = ref<HTMLElement | null>(null)
const headEl = ref<HTMLElement | null>(null)
const metaEl = ref<HTMLElement | null>(null)
const regionSlotEl = ref<HTMLElement | null>(null)
const tabEls: HTMLElement[] = []
const slotEls: HTMLElement[] = []
const ghostEls: HTMLElement[] = []
const metaGhostEl = ref<HTMLElement | null>(null)
const dimEl = ref<HTMLElement | null>(null)
const layout = shallowRef<MorphLayout | null>(null)
/**
 * 是否处在变形中（入场进度 < 1）。只在越过边界时改变，模板不会随滚动每帧重渲染；
 * 每帧的位置 / 透明度由 applyMorph() 直接写到元素上。
 */
const morphing = ref(false)
/** 与 .hcs 在 960px 以上的上内边距一致 */
const STAGE_PAD = 24

function lerpBox(a: Box, b: Box, p: number): Box {
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, w: a.w + (b.w - a.w) * p, h: a.h + (b.h - a.h) * p }
}

function setBox(el: HTMLElement, b: Box) {
  const s = el.style
  s.left = `${b.x}px`
  s.top = `${b.y}px`
  s.width = `${b.w}px`
  s.height = `${b.h}px`
}

/** 变形结束后清掉写在真实元素上的样式，交还给 CSS */
let morphDirty = false
function clearMorph() {
  if (!morphDirty) return
  morphDirty = false
  if (chatEl.value) {
    chatEl.value.style.clipPath = ''
    chatEl.value.style.opacity = ''
  }
  if (headEl.value) headEl.value.style.transform = ''
  if (tabEls[0]) tabEls[0].style.opacity = ''
}

/** 按入场进度 e 摆放 ghost 与真实元素；各元素的进度错开：聊天窗先动，列表项依次跟上 */
function applyMorph(e: number) {
  const l = layout.value
  const on = staged.value && !!l && e < 0.999
  if (on !== morphing.value) morphing.value = on
  if (!on || !l) {
    clearMorph()
    return
  }
  morphDirty = true
  const prog = (start: number, span: number) => smooth(clamp01((e - start) / span))
  const n = l.from.length

  for (let i = 0; i < n; i++) {
    const el = ghostEls[i]
    if (!el) continue
    const p = i === 0 ? prog(0.08, 0.72) : prog(0.16 + i * 0.05, 0.6)
    setBox(el, lerpBox(l.from[i], l.to[i], p))
    el.style.setProperty('--p', p.toFixed(4))
    // B50 卡淡出，让位给在它框内露出的真实聊天窗
    if (i === 0) {
      el.style.opacity = String(clamp01(1 - p * 1.6))
      // 真实聊天窗：只露出 B50 卡当前所在的矩形
      const chat = chatEl.value
      if (chat) {
        const b = lerpBox(l.from[0], l.to[0], p)
        const c = l.to[0]
        const r = 14 + 6 * p
        chat.style.clipPath = `inset(${b.y - c.y}px ${c.x + c.w - b.x - b.w}px ${c.y + c.h - b.y - b.h}px ${b.x - c.x}px round ${r}px)`
        chat.style.opacity = String(clamp01(p * 2.5))
      }
    }
  }

  const meta = metaGhostEl.value
  if (meta) {
    const p = prog(0.4, 0.55)
    setBox(meta, lerpBox(l.metaFrom, l.metaTo, p))
    meta.style.setProperty('--p', p.toFixed(4))
  }
  if (headEl.value) headEl.value.style.transform = `translateY(${l.headDy * (1 - prog(0.1, 0.75))}px)`
  // 列表里的 B50 项：它的卡片变成了聊天窗，所以最后单独淡入
  if (tabEls[0]) tabEls[0].style.opacity = String(prog(0.78, 0.2))
}

function measureLayout() {
  const c = containerEl.value
  const a = teaserEl.value
  const side = sideEl.value
  const chat = chatEl.value
  const meta = metaEl.value
  const head = headEl.value
  const region = regionSlotEl.value
  const n = copy.value.scenes.length
  if (!staged.value || !c || !a || !side || !chat || !meta || !head || !region || slotEls.length < n || tabEls.length < n) {
    layout.value = null
    return
  }
  // 卡片布局贴住模块顶端（舞台布局是垂直居中的），标题占位留在卡片上方
  const aTop = STAGE_PAD - c.offsetTop
  a.style.top = `${aTop}px`
  a.style.paddingTop = `${head.offsetHeight + 24}px`

  const cr = c.getBoundingClientRect()
  const rel = (el: HTMLElement): Box => {
    const r = el.getBoundingClientRect()
    return { x: r.left - cr.left, y: r.top - cr.top, w: r.width, h: r.height }
  }
  layout.value = {
    from: slotEls.slice(0, n).map(rel),
    to: tabEls.slice(0, n).map((el, i) => rel(i === 0 ? chat : el)),
    metaFrom: rel(region),
    metaTo: rel(meta),
    headDy: aTop - rel(side).y,
  }
}

/**
 * 舞台几何（单位：scrollY），只在尺寸变化时重算，滚动帧里直接用：
 *   S = 舞台顶端贴住导航栏（吸附点）；S → S + hold 为固定段；
 *   N = 后面的内容完全盖住舞台、贴住导航栏（离场吸附点）。
 *
 * 后面的内容（动态 + 社区）用负的 margin-top 往上叠进固定段，在固定段里从下方盖住舞台。
 * 这样它不足一屏时也不需要补高度：舞台留在它后面，而不是在它上方留出一块空白。
 */
type Geom = { vh: number; S: number; hold: number; N: number }
let G: Geom | null = null
let navEl: HTMLElement | null = null
let heroEl: HTMLElement | null = null
/** 叠上来的那块内容；卸载时模板 ref 已清空，所以单独记下来 */
let tailEl: HTMLElement | null = null

function computeGeom() {
  const track = trackEl.value
  const next = (track?.nextElementSibling as HTMLElement | null) ?? null
  if (!staged.value || !track) {
    if (track) track.style.height = ''
    if (tailEl) tailEl.style.marginTop = ''
    tailEl = null
    G = null
    return
  }
  tailEl = next
  const navH = navEl?.offsetHeight ?? 64
  const vh = window.innerHeight
  // 叠进去的距离不超过它自身高度：舞台始终被限制在它的盒子后面，不会从它下方的透明间隙里露出来
  const overlap = next ? Math.min(next.offsetHeight, vh - navH) : 0
  if (next) {
    const v = overlap > 0 ? `${-overlap}px` : ''
    if (next.style.marginTop !== v) next.style.marginTop = v
  }
  // 固定段长度跟着叠进来的距离走：一进固定段，它的上沿就在视口底部，一滚就露出来。
  // 内容够高时就是 CSS 里的 200vh - 导航栏；内容短时固定段也相应变短，不会空滚一段
  const trackPx = `${vh + overlap}px`
  if (track.style.height !== trackPx) track.style.height = trackPx
  const trackH = vh + overlap
  const S = Math.max(0, track.getBoundingClientRect().top + window.scrollY - navH)
  const maxY = document.documentElement.scrollHeight - vh
  G = { vh, S, hold: Math.max(0, trackH - (vh - navH)), N: Math.max(S, Math.min(S + trackH - overlap, maxY)) }
}

/** 尺寸变化后：重算几何与卡片布局，再按当前滚动位置画一帧 */
function remeasure() {
  computeGeom()
  measureLayout()
  lastEnter = -1
  lastExit = -1
  measureStage()
}

let ro: ResizeObserver | undefined
function observeSizes() {
  ro?.disconnect()
  if (!staged.value) return
  ro = new ResizeObserver(remeasure)
  const track = trackEl.value
  for (const el of [track?.previousElementSibling, containerEl.value, teaserEl.value, track?.nextElementSibling]) {
    if (el) ro.observe(el)
  }
}

function later(ms: number, fn: () => void) {
  timers.push(setTimeout(fn, ms))
}

function clearTimers() {
  timers.forEach(clearTimeout)
  timers = []
  if (autoplayTimer) clearTimeout(autoplayTimer)
  autoplayTimer = undefined
}

/** 回复出现后停多久再往下走：有导览时等导览走完（用户点选的场景至少停 T.userHold），否则按常规停留 */
function holdFor(tourLeft: number) {
  const tour = tourLeft > 0 ? tourLeft + T.tourTail : 0
  return manual ? Math.max(T.userHold, tour) : tour || T.autoplay
}

/** 安排下一步：同一场景还有下一轮就接着发，否则切到下一个场景 */
function scheduleAutoplay() {
  if (autoplayTimer) clearTimeout(autoplayTimer)
  autoplayTimer = undefined
  if (reduceMotion.value || !inView.value) {
    barOn.value = false
    return
  }
  // 导览的计时器不随离开视口暂停，回来时只等剩下的部分
  const tourLeft = Math.max(0, tourEndAt - performance.now())
  const hold = holdFor(tourLeft)
  if (hasFollowUp.value) {
    const then = copy.value.scenes[activeIndex.value].then!
    const wait = tourLeft > 0 ? tourLeft + T.tourTail : T.followUp
    startBar(wait + roundMs(then.command) + holdFor(planTour(then, frameUnits.value, false).total))
    autoplayTimer = setTimeout(() => run(activeIndex.value, 1), wait)
  } else {
    // 第二轮回复出现时，进度条已经从第一轮走到这里，接着走完即可
    if (!barOn.value) startBar(hold)
    autoplayTimer = setTimeout(() => {
      manual = false
      run((activeIndex.value + 1) % copy.value.scenes.length)
    }, hold)
  }
}

/**
 * 预加载某个场景（含第二轮）的图，扫描显现时不用等下载。
 * 演示图合计近 1 MB，不在挂载时一次拉完：首个场景等聊天窗接近视口再拉，之后每轮顺带拉下一个场景。
 */
const preloaded = new Set<number>()
let preloadIo: IntersectionObserver | undefined
function preload(index: number) {
  const scenes = copy.value.scenes
  const i = index % scenes.length
  if (preloaded.has(i)) return
  preloaded.add(i)
  for (const step of [scenes[i], scenes[i].then]) if (step) new Image().src = withBase(step.image.src)
}

function run(index: number, step = 0) {
  clearTimers()
  started = true
  preload(index)
  preload(index + 1)
  activeIndex.value = index
  const scene = copy.value.scenes[index]
  const command = (step === 1 && scene.then ? scene.then : scene).command
  // 新场景（或重播）从头算进度；第二轮沿用第一轮开始走的进度条
  if (step === 0) barOn.value = false

  if (reduceMotion.value) {
    typed.value = ''
    shownIndex.value = index
    shownStep.value = step
    round.value++
    resetTour()
    phase.value = 'reply'
    return
  }

  phase.value = 'input'
  typed.value = ''
  const chars = Array.from(command)
  chars.forEach((_, i) => {
    later(T.beforeType + i * T.perChar, () => (typed.value = chars.slice(0, i + 1).join('')))
  })

  const tSend = T.beforeType + chars.length * T.perChar + T.beforeSend
  later(tSend, () => {
    typed.value = ''
    sendPulse.value++
    shownIndex.value = index
    shownStep.value = step
    round.value++
    imageLoaded.value = false
    resetTour()
    phase.value = 'sent'
  })
  later(tSend + T.thinking, () => (phase.value = 'thinking'))
  later(tSend + T.reply, () => {
    phase.value = 'reply'
    // 等回复渲染出来再量图宽：导览的滚动距离与标注位置都按实际图宽缩放
    const r = round.value
    nextTick(() => {
      if (round.value !== r) return
      measureShotWidth()
      revealed.value = tour.value.initial
      startTour()
      scheduleAutoplay()
    })
  })
}

/** 长图导览的状态：图片与标注一起上移的距离、这一段滚动的时长、已出现的标注数 */
const pan = ref(0)
const panMs = ref(0)
const revealed = ref(0)
/** 导览结束的时刻（performance.now()），没有导览时为 0 */
let tourEndAt = 0

/**
 * 图片实际显示宽度。标注坐标、导览距离都按 IMAGE_WIDTH（340）记，显示时乘 scale；
 * 窄屏的图比 340 窄，不缩放的话导览会滚过头、标注也对不上。
 */
const imgW = ref(IMAGE_WIDTH)
const scale = computed(() => imgW.value / IMAGE_WIDTH)
/** 图片框最大高度换算成 IMAGE_WIDTH 下的像素 */
const frameUnits = computed(() => frameMax.value / scale.value)
const stageEl = ref<HTMLElement | null>(null)
let stageRo: ResizeObserver | undefined

function measureShotWidth() {
  const w = stageEl.value?.clientWidth
  if (w) imgW.value = Math.min(IMAGE_WIDTH, w)
}

watch(stageEl, (el, old) => {
  if (typeof ResizeObserver === 'undefined') return
  stageRo ??= new ResizeObserver(measureShotWidth)
  if (old) stageRo.unobserve(old)
  if (el) stageRo.observe(el)
})

const tour = computed(() => planTour(shown.value, frameUnits.value, reduceMotion.value))
const shownCallouts = computed(() => (shown.value?.callouts ?? []).slice(0, revealed.value))
const panEnd = computed(() => {
  const img = shown.value?.image
  return !!img && pan.value > 0 && pan.value >= (img.height / img.width) * IMAGE_WIDTH - tour.value.frame - 1
})

/** 新一轮回复：回到图片顶部（不带过渡），只留首屏的标注 */
function resetTour() {
  tourEndAt = 0
  panMs.value = 0
  pan.value = 0
  revealed.value = tour.value.initial
}

/** 按 planTour 的分段排好滚动；计时器与本轮其他计时器一起由 clearTimers 清掉 */
function startTour() {
  const { stops, total } = tour.value
  tourEndAt = total ? performance.now() + total : 0
  for (const s of stops) {
    later(s.at, () => {
      panMs.value = s.ms
      pan.value = s.pan
    })
    // 滚到六成时让新标注出现，看起来是随图片一起滚进来的
    later(s.at + s.ms * 0.6, () => (revealed.value = s.reveal))
  }
}

/** SSR 时按 900 计算，挂载后改用真实视口高度 */
const viewportH = ref(900)
const bodyH = computed(() => Math.round(Math.min(BODY_MAX, Math.max(BODY_MIN, viewportH.value - 229))))
const frameMax = computed(() => bodyH.value - BODY_CHROME)

const isTall = computed(() => {
  const img = shown.value?.image
  if (!img) return false
  return (img.height / img.width) * imgW.value > frameMax.value
})

/**
 * 窄屏首屏的「向下滑动」提示：首屏常常只有 hero，用户不知道下面还有演示。
 * 固定在屏幕底部，只在页面还停在顶部、聊天窗还没露出来时显示；一开始滚动就收起，之后不再出现。
 * 桌面端的舞台卡片里有自己的提示，这里不显示。
 */
const scrollCue = ref(false)
let scrollCueDone = false

function updateScrollCue() {
  if (scrollCueDone) return
  if (staged.value || window.scrollY > 24) {
    // 桌面舞台模式只是不显示；真的滚动过才算看到了
    if (!staged.value) scrollCueDone = true
    scrollCue.value = false
    return
  }
  const top = chatEl.value?.getBoundingClientRect().top ?? 0
  scrollCue.value = top > window.innerHeight - 120
}

function scrollToDemo() {
  scrollCueDone = true
  scrollCue.value = false
  chatEl.value?.scrollIntoView({ behavior: reduceMotion.value ? 'auto' : 'smooth', block: 'center' })
}

function onResize() {
  viewportH.value = window.innerHeight
  updateScrollCue()
  // 视口高度变了，舞台高度（vh 单位）跟着变；ResizeObserver 也会触发，这里保证至少一次
  if (staged.value) remeasure()
}

/** 上一帧写过的进度；没变就不碰 DOM */
let lastEnter = -1
let lastExit = -1

function measureStage() {
  rafId = 0
  if (!staged.value || !G) return
  const { S, hold, N } = G
  const y = window.scrollY
  const enter = S > 0 ? clamp01(y / S) : 1
  const d = Math.min(Math.max(y - S, 0), hold)
  // 变暗跟着「被盖住的程度」走，盖满（到 N）时最暗
  const span = Math.min(hold, N - S)
  const exit = span > 0 ? Math.min(d / span, 1) : 0

  if (Math.abs(enter - lastEnter) > 0.0002) {
    lastEnter = enter
    applyMorph(enter)
    if (heroEl) {
      heroEl.style.opacity = String(1 - enter * 0.8)
      heroEl.style.transform = `translateY(${-enter * 48}px) scale(${1 - enter * 0.04})`
    }
  }
  if (Math.abs(d - lastExit) > 0.1) {
    lastExit = d
    // 固定段内内容以递减的比例跟着走（起步 55%，越拉越沉），手感上就是「拉不动」
    const R = SNAP.rubberMax
    const rubber = (1 - 1 / ((d * SNAP.rubber) / R + 1)) * R
    if (containerEl.value) containerEl.value.style.translate = d > 0 ? `0 ${-rubber.toFixed(1)}px` : ''
    if (dimEl.value) dimEl.value.style.opacity = exit > 0 ? exit.toFixed(3) : ''
  }

  // 到位 = 舞台已贴住导航栏且还没被后面的内容盖过大半。
  // 吸附动画进行中不算「开始」，吸到位那一帧才开始播；已经在播的不因往回吸附而中断
  const atStage = enter >= 0.999 && exit < 0.6
  stageActive = atStage && (!snapping || stageActive)
  // 退回首屏：恢复成预告海报，下次进入从头演示
  if (enter < 0.25 && started) resetIdle()
  updateInView()
}

function onScroll() {
  if (scrollCue.value || !scrollCueDone) updateScrollCue()
  if (!staged.value) return
  if (!rafId) rafId = requestAnimationFrame(measureStage)
  if (snapping) return
  const y = window.scrollY
  if (gestureStart === null) gestureStart = lastY
  if (y !== lastY) {
    scrollDir = y > lastY ? 1 : -1
    lastY = y
  }
  scheduleSettle()
}

function scheduleSettle() {
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(settle, SNAP.idle)
}

/** 滚动停下后决定吸到哪一端 */
function settle() {
  idleTimer = undefined
  if (touching || snapping || !staged.value || !G) return
  const { S, N } = G
  const y = window.scrollY
  const start = gestureStart ?? y
  gestureStart = null
  let target: number | null = null

  if (y > 0 && y < S) {
    // 入场段：滚过 15% 吸进舞台，否则弹回顶部
    const e = y / S
    target = scrollDir > 0 ? (e >= SNAP.enter ? S : 0) : (e <= 1 - SNAP.enter ? 0 : S)
  } else if (y > S && y < N) {
    if (scrollDir > 0) {
      // 离场段往下：自由滚动。只有一次手势从首屏直接冲进来的，才先停在舞台上
      if (start < S - 1) target = S
    } else if (N - y >= SNAP.enter * (N - S)) {
      // 离场途中往回滚：视为重新进入，吸回舞台；只轻轻碰一下则不动
      target = S
    }
  }
  if (target !== null && Math.abs(target - y) > 1) snapTo(target)
}

function snapTo(target: number) {
  cancelSnap()
  const from = window.scrollY
  const dist = Math.abs(target - from)
  if (dist < 1) return
  const dur = Math.min(SNAP.maxDur, Math.max(SNAP.minDur, 250 + dist * 0.6))
  const t0 = performance.now()
  snapping = true
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / dur)
    window.scrollTo({ top: from + (target - from) * easeInOutCubic(p), behavior: 'instant' })
    if (p < 1) {
      snapRaf = requestAnimationFrame(step)
    } else {
      snapRaf = 0
      snapping = false
      lastY = window.scrollY
      gestureStart = null
      // 吸到位后立即判断一次是否开始播放，不依赖之后是否还有 scroll 事件
      if (!rafId) rafId = requestAnimationFrame(measureStage)
    }
  }
  snapRaf = requestAnimationFrame(step)
}

/** 吸附途中用户一有操作就交还控制权 */
function cancelSnap() {
  if (snapRaf) cancelAnimationFrame(snapRaf)
  snapRaf = 0
  if (!snapping) return
  snapping = false
  lastY = window.scrollY
  gestureStart = null
}

function onTouchStart() {
  touching = true
  cancelSnap()
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = undefined
}

function onTouchEnd() {
  touching = false
  if (staged.value) scheduleSettle()
}

/** 退出舞台模式：清掉脚本写在页面元素上的所有样式 */
function clearStageStyles() {
  if (heroEl) {
    heroEl.style.opacity = ''
    heroEl.style.transform = ''
    heroEl.style.willChange = ''
  }
  if (containerEl.value) containerEl.value.style.translate = ''
  if (dimEl.value) dimEl.value.style.opacity = ''
  morphing.value = false
  clearMorph()
  lastEnter = -1
  lastExit = -1
}

/**
 * 窄屏入场：标题、标签条、聊天窗各自滚进视口时才入场（加 is-in 类），每个只播一次。
 * 不按整个模块一起触发：首屏往往只露出标题，聊天窗要等滚到才看得到入场。
 * 桌面舞台模式或减少动态效果时不做（reveal 为 false，元素照常可见）。
 */
const reveal = ref(false)
let revealIo: IntersectionObserver | undefined

function setupReveal() {
  revealIo?.disconnect()
  revealIo = undefined
  const targets = [headEl.value, tabsEl.value, chatEl.value].filter((el): el is HTMLElement => !!el)
  // 挂载时已经露在屏幕里的（比如字号大的手机上，标题刚好卡在首屏底部）直接算入场：
  // 静态 HTML 里它本来就看得见，先藏起来再淡入只会让首屏底部空一块
  if (!staged.value && !reduceMotion.value) {
    for (const el of targets) if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
  }
  const pending = targets.filter((el) => !el.classList.contains('is-in'))
  if (staged.value || reduceMotion.value || !pending.length) {
    reveal.value = false
    return
  }
  reveal.value = true
  // 元素露出到屏幕底部往上 10% 时入场；IntersectionObserver 首次回调在下一帧，隐藏态已渲染，过渡能生效
  revealIo = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      e.target.classList.add('is-in')
      revealIo?.unobserve(e.target)
    }
  }, { rootMargin: '0px 0px -10% 0px' })
  pending.forEach((el) => revealIo!.observe(el))
}

/** 桌面 / 窄屏、动效开关切换后重新进入对应模式 */
function applyMode() {
  setupReveal()
  if (staged.value) {
    lastY = window.scrollY
    navEl = document.querySelector<HTMLElement>('.VPNav')
    heroEl = trackEl.value?.previousElementSibling as HTMLElement | null
    if (heroEl) heroEl.style.willChange = 'opacity, transform'
    // 桌面端是否到位由滚动进度判断，不需要 IntersectionObserver 在滚动时不停回调
    io?.disconnect()
    // 卡片布局要等 staged 渲染出来才能测
    nextTick(() => {
      observeSizes()
      remeasure()
    })
  } else {
    ro?.disconnect()
    layout.value = null
    cancelSnap()
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = undefined
    clearStageStyles()
    computeGeom()
    stageActive = false
    if (io && chatEl.value) io.observe(chatEl.value)
    updateInView()
  }
}

function onDesktopChange() {
  stageMode.value = !!desktopQuery?.matches
  applyMode()
}

/** 点列表项、首屏卡片或海报：标记为用户点选（停留更久）；舞台还没到位时先吸进去，到位后再播 */
function select(index: number) {
  manual = true
  if (staged.value && !stageActive && G) {
    clearTimers()
    barOn.value = false
    activeIndex.value = index
    pendingStart = true
    snapTo(G.S)
    return
  }
  run(index)
}

/** 全图预览打开期间暂停切换场景，关掉后接着播 */
let viewerOpen = false

/**
 * 「查看完整图」用文档页同款的 Teek 图片预览器打开全图（不是聊天框里的截取图）。
 * 带修饰键或中键点击时不拦，照常在新标签页打开链接。
 * 图片带 no-preview 类、这里也拦下冒泡：主题挂在 #VPContent 上的全局预览只会拿到截取图。
 */
function openFull(e: MouseEvent) {
  const image = shown.value?.image
  if (!image || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  e.stopPropagation()
  viewerOpen = true
  updateInView()
  createImageViewer({
    urlList: [withBase(image.full)],
    initialIndex: 0,
    infinite: false,
    onClose: () => {
      viewerOpen = false
      updateInView()
    },
  })
}

function updateInView() {
  const reached = staged.value ? stageActive : ioVisible
  const visible = reached && document.visibilityState === 'visible' && !viewerOpen
  if (visible === inView.value) return
  inView.value = visible

  if (!visible) {
    // 只停「切到下一个场景」；正在进行的一轮让它播完
    if (autoplayTimer) clearTimeout(autoplayTimer)
    autoplayTimer = undefined
    barOn.value = false
    return
  }
  if (!started || pendingStart) {
    pendingStart = false
    run(activeIndex.value)
  } else if (phase.value === 'reply') {
    scheduleAutoplay()
  }
}

function resetIdle() {
  clearTimers()
  started = false
  manual = false
  pendingStart = false
  activeIndex.value = 0
  shownIndex.value = null
  shownStep.value = 0
  typed.value = ''
  phase.value = 'idle'
}

/**
 * 窄屏的功能列表是横向滑动的标签条：切到的标签不在可见范围时，把它滚到中间。
 * 只滚标签条自身（scrollTo），不用 scrollIntoView，避免带着整页一起滚。
 */
const tabsEl = ref<HTMLElement | null>(null)
watch(activeIndex, (i) => {
  const strip = tabsEl.value
  const tab = tabEls[i]
  if (staged.value || !strip || !tab || strip.scrollWidth <= strip.clientWidth) return
  // 标签条没有定位，offsetLeft 不是相对它的，用两者的视口位置差算
  const offset = tab.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft
  const left = offset - (strip.clientWidth - tab.offsetWidth) / 2
  strip.scrollTo({ left: Math.max(0, left), behavior: reduceMotion.value ? 'auto' : 'smooth' })
})

watch(lang, () => {
  if (reduceMotion.value || inView.value) run(0)
  else resetIdle()
  nextTick(() => {
    if (staged.value) remeasure()
  })
})

function onMotionChange() {
  reduceMotion.value = !!motionQuery?.matches
  applyMode()
  run(activeIndex.value)
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', onMotionChange)
  // 聊天窗接近视口时才预加载第一个场景，之后每轮预加载下一个场景（见 run）
  preloadIo = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    preload(0)
    preloadIo?.disconnect()
  }, { rootMargin: '0px 0px 50% 0px' })
  if (chatEl.value) preloadIo.observe(chatEl.value)

  desktopQuery = window.matchMedia('(min-width: 961px)')
  desktopQuery.addEventListener('change', onDesktopChange)
  stageMode.value = desktopQuery.matches
  lastY = window.scrollY

  viewportH.value = window.innerHeight
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('wheel', cancelSnap, { passive: true })
  window.addEventListener('mousedown', cancelSnap)
  window.addEventListener('keydown', cancelSnap)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd)
  window.addEventListener('touchcancel', onTouchEnd)
  document.addEventListener('visibilitychange', updateInView)

  // 不播动画时没有「错过开头」的问题，直接展示第一个场景
  if (reduceMotion.value) run(0)
  applyMode()
  updateScrollCue()

  // 聊天窗可见部分达到「自身高度与视口高度中较小者」的 85% 才算看到了：
  // 窗口比视口高时（高缩放）用视口高度做基准，否则永远达不到阈值
  io = new IntersectionObserver(([entry]) => {
    const rootH = entry.rootBounds?.height ?? window.innerHeight
    const need = 0.85 * Math.min(entry.boundingClientRect.height, rootH)
    ioVisible = entry.isIntersecting && entry.intersectionRect.height >= need
    updateInView()
  }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) })
  if (!staged.value && chatEl.value) io.observe(chatEl.value)
})

onUnmounted(() => {
  clearTimers()
  io?.disconnect()
  revealIo?.disconnect()
  preloadIo?.disconnect()
  stageRo?.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
  cancelSnap()
  if (idleTimer) clearTimeout(idleTimer)
  ro?.disconnect()
  // 页面切走时 hero 与后面的内容还在复用的布局里，样式要还原
  if (heroEl) {
    heroEl.style.opacity = ''
    heroEl.style.transform = ''
    heroEl.style.willChange = ''
  }
  if (tailEl) tailEl.style.marginTop = ''
  desktopQuery?.removeEventListener('change', onDesktopChange)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('wheel', cancelSnap)
  window.removeEventListener('mousedown', cancelSnap)
  window.removeEventListener('keydown', cancelSnap)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('touchcancel', onTouchEnd)
  document.removeEventListener('visibilitychange', updateInView)
  motionQuery?.removeEventListener('change', onMotionChange)
})

const avatar = withBase('/images/cain-mcmai-avatar-128.webp')
</script>

<template>
  <div ref="trackEl" class="hcs-track" :class="{ staged }">
  <section
    class="hcs"
    :class="{ morphing }"
    :style="{ '--img-w': `${IMAGE_WIDTH}px`, '--frame-max': `${frameMax}px`, '--body-h': `${bodyH}px` }"
  >
    <div
      ref="containerEl"
      class="hcs-container"
      :class="{ live: inView, reveal }"
    >
      <!-- 首屏卡片布局：只用来测量每张卡的位置，画面由下方 .hcs-ghosts 绘制 -->
      <div v-if="staged" ref="teaserEl" class="hcs-teaser" aria-hidden="true">
        <div class="hcs-grid">
          <div
            v-for="(s, i) in copy.scenes"
            :key="s.key"
            :ref="(el) => { if (el) slotEls[i] = el as HTMLElement }"
            class="hcs-tab hcs-card"
            :class="{ feature: i === 0, active: i === 0 }"
          >
            <span class="hcs-tab-index">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="hcs-tab-text">
                  <span class="hcs-tab-title">{{ s.title }}</span>
                  <span class="hcs-tab-desc">{{ s.desc }}</span>
                  <span v-if="i === 0" class="hcs-card-cue">{{ copy.cue }} ↓</span>
                </span>
          </div>
          <dl ref="regionSlotEl" class="hcs-meta hcs-card region">
            <span class="hcs-region-text">
                  <span class="hcs-tab-title">{{ copy.regionTitle }}</span>
                  <span class="hcs-tab-desc">{{ copy.regionDesc }}</span>
                </span>
                <div>
                  <dt>{{ copy.regionsLabel }}</dt>
                  <dd v-for="r in copy.regions" :key="r">{{ r }}</dd>
                </div>
                <div>
                  <dt>{{ copy.platformsLabel }}</dt>
                  <dd v-for="p in PLATFORMS" :key="p">{{ p }}</dd>
                </div>
          </dl>
        </div>
      </div>

      <div class="hcs-body">
        <!-- 左：标题 + 功能列表 + 区服/平台 -->
        <div ref="sideEl" class="hcs-side">
          <header ref="headEl" class="hcs-head">
            <p class="hcs-eyebrow">{{ copy.eyebrow }}</p>
            <h2 class="hcs-title">{{ copy.title }}</h2>
            <p class="hcs-sub">{{ copy.sub }}</p>
          </header>

          <div ref="tabsEl" class="hcs-tabs" role="tablist">
            <button
              v-for="(s, i) in copy.scenes"
              :key="s.key"
              type="button"
              role="tab"
              :ref="(el) => { if (el) tabEls[i] = el as HTMLElement }"
              class="hcs-tab"
              :class="{ active: i === activeIndex }"
              :aria-selected="i === activeIndex"
              @click="select(i)"
            >
              <span class="hcs-tab-index">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="hcs-tab-text">
                <span class="hcs-tab-title">{{ s.title }}</span>
                <span class="hcs-tab-desc">{{ s.desc }}</span>
              </span>
              <span
                v-if="i === activeIndex && barOn && inView && !reduceMotion"
                :key="barKey"
                class="hcs-tab-progress"
                :style="{ animationDuration: `${barMs}ms` }"
              />
            </button>
          </div>

          <dl ref="metaEl" class="hcs-meta">
            <div>
              <dt>{{ copy.regionsLabel }}</dt>
              <dd v-for="r in copy.regions" :key="r">{{ r }}</dd>
            </div>
            <div>
              <dt>{{ copy.platformsLabel }}</dt>
              <dd v-for="p in PLATFORMS" :key="p">{{ p }}</dd>
            </div>
          </dl>
        </div>

        <!-- 右：聊天窗口 -->
        <div ref="chatEl" class="hcs-chat" role="tabpanel">
          <div class="hcs-chat-bar">
            <img class="hcs-avatar sm" :src="avatar" alt="" width="28" height="28">
            <span class="hcs-chat-name">{{ copy.botName }}</span>
            <span class="hcs-chat-status"><i />{{ copy.online }}</span>
            <span class="hcs-demo-badge">{{ copy.demo }}</span>
            <a class="hcs-more" :href="withBase(active.link)">{{ copy.learnMore }} →</a>
          </div>

          <div class="hcs-chat-body">
            <!-- 预告海报：还没开始演示时占位，像视频封面；点击等同滚进舞台 -->
            <Transition name="hcs-fade">
              <div v-if="phase === 'idle'" class="hcs-poster" aria-hidden="true" @click="select(activeIndex)">
                <img class="hcs-poster-blur" :src="withBase(B50_POSTER)" alt="" :width="B50_IMAGE.width" :height="B50_IMAGE.height">
                <!-- 窄屏的封面：三张真实结果图扇形摊开，聊天窗滚进视口时从叠在一起展开 -->
                <div class="hcs-fan">
                  <img
                    v-for="f in FAN"
                    :key="f.key"
                    class="hcs-fan-card"
                    :class="f.key"
                    :src="withBase(f.src)"
                    alt=""
                    :width="f.width"
                    :height="f.height"
                    loading="lazy"
                    decoding="async"
                  >
                </div>
                <!-- 与封面图同框，按钮和提示在框里居中 -->
                <span class="hcs-play-area">
                  <span class="hcs-play">
                    <!-- Material Symbols「play_arrow」Rounded（Apache-2.0）；viewBox 横移让三角外框落在圆心 -->
                    <svg viewBox="1.0625 0 24 24" width="44" height="44" fill="currentColor"><path d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712" /></svg>
                  </span>
                  <span class="hcs-cue">{{ copy.cue }} <span class="hcs-cue-arrow">↓</span></span>
                </span>
              </div>
            </Transition>

            <Transition name="hcs-swap" mode="out-in">
              <div v-if="shown" :key="round" class="hcs-thread">
                <div class="hcs-msg user">
                  <div class="hcs-bubble user"><code>{{ shown.command }}</code></div>
                </div>

                <div v-if="phase !== 'sent'" class="hcs-msg bot">
                  <img class="hcs-avatar" :src="avatar" alt="" width="36" height="36">

                  <div v-if="phase === 'thinking'" class="hcs-bubble bot hcs-typing" aria-hidden="true">
                    <span /><span /><span />
                  </div>

                  <div v-else class="hcs-reply">
                    <div ref="stageEl" class="hcs-stage" :style="{ '--pan': `${-pan * scale}px`, '--pan-ms': `${panMs}ms`, '--shot-w': `${imgW}px` }">
                      <a
                        class="hcs-image"
                        :class="{ tall: isTall, loaded: imageLoaded, end: panEnd }"
                        :href="withBase(shown.image.full)"
                        target="_blank"
                        rel="noopener"
                        @click="openFull"
                      >
                        <img
                          class="no-preview"
                          :src="withBase(shown.image.src)"
                          :alt="shown.image.alt"
                          :width="shown.image.width"
                          :height="shown.image.height"
                          decoding="async"
                          @load="imageLoaded = true"
                        >
                        <span class="hcs-scan" aria-hidden="true" />
                        <span class="hcs-image-hint">
                          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M11 8v6M8 11h6" /></svg>
                          <span class="hcs-image-hint-text">{{ copy.viewFull }}</span>
                        </span>
                      </a>

                      <!-- 标注层与图片框等高，和图片用同一个 --pan 平移，导览时一起滚动；滚出框外的靠遮罩淡出 -->
                      <div v-if="imageLoaded" class="hcs-callouts" :style="{ height: `${tour.frame * scale}px` }">
                        <div class="hcs-callouts-track">
                          <div
                            v-for="(c, i) in shownCallouts"
                            :key="c.text"
                            class="hcs-callout"
                            :class="{ out: c.y - pan < CALLOUT_MARGIN }"
                            :style="{ top: `${c.y * scale}px`, animationDelay: `${i < tour.initial ? 450 + i * 160 : 0}ms` }"
                          >
                            <i class="hcs-callout-dot" />
                            <i class="hcs-callout-line" />
                            <span class="hcs-callout-label">{{ c.text }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- 输入栏：纯展示，不可交互 -->
          <div class="hcs-input" aria-hidden="true">
            <div class="hcs-field" :class="{ focus: phase === 'input' && !reduceMotion }">
              <span class="hcs-typed">{{ typed }}</span>
              <span v-if="phase === 'input' && !reduceMotion" class="hcs-caret" />
              <span v-if="!typed" class="hcs-placeholder">{{ copy.inputPlaceholder }}</span>
            </div>
            <span :key="sendPulse" class="hcs-send" :class="{ ready: !!typed, pressed: sendPulse > 0 }">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            </span>
          </div>
        </div>
      </div>

      <!-- 变形中的卡片：位置在「首屏卡片」与「舞台元素」之间按滚动进度插值 -->
      <div v-if="staged" class="hcs-ghosts" aria-hidden="true">
        <button
          v-for="(s, i) in copy.scenes"
          :key="s.key"
          type="button"
          tabindex="-1"
          :ref="(el) => { if (el) ghostEls[i] = el as HTMLElement }"
          class="hcs-tab hcs-card hcs-ghost"
          :class="{ feature: i === 0, active: i === 0 }"
          @click="select(i)"
        >
          <span class="hcs-tab-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="hcs-tab-text">
            <span class="hcs-tab-title">{{ s.title }}</span>
            <span class="hcs-tab-desc">{{ s.desc }}</span>
            <span v-if="i === 0" class="hcs-card-cue">{{ copy.cue }} <span class="hcs-cue-arrow">↓</span></span>
          </span>
          <img v-if="i === 0" class="hcs-card-thumb" :src="withBase(B50_POSTER)" alt="" :width="B50_IMAGE.width" :height="B50_IMAGE.height">
        </button>
        <dl ref="metaGhostEl" class="hcs-meta hcs-card region hcs-ghost" @click="select(activeIndex)">
          <span class="hcs-region-text">
            <span class="hcs-tab-title">{{ copy.regionTitle }}</span>
            <span class="hcs-tab-desc">{{ copy.regionDesc }}</span>
          </span>
          <div>
            <dt>{{ copy.regionsLabel }}</dt>
            <dd v-for="r in copy.regions" :key="r">{{ r }}</dd>
          </div>
          <div>
            <dt>{{ copy.platformsLabel }}</dt>
            <dd v-for="p in PLATFORMS" :key="p">{{ p }}</dd>
          </div>
        </dl>
      </div>
    </div>
    <!-- 窄屏首屏底部的「向下滑动」提示（见 updateScrollCue），默认隐藏，脚本判断需要时才显示 -->
    <button
      v-if="!staged"
      type="button"
      class="hcs-scroll-cue"
      :class="{ shown: scrollCue }"
      :tabindex="scrollCue ? 0 : -1"
      :aria-hidden="!scrollCue"
      @click="scrollToDemo"
    >
      {{ copy.cue }} <span class="hcs-cue-arrow">↓</span>
    </button>
    <!-- 固定段里被后面内容盖住时的变暗层：只改它的 opacity，不对整块内容做 filter -->
    <div v-if="staged" ref="dimEl" class="hcs-dim" aria-hidden="true" />
  </section>
  </div>
</template>

<style scoped>
.hcs {
  position: relative;
  z-index: 1;
  padding: 8px 24px 56px;
}

@media (min-width: 640px) {
  .hcs { padding: 8px 48px 64px; }
}

@media (min-width: 960px) {
  /* 一屏一个模块：高度 = 视口 - 导航栏，内容垂直居中 */
  .hcs {
    display: flex;
    align-items: center;
    min-height: calc(100vh - var(--vp-nav-height));
    padding: 24px 64px;
  }

  .hcs-container {
    flex: 1;
  }
}

.hcs-container {
  position: relative;
  max-width: 1152px;
  margin: 0 auto;
}

/* ---------- 舞台（桌面端） ---------- */
.hcs-track {
  position: relative;
}

@media (min-width: 961px) {
  /* 一屏的舞台 + 一屏的固定段（吸附与阻尼见脚本里的 SNAP）。
     挂载后 computeGeom() 按后面内容的高度改写成精确值，这里是渲染前的默认值 */
  .hcs-track.staged {
    height: calc(200vh - var(--vp-nav-height));
  }

  .hcs-track.staged .hcs {
    position: sticky;
    top: var(--vp-nav-height);
    height: calc(100vh - var(--vp-nav-height));
  }
}

/*
 * 固定段里的回弹位移（.hcs-container 的 translate）和变暗（.hcs-dim 的 opacity）
 * 由 measureStage() 直接写在元素上，都只触发合成，不重排、不重绘。
 * staged 类只在桌面且未开启「减少动态效果」时存在。
 */
.staged .hcs-container {
  will-change: translate;
}

.hcs-dim {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  background: rgb(0 0 0 / 35%);
  opacity: 0;
  will-change: opacity;
}

/* ---------- 首屏卡片与变形 ---------- */
/* 只用于测量：与真实布局同宽，贴住模块顶端（top / padding-top 由脚本写入） */
.hcs-teaser {
  position: absolute;
  left: 0;
  right: 0;
  visibility: hidden;
  pointer-events: none;
}

.hcs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.15fr;
  gap: 14px;
}

.hcs .hcs-card.region {
  grid-column: 1 / -1;
}

/* 卡片态的功能项：结构、样式与列表项一致，变形结束时才能和真实列表项无缝替换 */
.hcs .hcs-card {
  margin: 0;
}

/* B50 卡在右侧占两行，最后展开成同在右侧的聊天窗 */
.hcs .hcs-card.feature {
  grid-column: 3;
  grid-row: 1 / span 2;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  padding: 20px 22px;
  opacity: 1;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}

.hcs .hcs-card.feature .hcs-tab-title {
  font-size: 19px;
}

.hcs .hcs-card-cue {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

/* B50 卡底部露出一截模糊的成绩图，和展开后的海报衔接 */
.hcs .hcs-card-thumb {
  position: absolute;
  left: 22px;
  right: 22px;
  top: calc(100% - 64px);
  width: calc(100% - 44px);
  height: auto;
  border-radius: 10px;
  pointer-events: none;
}

/* 「多区服」卡：标题说明在上，区服 / 平台标签在下；变形时标题说明收起 */
.hcs .hcs-card.region {
  flex-direction: row;
  padding: 14px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.hcs .hcs-region-text {
  display: flex;
  flex-basis: 100%;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 4px;
}

.hcs:not(.morphing) .hcs-ghosts {
  display: none;
}

.hcs .hcs-ghosts {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.hcs .hcs-ghost {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
  pointer-events: auto;
  cursor: pointer;
  /* 与未选中列表项的 0.7 衔接 */
  opacity: calc(1 - var(--p, 0) * 0.3);
  transition: none;
}

.hcs .hcs-ghost:hover {
  opacity: 1;
  transform: none;
}

/* B50 卡的文字和缩略图先于卡片本身淡出 */
.hcs .hcs-ghost.feature > * {
  opacity: calc(1 - var(--p, 0) * 2.2);
}

/* 多区服条：卡片外观淡出，变成上方带分隔线的标签区 */
.hcs .hcs-ghost.region {
  padding:
    calc(14px + var(--p, 0) * 4px)
    calc((1 - var(--p, 0)) * 20px)
    calc((1 - var(--p, 0)) * 14px);
  border-color: rgb(from var(--vp-c-divider) r g b / calc(1 - var(--p, 0)));
  border-top-color: var(--vp-c-divider);
  border-radius: calc((1 - var(--p, 0)) * 14px);
  background: rgb(from var(--vp-c-bg-soft) r g b / calc(1 - var(--p, 0)));
  opacity: 1;
}

.hcs .hcs-ghost.region .hcs-region-text {
  max-height: calc((1 - var(--p, 0)) * 64px);
  margin-bottom: calc((1 - var(--p, 0)) * 4px);
  overflow: hidden;
  opacity: calc(1 - var(--p, 0) * 2);
}

/* 变形期间真实的列表项 / 标签由 ghost 代替；B50 项的透明度由脚本控制 */
.morphing .hcs-body .hcs-tab:not(:first-child),
.morphing .hcs-body .hcs-meta {
  visibility: hidden;
}

/* ---------- 预告提示（海报上） ---------- */
/* 桌面端提示已在 B50 卡片上，海报里不再重复 */
.staged .hcs-cue {
  display: none;
}

.hcs-cue {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  border-radius: 999px;
  background: rgb(17 18 24 / 72%);
}

.hcs-cue-arrow {
  display: inline-block;
  animation: hcs-bounce 1.4s ease-in-out infinite;
}

@keyframes hcs-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* 窄屏首屏底部的「向下滑动」提示：居中贴底，避开右下角的文档助手按钮 */
.hcs-scroll-cue {
  position: fixed;
  z-index: 20;
  left: 50%;
  bottom: calc(20px + env(safe-area-inset-bottom));
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  border-radius: 999px;
  background: rgb(17 18 24 / 78%);
  box-shadow: 0 6px 20px rgb(0 0 0 / 20%);
  opacity: 0;
  transform: translate(-50%, 12px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.hcs-scroll-cue.shown {
  opacity: 1;
  transform: translate(-50%, 0);
  pointer-events: auto;
}

@media (min-width: 961px) {
  .hcs-scroll-cue {
    display: none;
  }
}

/* ---------- 预告海报 ---------- */
.hcs-poster {
  position: absolute;
  inset: 0;
  overflow: hidden;
  cursor: pointer;
}

.hcs-poster:hover .hcs-play {
  transform: scale(1.06);
  box-shadow:
    0 0 0 10px rgb(255 255 255 / 28%),
    0 12px 32px rgb(0 0 0 / 35%);
}

/* 与回复图片同一位置：左 = 内边距 18 + 头像 36 + 间距 10；上 = 内边距 18 + 用户气泡 40 + 间距 14 */
.hcs-poster-blur {
  position: absolute;
  left: 64px;
  top: 72px;
  width: var(--img-w);
  height: auto;
  border-radius: 12px;
}

/* 按钮与提示的定位框：和封面图同位同宽，底部到海报底，内容在框里居中 */
.hcs-play-area {
  position: absolute;
  left: 64px;
  top: 72px;
  bottom: 0;
  width: var(--img-w);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  pointer-events: none;
}

/* 白色实心圆 + 品牌色三角，外圈一道半透明光环；在花哨的截图上也清楚 */
.hcs-play {
  position: relative;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  /* 底色两种主题都是白，三角固定用亮色主题的品牌靛蓝；暗色的 brand-1 是浅紫，压在白底上太淡 */
  color: #3451b2;
  background: #fff;
  box-shadow:
    0 0 0 8px rgb(255 255 255 / 22%),
    0 10px 28px rgb(0 0 0 / 30%);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.hcs-play::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid rgb(255 255 255 / 55%);
  animation: hcs-halo 2.2s ease-out 1s infinite;
}

@keyframes hcs-halo {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(1.4); opacity: 0; }
}

/* 窄屏封面的扇形卡片（样式见窄屏媒体查询），宽屏不显示 */
.hcs-fan {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 22px;
  height: 300px;
  -webkit-mask-image: linear-gradient(to bottom, #000 45%, transparent 96%);
  mask-image: linear-gradient(to bottom, #000 45%, transparent 96%);
}

.hcs-fan-card {
  position: absolute;
  top: 18px;
  width: 54%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: top;
  border-radius: 12px;
  border: 1px solid rgb(255 255 255 / 14%);
  box-shadow: 0 12px 28px rgb(0 0 0 / 28%);
  transform-origin: 50% 100%;
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
}

.hcs-fan-card.search {
  left: 5%;
  transform: rotate(-8deg);
}

.hcs-fan-card.grank {
  left: 41%;
  transform: rotate(8deg);
}

.hcs-fan-card.b50 {
  top: 0;
  left: 23%;
  z-index: 1;
}

/* 聊天窗还没滚进来时三张叠在一起，进来后摊开（只在窄屏入场动画开启时） */
.hcs-container.reveal .hcs-chat:not(.is-in) .hcs-fan-card.search {
  transform: translateX(30%) rotate(0) scale(0.92);
}

.hcs-container.reveal .hcs-chat:not(.is-in) .hcs-fan-card.grank {
  transform: translateX(-30%) rotate(0) scale(0.92);
}

.hcs-container.reveal .hcs-chat:not(.is-in) .hcs-fan-card.b50 {
  transform: translateY(14px) scale(0.96);
}

.hcs-fade-leave-active {
  transition: opacity 0.35s ease;
}

.hcs-fade-leave-to {
  opacity: 0;
}

/* ---------- 布局 ---------- */
.hcs-body {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.3fr);
  gap: 32px;
  align-items: stretch;
}

.hcs-side {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* ---------- 标题 ---------- */
.hcs-head {
  margin-bottom: 24px;
}

.hcs-eyebrow {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--vp-c-brand-1);
}

.hcs-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.hcs-sub {
  margin: 8px 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* ---------- 左侧功能列表 ---------- */
.hcs-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hcs-tab {
  position: relative;
  overflow: hidden;
  display: flex;
  flex: 1;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  text-align: left;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  opacity: 0.7;
  transition: border-color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
}

.hcs-tab:hover {
  opacity: 1;
  transform: translateX(3px);
}

.hcs-tab.active {
  opacity: 1;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
  transform: none;
}

.hcs-tab-index {
  flex: none;
  padding-top: 2px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
  transition: color 0.2s ease;
}

.hcs-tab.active .hcs-tab-index {
  color: var(--vp-c-brand-1);
}

.hcs-tab-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.hcs-tab-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.hcs-tab-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.hcs-tab-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: var(--vp-c-brand-1);
  transform-origin: left;
  animation: hcs-progress linear forwards;
}

@keyframes hcs-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* ---------- 区服 / 平台 ---------- */
/* 横向排列、放不下自动换行：首屏的「多区服」长条和左栏里的窄标签区用同一套排版 */
.hcs-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 20px 0 0;
  padding-top: 18px;
  border-top: 1px solid var(--vp-c-divider);
}

.hcs-meta > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.hcs-meta dt {
  min-width: 4.5em;
  margin-right: 4px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.hcs-meta dd {
  margin: 0;
  padding: 2px 10px;
  font-size: 12.5px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

/* ---------- 右侧聊天窗口 ---------- */
.hcs-chat {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 10px 30px 0 rgb(0 0 0 / 15%);
  overflow: hidden;
}

.hcs-chat-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.hcs-chat-name {
  font-size: 14px;
  font-weight: 600;
}

.hcs-demo-badge {
  padding: 1px 8px;
  font-size: 11px;
  line-height: 18px;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
}

.hcs-chat-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.hcs-chat-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3fb950;
}

.hcs-more {
  margin-left: auto;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.hcs-more:hover {
  text-decoration: underline;
}

.hcs-chat-body {
  container-type: inline-size;
  position: relative;
  /* 固定高度（随视口计算，见 bodyH）：切换场景时窗口不跳动 */
  flex: 1;
  min-height: var(--body-h);
  padding: 18px 18px 8px;
  overflow: hidden;
}

.hcs-thread {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 旧对话向上淡出，新对话自下而上进入 */
.hcs-swap-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.hcs-swap-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

.hcs-avatar {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.hcs-avatar.sm {
  width: 28px;
  height: 28px;
}

.hcs-msg {
  display: flex;
  gap: 10px;
}

.hcs-msg.user {
  justify-content: flex-end;
}

.hcs-msg.user .hcs-bubble {
  transform-origin: bottom right;
  animation: hcs-pop 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.hcs-msg.bot {
  animation: hcs-in 0.26s ease both;
}

@keyframes hcs-pop {
  from { opacity: 0; transform: translateY(24px) scale(0.85); }
  to { opacity: 1; transform: none; }
}

@keyframes hcs-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}

.hcs-bubble {
  max-width: 100%;
  padding: 9px 14px;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 16px;
}

.hcs-bubble.user {
  border-bottom-right-radius: 6px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}

.hcs-bubble.user code {
  padding: 0;
  font-size: 14px;
  color: inherit;
  background: none;
}

.hcs-bubble.bot {
  border-top-left-radius: 6px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
}

.hcs-typing {
  display: inline-flex;
  gap: 4px;
  align-self: flex-start;
  padding: 14px 16px;
}

.hcs-typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
  animation: hcs-dot 1s infinite ease-in-out;
}

.hcs-typing span:nth-child(2) { animation-delay: 0.15s; }
.hcs-typing span:nth-child(3) { animation-delay: 0.3s; }

@keyframes hcs-dot {
  0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
}

.hcs-reply {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

/* ---------- 图片框：扫描显现 + 限高渐隐 + 长图导览 ---------- */
.hcs-stage {
  position: relative;
}

.hcs-image {
  position: relative;
  display: block;
  width: var(--img-w);
  max-width: 100%;
  max-height: var(--frame-max);
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  /* 图片显现前的骨架闪光 */
  background:
    linear-gradient(100deg, transparent 30%, rgb(255 255 255 / 6%) 50%, transparent 70%) 0 0 / 200% 100%,
    var(--vp-c-bg-elv);
  animation: hcs-shimmer 1.2s linear infinite;
}

@keyframes hcs-shimmer {
  to { background-position: -200% 0; }
}

.hcs-image img {
  display: block;
  width: 100%;
  height: auto;
  clip-path: inset(0 0 100% 0);
  /* 长图导览：--pan 由脚本按 planTour 分段写入，标注层用同一个值，两者始终对齐 */
  transform: translateY(var(--pan, 0));
  transition: transform var(--pan-ms, 0ms) cubic-bezier(0.45, 0, 0.25, 1);
}

.hcs-image.loaded img {
  clip-path: none;
  animation: hcs-reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hcs-image.loaded {
  animation: none;
}

@keyframes hcs-reveal {
  from { clip-path: inset(0 0 100% 0); }
  to { clip-path: inset(0 0 0 0); }
}

/* 跟随显现边缘下移的扫描光带：一层与图片框等高、光带画在底边，整层用 translateY 从框上方移到框内，
   底边正好扫过整张图（只动 transform，不动 top） */
.hcs-scan {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(to bottom, transparent calc(100% - 36px), rgb(255 255 255 / 35%) calc(100% - 5px), rgb(255 255 255 / 80%));
  pointer-events: none;
  opacity: 0;
  transform: translateY(-100%);
}

.hcs-image.loaded .hcs-scan {
  animation: hcs-scan 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes hcs-scan {
  0% { transform: translateY(-100%); opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateY(0); opacity: 0; }
}

.hcs-image.tall::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 72px;
  background: linear-gradient(to bottom, transparent, rgb(0 0 0 / 55%));
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* 导览滚到图片底部时，底部的「还有更多」渐暗就不需要了 */
.hcs-image.tall.end::after {
  opacity: 0;
}

/* 点击在页内用图片预览器放大，不跳走 */
a.hcs-image {
  cursor: zoom-in;
}

/* 放左下角：标注的圆点都贴在图片右缘，放右下会被最底下那条压住 */
.hcs-image-hint {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px 3px 8px;
  font-size: 12px;
  color: #fff;
  border-radius: 999px;
  background: rgb(0 0 0 / 60%);
  animation: hcs-in 0.3s ease 0.7s both;
}

.hcs-image-hint svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
}

.hcs-image:not(.loaded) .hcs-image-hint {
  display: none;
}

/* ---------- 图片标注：利用图片右侧的空白 ---------- */
/* 与图片框等高的一层，上下边缘渐隐：导览时滚出框外的标注在这里淡出。
   右侧多留 20px 给标签阴影，遮罩外的部分会被裁掉 */
.hcs-callouts {
  position: absolute;
  top: 0;
  left: 0;
  right: -20px;
  z-index: 4;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 12px, #000 calc(100% - 12px), transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 12px, #000 calc(100% - 12px), transparent);
}

.hcs-callouts-track {
  position: relative;
  height: 100%;
  transform: translateY(var(--pan, 0));
  transition: transform var(--pan-ms, 0ms) cubic-bezier(0.45, 0, 0.25, 1);
}

.hcs-callout {
  position: absolute;
  left: calc(var(--img-w) - 18px);
  right: 20px;
  display: flex;
  align-items: center;
  pointer-events: none;
  transform: translateY(-50%);
  animation: hcs-callout 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: opacity 0.25s ease;
}

/* 导览把标注滚出框顶时淡出（入场动画占着 .hcs-callout 自身的 opacity，所以淡的是子元素） */
.hcs-callout > * {
  transition: opacity 0.3s ease;
}

.hcs-callout.out > * {
  opacity: 0;
}

@keyframes hcs-callout {
  from { opacity: 0; clip-path: inset(-20px 100% -20px -20px); }
  to { opacity: 1; clip-path: inset(-20px -20px -20px -20px); }
}

.hcs-callout-dot {
  position: relative;
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgb(255 255 255 / 85%);
}

.hcs-callout-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-brand-1);
  animation: hcs-ping 1.8s ease-out 1.2s infinite;
}

/* 舞台不在视口里（或标签页在后台）时，循环动画停下 */
.hcs-container:not(.live) .hcs-callout-dot::after {
  animation-play-state: paused;
}

@keyframes hcs-ping {
  from { transform: scale(1); opacity: 0.9; }
  to { transform: scale(2.4); opacity: 0; }
}

.hcs-callout-line {
  flex: none;
  width: 30px;
  height: 1px;
  background: var(--vp-c-brand-1);
}

.hcs-callout-label {
  min-width: 0;
  padding: 5px 10px;
  font-size: 12.5px;
  line-height: 1.45;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  box-shadow: 0 4px 14px rgb(0 0 0 / 12%);
}

/*
 * 聊天区太窄、图片右侧放不下标注时，标注直接盖在图上：圆点贴图片右缘，标签向左展开，
 * 深色半透明底保证压在任何图上都看得清。坐标、导览与宽屏共用，只是换了摆法。
 */
@container (max-width: 600px) {
  .hcs-callouts {
    right: auto;
    width: var(--shot-w, 100%);
  }

  .hcs-callout {
    left: 8px;
    right: 8px;
    flex-direction: row-reverse;
    animation-name: hcs-callout-rtl;
  }

  .hcs-callout-dot {
    width: 8px;
    height: 8px;
    box-shadow: 0 0 0 2px rgb(255 255 255 / 90%);
  }

  .hcs-callout-line {
    width: 10px;
    background: rgb(255 255 255 / 85%);
  }

  .hcs-callout-label {
    max-width: calc(100% - 24px);
    padding: 3px 9px;
    font-size: 11.5px;
    line-height: 1.4;
    border: 1px solid rgb(255 255 255 / 16%);
    border-radius: 11px;
    background: rgb(17 18 24 / 82%);
    color: #fff;
    box-shadow: 0 3px 10px rgb(0 0 0 / 25%);
  }

  /* 标签从右侧向左展开，可能伸到左下角；提示缩成只有放大镜的小圆钮 */
  .hcs-image-hint {
    left: 8px;
    bottom: 8px;
    width: 26px;
    height: 26px;
    padding: 0;
    justify-content: center;
  }

  .hcs-image-hint svg {
    width: 14px;
    height: 14px;
  }

  .hcs-image-hint-text {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}

@keyframes hcs-callout-rtl {
  from { opacity: 0; clip-path: inset(-20px -20px -20px 100%); }
  to { opacity: 1; clip-path: inset(-20px -20px -20px -20px); }
}

/* ---------- 输入栏 ---------- */
.hcs-input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px 14px;
}

.hcs-field {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.hcs-field.focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.hcs-placeholder {
  position: absolute;
  left: 16px;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-3);
}

.hcs-field.focus .hcs-placeholder {
  left: 19px;
}

.hcs-caret {
  flex: none;
  width: 2px;
  height: 18px;
  margin-left: 1px;
  background: var(--vp-c-brand-1);
  animation: hcs-caret 1s steps(1) infinite;
}

@keyframes hcs-caret {
  50% { opacity: 0; }
}

.hcs-send {
  flex: none;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.hcs-send.ready {
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  transform: scale(1.06);
}

.hcs-send.pressed {
  animation: hcs-press 0.36s ease;
}

@keyframes hcs-press {
  0% { transform: scale(1.06); background: var(--vp-button-brand-bg); color: var(--vp-button-brand-text); }
  35% { transform: scale(0.86); background: var(--vp-button-brand-bg); color: var(--vp-button-brand-text); }
  100% { transform: scale(1); }
}

/* ---------- 窄屏：列表变成横向滑动的标签 ---------- */
@media (max-width: 860px) {
  .hcs-body {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  .hcs-tabs {
    flex-direction: row;
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 -24px;
    padding: 0 24px;
  }

  .hcs-tab {
    flex: none;
    padding: 8px 16px;
    border-radius: 999px;
  }

  .hcs-tab:hover {
    transform: none;
  }

  .hcs-tab-index,
  .hcs-tab-desc {
    display: none;
  }

  .hcs-tab-title {
    font-size: 14px;
    white-space: nowrap;
  }

  /* 窄屏下夹在标签和聊天窗之间太挤；区服与平台信息首屏 hero 已经提到 */
  .hcs-meta {
    display: none;
  }

  .hcs-chat-body {
    padding: 16px 14px 8px;
  }

  /*
   * 窄屏封面：不用模糊压暗的单张图，改成三张真实结果图扇形摊开，底部渐隐进聊天区；
   * 播放按钮和提示语居中压在中间那张上。三张都是演示要用的图，懒加载，不额外占流量。
   */
  .hcs-poster {
    background: radial-gradient(90% 60% at 50% 28%, var(--vp-c-brand-soft), transparent 72%);
  }

  .hcs-poster-blur {
    display: none;
  }

  .hcs-fan {
    display: block;
  }

  /* 定位框与中间那张 B50 卡片重合（同 left / width / 比例，top = .hcs-fan 的 22px） */
  .hcs-play-area {
    left: 23%;
    top: 22px;
    bottom: auto;
    width: 54%;
    aspect-ratio: 4 / 5;
  }
}

/* ---------- 窄屏入场：标题、标签条、聊天窗依次上浮淡入 ----------
 * 窄屏没有舞台，用一次性的入场代替：每个元素滚进视口时各自触发，只播一次。
 * reveal 类只在窄屏且未开启「减少动态效果」时由脚本加上，脚本没跑时内容照常可见。
 * 只动 opacity / transform。
 */
.hcs-container.reveal :is(.hcs-head, .hcs-tabs, .hcs-chat) {
  opacity: 0;
  transform: translateY(28px);
}

.hcs-container.reveal .hcs-chat {
  transform: translateY(44px) scale(0.97);
}

.hcs-container.reveal :is(.hcs-head, .hcs-tabs, .hcs-chat).is-in {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.6s ease,
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 标题和标签条通常一起露出，标签条稍晚一点 */
.hcs-container.reveal .hcs-tabs.is-in {
  transition-delay: 90ms;
}

/* 矮屏 / 高缩放：左栏收起未选中项的描述，和变矮的聊天窗对齐 */
@media (min-width: 861px) and (max-height: 820px) {
  .hcs-head {
    margin-bottom: 16px;
  }

  .hcs-title {
    font-size: 24px;
  }

  .hcs-tab {
    padding: 12px 18px;
  }

  .hcs-tab:not(.active) .hcs-tab-desc {
    display: none;
  }

  .hcs-meta {
    margin-top: 14px;
    padding-top: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hcs *,
  .hcs *::before,
  .hcs *::after {
    animation: none !important;
    transition: none !important;
  }

  .hcs-scan {
    display: none;
  }
}
</style>
