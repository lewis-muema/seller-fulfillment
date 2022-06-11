<template>
  <div>
    <div v-if="products.length">
      <v-card class="m-3 desktop-product-details" variant="outlined">
        <div class="products-search">
          <v-text-field
            color="#324BA8"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            variant="outlined"
            placeholder="Search Product and product options"
          ></v-text-field>
        </div>

        <v-table class="">
          <table-header :header="tableHeaders" />
          <tbody>
            <tr v-for="(product, index) in products" :key="index">
              <td>
                <v-list-item lines="two">
                  <v-list-item-avatar class="product-image-container">
                    <!-- <img src="../../../../assets/shearButter.jpg" /> -->
                    <v-icon class="">mdi mdi-image</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-header>
                    <v-list-item-title>{{
                      product.product_name
                    }}</v-list-item-title>
                    <v-list-item-subtitle
                      >{{
                        product.product_variants
                          ? `${product.product_variants.length} product options`
                          : ""
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-header>
                </v-list-item>
              </td>
              <td>5 in Stock</td>
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
                  {{ $t("inventory.view") }}</router-link
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
import { mapGetters } from "vuex";
export default {
  components: { tableHeader, addProductsCard },
  data() {
    return {
      headers: ["Product", "Available inventory", "Actions"],
    };
  },
  computed: {
    ...mapGetters(["getProductLists"]),
    products() {
      return this.getProductLists.data.products;
    },
    tableHeaders() {
      return this.headers;
    },
  },
};
</script>

<style>
.desktop-product-details {
  border-color: #e2e7ed;
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
</style>
