import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/style.css";

// Setup Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHeart,
  faHome,
  faUser,
  faSun,
  faMoon,
  faSync,
  faChevronLeft,
  faChevronRight,
  faTachometerAlt,
  faTasks,
  faPlusCircle,
  faLock,
  faTag,
  faServer,
  faHeartbeat,
  faUnlock,
  faClock,
  faPlay,
  faCheck,
  faTimes,
  faPlus,
  faArrowLeft,
  faSave,
  faEye,
  faStop,
  faTrash,
  faChartLine,
  faCode,
  faSyncAlt,
  faPowerOff,
  faTrashAlt,
  faBroom,
  faUnlockAlt,
  faSearch,
  faFilter,
  faRedo,
  faCopy,
  faToggleOn,
  faToggleOff,
  faDice,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

// Add icons to the library
library.add(
  faHeart,
  faHome,
  faUser,
  faSun,
  faMoon,
  faSync,
  faChevronLeft,
  faChevronRight,
  faTachometerAlt,
  faTasks,
  faPlusCircle,
  faLock,
  faTag,
  faServer,
  faHeartbeat,
  faUnlock,
  faClock,
  faPlay,
  faCheck,
  faTimes,
  faPlus,
  faArrowLeft,
  faSave,
  faGithub,
  faEye,
  faStop,
  faTrash,
  faChartLine,
  faCode,
  faSyncAlt,
  faPowerOff,
  faTrashAlt,
  faBroom,
  faUnlockAlt,
  faSearch,
  faFilter,
  faRedo,
  faCopy,
  faToggleOn,
  faToggleOff,
  faDice
);

// Async function to handle mock setup and app initialization
async function initializeApp() {
  // Import mock setup in development - MUST be synchronous and before Vue app creation
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    console.warn("Mock mode is enabled. Using mock data.");
    // Use synchronous import to ensure mock is ready before app starts
    await import("./mocks/index.js");
  }

  // Create Vue app
  const app = createApp(App);

  // Register Font Awesome component globally
  app.component("font-awesome-icon", FontAwesomeIcon);

  // Use router
  app.use(router);

  // Mount the app
  app.mount("#app");
}

// Initialize the app
initializeApp();
