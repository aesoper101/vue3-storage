import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Storage from "vue3-storage";

createApp(App)
  .use(router)
  .use(Vue3Storage)
  .mount("#app");
