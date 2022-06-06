<template>
  <div class="send-inventory-checkout-container">
    <v-row>
      <v-col cols="7">
        <pickup-checkout v-if="getRoute === 'ProductsToSendy'" />
        <delivery-checkout v-if="getRoute === 'ProductsToCustomer'" />
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
    return {
      sendyPhoneProps: {
        mode: "international",
        defaultCountry: "ke",
        preferredCountries: ["ke", "ug", "tz"],
      },
    };
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
