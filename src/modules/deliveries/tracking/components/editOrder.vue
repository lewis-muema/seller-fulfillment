<template>
  <div>
    <v-row class="edit-order-container">
      <v-col cols="8">
        <v-card variant="outlined" class="desktop-select-products-card">
          <div class="enter-quantity-container desktop-header-title d-flex p-3">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="
                $router.push({
                  name: 'Tracking',
                  params: {
                    order_id: this.getOrderTrackingData.order.order_id,
                  },
                })
              "
            ></i>
            <v-card-title class="text-center send-products-title">
              {{ $t("common.editProducts") }}
            </v-card-title>
          </div>
          <div>
            <span
              class="add-products-span-header"
              @click="
                navigateRoute(
                  getParent === 'sendy'
                    ? '/inventory/add-pickup-products'
                    : '/inventory/add-delivery-products'
                )
              "
            >
              <i class="mdi mdi-plus"></i>
              {{ $t("common.addProducts") }}
            </span>
          </div>
          <div class="products-selected-summary" v-if="!productsEmpty">
            <v-table>
              <table-header :header="tableHeaders" />
              <tbody>
                <tr
                  v-for="(orderedProduct, index) in getProductsToSubmit"
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
                            :src="orderedProduct.product_variant_image_link"
                            alt=""
                            class="product-select-img"
                          />
                        </div>
                      </span>
                      <div>
                        <p class="product-select-product-name">
                          {{ orderedProduct.product_variant_description }}
                        </p>
                        <p class="product-select-product-option">
                          {{ orderedProduct.product_variant_quantity }}
                          {{ orderedProduct.product_variant_quantity_type }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      {{ orderedProduct.currency }}
                      {{ orderedProduct.unit_price }}
                    </div>
                  </td>
                  <td class="">
                    <label>{{ $t("inventory.qty") }}</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="orderedProduct.quantity"
                      placeholder="0.0"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <div v-else>
            <div class="no-products-card-container">
              <i class="mdi mdi-store no-products-icon"></i>
              <div class="no-products-description">
                {{ $t("deliveries.cartEmpty") }}
              </div>
              <span
                @click="
                  navigateRoute(
                    getParent === 'sendy'
                      ? '/inventory/add-pickup-products'
                      : '/inventory/add-delivery-products'
                  )
                "
                class="add-products-span-link"
              >
                <span class="add-products-span">
                  <i class="mdi mdi-plus"></i>
                  {{ $t("common.addProducts") }}
                </span>
              </span>
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
            <v-divider />
            <div v-if="getParent === 'sendy'">
              <div class="mt-2">{{ $t("inventory.fees") }}</div>
              <p class="mt-2">
                <span>{{ $t("inventory.pickupFee") }}</span>
                <span class="orderedProductKes"
                  >{{ currency }} {{ amount }}</span
                >
              </p>
            </div>
            <v-btn
              v-loading="buttonLoader"
              @click="submitChanges()"
              class="edit-info-submit-button edit-order-button"
            >
              {{ $t("deliveries.submit") }}
            </v-btn>
          </div>
        </v-card>
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
      productsEmpty: false,
      amount: 0,
      currency: "KES",
      buttonLoader: false,
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
    };
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "getStorageUserDetails",
      "getOrderTrackingData",
      "getParent",
      "getSelectedProducts",
      "getProductsToSubmit",
    ]),
    totalProducts() {
      let total = 0;
      this.getProductsToSubmit.forEach((row) => {
        if (row.quantity) {
          total = parseInt(row.quantity) + total;
        }
      });
      return total;
    },
  },
  methods: {
    ...mapMutations([
      "setOrderTrackingData",
      "setLoader",
      "setEditValue",
      "setSelectedProducts",
      "setProductsToSubmit",
    ]),
    ...mapActions(["updateOrderTrackingData", "requestAxiosGet"]),
    navigateRoute(route) {
      this.setEditValue(true);
      this.$router.push(route);
    },
    async submitChanges() {
      this.buttonLoader = true;
      const payload = {
        products: JSON.parse(JSON.stringify(this.getProductsToSubmit)),
      };
      const fullPayload = {
        app: process.env.FULFILMENT_SERVER,
        values: payload,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/${
          this.getParent === "sendy" ? "consignments" : "deliveries"
        }/${this.getOrderTrackingData.order.order_id}`,
      };
      if (payload.products.length > 0) {
        const response = await this.updateOrderTrackingData(fullPayload);
        if (response.status === 200) {
          ElNotification({
            title: "",
            message: this.$t("deliveries.deliveryEditedSuccessfully"),
            type: "success",
          });
          this.buttonLoader = false;
          this.setEditValue(false);
          this.$router.push({
            name: "Tracking",
            params: { order_id: this.getOrderTrackingData.order.order_id },
          });
          this.sendSegmentEvents({
            event: "click_submit_edited_order_products",
            data: {
              userId: this.getStorageUserDetails.business_id,
              SKU: response.data.data.order_id,
              clientType: "web",
              device: "desktop",
            },
          });
          setTimeout(() => {
            this.setSelectedProducts([]);
            this.setProductsToSubmit([]);
          }, 1000);
        } else {
          ElNotification({
            title: "",
            message: this.$t("deliveries.cosignmentEditingFailed"),
            type: "error",
          });
          this.buttonLoader = false;
        }
      } else {
        this.productsEmpty = true;
        ElNotification({
          title: "",
          message: this.$t("deliveries.pleaseAddProduct"),
          type: "warning",
        });
        this.buttonLoader = false;
      }
    },
    removeProductOption(index) {
      const products = this.getProductsToSubmit;
      products.splice(index, 1);
    },
  },
};
</script>

<style>
.edit-order-container {
  margin-top: 30px !important;
}

.orderedProductKes {
  float: right;
}

.edit-order-button {
  margin-top: 10px !important;
  text-transform: uppercase !important;
}

.add-products-span-header {
  float: right !important;
  margin: -50px 30px 0px 0px;
  color: #324ba8;
  text-decoration: none !important;
  cursor: pointer !important;
}

.add-products-span {
  color: #324ba8;
}

.add-products-span-link {
  text-decoration: none;
}
</style>
