<template>
  <div
    :class="
      currentCycle ? 'transaction-page-container' : 'transaction-page-top'
    "
  >
    <div class="row transaction-list-top" v-if="getBillingCycles[0]?.active">
      <div class="col-4 billing-cycle-desc">
        <p :class="getLoader.billingCycle">{{ $t("payments.billingCycle") }}</p>
        <p class="billing-cycle-text" :class="getLoader.billingCycle">
          {{ billInfo("cycleType") }}
        </p>
      </div>
      <div class="col-4 billing-cycle-desc">
        <p :class="getLoader.billingCycle">
          {{ $t("payments.currentBillingCycle") }}
        </p>
        <p class="billing-cycle-text" :class="getLoader.billingCycle">
          {{ billInfo("startDate") }} - {{ billInfo("endDate") }}
        </p>
        <span
          class="billing-cycle-view"
          @click="viewBillingCycle"
          :class="getLoader.billingCycle"
        >
          <i class="mdi mdi-eye" :class="getLoader.billingCycle"></i>
          {{ $t("payments.view") }}
        </span>
      </div>
      <div class="col-4 billing-cycle-desc">
        <p :class="getLoader.billingCycle">
          {{ $t("payments.accruedAmount") }}
        </p>
        <p class="billing-cycle-text" :class="getLoader.billingCycle">
          KES {{ billInfo("accruedAmount") }}
        </p>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-3">
        <el-select
          class="mb-6 business-details-industry transaction-page-select"
          :disabled="getLoader.transactions !== ''"
          id="industry"
          v-model="transactionType"
          :placeholder="$t('payments.filter')"
        >
          <el-option
            v-for="transaction in getTransactionTypes"
            :key="transaction.value"
            :label="$t(transaction.name)"
            :value="transaction.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="col-5">
        <div class="transaction-info-bar-download">
          <div class="transaction-info-export">
            <div class="transaction-export-button" @click="triggerExport()">
              <span>
                <i class="mdi mdi-export-variant export-icon"></i>
              </span>
              <span>
                {{ $t("common.export") }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <el-date-picker
          class="deliveries-date-picker transaction-page-date-range"
          id="range"
          v-model="range"
          type="daterange"
          :start-placeholder="$t('deliveries.startDate')"
          :end-placeholder="$t('deliveries.endDate')"
        />
      </div>
    </div>
    <div
      class="m-4 mt-3 transactions-top-recent-list-container scroll-y"
      v-if="transactions.length"
    >
      <div
        class="transactions-top-recent-list"
        v-for="(transaction, i) in transactions"
        :key="i"
        @click="showTransaction(transaction)"
      >
        <div class="dpp-top-row-date mt-5" v-if="transaction.show_date">
          <span class="" :class="getLoader.transactions">
            {{ formatLongDate(transaction.date_created) }}
          </span>
        </div>
        <p class="transactions-top-recent-list-top">
          <span class="" :class="getLoader.transactions">{{
            transaction.transaction_description
          }}</span>
          <span class="transactions-top-recent-list-right">
            <span :class="getLoader.transactions">
              {{ getSignMapping[transaction.transaction_type] }}
              {{ transaction.transaction_currency }}
              {{ transaction.transaction_amount }}
            </span>
            <i class="mdi mdi-chevron-right transactions-top-recent-arrow"></i>
          </span>
        </p>
        <p class="transactions-top-recent-list-bottom-row">
          <span
            class="statements-expansion-title-amount"
            :class="getLoader.transactions"
          >
            {{ transaction.transaction_subtitle }}
          </span>
          <span
            v-if="
              [
                'UPCOMING_EARNING_FROM_SALE_OF_GOOD',
                'EARNING_FROM_SALE_OF_GOOD',
              ].includes(transaction.transaction_type) &&
              getLoader.transactions === ''
            "
            class="transactions-top-recent-list-right"
          >
            <span
              class="transaction-pending-badge"
              v-if="
                transaction.transaction_type ===
                'UPCOMING_EARNING_FROM_SALE_OF_GOOD'
              "
              >{{ $t("deliveries.pending") }}</span
            >
            <span
              class="transaction-paid-badge"
              v-if="
                transaction.transaction_type === 'EARNING_FROM_SALE_OF_GOOD'
              "
              >{{ $t("deliveries.completed") }}</span
            >
          </span>
          <span
            v-else
            class="transactions-top-recent-list-right transactions-top-recent-date"
            :class="getLoader.transactions"
          >
            {{ timeFormat(transaction.date_created) }}
          </span>
        </p>
        <hr v-if="i < transactions.length - 1" />
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
import eventsMixin from "../../../../mixins/events_mixin";
import moment from "moment";

export default {
  data() {
    return {
      seeAll: false,
      range: "",
      transactionType: "",
    };
  },
  watch: {
    range() {
      this.getUserTransactions();
    },
    transactionType() {
      this.getUserTransactions();
    },
  },
  mixins: [eventsMixin],
  computed: {
    ...mapGetters([
      "getWallets",
      "getStorageUserDetails",
      "getTransactions",
      "getLoader",
      "getBillingCycles",
      "getSignMapping",
      "getBusinessDetails",
      "getUserDetails",
      "getActiveTransaction",
      "getTransactionTypes",
    ]),
    params() {
      let params = "";
      const type =
        this.transactionType === "ALL"
          ? ""
          : `transaction_type=${this.transactionType}`;
      if (this.range && !this.transactionType) {
        params = `?lower_limit_date=${moment(this.range[0]).format(
          "YYYY-MM-DD"
        )}&upper_limit_date=${moment(this.range[1]).format("YYYY-MM-DD")}`;
      } else if (this.transactionType && !this.range) {
        params = `?${type}`;
        // eslint-disable-next-line no-dupe-else-if
      } else if (this.range && this.transactionType) {
        params = `?lower_limit_date=${moment(this.range[0]).format(
          "YYYY-MM-DD"
        )}&upper_limit_date=${moment(this.range[1]).format("YYYY-MM-DD")}${
          type ? "&" : ""
        }${type}`;
      }
      return params;
    },
    transactions() {
      const transactions = [];
      let firstDate = "";
      this.getTransactions.forEach((row) => {
        if (
          firstDate === "" ||
          firstDate !== this.formatLongDate(row.date_created)
        ) {
          firstDate = this.formatLongDate(row.date_created);
          row.show_date = true;
        }
        transactions.push(row);
      });
      return transactions;
    },
    currentCycle() {
      return (
        this.getBillingCycles.length &&
        this.getBillingCycles[0].active &&
        this.getBillingCycles[0].amount_to_charge > 0
      );
    },
  },
  mounted() {
    this.getUserWallets();
    this.getUserTransactions();
    this.allBillingCycle();
    this.sendSegmentEvents({
      event: "Select_Transaction_History",
      data: {
        userId: this.getStorageUserDetails.business_id,
        clientType: "web",
        device: "desktop",
      },
    });
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations([
      "setWallets",
      "setTransactions",
      "setLoader",
      "setBillingCycles",
      "setActiveTransaction",
      "setExportDataType",
      "setOverlayStatus",
    ]),
    triggerExport() {
      this.setOverlayStatus({
        overlay: true,
        popup: "export",
      });
      this.setExportDataType("BUSINESS_TRANSACTION");
    },
    timeFormat(date) {
      return moment(date).format("h:mm A, Do MMM");
    },
    formatLongDate(date) {
      return moment(date).format("ddd, Do MMM YYYY");
    },
    showTransaction(transaction) {
      this.setActiveTransaction(transaction);
      this.$router.push(`/payments/transaction-details`);
    },
    getUserWallets() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/wallets`,
      }).then((response) => {
        if (response.status === 200) {
          this.setWallets(response.data.data.wallets);
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
        endpoint: `seller/${this.getStorageUserDetails.business_id}/transactions${this.params}`,
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
    allBillingCycle() {
      this.setLoader({
        type: "billingCycle",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles`,
      }).then((response) => {
        if (response.status === 200) {
          this.setLoader({
            type: "billingCycle",
            value: "",
          });
          this.setBillingCycles(response.data.data.billing_cycles);
        }
      });
    },
    viewBillingCycle() {
      this.$router.push("/payments/statements");
    },
    billInfo(type) {
      let results = "";
      const cycle = this.currentCycle ? this.getBillingCycles[0] : "";
      if (type === "startDate") {
        results = moment(cycle.billing_cycle_start_date).format("Do MMM");
      }
      if (type === "endDate") {
        results = moment(cycle.billing_cycle_end_date).format("Do MMM");
      }
      if (type === "cycleType") {
        results =
          cycle.cycle_interval_type?.charAt(0).toUpperCase() +
          cycle.cycle_interval_type?.slice(1).toLowerCase();
      }
      if (type === "accruedAmount") {
        results = cycle.amount_to_charge;
      }
      return results;
    },
  },
};
</script>

<style>
.transaction-page-container {
  margin: 45px 10px 45px 40px !important;
  background: white;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  padding-bottom: 20px;
}
.transaction-page-top {
  margin: 45px 10px 45px 40px !important;
  background: white;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  padding: 20px 0px;
}
.transaction-page-select {
  margin: 5px 20px;
}
.transaction-page-date-range {
  float: right;
  margin: 5px 20px;
}
.transaction-list-top {
  background: #f0f3f7;
  padding: 20px;
  border-bottom: 1px solid #e2e7ed;
  margin-bottom: 20px;
}
.billing-cycle-text {
  font-weight: 500;
}
.billing-cycle-desc > p {
  margin-bottom: 10px !important;
}
.billing-cycle-view {
  color: #324ba8;
  cursor: pointer;
}
.transaction-export-button {
  margin: 10px 0px 0px 100px;
  color: #324ba8;
  cursor: pointer;
}
.scroll-y {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 600px;
}
</style>
