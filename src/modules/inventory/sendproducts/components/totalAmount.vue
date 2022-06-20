<template>
  <div class="">
    <div class="promo-code-text">
      <p
        class="promo-code-trigger"
        @click="
          setOverlayStatus({
            overlay: true,
            popup: 'promo',
          })
        "
      >
        {{ $t("inventory.applyPromoCode") }}
      </p>
    </div>
    <div class="promo-code-container-inner">
      <div class="promo-code-row promo-code-divider">
        <span :class="getLoader">
          {{ $t("inventory.totalValue") }}
        </span>
        <span :class="getLoader" class="promo-code-left-section">
          {{ getFulfillmentFees.currency }}
          {{ getFulfillmentFees.total_product_value }}
        </span>
      </div>
      <div>
        <div class="promo-code-row promo-code-bold promo-code-margin-top">
          <span :class="getLoader">{{ $t("inventory.fees") }}</span>
        </div>
        <div class="promo-code-row">
          <span>
            <span :class="getLoader">
              {{ $t("inventory.fulfillmentFee") }}
            </span>
            <i
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'fees',
                })
              "
              v-if="!getLoader"
              class="mdi mdi-information"
            ></i
          ></span>
          <span :class="getLoader" class="promo-code-left-section"
            >{{ getFulfillmentFees.currency }}
            {{ getFulfillmentFees.pre_adjustments_calculated_fee }}</span
          >
        </div>
        <div class="promo-code-row promo-code-divider">
          <span :class="getLoader">{{ $t("inventory.discount") }}</span>
          <span :class="getLoader" class="promo-code-left-section"
            >{{ getFulfillmentFees.currency }}
            {{
              getFulfillmentFees.calculated_fee -
              getFulfillmentFees.pre_adjustments_calculated_fee
            }}</span
          >
        </div>
      </div>
      <div class="promo-code-row promo-code-bold promo-code-margin-top">
        <span :class="getLoader">{{ $t("inventory.amountToPay") }}</span>
        <span :class="getLoader" class="promo-code-left-section"
          >{{ getFulfillmentFees.currency }}
          {{ getFulfillmentFees.calculated_fee }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  props: ["products"],
  data() {
    return {
      currency: "KES",
      amount: 4500,
      amount2: 500,
    };
  },
  computed: {
    ...mapGetters(["getSendProductsRoute", "getLoader", "getFulfillmentFees"]),
    getRoute() {
      return this.getSendProductsRoute;
    },
    productPayload() {
      const products = [];
      this.products.forEach((row) => {
        products.push({
          product_id: row.product_id,
          product_variant_id: row.selectedOption.product_variant_id,
          quantity: row.quantity,
          currency: row.selectedOption.product_variant_currency,
          unit_price: row.selectedOption.product_variant_unit_price,
        });
      });
      return {
        order_type:
          this.$route.params.path === "customer" ? "DELIVERY" : "PICKUP",
        products,
      };
    },
  },
  mounted() {
    this.calculateFee();
  },
  methods: {
    ...mapMutations(["setOverlayStatus", "setLoader", "setFulfillmentFees"]),
    ...mapActions(["requestAxiosPost"]),
    calculateFee() {
      const userDetails = JSON.parse(localStorage.userDetails).data;
      this.setLoader("loading-text");
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${userDetails.business_id}/orders/calculate-fee`,
        values: this.productPayload,
      }).then((response) => {
        this.setLoader("");
        if (response.status === 200) {
          this.setFulfillmentFees(response.data.data);
        }
      });
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
</style>
