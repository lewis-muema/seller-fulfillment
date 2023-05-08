import integrationsList from "../components/integrationsList.vue";

import thankYou from "@/modules/integrations/components/platform/setup/thankYou.vue";
import index from "../components/index.vue";

// Platform Setup Components
import platformIndex from "@/modules/integrations/components/platform/index.vue";
import stepOne from "@/modules/integrations/components/platform/setup/stepOne.vue";
import stepTwo from "@/modules/integrations/components/platform/setup/stepTwo.vue";
import stepThree from "@/modules/integrations/components/platform/setup/stepThree.vue";
import stepFour from "@/modules/integrations/components/platform/setup/stepFour.vue";
import stepFive from "@/modules/integrations/components/platform/setup/stepFive/index.vue";
import resolveConflicts from "@/modules/integrations/components/platform/setup/stepFive/resolveConflicts.vue";

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
          component: stepOne,
          props: true,
        },
        {
          path: "setup/2",
          name: "SetupStep2",
          props: true,
          component: stepTwo,
          beforeEnter: (to, from, next) => {
            if (Object.keys(to.params).includes("storePlatform")) {
              next();
            } else {
              next({ name: "SetupStep1" });
            }
          },
        },
        {
          path: "setup/3",
          name: "SetupStep3",
          component: stepThree,
          props: true,
          beforeEnter: (to, from, next) => {
            if (
              Object.keys(to.params).includes("storeName") &&
              Object.keys(to.params).includes("storeUrl") &&
              Object.keys(to.params).includes("storePlatform")
            ) {
              next();
            } else {
              next({ name: "SetupStep2" });
            }
          },
        },
        {
          path: "setup/4",
          name: "SetupStep4",
          component: stepFour,
          props: true,
        },
        {
          path: "setup/5",
          name: "SetupStep5",
          component: stepFive,
          props: true,
        },
        {
          path: "setup/5/resolve-conflicts",
          name: "ConflictResolution",
          component: resolveConflicts,
          props: true,
        },
        {
          path: "thank-you",
          name: "ThankYou",
          component: thankYou,
          props: true,
        },
      ],
    },
  ],
};

export default routes;
