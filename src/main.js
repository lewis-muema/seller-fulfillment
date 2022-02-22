import { createApp } from "vue";
import vuetify from 'vuetify';
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(vuetify).use(router).mount("#app");
