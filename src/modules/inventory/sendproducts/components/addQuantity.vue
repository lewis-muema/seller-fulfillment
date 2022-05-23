<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-card variant="outlined" class="desktop-select-products-card">
          <div class="enter-quantity-container desktop-header-title d-flex">
            <router-link to="auth/sign-up">
              <i class="mdi mdi-arrow-left" aria-hidden="true"></i
            ></router-link>
            <v-card-title class="text-center"> Enter Quantity </v-card-title>
          </div>
          <div class="products-selected-summary">
            <v-table>
              <table-header :header="tableHeaders" />
              <tbody>
                <tr
                  v-for="selectedProduct in selectedProductsSummary"
                  :key="selectedProduct.id"
                  class="enter-quantity-input"
                >
                  <td>{{ selectedProduct.name }}</td>
                  <td>{{ selectedProduct.price }}</td>
                  <td class="">
                    <label>Qty</label>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="0.0"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <items-selected :itemsAddedCount="itemsAddedCount" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tableHeader from "@/modules/inventory/tables/tableHeader";
import itemsSelected from "./itemsSelected";
export default {
  components: { tableHeader, itemsSelected },
  data() {
    return {
      itemsAddedCount: 0,
      tableHeaders: ["Product", "Price", "Quantity to send"],
    };
  },
  computed: {
    ...mapGetters(["getSelectedProducts"]),
    selectedProductsSummary() {
      return this.getSelectedProducts;
    },
  },
};
</script>

<style>
.enter-quantity-input td {
  height: 85px !important;
}
.enter-quantity-input td > .form-control {
  width: 30% !important;
}
</style>
