<template>
  <div>
    <Tabs />
    <Deliveries />
  </div>
</template>

<script>
import Tabs from "./components/tabs.vue";
import Deliveries from "./components/deliveries.vue";
import { mapMutations } from "vuex";

export default {
  components: { Tabs, Deliveries },
  data: () => ({}),
  mounted() {
    this.setComponent(this.$t("common.deliveriesToSendy"));
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
  },
};
</script>

<style></style>
