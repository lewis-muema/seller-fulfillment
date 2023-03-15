const routes = [
  {
    path: "/settings/integrations",
    name: "Integrations",
    component: () => require("../components/index.vue"),
  },
  {
    path: "/settings/integrations/store-platform",
    name: "Platform",
    component: () => require("../components/storePlatform.vue"),
  },
  {
    path: "/settings/integrations/store-details",
    name: "Store Details",
    component: () => require("../components/storeDetails.vue"),
  },
  {
    path: "/settings/integrations/thank-you",
    name: "ThankYou",
    component: () => require("../components/thankYou.vue"),
    props: true,
  },
];

export default routes;
