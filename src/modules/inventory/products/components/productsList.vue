<template>
  <div>
    <div v-if="getProductLists.length">
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
                            ? `${product.product_variants.length - 1} ${$t(
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
                <span :class="getLoader.products">
                  {{
                    product.product_variants[0].product_variant_stock_levels
                      ? product.product_variants[0].product_variant_stock_levels
                          .quantity_in_inventory
                      : "-"
                  }}
                  {{ $t("inventory.inStock") }}
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
        <div
          class="show-more-deliveries-link mb-3"
          v-if="getProductLists.length === max"
        >
          <div @click="loadMore()" class="show-more-deliveries-link">
            {{ $t("inventory.loadMore") }}<v-icon>mdi mdi-arrow-right</v-icon>
          </div>
        </div>
      </v-card>
    </div>
    <div v-else>
      <add-products-card />
    </div>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
import addProductsCard from "@/modules/inventory/products/components/addProductsCard";
import searchAlgolia from "../../../common/searchAlgolia.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import placeholder from "../../../../mixins/placeholders";

export default {
  components: { tableHeader, addProductsCard, searchAlgolia },
  mixins: [placeholder],
  data() {
    return {
      headers: [
        {
          title: "inventory.product",
        },
        {
          title: "inventory.availableProduct",
        },
        {
          title: "inventory.actions",
        },
      ],
      max: 10,
    };
  },
  computed: {
    ...mapGetters([
      "getProductLists",
      "getLoader",
      "getInventorySelectedTab",
      "getStorageUserDetails",
    ]),
    tableHeaders() {
      return this.headers;
    },
  },
  watch: {
    "$store.state.inventorySelectedTab": function inventorySelectedTab() {
      this.setProductLists(this.placeholderProducts);
      this.fetchProducts();
    },
  },
  mounted() {
    this.setProductLists(this.placeholderProducts);
    this.fetchProducts();
  },
  methods: {
    ...mapMutations([
      "setLoader",
      "setProductLists",
      "setAllProductCount",
      "setArchivedProductCount",
    ]),
    ...mapActions(["requestAxiosGet"]),
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
        }?max=${this.max}`,
      }).then((response) => {
        this.setLoader({
          type: "products",
          value: "",
        });
        if (response.status === 200) {
          if (this.getInventorySelectedTab === "inventory.all") {
            this.setAllProductCount(response.data.data.products.length);
          } else {
            this.setArchivedProductCount(response.data.data.products.length);
          }
          this.setProductLists(response.data.data.products);
        }
      });
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
</style>
