<template>
  <div class="" v-if="getRoute === 'ProductsToCustomer'">
    <div class="promo-code-text">
      <router-link to="/">{{ $t("inventory.applyPromoCode") }}</router-link>
    </div>

    <v-list-item>
      <v-list-item-header class="d-flex total-amount-content">
        <v-list-item-title>{{ $t("inventory.totalValue") }}</v-list-item-title>
        <v-list-item-title>KES 4500</v-list-item-title>
      </v-list-item-header>
    </v-list-item>
    <hr />
    <v-list-item>
      <v-list-item-header class="d-flex total-amount-content">
        <v-list-item-title>{{
          $t("inventory.fulfillmentFee")
        }}</v-list-item-title>
        <v-list-item-title>KES 500</v-list-item-title>
      </v-list-item-header>
    </v-list-item>
    <hr />
    <v-list-item>
      <v-list-item-header class="d-flex total-amount-content">
        <v-list-item-title>{{ $t("inventory.amountToPay") }}</v-list-item-title>
        <v-list-item-title>KES 500</v-list-item-title>
      </v-list-item-header>
    </v-list-item>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getSendProductsRoute"]),
    getRoute() {
      return this.getSendProductsRoute;
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
</style>
