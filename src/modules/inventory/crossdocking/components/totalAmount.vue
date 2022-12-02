<template>
  <div>
    <div class="promo-code-container-inner cross-docking-checkout-container">
      <div>
        <div class="promo-code-row promo-code-bold promo-code-margin-top">
          <span :class="getLoader.calculateFee">{{
            $t("inventory.fees")
          }}</span>
        </div>
        <div class="promo-code-row">
          <span>
            <span :class="getLoader.calculateFee">
              {{ $t("inventory.pickupFees") }}
            </span>
            <i
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'pickupfees',
                })
              "
              v-if="!getLoader.calculateFee"
              class="mdi mdi-information"
            ></i
          ></span>
          <span :class="getLoader.calculateFee" class="promo-code-left-section"
            >{{ getFulfillmentFees.pricing.pricing_deliveries[0].currency }}
            {{ getFulfillmentFees.pricing.pricing_subtotals.pickup_fee }}</span
          >
        </div>
        <div class="promo-code-row promo-code-divider">
          <span>
            <span :class="getLoader.calculateFee">
              {{ $t("inventory.fulfillmentFees") }}
            </span>
            <i
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'fulfillmentFees',
                })
              "
              v-if="!getLoader.calculateFee"
              class="mdi mdi-information"
            ></i
          ></span>
          <span :class="getLoader.calculateFee" class="promo-code-left-section"
            >{{ getFulfillmentFees.pricing.pricing_deliveries[0].currency }}
            {{
              getFulfillmentFees.pricing.pricing_subtotals.fulfilment_fee
            }}</span
          >
        </div>
      </div>
      <div class="promo-code-row promo-code-bold promo-code-margin-top">
        <span :class="getLoader.calculateFee">{{ $t("inventory.total") }}</span>
        <span :class="getLoader.calculateFee" class="promo-code-left-section"
          >{{ getFulfillmentFees.pricing.pricing_deliveries[0].currency }}
          {{ getFulfillmentFees.pricing.pricing_subtotals.total_fee }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      currency: "KES",
      amount: 4500,
      amount2: 500,
    };
  },
  watch: {
    "$store.state.promoCode": function promoCode() {},
  },
  computed: {
    ...mapGetters([
      "getSendProductsRoute",
      "getLoader",
      "getFulfillmentFees",
      "getStorageUserDetails",
      "getPromoCode",
      "getSelectedProducts",
    ]),
    getRoute() {
      return this.getSendProductsRoute;
    },
    products() {
      let products = [];
      this.getSelectedProducts.forEach((row) => {
        if (row.quantity) {
          products.push(row);
        }
      });
      return products;
    },
    productPayload() {
      const products = [];
      this.products.forEach((row) => {
        products.push({
          product_id: row.product_id,
          product_variant_id: this.option(row).product_variant_id,
          quantity: row.quantity,
          currency: this.option(row).product_variant_currency,
          unit_price: this.option(row).product_variant_unit_price,
        });
      });
      return {
        order_type: "DELIVERY",
        products,
        coupon_code: this.getPromoCode ? this.getPromoCode : null,
      };
    },
  },
  beforeMount() {
    this.setLoader({
      type: "calculateFee",
      value: "",
    });
  },
  mounted() {
    this.setComponent("common.sendDeliveryToCustomer");
  },
  methods: {
    ...mapMutations([
      "setOverlayStatus",
      "setLoader",
      "setFulfillmentFees",
      "setPromoCode",
      "setComponent",
    ]),
    ...mapActions(["requestAxiosPost"]),
    option(row) {
      const option = row.selectedOption
        ? row.selectedOption
        : row.product_variants[0];
      return option;
    },
    removePromoCode() {
      this.setPromoCode("");
    },
  },
};
</script>

<style>
.total-amount {
  align-items: right !important;
}
.total-amount-content {
  justify-content: space-between !important;
  flex-direction: row !important;
}
.promo-code-text {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
.promo-code-text a {
  color: #324ba8;
}
.promo-code-container-inner {
  padding: 20px;
  font-size: 14px;
}
.promo-code-left-section {
  float: right;
}
.promo-code-row {
  height: 40px;
}
.promo-code-bold {
  font-weight: 500;
}
.promo-code-divider {
  border-bottom: 1px solid #e2e7ed;
}
.promo-code-margin-top {
  margin-top: 20px;
}
.promo-code-trigger {
  color: #324ba8;
  font-weight: 500;
  border-bottom: 2px solid #324ba8;
  cursor: pointer;
}
.promo-code-card {
  background: #b8f5a8;
  color: #064a23;
  min-height: 40px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 5px;
  padding-left: 10px;
}
.promo-code-card-description {
  margin: auto;
}
.promo-code-card-close {
  margin-left: -30px;
  margin-right: 10px;
  cursor: pointer;
}
.cross-docking-checkout-container {
  background: white;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
}
</style>
