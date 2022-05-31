<template>
  <div>
    <v-row>
      <v-col cols="8" class="mx-auto">
        <v-card variant="outlined" class="stock-details">
          <div class="d-flex desktop-header-title mb-2">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="$router.back()"
            ></i>

            <v-card-title class="text-center">Product Details </v-card-title>
            <div class="dropdown actions-dropdown">
              <button
                class="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Actions
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item" href="#">Edit</a></li>
                <li><a class="dropdown-item" href="#">Archive</a></li>
              </ul>
            </div>
          </div>
          <product-details-tabs v-if="stockSelectedTab === 'Overview'">
            <product-overview />
          </product-details-tabs>
          <product-details-tabs v-if="stockSelectedTab === 'History'">
            <product-history />
          </product-details-tabs>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import productDetailsTabs from "@/modules/inventory/products/viewProduct/components/productDetailsTabs";
import productOverview from "@/modules/inventory/products/viewProduct/components/productOverview";
import productHistory from "@/modules/inventory/products/viewProduct/components/productHistory";
import { mapGetters } from "vuex";
export default {
  components: { productDetailsTabs, productOverview, productHistory },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.viewProduct"));
  },
  computed: {
    ...mapGetters(["getStockSelectedTab"]),
    stockSelectedTab() {
      return this.getStockSelectedTab;
    },
  },
};
</script>

<style scoped>
.stock-details {
  padding: 20px 30px 30px 30px;
  border-color: #e2e7ed;
  margin-top: 50px !important;
  height: auto;
}
</style>
