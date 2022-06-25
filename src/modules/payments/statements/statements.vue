<template>
  <div>
    <make-payment v-if="prompt" />
    <div class="statements-top-bar-container">
      <div>
        <p class="statements-top-bar-description">
          <span>
            <i class="mdi mdi-cash-multiple statements-top-bar-cash-icon"></i>
          </span>
          <span :class="getLoader">
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
      <div />
      <div :class="getLoader">
        <span>
          {{ $t("payments.billingCycle") }}:
          {{
            activeCycle.cycle_interval_type
              ? activeCycle.cycle_interval_type
              : $t("payments.none")
          }}
        </span>
      </div>
    </div>
    <div class="container-border">
      <statement-list />
    </div>
  </div>
</template>

<script>
import makePayment from "./components/makePayment.vue";
import statementList from "./components/statementList.vue";
import { mapMutations, mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  components: { makePayment, statementList },
  computed: {
    ...mapGetters([
      "getLoader",
      "getStorageUserDetails",
      "getBusinessDetails",
      "getBillingCycles",
    ]),
    activeCycle() {
      let active = {};
      this.getBillingCycles.forEach((row) => {
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
      prompt: false,
    };
  },
  mounted() {
    this.setComponent(this.$t("common.billings"));
    this.listBillingCycles();
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setBillingCycles",
    ]),
    ...mapActions(["requestAxiosGet"]),
    listBillingCycles() {
      this.setLoader("loading-text");
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles`,
      }).then((response) => {
        if (response.status === 200) {
          this.setBillingCycles(response.data.data.billing_cycles);
          if (this.$route.path === "/payments/billings") {
            this.setLoader("");
          }
        }
      });
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
</style>
