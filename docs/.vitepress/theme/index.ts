import { h } from 'vue'
import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import "./custom.css";
import Confetti from "./components/Confetti.vue";
import HeroTypewriter from "./components/HeroTypewriter.vue";
import UpdateLog from "./components/UpdateLog.vue";
import HomeColumns from "./components/HomeColumns.vue";
import HomeChatShowcase from "./components/HomeChatShowcase.vue";
import ShowcaseFigure from "./components/ShowcaseFigure.vue";
import LanguageSuggestion from "./components/LanguageSuggestion.vue";
import AskChatGPT from "./components/AskChatGPT.vue";

export default {
  extends: Teek,
  Layout: () => {
    return h(Teek.Layout, null, {
      'home-hero-info': () => h(HeroTypewriter),
      'home-features-before': () => h(HomeChatShowcase),
      'home-features-after': () => h(Confetti),
      'teek-right-bottom-before': () => h(AskChatGPT),
      'layout-bottom': () => h(LanguageSuggestion),
    });
  },
  enhanceApp({ app }) {
    app.component("UpdateLog", UpdateLog);
    app.component("HomeColumns", HomeColumns);
    app.component("ShowcaseFigure", ShowcaseFigure);
  },
};
