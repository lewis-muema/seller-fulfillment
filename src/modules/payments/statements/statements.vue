<template>
  <div>
    <make-payment class="statements-payment-banner" v-if="prompt" />
    <div class="statements-top-bar-container">
      <div>
        <div v-if="activeCycle.active">
          <p class="statements-top-bar-description">
            <span>
              <i class="mdi mdi-cash-multiple statements-top-bar-cash-icon"></i>
            </span>
            <span :class="getLoader.billingCycles">
              <b
                >{{ getBusinessDetails.currency }}
                {{
                  activeCycle.billable_amount ? activeCycle.billable_amount : 0
                }}</b
              >
              {{ $t("payments.youWillBeCharged") }} {{ activeCycleTime }}
            </span>
          </p>
        </div>
      </div>
      <div />
      <div>
        <p class="mt-1">
          <span :class="getLoader.billingCycles">
            {{ $t("payments.billingCycle") }}:
            {{
              activeCycle.cycle_interval_type
                ? activeCycle.cycle_interval_type
                : $t("payments.none")
            }}
          </span>
        </p>
      </div>
    </div>
    <div class="container-border">
      <statement-list :activeCycle="activeCycle" @range="rangeChanged" />
    </div>
  </div>
</template>

<script>
import makePayment from "./components/makePayment.vue";
import statementList from "./components/statementList.vue";
import { mapMutations, mapGetters, mapActions } from "vuex";
import eventsMixin from "../../../mixins/events_mixin";
import moment from "moment";

export default {
  components: { makePayment, statementList },
  mixins: [eventsMixin],
  computed: {
    ...mapGetters([
      "getLoader",
      "getStorageUserDetails",
      "getBusinessDetails",
      "getBillingCycles",
      "getActivePayment",
    ]),
    limitParams() {
      return `?lower_limit_date=${moment(this.range[0]).format(
        "YYYY-MM-DD"
      )}&upper_limit_date=${moment(this.range[1]).format("YYYY-MM-DD")}`;
    },
    prompt() {
      const cycle = this.getActivePayment ? this.getActivePayment : {};
      return Object.keys(cycle).length > 0;
    },
    activeCycle() {
      let active = {};
      this.activeBillingCycle.forEach((row) => {
        if (row.active) {
          active = row;
        }
      });
      return active;
    },
    activeCycleTime() {
      return moment(this.activeCycle.billing_cycle_end_date).fromNow();
    },
  },
  data() {
    return {
      orders: "3",
      amount: "KES 750",
      billingCycle: "Daily",
      params: "",
      range: "",
      activeBillingCycle: [],
    };
  },
  mounted() {
    this.setComponent("common.billings");
    this.listBillingCycles();
    this.getActiveCycle();
    this.sendSegmentEvents({
      event: "Select Transaction History",
      data: {
        userId: this.getStorageUserDetails.business_id,
        clientType: "web",
        device: "desktop",
      },
    });
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
    listBillingCycles() {
      this.setLoader({
        type: "billingCycles",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles${this.params}`,
      }).then((response) => {
        if (response.status === 200) {
          this.setBillingCycles(response.data.data.billing_cycles);
          if (this.activeBillingCycle.length === 0) {
            this.activeBillingCycle = this.getBillingCycles;
          }
          if (this.$route.path === "/payments/billings") {
            this.setLoader({
              type: "billingCycles",
              value: "",
            });
          }
        }
      });
    },
    rangeChanged(val) {
      if (val) {
        this.range = val;
        this.params = this.limitParams;
      } else {
        this.params = "";
      }
      this.listBillingCycles();
    },
  },
};
</script>

<style>
.statements-top-bar-container {
  display: grid;
  grid-template-columns: 70% 15% 15%;
  margin: 50px 30px;
}
.statements-top-bar-description {
  font-size: 16px;
}
.statements-info-bar-container {
  display: grid;
  grid-template-columns: 15% 15% 5% 65%;
}
.statements-payment-banner {
  max-width: 100% !important;
  margin-left: 30px;
}
</style>
