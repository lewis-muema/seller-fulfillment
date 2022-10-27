<template>
  <div class="transaction-page-container">
    <div class="row mb-5">
      <div class="col-2">
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
      <div class="col-6"></div>
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
    <div class="m-4 mt-3" v-if="transactions.length">
      <div
        class="transactions-top-recent-list"
        v-for="(transaction, i) in transactions"
        :key="i"
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
            <i
              class="mdi mdi-chevron-right transactions-top-recent-arrow"
              @click="showTransaction(transaction)"
            ></i>
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
                'WITHDRAWAL_OF_EARNING',
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
  },
  mounted() {
    this.getUserWallets();
    this.getUserTransactions();
    this.allBillingCycle();
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations([
      "setWallets",
      "setTransactions",
      "setLoader",
      "setBillingCycles",
      "setActiveTransaction",
    ]),
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
        } else {
          this.setWallets([]);
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
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles`,
      }).then((response) => {
        if (response.status === 200) {
          this.setBillingCycles(response.data.data.billing_cycles);
        }
      });
    },
  },
};
</script>

<style>
.transaction-page-container {
  margin: 40px;
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
</style>
