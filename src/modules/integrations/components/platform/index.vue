<template>
  <div>
    <headerComponent />
    <router-view />
  </div>
</template>

<script>
import headerComponent from "@/modules/integrations/components/platform/header.vue";

export default {
  name: "platform",
  components: { headerComponent },
};
</script>

<style lang="scss">
@import "~@/modules/integrations/assets/styling.scss";
</style>
