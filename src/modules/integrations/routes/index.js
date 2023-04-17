import integrationsList from "../components/integrationsList.vue";
import storeDetails from "../components/storeDetails.vue";
import thankYou from "../components/thankYou.vue";
import index from "../components/index.vue";

// Platform
import platformIndex from "../components/platform/index.vue";
import platformSetup from "../components/platformSetup.vue";

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
      path: "platform",
      name: "platfom",
      component: platformIndex,
      children: [
        {
          path: "setup/1",
          name: "PlatformSetup",
          component: platformSetup,
        },
      ],
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
