<template>
  <div>
    <v-card class="desktop-product-details" variant="outlined">
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
          <tr v-for="(product, index) in products" :key="index">
            <td>
              <v-list-item lines="two">
                <v-list-item-avatar class="product-image-container">
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
            <td>{{ product.available }}</td>
            <td>{{ product.committed }}</td>
            <td>{{ product.incoming }}</td>
            <td>
              <router-link
                :to="{
                  name: 'View Product',
                  params: {
                    product: JSON.stringify(product),
                  },
                }"
                class="view-product-link"
                >{{ $t("inventory.view") }}</router-link
              >
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
export default {
  props: ["products"],
  data() {
    return {
      headers: ["Product", "Available", "Committed", "Incoming", "Actions"],
    };
  },
  components: {
    tableHeader,
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.stocks"));
  },
  computed: {
    tableHeaders() {
      return this.headers;
    },
  },
};
</script>

<style scoped></style>
