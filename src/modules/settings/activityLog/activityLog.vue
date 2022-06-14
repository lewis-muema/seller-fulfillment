<template>
  <div>
    <logs />
  </div>
</template>

<script>
import logs from "./components/logs.vue";
import { mapMutations } from "vuex";

export default {
  components: { logs },
  mounted() {
    this.setComponent(this.$t("common.activityLog"));
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
  },
};
</script>

<style></style>
