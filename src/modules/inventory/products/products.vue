<template>
  <div class="container">
    <tabs>
      <products-list />
    </tabs>
  </div>
</template>

<script>
import tabs from "@/modules/inventory/components/tabs.vue";
import productsList from "@/modules/inventory/products/components/productsList";
export default {
  components: { tabs, productsList },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.products"));
  },
};
</script>

<style></style>
