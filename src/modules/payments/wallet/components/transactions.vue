<template>
  <div>
    <div class="transactions-container">
      <div class="transactions-top">
        <p class="transactions-top-title">
          {{ $t("payments.accountBalance") }}
        </p>
        <p class="product-select-product-column mb-2">
          <span class="transactions-top-currency">
            {{ getWallets[0].currency }}
          </span>
          <span class="transactions-top-amount">
            {{ getWallets[0].wallet_balance }}
          </span>
        </p>
        <button
          class="btn btn-primary mt-2 btn-long submit-order-btn transactions-top-withdraw"
          @click="$router.push('/payments/withdraw')"
          v-if="canWithdraw"
        >
          {{ $t("payments.withdrawCash") }}
        </button>
      </div>
      <div>
        <div class="row m-4">
          <div class="col-8 transactions-top-recent-title">
            {{ $t("payments.recentTransactions") }}
          </div>
          <div class="col-4">
            <span
              class="transactions-top-see-all-title"
              v-if="!seeAll"
              @click="seeAll = !seeAll"
              >{{ $t("payments.seeAll") }}</span
            >
            <span
              class="transactions-top-see-all-title"
              v-else
              @click="seeAll = !seeAll"
              >{{ $t("payments.seeLess") }}</span
            >
          </div>
        </div>
        <div class="m-4 mt-3" v-if="transactions.length">
          <div
            class="transactions-top-recent-list"
            v-for="(transaction, i) in transactions"
            :key="i"
            @click="showTransaction(transaction)"
          >
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
    };
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
    ]),
    transactions() {
      return this.getTransactions.slice(
        0,
        this.seeAll ? this.getTransactions.length : 5
      );
    },
    withdrawalsEnabledFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.withdrawals_enabled
        : false;
    },
    canWithdraw() {
      let status = false;
      this.getUserDetails.user_access_permissions.forEach((row) => {
        if (
          row.permission_id === "CAN_WITHDRAW_EARNINGS" &&
          row.permission_granted
        ) {
          status = true;
        }
      });
      return status && this.withdrawalsEnabledFlag;
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
        endpoint: `seller/${this.getStorageUserDetails.business_id}/transactions`,
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
.transactions-container {
  margin: 45px 10px 45px 40px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
}
.transactions-top {
  background: #f0f3f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4%;
  border-bottom: 1px solid #e2e7ed;
}
.transactions-top-title {
  font-size: 17px;
  color: #606266;
  margin-bottom: 10px;
  font-weight: 500;
  margin-top: 10px;
}
.transactions-top-currency {
  font-size: 14px;
  color: #303133;
  margin-right: 10px;
}
.transactions-top-amount {
  font-size: 25px;
  font-weight: 600;
}
.transactions-top-withdraw {
  width: 40%;
  font-weight: 500;
}
.transactions-top-recent-title {
  font-weight: 500;
  font-size: 18px;
}
.transactions-top-see-all-title {
  float: right;
  font-weight: 500;
  font-size: 17px;
  cursor: pointer;
  color: #324ba8;
}
.transactions-top-recent-list-right {
  float: right;
  display: flex;
}
.transactions-top-recent-arrow {
  color: #909399;
  cursor: pointer;
  font-size: 20px;
  margin-left: 5px;
}
.transactions-top-recent-date {
  margin-right: 25px;
}
.transactions-top-recent-list {
  text-align: left;
  margin: 20px 15px;
  cursor: pointer;
}
.transactions-top-recent-list-bottom-row {
  color: #606266;
  font-size: 14px;
  height: 20px;
}
.transactions-top-recent-list-top {
  margin-bottom: 7px;
}
</style>
