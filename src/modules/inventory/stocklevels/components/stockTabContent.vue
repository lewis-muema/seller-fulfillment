<template>
  <div>
    <tabs>
      <stock-level-list :products="products" />
    </tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tabs from "@/modules/inventory/components/tabs";
import stockLevelList from "@/modules/inventory/stocklevels/components/stockLevelList";
export default {
  components: { tabs, stockLevelList },
  computed: {
    ...mapGetters(["getInventorySelectedTab", "getProductLists"]),
    stockTabs() {
      return this.getInventorySelectedTab;
    },
    productLists() {
      return this.getProductLists.data.products;
    },
    products() {
      let result =
        this.getInventorySelectedTab === "Out of Stock"
          ? this.productLists
          : this.productLists;
      return result;
    },
  },
};
</script>

<style scoped></style>
