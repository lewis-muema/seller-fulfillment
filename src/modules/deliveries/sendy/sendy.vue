<template>
  <div>
    <Tabs parent="sendy" />
    <Deliveries />
  </div>
</template>

<script>
import Tabs from "../customers/components/tabs.vue";
import Deliveries from "../customers/components/deliveries.vue";

export default {
  components: { Tabs, Deliveries },
  data: () => ({}),
  mounted() {
    this.$store.commit("setComponent", this.$t("common.deliveriesToSendy"));
  },
};
</script>

<style></style>
