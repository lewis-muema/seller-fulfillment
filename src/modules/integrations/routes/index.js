import integrationsList from "../components/integrationsList.vue";

import thankYou from "../components/thankYou.vue";
import index from "../components/index.vue";

// Platform
import platformIndex from "../components/platform/index.vue";
import platformSetup from "../components/platformSetup.vue";
import storeDetails from "../components/storeDetails.vue";

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
      name: "platform",
      component: platformIndex,
      redirect: { name: "SetupStep1" },
      children: [
        {
          path: "setup",
          name: "Setup",
          redirect: { name: "SetupStep1" },
        },
        {
          path: "setup/1",
          name: "SetupStep1",
          component: platformSetup,
          props: true,
        },
        {
          path: "setup/2",
          name: "SetupStep2",
          component: storeDetails,
          beforeEnter: (to, from, next) => {
            if (Object.keys(to.params).includes("storePlatform")) {
              next();
            } else {
              next({ name: "SetupStep1" });
            }
          },
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
