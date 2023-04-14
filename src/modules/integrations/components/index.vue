<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  mounted() {
    this.setComponent("common.integrations");
  },
  methods: {
    ...mapMutations(["setComponent"]),
  },
};
</script>

<style lang="scss" scoped></style>
