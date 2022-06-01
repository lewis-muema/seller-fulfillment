<template>
  <div>
    <v-row>
      <v-col cols="8" class="mx-auto">
        <v-card variant="outlined" class="p-details">
          <div class="d-flex desktop-header-title mb-2">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="$router.back()"
            ></i>

            <v-card-title class="text-center">Product Details </v-card-title>
            <div class="dropdown actions-dropdown mt-2">
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
                <li class="view-product-dropdown-list">
                  <router-link
                    :to="{
                      name: 'EditProduct',
                      params: { pV: JSON.stringify(productVariants) },
                    }"
                    >Edit</router-link
                  >
                </li>
                <li class="view-product-dropdown-list">
                  <router-link to="/">Archive</router-link>
                </li>
              </ul>
            </div>
          </div>
          <product-details-tabs v-if="stockSelectedTab === 'Overview'">
            <product-overview
              :productVariants="productVariants"
              v-if="productVariants"
            />
          </product-details-tabs>
          <product-details-tabs v-if="stockSelectedTab === 'History'">
            <product-history
              :productVariants="productVariants"
              v-if="productVariants"
            />
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
  data() {
    return {
      productVariants: [],
      ttt: "",
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.viewProduct"));
    if (this.$route.params.pVariants) {
      this.productVariants = JSON.parse(this.$route.params.pVariants);
    }
  },
  computed: {
    ...mapGetters(["getStockSelectedTab"]),
    stockSelectedTab() {
      return this.getStockSelectedTab;
    },
  },
};
</script>

<style>
.p-details {
  padding: 20px 30px;
  border-color: #e2e7ed;
  margin-top: 50px !important;
  height: auto;
}
.view-product-dropdown-list a {
  color: #606266;
  text-decoration: none;
}
</style>
