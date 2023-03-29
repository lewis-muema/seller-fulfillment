<template>
  <div>
    <integrations :key="componentKey" />
  </div>
</template>

<script>
import integrations from "./integrations.vue";
import { mapMutations } from "vuex";
import { provide } from "vue";

export default {
  components: { integrations },
  data() {
    return {
      componentKey: 1,
    };
  },
  mounted() {
    this.setComponent("common.integrations");
    provide(
      "refreshIntegrationsComponent",
      this.refreshIntegrationsComponent()
    );
  },
  methods: {
    ...mapMutations(["setComponent"]),
    refreshIntegrationsComponent() {
      this.componentKey += 1;
    },
  },
};
</script>

<style>
.v-dialog--fullscreen .v-overlay__content {
  overflow-y: scroll !important;
}
</style>
