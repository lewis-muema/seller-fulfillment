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
        <span>
          {{ $t("inventory.totalValue") }}
        </span>
        <span class="promo-code-left-section">
          {{ currency }} {{ amount }}
        </span>
      </div>
      <div>
        <div class="promo-code-row promo-code-bold promo-code-margin-top">
          {{ $t("inventory.fees") }}
        </div>
        <div class="promo-code-row">
          <span
            >{{ $t("inventory.fulfillmentFee") }}
            <i
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'fees',
                })
              "
              class="mdi mdi-information"
            ></i
          ></span>
          <span class="promo-code-left-section"
            >{{ currency }} {{ amount2 }}</span
          >
        </div>
        <div class="promo-code-row promo-code-divider">
          <span>{{ $t("inventory.discount") }}</span>
          <span class="promo-code-left-section"
            >{{ currency }} {{ amount2 }}</span
          >
        </div>
      </div>
      <div class="promo-code-row promo-code-bold promo-code-margin-top">
        <span>{{ $t("inventory.amountToPay") }}</span>
        <span class="promo-code-left-section"
          >{{ currency }} {{ amount2 }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      currency: "KES",
      amount: 4500,
      amount2: 500,
    };
  },
  computed: {
    ...mapGetters(["getSendProductsRoute"]),
    getRoute() {
      return this.getSendProductsRoute;
    },
  },
  methods: {
    ...mapMutations(["setOverlayStatus"]),
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
