<template>
  Products - {{ getProductsToSubmit }}
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
                navigateRoute('/inventory/send-inventory/sendy/select-products')
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
                      <img
                        :src="orderedProduct.product_variant_image_link"
                        alt=""
                        class="product-select-img"
                      />
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
              <router-link
                to="/inventory/send-inventory/sendy/select-products"
                class="add-products-span-link"
              >
                <span class="add-products-span">
                  <i class="mdi mdi-plus"></i>
                  {{ $t("common.addProducts") }}
                </span>
              </router-link>
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
            <div class="mt-2">{{ $t("inventory.fees") }}</div>
            <p class="mt-2">
              <span>{{ $t("inventory.pickupFee") }}</span>
              <span class="orderedProductKes">{{ currency }} {{ amount }}</span>
            </p>
            <v-btn
              v-loading="buttonLoader"
              @click="submitChanges()"
              class="edit-info-submit-button edit-order-button"
            >
              {{ $t("deliveries.submit") }}
            </v-btn>
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
          console.log("Qua", row.quantity);
          total = parseInt(row.quantity) + total;
        }
      });
      return total;
    },
    orderedProducts() {
      let finalOrderedItems = [];
      const mappedSelectedProduct = [];
      if (this.getSelectedProducts.length) {
        this.getSelectedProducts.forEach((product) => {
          const productPayload = {
            product_id: product.product_id,
            product_variant_id: product.product_variants[0].product_variant_id,
            product_variant_image_link:
              product.product_variants[0].product_variant_image_link,
            product_name: product.product_name,
            product_variant_description:
              product.product_variants[0].product_variant_description,
            product_variant_quantity:
              product.product_variants[0].product_variant_quantity,
            product_variant_quantity_type:
              product.product_variants[0].product_variant_quantity_type,
            quantity: 0,
            unit_price: product.product_variants[0].product_variant_unit_price,
            currency: product.product_variants[0].product_variant_currency,
          };
          mappedSelectedProduct.push(productPayload);
        });
      }
      finalOrderedItems = [
        ...this.getOrderTrackingData.order.products,
        ...mappedSelectedProduct,
      ];
      return finalOrderedItems;
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
          this.setProductsToSubmit([]);
          this.$router.push({
            name: "Tracking",
            params: { order_id: this.getOrderTrackingData.order.order_id },
          });
          setTimeout(() => {
            this.fetchOrder();
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
    fetchOrder() {
      this.setLoader({
        type: "orderTracking",
        value: "loading-text",
      });
      this.setLoader({
        type: "orderTimeline",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/${
          this.getParent === "sendy" ? "consignments" : "deliveries"
        }/${this.$route.params.order_id}`,
      }).then((response) => {
        this.setLoader({
          type: "orderTracking",
          value: "",
        });
        if (response.status === 200) {
          this.setOrderTrackingData(response.data.data);
        }
      });
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
