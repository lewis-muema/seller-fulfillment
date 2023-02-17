<template>
  <div v-if="activeCycle" class="wallet-banner">
    <i class="mdi mdi-alert-circle-outline wallet-alert-icon"></i>
    {{
      $t("payments.fulfillmentFeesWillBeCharged", {
        Amount: billInfo("amount"),
        Date: billInfo("date"),
      })
    }}
    <span
      class="wallet-view-more"
      @click="
        $router.push(`/payments/deliveries-pending-payment/${activeCycleId}`)
      "
      >{{ $t("payments.viewMore") }}</span
    >
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  computed: {
    ...mapGetters(["getBillingCycles", "getWallets"]),
    activeCycleId() {
      return this.getBillingCycles[0].billing_cycle_instance_id;
    },
    activeCycle() {
      return (
        this.getBillingCycles.length &&
        this.getBillingCycles[0].active &&
        this.getBillingCycles[0].amount_to_charge > 0
      );
    },
  },
  methods: {
    billInfo(type) {
      const cycle =
        this.getBillingCycles.length && this.getBillingCycles[0].active > 0
          ? this.getBillingCycles[0]
          : "";
      return type === "date"
        ? moment(cycle.billing_cycle_end_date).format("dddd, Do MMM")
        : `${this.getWallets[0].currency} ${cycle.amount_to_charge}`;
    },
  },
};
</script>
