import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Setup Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
  faHeartbeat
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

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
  faGithub
)

// Create Vue app
const app = createApp(App)

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

// Use router
app.use(router)

// Mount the app
app.mount('#app')