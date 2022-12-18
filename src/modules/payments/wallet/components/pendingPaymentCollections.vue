<template>
  <div class="ppc-container">
    <div class="ppc-top">
      <i
        class="mdi mdi-arrow-left ppc-top-back"
        aria-hidden="true"
        @click="$router.back()"
      ></i>
      <p class="ppc-top-amount">
        {{ getStatisticsStats.currency }}
        {{ getStatisticsStats.transaction_type_total_value }}
      </p>
      <p>
        <span class="ppc-top-charged">{{
          $t("payments.totalAmountToBeCollected")
        }}</span>
      </p>
    </div>
    <div class="ppc-top-deliveries">
      {{ $t("common.deliveries") }}
    </div>
    <div v-if="getTransactions.length">
      <div
        v-for="(transaction, i) in getTransactions"
        :key="i"
        class="ppc-top-row"
      >
        <div @click="showTransaction(transaction)">
          <p class="ppc-top-recent-list-top">
            <span class="" :class="getLoader.transactions">{{
              transaction.transaction_description
            }}</span>
            <span class="ppc-top-recent-list-right">
              <span :class="getLoader.transactions">
                {{ getSignMapping[transaction.transaction_type] }}
                {{ transaction.transaction_currency }}
                {{ transaction.transaction_amount }}
              </span>
              <i class="mdi mdi-chevron-right ppc-top-recent-arrow"></i>
            </span>
          </p>
          <div class="mb-3">
            <span :class="`cpp-pending-status`">
              {{ $t("deliveries.pending") }}
            </span>
          </div>
        </div>
        <hr v-if="i < getTransactions.length - 1" />
      </div>
    </div>
    <div class="deliveries-empty" v-else>
      <div>
        <img
          src="https://images.sendyit.com/fulfilment/seller/track.png"
          alt=""
          class="deliveries-empty-img"
        />
      </div>
      <p class="statements-empty-title">
        {{ $t("payments.noTransactionsYet") }}
      </p>
      <p class="statements-empty-label">
        {{ $t("payments.trackTransactionsOnly") }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import moment from "moment";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "getWallets",
      "getStorageUserDetails",
      "getTransactions",
      "getLoader",
      "getBillingCycles",
      "getCycleLineItems",
      "getBillingCycle",
      "getBusinessDetails",
      "getStatisticsStats",
      "getTransactions",
      "getSignMapping",
    ]),
  },
  mounted() {
    this.setComponent("payments.pendingPaymentCollections");
    this.setTransactions(this.getTransactions.slice(0, 3));
    this.getTransactionStats();
    this.getUserTransactions();
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations([
      "setWallets",
      "setTransactions",
      "setLoader",
      "setBillingCycles",
      "setComponent",
      "setCycleLineItems",
      "setBillingCycle",
      "setStatisticsStats",
      "setTransactions",
      "setActiveTransaction",
    ]),
    timeFormat(date) {
      return moment(date).format("h:mm A");
    },
    showTransaction(transaction) {
      this.setActiveTransaction(transaction);
      this.$router.push(`/payments/transaction-details`);
    },
    formatDate(date) {
      return moment(date).format("Do MMM, YYYY");
    },
    formatLongDate(date) {
      return moment(date).format("ddd, Do MMM YYYY");
    },
    getTransactionStats() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/transactions/statistics?transaction_type=UPCOMING_EARNING_FROM_SALE_OF_GOOD`,
      }).then((response) => {
        if (response.status === 200) {
          this.setStatisticsStats(response.data.data.transaction_statistic);
        }
      });
    },
    getUserTransactions() {
      this.setLoader({
        type: "transactions",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/transactions?transaction_type=UPCOMING_EARNING_FROM_SALE_OF_GOOD`,
      }).then((response) => {
        this.setLoader({
          type: "transactions",
          value: "",
        });
        if (response.status === 200) {
          this.setTransactions(response.data.data.transactions);
        } else {
          this.setTransactions([]);
        }
      });
    },
  },
};
</script>

<style>
.ppc-container {
  margin: 45px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  background: white;
}
.ppc-top {
  padding: 20px 40px;
}
.ppc-top-back {
  font-size: 25px;
}
.ppc-top-amount {
  font-size: 25px;
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 0px;
}
.ppc-top-deliveries {
  margin: 0px 40px;
  font-size: 15px;
}
.ppc-top-charged {
  font-size: 15px;
  color: #909399;
}
.ppc-top-billing-cycle {
  float: right;
}
.ppc-top-recent-title {
  font-weight: 500;
  font-size: 18px;
}
.ppc-top-see-all-title {
  float: right;
  font-weight: 500;
  font-size: 17px;
  cursor: pointer;
  color: #324ba8;
}
.ppc-top-recent-list-right {
  float: right;
  display: flex;
}
.ppc-top-recent-arrow {
  color: #909399;
  cursor: pointer;
  font-size: 20px;
  margin-left: 5px;
}
.ppc-top-recent-date {
  margin-right: 25px;
}
.ppc-top-recent-list {
  text-align: left;
  margin: 20px 15px;
}
.ppc-top-recent-list-bottom-row {
  color: #606266;
  font-size: 14px;
}
.ppc-top-recent-list-top {
  margin-bottom: 20px;
}
.ppc-top-row {
  margin: 20px 40px;
}
.ppc-top-row-date {
  font-size: 13px;
  color: #606266;
  margin-bottom: 20px;
}
.cpp-pending-status {
  background: #fbdf9a;
  padding: 2px 20px;
  border-radius: 10px;
  color: #7f3b02;
}
</style>
