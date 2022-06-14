<template>
  <div class="product-overall-container">
    <tabs>
      <products-list />
    </tabs>
  </div>
</template>

<script>
import tabs from "@/modules/inventory/products/components/tabs.vue";
import productsList from "@/modules/inventory/products/components/productsList";
import { mapMutations } from "vuex";

export default {
  components: { tabs, productsList },
  mounted() {
    this.setComponent(this.$t("common.products"));
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
  },
};
</script>

<style>
.product-overall-container {
  margin: 0px 30px;
}
</style>
