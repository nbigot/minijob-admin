import DefaultTheme from "vitepress/theme";
import "./custom.css";
import FeatureGrid from "./components/FeatureGrid.vue";
import CodeBlock from "./components/CodeBlock.vue";
import Screenshot from "./components/Screenshot.vue";
import StatsCounter from "./components/StatsCounter.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("FeatureGrid", FeatureGrid);
    app.component("CodeBlock", CodeBlock);
    app.component("Screenshot", Screenshot);
    app.component("StatsCounter", StatsCounter);
  },
};
