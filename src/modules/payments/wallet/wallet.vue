<template>
  <div>
    <make-payment class="statements-payment-banner wallet-banner-override" />
    <div>
      <wallet-banner />
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
import makePayment from "../statements/components/makePayment.vue";
import walletBanner from "../wallet/components/walletBanner.vue";

import { mapMutations, mapActions, mapGetters } from "vuex";
import eventsMixin from "../../../mixins/events_mixin";
import moment from "moment";

export default {
  components: {
    transactions,
    statistics,
    makePayment,
    walletBanner,
  },
  mixins: [eventsMixin],
  computed: {
    ...mapGetters([
      "getWallets",
      "getStorageUserDetails",
      "getTransactions",
      "getLoader",
      "getBillingCycles",
      "getActivePayment",
    ]),
  },
  data() {
    return {};
  },
  mounted() {
    this.setComponent("payments.wallet");
    this.getActiveCycle();
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
.wallet-banner-override {
  margin-left: 40px;
}
</style>
