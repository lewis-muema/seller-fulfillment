import { createApp } from "vue";
import moment from "moment";
import VueGoogleMaps from "@fawmi/vue-google-maps";
// import { initializeApp } from "firebase/app";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { library } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
// import { ApmVuePlugin } from "@elastic/apm-rum-vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import {
  faSpinner,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "element-plus/dist/index.css";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";
import payments from "@sendyit/pay";
import { datadogRum } from "@datadog/browser-rum";

const VueTelInputOptions = {
  mode: "international",
  onlyCountries: ["NG", "KE", "UG", "TZ", "CI"],
};
datadogRum.init({
  applicationId: "ceb04c37-f2df-4331-9987-e21c38687804",
  clientToken: "pubefae2294472632446090d0b17cdabc28",
  site: "datadoghq.eu",
  service: "seller-fulfillment-webapp",
  env: process.env.DOCKER_ENV,
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  // sampleRate: 100,
  // premiumSampleRate: 100,
  trackInteractions: true,
  defaultPrivacyLevel: "mask-user-input",
  // allowedTracingOrigins: [/https:\/\/.*\.sendyit\.com/],
});
datadogRum.startSessionReplayRecording();
if (localStorage.userDetails && localStorage.user) {
  datadogRum.setUser({
    id: JSON.parse(localStorage.userDetails).business_id,
    name: JSON.parse(localStorage.userDetails).business_name,
    email: JSON.parse(localStorage.userDetails).email,
    userId: JSON.parse(localStorage.user).user_id,
    userName: JSON.parse(localStorage.user).first_name,
  });
}

library.add(faSpinner, faThumbsUp, faThumbsDown);
loadFonts();
if (window.Cypress) {
  // Add `store` to the window object only when testing with Cypress
  window.store = store;
}
createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(ElementPlus)
  .use(VueTelInput, VueTelInputOptions)
  // .use(ApmVuePlugin, {
  //   router,
  //   config: {
  //     serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
  //     // agent configuration
  //     serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  //     serviceVersion: process.env.ELASTIC_APM_SERVICE_VERSION,
  //     environment: process.env.ELASTIC_APM_ENVIRONMENT,
  //     distributedTracingOrigins: [
  //       process.env.ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS,
  //     ],
  //   },
  // })
  .use("font-awesome-icon", FontAwesomeIcon)
  .use(moment)
  .use(VueGoogleMaps, {
    load: {
      libraries: ["places"],
      key: process.env.GOOGLE_API_KEY_TEST,
    },
  })
  .use(i18n)
  .use(payments, {
    store,
    router,
    config: {
      BASE_URL: process.env.VUE_APP_BASE_URL,
      VGS_VAULT_ID: process.env.VUE_APP_VGS_VAULT_ID,
      VGS_ENVIRONMENT: process.env.VUE_APP_VGS_ENVIRONMENT,
    },
  })
  .mount("#app");
