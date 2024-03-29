<template>
  <div>
    <div v-if="getProductLists.length > 0">
      <v-card class="desktop-product-details" variant="outlined">
        <div class="products-search">
          <searchAlgolia type="product" />
        </div>

        <v-table class="">
          <table-header :header="tableHeaders" />
          <tbody>
            <tr v-for="(product, index) in getProductLists" :key="index">
              <td>
                <v-list-item lines="two">
                  <v-list-item-avatar class="product-image-container">
                    <img
                      :src="
                        product.product_variants[0].product_variant_image_link
                      "
                      v-if="!getLoader.products"
                      alt="img"
                      class="product-img"
                    />
                  </v-list-item-avatar>
                  <v-list-item-header>
                    <v-list-item-title>
                      <span :class="getLoader.products">
                        {{ product.product_name }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <span :class="getLoader.products">
                        {{
                          product.product_variants.length > 1
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
                  <span :class="getLoader.products">
                    {{ availableleTally(product) }}
                  </span>
                </span>
              </td>
              <td>
                <span :class="badgeAllocation(committedTally(product))">
                  <span :class="getLoader.products">
                    {{ committedTally(product) }}
                  </span>
                </span>
              </td>
              <td>
                <span :class="badgeAllocation(provisionalTally(product))">
                  <span :class="getLoader.products">
                    {{ provisionalTally(product) }}
                  </span>
                </span>
              </td>
              <td>
                <span :class="badgeAllocation(incomingTally(product))">
                  <span :class="getLoader.products">
                    {{ incomingTally(product) }}
                  </span>
                </span>
              </td>
              <td>
                <router-link
                  :to="`/inventory/view-product/${product.product_id}`"
                  class="view-product-link"
                >
                  <span :class="getLoader.products"
                    >{{ $t("inventory.view") }}
                  </span></router-link
                >
              </td>
            </tr>
          </tbody>
        </v-table>
        <div>
          <v-pagination
            class="mt-3"
            v-model="page"
            :length="getPagination.page_count"
            :total-visible="getPagination.page_count < 10 ? '' : 10"
            rounded="circle"
          ></v-pagination>
        </div>
      </v-card>
    </div>
    <div v-else class="deliveries-empty">
      <div v-if="getProductLists.length">
        <div class="no-products-card-container">
          <i class="mdi mdi-store no-products-icon"></i>
          <div class="no-products-description">
            {{
              getInventorySelectedTab === "inventory.lowStock"
                ? $t("inventory.thereAreNoLowStockItems")
                : $t("inventory.thereAreNoOutOfStockItems")
            }}
          </div>
        </div>
      </div>
      <div v-else>
        <div>
          <no-products-card />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
import noProductsCard from "@/modules/inventory/products/components/noProductsCard";
import searchAlgolia from "../../../common/searchAlgolia.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import placeholder from "../../../../mixins/placeholders";

export default {
  components: { tableHeader, searchAlgolia, noProductsCard },
  mixins: [placeholder],
  data() {
    return {
      headers: [
        {
          title: "inventory.product",
          description: "",
        },
        {
          title: "inventory.available",
          description: "inventory.availableProducts",
        },
        {
          title: "inventory.committed",
          description: "inventory.CommittedProducts",
        },
        {
          title: "inventory.provisional",
          description: "inventory.provisionalProducts",
        },
        {
          title: "inventory.incoming",
          description: "inventory.IncomingProducts",
        },
        {
          title: "inventory.actions",
          description: "",
        },
      ],
      params: "?max=5",
      max: 5,
      page: 1,
    };
  },
  watch: {
    searchParam(val) {
      this.initiateAlgolia(val);
    },
    "$store.state.inventorySelectedTab": function inventorySelectedTab(val) {
      if (val === "inventory.lowStock") {
        this.params = `/lowstock?max=${this.max}`;
      } else if (val === "inventory.outOfStock") {
        this.params = `/outofstock?max=${this.max}`;
      } else {
        this.params = `?max=${this.max}`;
      }
      if (this.page === 1) {
        if (!this.getProductLists.length) {
          this.setProductLists(this.placeholderProducts);
        }
        this.fetchProducts();
      } else {
        this.page = 1;
      }
    },
    page() {
      this.fetchProducts();
    },
  },
  mounted() {
    this.setComponent("common.stocks");
    this.setProductLists(this.placeholderProducts);
    this.getStockStats();
    this.fetchProducts();
    this.getStockSettings();
    if (this.$route.params.tab === "noStock") {
      this.params = `/lowstock?max=${this.max}`;
      this.setInventorySelectedTab("inventory.outOfStock");
    } else if (this.$route.params.tab === "lowStock") {
      this.params = `/outofstock?max=${this.max}`;
      this.setInventorySelectedTab("inventory.lowStock");
    } else {
      this.params = `?max=${this.max}`;
      this.setInventorySelectedTab("inventory.all");
    }
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getProductLists",
      "getInventorySelectedTab",
      "getStorageUserDetails",
      "getSettings",
      "getPagination",
    ]),
    tableHeaders() {
      return this.headers;
    },
    filteredProducts() {
      return this.getProductLists;
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
      "setInventorySelectedTab",
      "setPagination",
      "setAllProductCount",
      "setArchivedProductCount",
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
    totalStock(val) {
      let total = 0;
      val.forEach((element) => {
        total = element.product_variant_stock_levels.available + total;
      });
      return total;
    },
    fetchProducts() {
      this.setLoader({
        type: "products",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products${
          this.getInventorySelectedTab === "inventory.archived"
            ? "/archived"
            : ""
        }${this.params}&offset=${this.page - 1}`,
      }).then((response) => {
        this.setLoader({
          type: "products",
          value: "",
        });
        if (response.status === 200) {
          if (this.getInventorySelectedTab === "inventory.all") {
            this.setAllProductCount(response.data.data.products.length);
          }
          this.setArchivedProductCount(response.data.data.products.length);
          this.setProductLists(response.data.data.products);
          this.setPagination(response.data.data.pagination);
          this.page = response.data.data.pagination.current_page + 1;
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
          tally = row.product_variant_stock_levels.available + tally;
        }
      });
      return tally;
    },
    committedTally(product) {
      let tally = 0;
      product.product_variants.forEach((row) => {
        if (row.product_variant_stock_levels) {
          tally =
            row.product_variant_stock_levels.quantity_held_locally +
            row.product_variant_stock_levels.quantity_in_sales_orders +
            tally;
        }
      });
      return tally;
    },
    provisionalTally(product) {
      let tally = 0;
      product.product_variants.forEach((row) => {
        if (row.product_variant_stock_levels) {
          tally =
            row.product_variant_stock_levels.quantity_in_inventory + tally;
        }
      });
      return tally;
    },
    incomingTally(product) {
      let tally = 0;
      product.product_variants.forEach((row) => {
        if (row.product_variant_stock_levels) {
          tally = row.product_variant_stock_levels.quantity_incoming + tally;
        }
      });
      return tally;
    },
    loadMore() {
      this.max = this.max + 10;
      this.fetchProducts();
    },
  },
};
</script>

<style>
.desktop-product-details {
  border-color: #e2e7ed;
  background: white;
}
.products-search {
  width: 30%;
  zoom: 85%;
  margin: 25px 25px 0px 20px;
}
.product-image-container {
  border: 1px solid;
  border-color: #dcdfe6;
  height: 45px;
  width: 45px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
}
.view-product-link {
  color: #324ba8;
  text-decoration: none;
}
.product-img {
  width: 40px;
  height: inherit;
}
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
