<template>
  <div>
    <v-row>
      <v-col cols="6" class="mx-auto mt-4 mb-3">
        <el-steps :active="1" finish-status="success">
          <el-step :title="$t('inventory.selectProducts')"></el-step>
          <el-step :title="$t('inventory.review')"></el-step>
          <el-step :title="$t('inventory.checkout')"></el-step>
        </el-steps>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-card variant="outlined" class="desktop-select-products-card">
          <div class="enter-quantity-container desktop-header-title d-flex p-3">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="$router.push(`/inventory/add-pickup-products`)"
            ></i>
            <v-card-title class="text-center send-products-title">
              {{ $t("inventory.reviewProductsAdded") }}
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
        this.$router.push(`/inventory/create-pickup`);
      } else {
        ElNotification({
          title: "",
          message: this.$t("inventory.pleaseEnterQuantity"),
          type: "error",
        });
      }
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
.no-products-selected-card-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 40vh;
}
</style>
