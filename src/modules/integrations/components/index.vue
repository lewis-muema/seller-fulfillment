<template>
  <div>
    <router-view v-loading="loading" />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { provide, onMounted } from "vue";
import useIntegrations from "@/modules/integrations/composibles/useIntegrations";

export default {
  setup() {
    provide("getUserDetails", JSON.parse(localStorage.getItem("userDetails")));
    const { fetchIntegrations, loadingIntegrations: loading } =
      useIntegrations();

    onMounted(async () => {
      await fetchIntegrations();
    });

    return {
      loading,
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

<style lang="scss" scoped></style>
