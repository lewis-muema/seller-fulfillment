<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-card variant="outlined" class="desktop-select-products-card">
          <div class="enter-quantity-container desktop-header-title d-flex p-3">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="$router.back()"
            ></i>
            <v-card-title class="text-center">Enter Quantity</v-card-title>
          </div>
          <div class="products-selected-summary">
            <v-table>
              <table-header
                :header="
                  getRouteName === 'ProductsToSendy'
                    ? tableHeaders
                    : tableHeaders2
                "
              />
              <tbody>
                <tr
                  v-for="(selectedProduct, index) in selectedProductsSummary"
                  :key="index"
                  class="enter-quantity-input"
                >
                  <td>
                    <v-icon> mdi mdi-window-close </v-icon>
                  </td>
                  <td style="width: 300px">
                    {{ selectedProduct.product_name }}
                  </td>
                  <td>
                    {{ selectedProduct.product_currency }}
                    {{ selectedProduct.product_price }}
                  </td>
                  <td v-if="getRouteName === 'ProductsToCustomer'">
                    <div class="available-units">
                      {{ selectedProduct.available }}
                    </div>
                  </td>
                  <td class="">
                    <label>Qty</label>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="0.0"
                      required
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
      tableHeaders: ["", "Product", "Price", "Quantity to send"],
      tableHeaders2: [
        "",
        "Product",
        "Price",
        "Available units",
        "Quantity to send",
      ],
    };
  },
  computed: {
    ...mapGetters(["getSelectedProducts", "getSendProductsRoute"]),
    selectedProductsSummary() {
      return this.getSelectedProducts;
    },
    getRouteName() {
      return this.getSendProductsRoute;
    },
  },
};
</script>

<style>
.enter-quantity-input td {
  height: 85px !important;
}
.enter-quantity-input td > .form-control {
  width: 50% !important;
}
.available-units {
  border: 1px;
  background-color: #f0f3f7;
  width: 40px;
  border-radius: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
