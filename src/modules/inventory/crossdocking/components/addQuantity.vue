<template>
  <div>
    <div
      class="crossdocking-product-unavailable-banner"
      v-if="unavailableProductStatus"
    >
      <span>
        <i
          class="mdi mdi-information-outline crossdocking-product-unavailable-banner-icon"
        ></i>
      </span>
      <span>
        {{ $t("inventory.someItemsOnYourList") }}
      </span>
    </div>
    <v-row class="mt-5">
      <v-col cols="8">
        <v-card variant="outlined" class="desktop-select-products-card">
          <div class="enter-quantity-container desktop-header-title d-flex p-3">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="this.$router.go(-1)"
            ></i>
            <v-card-title class="text-center send-products-title">
              {{ $t("inventory.enterQuantity") }}
            </v-card-title>
            <div
              class="crossdocking-product-add-product"
              @click="$router.push(`/inventory/add-delivery-products`)"
            >
              <v-icon>mdi mdi-plus</v-icon>
              {{ $t("inventory.addProducts") }}
            </div>
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
                      <span class="product-image-frame-container">
                        <div class="product-image-frame">
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
                            :src="
                              selectedProduct.product_variants[0]
                                .product_variant_image_link
                            "
                            alt=""
                            class="product-select-img"
                          />
                        </div>
                      </span>
                      <div>
                        <p class="product-select-product-name">
                          {{
                            selectedProduct.selectedOption
                              ? selectedProduct.selectedOption
                                  .product_variant_description
                              : selectedProduct.product_name
                          }}
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
                  <td style="width: 250px">
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
                      {{
                        selectedProduct.product_variants[0]
                          .product_variant_currency
                      }}
                      {{
                        selectedProduct.product_variants[0]
                          .product_variant_unit_price
                      }}
                    </div>
                    <div
                      @click="openPricingOverlay(index)"
                      class="add-quantity-price-tag"
                    >
                      <i class="mdi mdi-tag-multiple"></i>
                      {{ $t("inventory.editPrice") }}
                    </div>
                  </td>
                  <td class="">
                    <div class="crossdocking-product-quantity-label">
                      <p class="mb-1">
                        {{ $t("inventory.qty") }}
                      </p>
                      <el-input-number
                        class="crossdocking-product-counter"
                        v-model="selectedProduct.quantity"
                        :min="1"
                        @change="addQuantity(index, selectedProduct.quantity)"
                        required
                      />
                    </div>
                    <div class="crossdocking-product-counter-error">
                      {{ unavailableProducts(selectedProduct) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <div v-if="totalProducts === 0">
            <div class="no-products-selected-card-container">
              <i class="mdi mdi-store no-products-icon"></i>
              <div class="no-products-description">
                {{ $t("inventory.pleaseSelectSomeProductsToProceed") }}
              </div>
            </div>
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
import { mapGetters, mapMutations, mapActions } from "vuex";
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
          title: "inventory.quantityToSend",
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "getSelectedProducts",
      "getStorageUserDetails",
      "getDestinations",
      "getDestinationIndex",
    ]),
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
    unavailableProductStatus() {
      let status = false;
      this.selectedProductsSummary.forEach((row) => {
        const availableStock = row.selectedOption
          ? row.selectedOption.product_variant_stock_levels.available
          : row.product_variants[0].product_variant_stock_levels.available;
        if (availableStock < this.productQuantities(row)) {
          status = true;
        }
      });
      return status;
    },
  },
  mounted() {
    this.unavailableStockStatus = false;
    this.getSelectedProducts.forEach((row, i) => {
      this.refreshStock(row, i);
    });
  },
  methods: {
    ...mapMutations([
      "setProductStep",
      "setSelectedProducts",
      "setOverlayStatus",
      "setEditedPriceIndex",
      "setDestinations",
    ]),
    ...mapActions(["requestAxiosGet"]),
    addProductStep() {
      if (this.totalProducts > 0) {
        const destinations = this.getDestinations;
        const index = this.getDestinationIndex;
        if (destinations[index]) {
          destinations[index].products = this.getSelectedProducts;
        } else {
          destinations.splice([index], 0, {
            products: this.getSelectedProducts,
          });
        }
        this.setDestinations(destinations);
        destinations[index].autofillProductStatus = false;
        this.$router.push(`/inventory/create-delivery`);
      } else {
        ElNotification({
          title: "",
          message: this.$t("inventory.pleaseEnterQuantity"),
          type: "error",
        });
      }
    },
    unavailableProducts(val) {
      const availableStock = val.selectedOption
        ? val.selectedOption.product_variant_stock_levels.available
        : val.product_variants[0].product_variant_stock_levels.available;
      if (availableStock < this.productQuantities(val)) {
        return `${
          this.productQuantities(val) - availableStock
        } units are unavailable`;
      }
    },
    productQuantities(reference) {
      let stock = 0;
      if (
        this.getDestinations[this.getDestinationIndex].products &&
        this.existingProduct(reference).length === 0
      ) {
        stock = stock + reference.quantity;
      } else if (!this.getDestinations[this.getDestinationIndex].products) {
        stock = stock + reference.quantity;
      }
      this.getDestinations.forEach((row) => {
        if (row.products) {
          row.products.forEach((product) => {
            if (product.selectedOption && reference.selectedOption) {
              if (
                product.selectedOption.product_id ===
                  reference.selectedOption.product_id &&
                product.selectedOption.product_variant_id ===
                  reference.selectedOption.product_variant_id
              ) {
                stock = stock + product.quantity;
              }
            } else if (!product.selectedOption && !reference.selectedOption) {
              if (
                product.product_variants[0].product_id ===
                  reference.product_variants[0].product_id &&
                product.product_variants[0].product_variant_id ===
                  reference.product_variants[0].product_variant_id
              ) {
                stock = stock + product.quantity;
              }
            }
          });
        }
      });
      return stock;
    },
    existingProduct(reference) {
      return this.getDestinations[this.getDestinationIndex].products.filter(
        (row) => {
          const row_variant = row.selectedOption
            ? row.selectedOption
            : row.product_variants[0];
          const reference_variant = reference.selectedOption
            ? reference.selectedOption
            : reference.product_variants[0];
          return (
            row.product_id === reference.product_id &&
            row_variant.product_variant_id ===
              reference_variant.product_variant_id
          );
        }
      );
    },
    addQuantity(val, quantity) {
      const products = this.getSelectedProducts;
      if (products[val]) {
        this.sendSegmentEvents({
          event: "Review_Added_Items",
          data: {
            userId: this.getStorageUserDetails.business_id,
            SKU: products[val].product_id,
            variant: products[val].selectedOption
              ? products[val].selectedOption.product_variant_id
              : products[val].product_variants[0].product_variant_id,
            quantity: quantity,
            product_collection: products[val].product_collection
              ? products[val].product_collection.collection_id
              : "",
            clientType: "web",
            device: "desktop",
          },
        });
      }
    },
    refreshStock(row, i) {
      const product = this.getSelectedProducts[i];
      const productId = product.product_id;
      const productVariantId = product.selectedOption
        ? product.selectedOption.product_variant_id
        : product.product_variants[0].product_variant_id;
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products/${row.product_id}`,
      }).then((response) => {
        if (response.status === 200) {
          const selectedProducts = this.getSelectedProducts.filter((row) => {
            const rowVariantId = row.selectedOption
              ? row.selectedOption.product_variant_id
              : row.product_variants[0].product_variant_id;
            return (
              row.product_id === productId && rowVariantId === productVariantId
            );
          });
          if (selectedProducts.length) {
            if (selectedProducts[0].selectedOption) {
              response.data.data.product.product_variants.forEach((row) => {
                if (
                  row.product_variant_id ===
                  selectedProducts[0].selectedOption.product_variant_id
                ) {
                  selectedProducts[0].selectedOption.product_variant_stock_levels.available =
                    row.product_variant_stock_levels.available;
                }
              });
            } else {
              selectedProducts[0].product_variants[0].product_variant_stock_levels.available =
                response.data.data.product.product_variants[0].product_variant_stock_levels.available;
            }
          }
        }
      });
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
.crossdocking-product-quantity-label {
  display: flex;
  flex-direction: column;
}
.crossdocking-product-counter-error {
  color: #9b101c;
  font-size: 13px;
  font-weight: 500;
  margin: 10px 0px;
}
.crossdocking-product-unavailable-banner {
  margin-left: 50px;
  padding: 20px;
  border-radius: 5px;
  background: #fbdecf;
  margin-right: 50px;
  margin-top: 40px;
  margin-bottom: -30px;
  display: flex;
  align-items: center;
  font-size: 17px;
}
.crossdocking-product-unavailable-banner-icon {
  font-size: 25px;
  margin-right: 20px;
  color: #9b101c;
}
.crossdocking-product-add-product {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 20px;
  cursor: pointer;
  color: #324aa8;
  font-weight: 500;
  font-size: 17px;
}
</style>
