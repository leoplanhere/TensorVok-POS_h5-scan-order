import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import "./assets/css/slicy.css";
import "./assets/css/style.css";
import "./assets/css/style2.css";
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'
import api from './common/index.js'
import i18n from './i18n'

import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
// 全局挂载api（可选）
app.config.globalProperties.$api = api
app.mount('#app')


// 1. 禁止多指缩放 (touchstart)
document.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

// 2. 禁止手势缩放 (gesturestart) - 专门针对 iOS Safari
document.addEventListener('gesturestart', function (event) {
  event.preventDefault();
});

// 3. 禁止双击缩放 (可选，主要靠 CSS)
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);