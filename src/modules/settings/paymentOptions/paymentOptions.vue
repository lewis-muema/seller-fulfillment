<template>
  <div></div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  mounted() {
    this.setComponent(this.$t("common.paymentOptions"));
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
  },
};
</script>

<style></style>
