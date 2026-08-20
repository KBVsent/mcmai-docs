import { h } from 'vue'
import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import "./custom.css";
import Confetti from "./components/Confetti.vue";
import HeroTypewriter from "./components/HeroTypewriter.vue";

export default {
  extends: Teek,
  Layout: () => {
    return h(Teek.Layout, null, {
      'home-hero-info': () => h(HeroTypewriter),
      'home-features-after': () => h(Confetti),
    });
  },
};
