<template>
  <div>
    <v-card class="desktop-product-details" variant="outlined">
      <div class="products-search">
        <searchAlgolia type="product" />
      </div>
      <v-table class="" v-if="filteredProducts.length > 0">
        <table-header :header="tableHeaders" />
        <tbody>
          <tr v-for="(product, index) in filteredProducts" :key="index">
            <td>
              <v-list-item lines="two">
                <v-list-item-avatar class="product-image-container">
                  <img
                    :src="
                      product.product_variants[0].product_variant_image_link
                    "
                    v-if="!getLoader"
                    alt="img"
                    class="product-img"
                  />
                </v-list-item-avatar>
                <v-list-item-header>
                  <v-list-item-title>
                    <span :class="getLoader">
                      {{ product.product_name }}
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span :class="getLoader">
                      {{
                        product.product_variants
                          ? `${product.product_variants.length} ${$t(
                              "inventory.producTOptions"
                            )}`
                          : ""
                      }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-header>
              </v-list-item>
            </td>
            <td>
              <span :class="badgeAllocation(availableleTally(product))">
                <span :class="getLoader">
                  {{ availableleTally(product) }}
                </span>
              </span>
            </td>
            <td>
              <span :class="badgeAllocation(committedTally(product))">
                <span :class="getLoader">
                  {{ committedTally(product) }}
                </span>
              </span>
            </td>
            <td>
              <span :class="badgeAllocation(incomingTally(product))">
                <span :class="getLoader">
                  {{ incomingTally(product) }}
                </span>
              </span>
            </td>
            <td>
              <router-link
                :to="`/inventory/view-product/${product.product_id}`"
                class="view-product-link"
                >{{ $t("inventory.view") }}</router-link
              >
            </td>
          </tr>
        </tbody>
      </v-table>
      <div class="deliveries-empty" v-else>
        <div>
          <img
            src="https://images.sendyit.com/fulfilment/seller/track.png"
            alt=""
            class="deliveries-empty-img"
          />
        </div>
        <p class="deliveries-empty-title">
          {{ $t("inventory.noInventoryToTrackYet") }}
        </p>
        <v-btn
          class="deliveries-btn"
          @click="
            $router.push('/inventory/send-inventory/sendy/select-products')
          "
          size="default"
        >
          {{ $t("inventory.sendInventoryToSendy") }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
import { mapMutations, mapGetters, mapActions } from "vuex";
import searchAlgolia from "../../../common/searchAlgolia.vue";

export default {
  components: { searchAlgolia, tableHeader },
  data() {
    return {
      placeholder: [],
      headers: [
        {
          title: this.$t("inventory.product"),
          description: "",
        },
        {
          title: this.$t("inventory.available"),
          description: this.$t("inventory.availableProducts"),
        },
        {
          title: this.$t("inventory.committed"),
          description: this.$t("inventory.CommittedProducts"),
        },
        {
          title: this.$t("inventory.incoming"),
          description: this.$t("inventory.IncomingProducts"),
        },
        {
          title: this.$t("inventory.actions"),
          description: "",
        },
      ],
      params: "",
    };
  },
  watch: {
    searchParam(val) {
      this.initiateAlgolia(val);
    },
  },
  mounted() {
    this.setComponent(this.$t("common.stocks"));
    this.placeholder = this.getProductLists;
    this.getStockStats();
    this.fetchProducts();
    this.getStockSettings();
  },
  beforeUnmount() {
    this.setProductLists(this.placeholder);
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getProductLists",
      "getInventorySelectedTab",
      "getStorageUserDetails",
      "getSettings",
    ]),
    tableHeaders() {
      return this.headers;
    },
    filteredProducts() {
      if (this.getInventorySelectedTab === this.$t("inventory.outOfStock")) {
        return this.NoStockProducts;
      }
      if (this.getInventorySelectedTab === this.$t("inventory.lowStock")) {
        return this.lowStockProducts;
      }
      return this.getProductLists;
    },
    lowStockProducts() {
      const products = [];
      this.getProductLists.forEach((row) => {
        if (
          row.product_variants[0].product_variant_stock_levels
            .quantity_in_inventory <=
            this.getSettings.global_low_stock_threshhold &&
          row.product_variants[0].product_variant_stock_levels
            .quantity_in_inventory > 0
        ) {
          products.push(row);
        }
      });
      return products;
    },
    NoStockProducts() {
      const products = [];
      this.getProductLists.forEach((row) => {
        if (
          row.product_variants[0].product_variant_stock_levels
            .quantity_in_inventory === 0
        ) {
          products.push(row);
        }
      });
      return products;
    },
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setProductLists",
      "setStockStatistics",
      "setSettings",
    ]),
    ...mapActions(["requestAxiosGet"]),
    badgeAllocation(val) {
      if (val > this.getSettings.global_low_stock_threshhold) {
        return "available-badge";
      } else if (
        val <= this.getSettings.global_low_stock_threshhold &&
        val > 0
      ) {
        return "low-stock-badge";
      } else if (val === 0) {
        return "no-stock-badge";
      }
    },
    fetchProducts() {
      this.setLoader("loading-text");
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products${this.params}`,
      }).then((response) => {
        if (this.$route.path === "/inventory/stock-levels") {
          this.setLoader("");
        }
        if (response.status === 200) {
          this.setProductLists(response.data.data.products);
        }
      });
    },
    getStockSettings() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/settings`,
      }).then((response) => {
        if (response.status === 200) {
          this.setSettings(response.data.data);
        }
      });
    },
    getStockStats() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products/statistics`,
      }).then((response) => {
        if (response.status === 200) {
          this.setStockStatistics(
            response.data.data.grouped_by_stock_level_count
          );
        }
      });
    },
    availableleTally(product) {
      let tally = 0;
      product.product_variants.forEach((row) => {
        if (row.product_variant_stock_levels) {
          tally =
            row.product_variant_stock_levels.quantity_in_inventory + tally;
        }
      });
      return tally;
    },
    committedTally(product) {
      let tally = 0;
      product.product_variants.forEach((row) => {
        if (row.product_variant_stock_levels) {
          tally =
            row.product_variant_stock_levels.quantity_in_sales_orders + tally;
        }
      });
      return tally;
    },
    incomingTally(product) {
      let tally = 0;
      product.product_variants.forEach((row) => {
        if (row.product_variant_stock_levels) {
          tally =
            row.product_variant_stock_levels.quantity_in_sales_orders + tally;
        }
      });
      return "-";
    },
  },
};
</script>

<style scoped>
.available-badge {
  background: #f0f3f7;
  padding: 5px 15px;
  border-radius: 15px;
  color: #303133;
}
.low-stock-badge {
  background: #fdf1cc;
  padding: 5px 15px;
  border-radius: 15px;
  color: #7f3b02;
}
.no-stock-badge {
  background: #fbdecf;
  padding: 5px 15px;
  border-radius: 15px;
  color: #9b101c;
}
</style>
