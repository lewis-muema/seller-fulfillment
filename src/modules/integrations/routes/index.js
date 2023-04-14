import integrationsList from "../components/integrationsList.vue";
import storePlatform from "../components/storePlatform.vue";
import storeDetails from "../components/storeDetails.vue";
import thankYou from "../components/thankYou.vue";
import index from "../components/index.vue";

const routes = {
  path: "/settings/integrations",
  name: "Integrations",
  component: index,
  redirect: "/settings/integrations/index",
  children: [
    {
      path: "index",
      name: "integrationsList",
      component: integrationsList,
    },
    {
      path: "store-platform",
      name: "Platform",
      component: storePlatform,
    },
    {
      path: "store-details",
      name: "Store Details",
      component: storeDetails,
    },
    {
      path: "thank-you",
      name: "ThankYou",
      component: thankYou,
      props: true,
    },
  ],
};

export default routes;
