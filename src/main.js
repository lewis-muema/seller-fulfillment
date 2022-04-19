import { createApp } from "vue";
import moment from "moment";
import * as VueGoogleMaps from "vue3-google-map";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSpinner,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faSpinner, faThumbsUp, faThumbsDown);

loadFonts();
createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use("font-awesome-icon", FontAwesomeIcon)
  .use(moment)
  .use(VueGoogleMaps, {
    load: {
      libraries: ["places", "geometry"],
      key: process.env.GOOGLE_API_KEY_TEST,
    },
  })
  .use(i18n)
  .mount("#app");
