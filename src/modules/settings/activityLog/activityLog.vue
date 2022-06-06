<template>
  <div>
    <logs />
  </div>
</template>

<script>
import logs from "./components/logs.vue";

export default {
  components: { logs },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.activityLog"));
  },
};
</script>

<style></style>
