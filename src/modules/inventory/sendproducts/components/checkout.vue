<template>
  <div class="send-inventory-checkout-container">
    <v-row>
      <v-col cols="7">
        <pickup-checkout v-if="$route.params.path === 'sendy'" />
        <delivery-checkout v-if="$route.params.path === 'customer'" />
      </v-col>
      <v-col cols="4">
        <products-summary />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pickupCheckout from "@/modules/inventory/sendproducts/components/pickupCheckout";
import deliveryCheckout from "@/modules/inventory/sendproducts/components/deliveryCheckout";
import productsSummary from "./productsSummary";
export default {
  components: { productsSummary, pickupCheckout, deliveryCheckout },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getSendProductsRoute"]),
    getRoute() {
      return this.getSendProductsRoute;
    },
  },
};
</script>

<style>
.send-inventory-checkout-container {
  padding: 0px 50px;
}
</style>
