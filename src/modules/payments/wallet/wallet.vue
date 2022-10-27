<template>
  <div>
    <div class="wallet-banner" v-if="activeCycle">
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
    <div class="row">
      <transactions class="col-8" />
      <statistics class="col-4" />
    </div>
  </div>
</template>

<script>
import transactions from "./components/transactions.vue";
import statistics from "./components/statistics.vue";
import { mapMutations, mapActions, mapGetters } from "vuex";
import eventsMixin from "../../../mixins/events_mixin";
import moment from "moment";

export default {
  components: {
    transactions,
    statistics,
  },
  mixins: [eventsMixin],
  computed: {
    ...mapGetters([
      "getWallets",
      "getStorageUserDetails",
      "getTransactions",
      "getLoader",
      "getBillingCycles",
    ]),
    activeCycle() {
      return (
        this.getBillingCycles.length &&
        this.getBillingCycles[0].active &&
        this.getBillingCycles[0].amount_to_charge > 0
      );
    },
    activeCycleId() {
      return this.getBillingCycles[0].billing_cycle_instance_id;
    },
  },
  data() {
    return {};
  },
  mounted() {
    this.setComponent("payments.wallet");
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setBillingCycles",
      "setActivePayment",
    ]),
    ...mapActions(["requestAxiosGet"]),
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

<style>
.wallet-banner {
  margin: 35px 55px -5px 45px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  padding: 10px 20px;
}
.wallet-alert-icon {
  color: #9b101c;
  font-size: 15px;
  font-weight: 600;
  margin-right: 5px;
}
.wallet-view-more {
  float: right;
  color: #324ba8;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
}
</style>
