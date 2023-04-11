import integrations from "../components/index.vue";
import storePlatform from "../components/storePlatform.vue";
import storeDetails from "../components/storeDetails.vue";
import thankYou from "../components/thankYou.vue";

const routes = [
  {
    path: "/settings/integrations",
    name: "Integrations",
    component: integrations,
  },
  {
    path: "/settings/integrations/store-platform",
    name: "Platform",
    component: storePlatform,
  },
  {
    path: "/settings/integrations/store-details",
    name: "Store Details",
    component: storeDetails,
  },
  {
    path: "/settings/integrations/thank-you",
    name: "ThankYou",
    component: thankYou,
    props: true,
  },
];

export default routes;
