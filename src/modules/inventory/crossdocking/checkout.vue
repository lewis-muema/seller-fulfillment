<template>
  <div class="send-inventory-checkout-container">
    <v-row>
      <v-col cols="7">
        <delivery-checkout class="mt-5" />
      </v-col>
      <v-col cols="4">
        <total-amount class="mt-5" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import deliveryCheckout from "./components/deliveryCheckout.vue";
import TotalAmount from "./components/totalAmount.vue";
export default {
  components: {
    deliveryCheckout,
    TotalAmount,
  },
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
