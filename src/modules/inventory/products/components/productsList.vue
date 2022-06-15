<template>
  <div>
    <div v-if="products.length">
      <v-card class="desktop-product-details" variant="outlined">
        <div class="products-search">
          <searchAlgolia />
        </div>

        <v-table class="">
          <table-header :header="tableHeaders" />
          <tbody>
            <tr v-for="(product, index) in products" :key="index">
              <td>
                <v-list-item lines="two">
                  <v-list-item-avatar class="product-image-container">
                    <img
                      :src="product.product_link"
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
                            ? `${product.product_variants.length} product options`
                            : ""
                        }}
                      </span>
                    </v-list-item-subtitle>
                  </v-list-item-header>
                </v-list-item>
              </td>
              <td>
                <span :class="getLoader">
                  {{ product.available }} in Stock
                </span>
              </td>
              <td>
                <router-link
                  :to="{
                    name: 'View Product',
                    params: {
                      product: JSON.stringify(product),
                    },
                  }"
                  class="view-product-link"
                >
                  <span :class="getLoader"
                    >{{ $t("inventory.view") }}
                  </span></router-link
                >
              </td>
            </tr>
          </tbody>
        </v-table>
        <div class="show-more-deliveries-link mb-3">
          <router-link to="/" class="show-more-deliveries-link">
            {{ $t("inventory.loadMore")
            }}<v-icon>mdi mdi-arrow-right</v-icon></router-link
          >
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
import { mapGetters, mapMutations } from "vuex";
export default {
  components: { tableHeader, addProductsCard, searchAlgolia },
  data() {
    return {
      headers: ["Product", "Available inventory", "Actions"],
    };
  },
  computed: {
    ...mapGetters(["getProductLists", "getLoader"]),
    products() {
      return this.getProductLists.data.products;
    },
    tableHeaders() {
      return this.headers;
    },
  },
  mounted() {
    setTimeout(() => {
      this.setLoader();
    }, 1000);
  },
  methods: {
    ...mapMutations(["setLoader"]),
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
}
</style>
