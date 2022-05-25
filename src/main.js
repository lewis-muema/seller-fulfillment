import { createApp } from "vue";
import moment from "moment";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { library } from "@fortawesome/fontawesome-svg-core";
import { ApmVuePlugin } from "@elastic/apm-rum-vue";
import {
  faSpinner,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueTelInput from "vue3-tel-input";
import "vue3-tel-input/dist/vue3-tel-input.css";

const VueTelInputOptions = {
  mode: "international",
  onlyCountries: ["NG", "KE", "UG", "TZ", "CI"],
};

library.add(faSpinner, faThumbsUp, faThumbsDown);
loadFonts();
createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(ElementPlus)
  .use(VueTelInput, VueTelInputOptions)
  .use(ApmVuePlugin, {
    router,
    config: {
      serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
      // agent configuration
      serverUrl: process.env.ELASTIC_APM_SERVER_URL,
      serviceVersion: process.env.ELASTIC_APM_SERVICE_VERSION,
      environment: process.env.ELASTIC_APM_ENVIRONMENT,
      distributedTracingOrigins: [
        process.env.ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS,
      ],
    },
  })
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
