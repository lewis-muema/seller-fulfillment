<template>
  <div>
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
            <tr v-for="stock in stockLevels" :key="stock.id">
              <td>{{ stock.name }}</td>
              <td>{{ stock.available }}</td>
              <td>{{ stock.committed }}</td>
              <td>{{ stock.incoming }}</td>
              <td>{{ stock.price }}</td>
              <td>
                <router-link to="/inventory/stock-details">View</router-link>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </tabs>
  </div>
</template>

<script>
import tabs from "@/modules/inventory/components/tabs.vue";
import tableHeader from "@/modules/inventory/tables/tableHeader";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      headers: [
        "Product",
        "Available",
        "Committed",
        "Incoming",
        "Price",
        "Actions",
      ],
      stockLevels: [
        {
          name: "SheaButter",
          color: "blue",
          available: "23",
          committed: "23",
          incoming: "4",
          price: "Kes 350",
        },
      ],
    };
  },
  components: {
    tabs,
    tableHeader,
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.stocks"));
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

<style></style>
