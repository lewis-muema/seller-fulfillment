<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-card variant="outlined" class="desktop-select-products-card">
          <div class="enter-quantity-container desktop-header-title d-flex p-3">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="
                $router.push(
                  `/inventory/send-inventory/${$route.params.path}/select-products`
                )
              "
            ></i>
            <v-card-title class="text-center send-products-title">
              {{ $t("inventory.enterQuantity") }}
            </v-card-title>
          </div>
          <div class="products-selected-summary">
            <v-table>
              <table-header
                :header="
                  $route.params.path === 'sendy' ? tableHeaders : tableHeaders2
                "
              />
              <tbody>
                <tr
                  v-for="(selectedProduct, index) in selectedProductsSummary"
                  :key="index"
                  class="enter-quantity-input"
                >
                  <td>
                    <v-icon
                      class="product-select-remove-product"
                      @click="removeProductOption(index)"
                    >
                      mdi mdi-window-close
                    </v-icon>
                  </td>
                  <td style="width: 300px">
                    <div class="product-select-product-column">
                      <img
                        v-if="selectedProduct.selectedOption"
                        :src="
                          selectedProduct.selectedOption
                            .product_variant_image_link
                        "
                        alt=""
                        class="product-select-img"
                      />
                      <img
                        v-else
                        :src="selectedProduct.product_link"
                        alt=""
                        class="product-select-img"
                      />
                      <div>
                        <p class="product-select-product-name">
                          {{ selectedProduct.product_name }}
                        </p>
                        <p
                          v-if="selectedProduct.selectedOption"
                          class="product-select-product-option"
                        >
                          {{
                            selectedProduct.selectedOption
                              .product_variant_quantity
                          }}
                          {{
                            selectedProduct.selectedOption
                              .product_variant_quantity_type
                          }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div v-if="selectedProduct.selectedOption">
                      {{
                        selectedProduct.selectedOption.product_variant_currency
                      }}
                      {{
                        selectedProduct.selectedOption
                          .product_variant_unit_price
                      }}
                    </div>
                    <div v-else>
                      {{ selectedProduct.product_currency }}
                      {{ selectedProduct.product_price }}
                    </div>
                    <div
                      @click="openPricingOverlay(index)"
                      class="add-quantity-price-tag"
                      v-if="$route.params.path === 'customer'"
                    >
                      <i class="mdi mdi-tag-multiple"></i>
                      {{ $t("inventory.editPrice") }}
                    </div>
                  </td>
                  <td v-if="$route.params.path === 'customer'">
                    <div class="available-units">
                      {{
                        selectedProduct.selectedOption
                          .product_variant_stock_levels
                          ? selectedProduct.selectedOption
                              .product_variant_stock_levels
                              .quantity_in_inventory
                          : "-"
                      }}
                    </div>
                  </td>
                  <td class="">
                    <label>{{ $t("inventory.qty") }}</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="selectedProduct.quantity"
                      placeholder="0.0"
                      @input="addQuantity(index, $event)"
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
        <v-card
          variant="outlined"
          class="desktop-select-products-card items-selected-card"
        >
          <div class="items-selected-container">
            <p>
              {{ `${totalProducts} ${$t("inventory.itemsAdded")}` }}
            </p>
            <button
              type="submit"
              @click="addProductStep()"
              class="btn btn-primary"
            >
              {{ $t("inventory.continueWith") }} {{ totalProducts }}
              {{ $t("inventory.itemsAdded") }}
            </button>
          </div></v-card
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import tableHeader from "@/modules/inventory/tables/tableHeader";
import { ElNotification } from "element-plus";
import eventsMixin from "../../../../mixins/events_mixin";

export default {
  components: { tableHeader },
  mixins: [eventsMixin],
  data() {
    return {
      quantities: [],
      quantity: 1,
      tableHeaders: [
        {
          title: "",
        },
        {
          title: "inventory.product",
        },
        {
          title: "inventory.price",
        },
        {
          title: "inventory.quantityToSend",
        },
      ],
      tableHeaders2: [
        {
          title: "",
        },
        {
          title: "inventory.product",
        },
        {
          title: "inventory.price",
        },
        {
          title: "inventory.availableUnits",
        },
        {
          title: "inventory.quantityToSend",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getSelectedProducts", "getStorageUserDetails"]),
    selectedProductsSummary() {
      return this.getSelectedProducts;
    },
    totalProducts() {
      let total = 0;
      this.getSelectedProducts.forEach((row) => {
        if (row.quantity) {
          total = parseInt(row.quantity) + total;
        }
      });
      return total;
    },
  },
  methods: {
    ...mapMutations([
      "setProductStep",
      "setSelectedProducts",
      "setOverlayStatus",
      "setEditedPriceIndex",
    ]),
    addProductStep() {
      if (this.totalProducts > 0) {
        this.$router.push(
          `/inventory/send-inventory/${this.$route.params.path}/checkout`
        );
      } else {
        ElNotification({
          title: "",
          message: this.$t("inventory.pleaseEnterQuantity"),
          type: "error",
        });
      }
    },
    addQuantity(val, event) {
      const products = this.getSelectedProducts;
      let tally = "";
      if (
        this.$route.params.path === "customer" &&
        event.target.value >
          products[val].selectedOption.product_variant_stock_levels
            .quantity_in_inventory &&
        process.env.DOCKER_ENV === "production"
      ) {
        ElNotification({
          title: "",
          message: this.$t("inventory.theQuantityYouHaveEntered"),
          type: "error",
        });
      } else {
        tally = event.target.value;
      }
      let newProduct = {};
      Object.keys(products[val]).forEach((row) => {
        newProduct[row] = products[val][row];
      });
      newProduct.quantity = tally;
      products[val] = newProduct;
      this.setSelectedProducts(products);
      if (this.$route.params.path === "customer") {
        this.sendSegmentEvents({
          event: "Review Added Items",
          data: {
            userId: this.getStorageUserDetails.business_id,
            SKU: products[val].product_id,
            variant: products[val].selectedOption.product_variant_id,
            quantity: event.target.value,
            product_collection: products[val].product_collection
              ? products[val].product_collection.collection_id
              : "",
            clientType: "web",
            device: "desktop",
          },
        });
      }
    },
    removeProductOption(index) {
      const products = this.getSelectedProducts;
      products.splice(index, 1);
      this.setSelectedProducts(products);
    },
    openPricingOverlay(index) {
      this.setEditedPriceIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "editPrice",
      });
    },
  },
};
</script>

<style>
.items-selected-container {
  margin: 30px 20px 30px;
  background: white;
}

.items-selected-card {
  margin-right: 50px;
  margin-left: 0 !important;
}
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
.product-select-product-name {
  margin-bottom: 0px;
}
.product-select-product-option {
  color: #606266;
  margin-bottom: 0px;
}
.product-select-product-column {
  display: flex;
  align-items: center;
}
.product-select-remove-product {
  color: #909399;
  cursor: pointer;
}
.add-quantity-price-tag {
  color: #909399;
  cursor: pointer;
}
</style>
