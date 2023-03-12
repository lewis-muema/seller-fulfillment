// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify({
  components,
  directives,
  icons: {
    iconfont: "mdi",
    values: {
      custom: {
        // name of our custom icon
        component: require("@/assets/logos/shopify.svg"), // our custom component
      },
    },
  },
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
