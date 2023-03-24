<template>
  <div>
    <integrations />
  </div>
</template>

<script>
import integrations from "./integrations.vue";
import { mapMutations } from "vuex";

export default {
  components: { integrations },
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

<style></style>
