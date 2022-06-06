<template>
  <div>
    <Tabs parent="customer" />
    <Deliveries />
  </div>
</template>

<script>
import Tabs from "./components/tabs.vue";
import Deliveries from "./components/deliveries.vue";

export default {
  components: { Tabs, Deliveries },
  data: () => ({}),
  mounted() {
    this.$store.commit("setComponent", this.$t("common.deliveriesToCustomers"));
  },
};
</script>

<style></style>
