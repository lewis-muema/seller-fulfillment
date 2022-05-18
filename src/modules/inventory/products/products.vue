<template>
  <div class="container">
    <tabs>
      <v-card class="m-3 desktop-product-details" variant="outlined">
        <div class="products-search">
          <v-text-field
            color="#324BA8"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            variant="outlined"
            placeholder="Search Product"
          ></v-text-field>
        </div>

        <v-table class="">
          <table-header :header="tableHeaders" />
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.product_name }}</td>
              <td>2 Products Options</td>
              <td>
                <router-link to="/inventory/product-details">View</router-link>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tabs from "@/modules/inventory/components/tabs.vue";
import tableHeader from "@/modules/inventory/tables/tableHeader";
export default {
  components: { tabs, tableHeader },
  data() {
    return {
      headers: ["Product", "Product Options", "Actions"],
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.products"));
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
</style>
