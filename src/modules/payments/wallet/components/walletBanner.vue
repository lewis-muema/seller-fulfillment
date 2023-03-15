<template>
  <div v-if="getBillingCycles[0]?.active" class="wallet-banner">
    <span :class="getLoader.billingCycle">
      <i
        class="mdi mdi-alert-circle-outline wallet-alert-icon"
        :class="getLoader.billingCycle"
      ></i>
      {{
        $t("payments.fulfillmentFeesWillBeCharged", {
          Amount: billInfo("amount"),
          Date: billInfo("date"),
        })
      }}
    </span>
    <span
      :class="getLoader.billingCycle"
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
    ...mapGetters(["getBillingCycles", "getWallets", "getLoader"]),
    activeCycleId() {
      return this.getBillingCycles[0].billing_cycle_instance_id;
    },
  },
  methods: {
    billInfo(type) {
      const cycle =
        this.getBillingCycles?.length &&
        this.getBillingCycles[0]?.active &&
        this.getBillingCycles[0]?.amount_to_charge > 0
          ? this.getBillingCycles[0]
          : "";
      return type === "date"
        ? moment(cycle.billing_cycle_end_date).format("dddd, Do MMM")
        : `${this.getWallets[0].currency} ${cycle.amount_to_charge}`;
    },
  },
};
</script>
