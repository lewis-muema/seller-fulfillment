<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit("setComponent", this.$t("sendInventory"));
  },
};
</script>

<style></style>
