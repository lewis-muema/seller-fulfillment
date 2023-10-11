import integrationsList from "../components/integrationsList.vue";
import index from "../components/index.vue";

// Platform Setup Components
import platformIndex from "@/modules/integrations/components/platform/index.vue";
import step1 from "@/modules/integrations/components/platform/setup/step1.vue";
import step2 from "@/modules/integrations/components/platform/setup/step2.vue";
import step3 from "@/modules/integrations/components/platform/setup/step3.vue";
import Step4 from "@/modules/integrations/components/platform/setup/step4/index.vue";
import ConnectionSuccess from "@/modules/integrations/components/platform/setup/step4/connectionSuccess.vue";
import ConnectionError from "@/modules/integrations/components/platform/setup/step4/connectionError.vue";
import step5 from "@/modules/integrations/components/platform/setup/step5.vue";
import step6 from "@/modules/integrations/components/platform/setup/step6/index.vue";
import resolveConflicts from "@/modules/integrations/components/platform/setup/step6/resolveConflicts.vue";
import step7 from "@/modules/integrations/components/platform/setup/step7.vue";

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
          component: step1,
          props: true,
        },
        {
          path: "setup/2",
          name: "SetupStep2",
          props: true,
          component: step2,
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
          component: step3,
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
          component: Step4,
          props: true,
          children: [
            {
              path: "success",
              name: "ConnectionSuccess",
              component: ConnectionSuccess,
              props: true,
            },
            {
              path: "error",
              name: "ConnectionError",
              component: ConnectionError,
              props: true,
            },
          ],
        },

        {
          path: "setup/5",
          name: "SetupStep5",
          component: step5,
          props: true,
        },
        {
          path: "setup/6",
          name: "SetupStep6",
          component: step6,
          props: true,
        },
        {
          path: "setup/6/resolve-conflicts",
          name: "ConflictResolution",
          component: resolveConflicts,
          props: true,
        },
        {
          path: "setup/7",
          name: "SetupStep7",
          component: step7,
          props: true,
        },
      ],
    },
  ],
};

export default routes;
