<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import GuideLanguageSelect from './GuideLanguageSelect.vue'
import BindBookmarkPreview from './BindBookmarkPreview.vue'
import UploaderProgressPreview from './UploaderProgressPreview.vue'
import TutorialIcon from './TutorialIcon.vue'
import { guideCopy, type GuideLocale } from './cn-net-ios-copy'
import { bookmarkletCopy, bookmarkletUi, type BookmarkletPlatform } from './bookmarklet-guide-copy'

const props = defineProps<{ platform: BookmarkletPlatform }>()
const { lang } = useData()
const locale = computed<GuideLocale>(() => lang.value.startsWith('en') ? 'en' : lang.value.startsWith('ja') ? 'ja' : /TW|Hant|HK/i.test(lang.value) ? 'zh-TW' : 'zh')
const screenLanguage = ref<GuideLocale | ''>('')
const uiLocale = computed(() => screenLanguage.value || locale.value)
const ui = computed(() => bookmarkletUi[uiLocale.value])
const copy = computed(() => bookmarkletCopy[locale.value])
const steps = computed(() => copy.value[props.platform])
const scene = ref(0)
const codeExample = computed(() => `javascript:〈${ui.value.codePlaceholder}〉`)
const tag = computed(() => ({ desktop: 'Chrome · Windows / macOS', ios: 'Safari · iPhone', android: 'Chrome · Android' })[props.platform])
</script>

<template>
  <figure class="bookmarklet-guide" :data-platform="platform">
    <div class="guide-toolbar">
      <span class="guide-tag">{{ tag }}</span>
      <GuideLanguageSelect v-model="screenLanguage" :label="copy.language" :follow="guideCopy[locale].follow" />
    </div>
    <div class="guide-stages" :aria-label="tag">
      <button v-for="(step, index) in steps" :key="index" type="button" :aria-pressed="scene === index" @click="scene = index">
        <span class="stage-number">{{ index + 1 }}</span><span>{{ step.title }}</span>
      </button>
    </div>
    <div class="guide-body" :class="{ 'mobile-body': platform !== 'desktop' }">
      <div class="browser-illustration" :class="[platform, { phone: platform !== 'desktop' }]" :lang="uiLocale" role="img" :aria-label="steps[scene].description">
        <div class="screen" aria-hidden="true">
          <div v-if="platform !== 'desktop'" class="phone-status"><span>9:41</span><span>▰ ▰ ▰</span></div>

          <template v-if="platform === 'desktop'">
            <div class="desktop-tabs"><span>● ● ●</span><span>{{ scene === 3 ? 'maimai NET' : 'McMai' }}</span><span>＋</span></div>
            <div class="browser-address"><span>‹　›　↻</span><span class="address-text">{{ scene === 3 ? 'maimaidx.jp/maimai-mobile/' : 'id.moev.cc' }}</span><TutorialIcon name="menu" /></div>
            <div v-if="scene !== 0" class="bookmarks-bar" :class="{ target: scene === 1 || scene === 3 }">
              <span v-if="scene === 1" class="drop-target">{{ ui.dropHere }}</span>
              <span v-else class="bookmark-chip"><TutorialIcon name="star" />{{ ui.bookmarkTitle }}</span>
              <b v-if="scene === 1 || scene === 3" class="pin">{{ scene === 1 ? 2 : 1 }}</b>
            </div>
            <div class="desktop-page" :class="{ 'binding-page': scene === 1 }">
              <template v-if="scene === 0">
                <p class="page-label">McMai</p><div class="ghost-lines"><span></span><span></span></div>
                <div class="browser-menu"><div>{{ ui.bookmarksLists }}</div><div class="menu-divider"></div><div class="target menu-row"><span>{{ ui.showBar }}</span><b class="pin">1</b></div></div>
              </template>
              <template v-else-if="scene === 1">
                <BindBookmarkPreview :locale="uiLocale" />
              </template>
              <template v-else-if="scene === 2">
                <div class="bookmark-editor"><strong>{{ ui.editBookmark }}</strong><div class="editor-field"><span>{{ ui.name }}</span><div class="field-value target"><span>McMai</span><b class="pin">1</b></div></div><div class="editor-field"><span>{{ ui.url }}</span><div class="field-value code-value target"><span>{{ codeExample }}</span><b class="pin">2</b></div></div><div class="editor-footer"><span>{{ ui.cancel }}</span><span class="fake-primary">{{ ui.save }}<b class="pin">3</b></span></div></div>
              </template>
              <template v-else><div class="net-placeholder"><strong>maimai NET</strong><span>PLAYER</span><div class="ghost-lines"><span></span><span></span></div></div><UploaderProgressPreview :locale="uiLocale" phase="uploading" /></template>
            </div>
          </template>

          <template v-else-if="platform === 'ios'">
            <template v-if="scene === 0">
              <div class="mobile-page"><strong>maimai NET</strong><div class="ghost-lines"><span></span><span></span></div></div>
              <div class="safari-toolbar"><span>‹</span><span>›</span><span class="toolbar-target target"><TutorialIcon name="book" /><b class="pin">1</b></span><span>▢</span></div>
              <div class="ios-sheet"><div class="menu-row target"><span>{{ ui.addBookmark }}</span><b class="pin">2</b></div><div class="menu-row">{{ ui.readingList }}</div></div>
            </template>
            <template v-else-if="scene === 1">
              <div class="mobile-heading"><span>‹</span><strong>{{ ui.bookmarks }}</strong><span>{{ ui.done }}</span></div>
              <p class="section-label">{{ ui.favorites }}</p><div class="bookmark-list-row target"><TutorialIcon name="book" /><span>maimai NET</span><b class="pin">1</b></div>
              <div class="ios-context"><div class="menu-row target"><span>{{ ui.edit }}</span><b class="pin">2</b></div><div class="menu-row">{{ ui.copy }}</div></div>
            </template>
            <template v-else-if="scene === 2">
              <div class="mobile-heading"><span>{{ ui.cancel }}</span><strong>{{ ui.editBookmark }}</strong><span class="save-target">{{ ui.save }}<b class="pin">3</b></span></div>
              <div class="mobile-editor"><div class="editor-field"><span>{{ ui.name }}</span><div class="field-value target"><span>McMai</span><b class="pin">1</b></div></div><div class="editor-field"><span>{{ ui.url }}</span><div class="field-value code-value target"><span>{{ codeExample }}</span><b class="pin">2</b></div></div><p class="section-label">{{ ui.location }}</p><div class="field-value">{{ ui.favorites }}　›</div></div>
            </template>
            <template v-else>
              <div class="mobile-address">maimaidx.jp</div><div class="mobile-page short"><strong>maimai NET</strong></div>
              <div class="ios-sheet running"><strong>{{ ui.bookmarks }}</strong><div class="bookmark-list-row target"><TutorialIcon name="book" /><span>McMai</span><b class="pin">2</b></div></div>
              <div class="safari-toolbar"><span>‹</span><span>›</span><span class="toolbar-target target"><TutorialIcon name="book" /><b class="pin">1</b></span><span>▢</span></div>
            </template>
          </template>

          <template v-else>
            <template v-if="scene === 0">
              <div class="android-address"><span class="address-text">maimaidx.jp</span><span class="toolbar-target"><TutorialIcon name="menu" /><b class="pin">1</b></span></div>
              <div class="mobile-page"><strong>maimai NET</strong><div class="ghost-lines"><span></span><span></span></div></div>
              <div class="android-menu"><div class="menu-row target"><TutorialIcon name="star" /><span>{{ ui.addBookmark }}</span><b class="pin">2</b></div><div class="menu-row"><TutorialIcon name="star" /><span>{{ ui.bookmarks }}</span></div></div>
            </template>
            <template v-else-if="scene === 1">
              <div class="mobile-heading"><span>‹</span><strong>{{ ui.bookmarks }}</strong><TutorialIcon name="search" /></div><p class="section-label">{{ ui.mobileBookmarks }}</p>
              <div class="bookmark-list-row"><TutorialIcon name="star" /><span>maimai NET</span><span class="toolbar-target target"><TutorialIcon name="menu" /><b class="pin">1</b></span></div>
              <div class="android-menu edit-menu"><div class="menu-row target"><span>{{ ui.edit }}</span><b class="pin">2</b></div></div>
            </template>
            <template v-else-if="scene === 2">
              <div class="mobile-heading"><span class="save-target">‹<b class="pin">3</b></span><strong>{{ ui.editBookmark }}</strong></div>
              <div class="mobile-editor"><div class="editor-field"><span>{{ ui.name }}</span><div class="field-value target"><span>McMai</span><b class="pin">1</b></div></div><div class="editor-field"><span>{{ ui.url }}</span><div class="field-value code-value target"><span>{{ codeExample }}</span><b class="pin">2</b></div></div><p class="section-label">{{ ui.folder }}</p><div class="field-value">{{ ui.mobileBookmarks }}</div></div>
            </template>
            <template v-else>
              <div class="android-address target"><TutorialIcon name="search" /><span class="address-text">McMai</span><b class="pin">1</b></div>
              <div class="suggestion target"><TutorialIcon name="star" /><div><strong>McMai</strong><small>javascript:…</small></div><b class="pin">2</b></div>
              <div class="suggestion"><TutorialIcon name="search" /><span>McMai</span></div>
              <div class="mobile-page short"><strong>maimai NET</strong></div>
            </template>
          </template>
          <div v-if="platform !== 'desktop'" class="phone-home"></div>
        </div>
      </div>
      <div class="guide-explanation" aria-live="polite" aria-atomic="true"><span class="guide-progress">{{ scene + 1 }} / {{ steps.length }}</span><h4>{{ steps[scene].title }}</h4><p>{{ steps[scene].description }}</p><ol class="guide-callouts"><li v-for="(note,index) in steps[scene].notes" :key="`${scene}-${index}`"><b class="pin">{{ index + 1 }}</b><span>{{ note }}</span></li></ol></div>
    </div>
    <figcaption>{{ copy.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.bookmarklet-guide { margin:24px 0;border:1px solid var(--vp-c-divider);border-radius:20px;overflow:hidden;background:var(--vp-c-bg-soft); }
.guide-toolbar { display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px; }.guide-tag{font-size:12px;font-weight:700;color:var(--vp-c-text-2)}
.guide-stages{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-block:1px solid var(--vp-c-divider)}.guide-stages button{display:flex;align-items:center;gap:7px;padding:14px 10px;text-align:start;font-size:12px;line-height:1.5;color:var(--vp-c-text-2);cursor:pointer;overflow-wrap:anywhere}.guide-stages button+button{border-left:1px solid var(--vp-c-divider)}.guide-stages button[aria-pressed="true"]{background:var(--vp-c-bg);color:var(--vp-c-brand-1);font-weight:650;box-shadow:inset 0 -3px var(--vp-c-brand-1)}.guide-stages button:focus-visible{outline:3px solid var(--vp-c-brand-1);outline-offset:-3px}.stage-number{display:grid;flex:0 0 22px;place-items:center;width:22px;height:22px;border:1px solid currentColor;border-radius:50%;font-size:11px}
.guide-body{padding:24px 20px}.mobile-body{display:grid;grid-template-columns:minmax(0,290px) minmax(0,1fr);gap:26px;align-items:center}.browser-illustration{min-width:0;border:1px solid #cdd2dd;border-radius:12px;overflow:hidden;background:#f7f8fb;color:#232631;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 8px 22px #0000000b}.screen{position:relative;min-height:340px}.pin{display:inline-grid;flex:0 0 21px;place-items:center;width:21px;height:21px;border-radius:50%;background:#1765ce;color:white;font:700 11px/1 sans-serif}.target{background:#eaf2ff;box-shadow:inset 0 0 0 1.5px #4385d5;border-radius:7px}
.desktop-tabs{display:flex;align-items:center;gap:14px;padding:10px 12px;background:#e5e9f2;font-size:10px}.desktop-tabs>span:nth-child(2){flex:1}.browser-address{display:flex;align-items:center;gap:10px;padding:9px 12px;background:#edf0f6;font-size:10px;line-height:1.6}.address-text{min-width:0;flex:1;padding:5px 9px;border-radius:20px;background:white;overflow-wrap:anywhere}.browser-address>span:first-child{white-space:nowrap}.bookmarks-bar{display:flex;align-items:center;gap:8px;justify-content:space-between;min-height:40px;padding:7px 12px;font-size:11px}.bookmark-chip{display:inline-flex;align-items:center;gap:6px;min-width:0}.bookmark-chip .tutorial-icon{width:14px;height:14px}.drop-target{padding:3px 9px;border:1px dashed #4385d5;border-radius:4px;color:#50657c}.desktop-page{position:relative;min-height:250px;padding:20px}.page-label{margin:0 0 20px;font-size:16px;font-weight:600}.browser-menu{margin-left:auto;width:240px;max-width:100%;padding:9px;background:white;border:1px solid #dce0e8;border-radius:9px;box-shadow:0 8px 20px #0001;font-size:11px}.menu-divider{height:1px;margin:10px 0;background:#e5e8ee}.menu-row{display:flex;align-items:center;gap:8px;justify-content:space-between;min-height:40px;padding:9px;font-size:11px;line-height:1.6;overflow-wrap:anywhere}.menu-row>span{flex:1;min-width:0}.bookmark-editor{max-width:380px;margin:auto;padding:16px;border:1px solid #dce0e8;border-radius:10px;background:white;font-size:12px}.editor-field{display:grid;gap:7px;margin-top:18px;font-size:11px;line-height:1.6}.editor-field>span{color:#677384}.field-value{display:flex;align-items:center;gap:7px;justify-content:space-between;min-width:0;padding:10px;background:#fff;border:1px solid #dde1e9;border-radius:7px;font-size:11px;line-height:1.7}.field-value>span{min-width:0;overflow-wrap:anywhere}.code-value{font-family:var(--vp-font-family-mono);font-size:10px}.editor-footer{display:flex;align-items:center;justify-content:flex-end;gap:18px;margin-top:22px;font-size:11px}.fake-primary{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:6px;background:#1765ce;color:white}.fake-primary .pin{background:white;color:#1765ce}.net-placeholder{display:grid;gap:12px;padding:10px;color:#566978}.net-placeholder>strong{font-size:20px}.net-placeholder>span{font-size:11px}
.phone{position:relative;width:290px;max-width:100%;border:5px solid #30343c;border-radius:30px;background:#f3f4f8}.phone .screen{min-height:430px;padding:10px 10px 28px}.phone-status{display:flex;justify-content:space-between;padding:0 6px 12px;font-size:10px;font-weight:700}.phone-home{position:absolute;bottom:7px;left:33%;width:34%;height:4px;border-radius:8px;background:#30343c}.mobile-page{min-height:200px;padding:30px 8px;font-size:21px;color:#526477}.mobile-page.short{min-height:100px;padding-top:20px}.safari-toolbar{display:flex;align-items:center;justify-content:space-around;gap:8px;margin-top:16px;padding:10px 0;color:#1765ce;font-size:23px}.toolbar-target{display:inline-flex;align-items:center;gap:5px;padding:5px}.ios-sheet{position:relative;margin:8px 0;padding:9px;border:1px solid #dee2eb;border-radius:12px;background:#fff;box-shadow:0 4px 12px #0001}.ios-sheet.running{margin-top:12px}.ios-sheet>strong{display:block;padding:8px;font-size:13px}.mobile-heading{display:flex;align-items:center;gap:6px;min-height:60px;color:#1765ce;font-size:11px;line-height:1.5}.mobile-heading>strong{flex:1;min-width:0;text-align:center;overflow-wrap:anywhere;color:#232631;font-size:12px}.mobile-heading>span{flex-shrink:0}.save-target{display:inline-flex;align-items:center;gap:3px}.section-label{margin:18px 8px 9px;color:#687385;font-size:10px;line-height:1.6}.bookmark-list-row{display:flex;align-items:center;gap:8px;min-height:45px;padding:10px;background:white;font-size:12px;line-height:1.6}.bookmark-list-row>span:not(.toolbar-target){min-width:0;flex:1;overflow-wrap:anywhere}.ios-context{width:80%;margin:15px 0 0 auto;padding:7px;border-radius:10px;background:white;box-shadow:0 7px 20px #0001}.mobile-editor{padding:0 2px}.mobile-address{margin:5px 0;padding:9px;border-radius:12px;background:white;text-align:center;font-size:11px}.android-address{display:flex;align-items:center;gap:7px;min-height:45px;font-size:12px}.android-menu{position:relative;margin-top:-150px;margin-left:auto;width:95%;padding:7px;border:1px solid #dce0e8;border-radius:10px;background:white;box-shadow:0 7px 20px #0001}.android-menu.edit-menu{margin-top:14px;width:75%}.suggestion{display:flex;align-items:center;gap:8px;margin:10px 0;padding:10px;font-size:12px;line-height:1.5}.suggestion>div{min-width:0;flex:1}.suggestion strong{display:block;font-size:12px}.suggestion small{display:block;color:#6b7483;font-size:9px;overflow-wrap:anywhere}.ghost-lines{display:grid;gap:14px;padding:22px 6px}.ghost-lines span{width:75%;height:8px;border-radius:9px;background:#e0e3eb}.ghost-lines span+span{width:48%}
.guide-explanation{min-width:0;margin-top:24px}.mobile-body .guide-explanation{margin-top:0}.guide-progress{font-size:12px;font-weight:700;color:var(--vp-c-brand-1)}.guide-explanation h4{margin:8px 0 12px;font-size:19px;line-height:1.5}.guide-explanation p{margin:0 0 16px;font-size:14px;line-height:1.8}.guide-callouts{display:grid;gap:14px;list-style:none;padding:0;margin:18px 0}.guide-callouts li{display:flex;align-items:flex-start;gap:10px;margin:0;font-size:14px;line-height:1.7}.guide-callouts .pin{margin-top:2px}figcaption{padding:13px 20px;border-top:1px solid var(--vp-c-divider);color:var(--vp-c-text-2);font-size:12px;line-height:1.7}
.desktop-page.binding-page { padding: 0; }
.ios .screen { min-height: 460px; }
.safari-toolbar { position: absolute; left: 10px; right: 10px; bottom: 20px; margin: 0; }
.ios-sheet, .ios-sheet.running { position: absolute; left: 10px; right: 10px; bottom: 82px; margin: 0; }
@media(max-width:640px){.mobile-body{grid-template-columns:minmax(0,1fr);gap:24px}.phone{justify-self:center}.guide-body{padding:24px 18px}.guide-stages button{flex-direction:column;align-items:flex-start;padding:12px 8px}.guide-toolbar{padding-inline:16px}.browser-address{padding-inline:8px;gap:6px}.desktop-page{padding:14px}.bookmark-editor{padding:12px}}
@media(max-width:400px){.guide-stages{grid-template-columns:repeat(2,minmax(0,1fr))}.guide-stages button:nth-child(3){border-left:0}.guide-stages button:nth-child(n+3){border-top:1px solid var(--vp-c-divider)}.guide-stages button{flex-direction:row}.browser-address>span:first-child{display:none}}
</style>
