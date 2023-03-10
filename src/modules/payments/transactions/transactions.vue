<template>
  <div>
    <make-payment class="statements-payment-banner wallet-banner-override" />
    <div class="row">
      <tranactionsList class="col-7" />
      <transcationActions class="col-4" />
    </div>
  </div>
</template>

<script>
import tranactionsList from "./components/transactionsList.vue";
import transcationActions from "./components/transactionActions.vue";
import makePayment from "../statements/components/makePayment.vue";
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
  components: {
    tranactionsList,
    makePayment,
    transcationActions,
  },
  mounted() {
    this.setComponent("payments.transactions");
    this.getActiveCycle();
  },
  computed: {
    ...mapGetters(["getStorageUserDetails"]),
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations(["setComponent", "setLoader", "setActivePayment"]),
    getActiveCycle() {
      this.setLoader({
        type: "pendingPayment",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/paymentrequired`,
      }).then((response) => {
        this.setLoader({
          type: "pendingPayment",
          value: "",
        });
        if (response.status === 200) {
          this.setActivePayment(response.data.data);
        } else {
          this.setActivePayment({});
        }
      });
    },
  },
};
</script>

<style></style>
