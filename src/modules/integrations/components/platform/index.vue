<template>
  <div>
    <headerComponent />
    <router-view />
  </div>
</template>

<script>
import headerComponent from "@/modules/integrations/components/platform/header.vue";
import { provide } from "vue";
export default {
  name: "platform",
  components: { headerComponent },
  setup() {
    function nextStep(params) {
      const currentRoute = this.$route;
      const splitRouteArray = currentRoute.fullPath.split("/");
      const currentStep = parseInt(splitRouteArray[splitRouteArray.length - 1]);
      let newStep = currentStep + 1;
      if (params) {
        this.$router.push({ name: `SetupStep${newStep}`, ...params });
      } else {
        this.$router.push({ name: `SetupStep${newStep}` });
      }
    }

    function lastStep(params) {
      const currentRoute = this.$route;
      const splitRouteArray = currentRoute.fullPath.split("/");
      const currentStep = parseInt(splitRouteArray[splitRouteArray.length - 1]);
      let newStep = currentStep - 1;
      if (params) {
        this.$router.push({ name: `SetupStep${newStep}`, ...params });
      } else {
        this.$router.push({ name: `SetupStep${newStep}` });
      }
    }

    function backToIntegrations() {
      // eslint-disable-next-line no-useless-catch
      try {
        this.$router.push({ name: "Integrations" });
      } catch (e) {
        throw e;
      }
    }

    provide("nextStep", nextStep);
    provide("lastStep", lastStep);
    provide("backToIntegrations", backToIntegrations);
  },
};
</script>

<style lang="scss">
@import "~@/modules/integrations/assets/styling.scss";
</style>
