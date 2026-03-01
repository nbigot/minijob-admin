import DefaultTheme from "vitepress/theme";
import "./custom.css";
import FeatureGrid from "./components/FeatureGrid.vue";
import CodeBlock from "./components/CodeBlock.vue";
import DocScreenshot from "./components/DocScreenshot.vue";
import StatsCounter from "./components/StatsCounter.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("FeatureGrid", FeatureGrid);
    app.component("CodeBlock", CodeBlock);
    app.component("DocScreenshot", DocScreenshot);
    app.component("StatsCounter", StatsCounter);
  },
};
