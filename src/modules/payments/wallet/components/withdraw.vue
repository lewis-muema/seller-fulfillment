<template>
  <div>
    <div class="withdraw-container">
      <i
        class="mdi mdi-arrow-left dpp-top-back"
        aria-hidden="true"
        @click="$router.back()"
      ></i>
      <p class="withdraw-title">{{ $t("payments.withdrawCash") }}</p>
      <p class="withdraw-balance-title">
        {{
          $t("payments.balance", {
            Amount: `${getWallets[0].currency} ${getWallets[0].wallet_balance}`,
          })
        }}
      </p>
      <div>
        <div class="withdraw-input-label">
          {{ $t("payments.enterAmount") }}
        </div>
        <v-text-field
          :label="`${getWallets[0].currency} ${getWallets[0].wallet_maximum_withdraw_amount}`"
          v-model="amount"
          type="number"
          variant="outlined"
          :prefix="getWallets[0].currency"
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
        <div
          v-if="v$.amount.$error"
          class="error-msg withdraw-transaction-error"
        >
          {{ $t("payments.amountIsRequired") }}
        </div>
        <div
          v-if="amount > getWallets[0].wallet_maximum_withdraw_amount"
          class="error-msg withdraw-transaction-error"
        >
          {{ $t("payments.youHaveInsufficientFunds") }}
        </div>
        <div class="withdraw-transaction-fees">
          {{
            $t("payments.transactionFees", {
              Amount: `${getWallets[0].currency} ${getWallets[0].wallet_withdraw_fees}`,
            })
          }}
        </div>
      </div>
      <div>
        <button
          :disabled="amount > getWallets[0].wallet_maximum_withdraw_amount"
          class="btn btn-primary mt-2 btn-long submit-order-btn withdraw-continue"
          @click="withdraw()"
        >
          {{ $t("auth.continue") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      amount: "",
    };
  },
  validations() {
    return {
      amount: { required },
    };
  },
  computed: {
    ...mapGetters([
      "getWallets",
      "getStatisticsStats",
      "getStorageUserDetails",
      "getBusinessDetails",
      "getUserDetails",
    ]),
  },
  mounted() {
    this.setComponent("payments.wallet");
    this.getUserWallets();
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations(["setStatisticsStats", "setWallets", "setComponent"]),
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
    withdraw() {
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
      const buPayload = {
        user_id: this.getBusinessDetails.business_id,
        entity_id: 6,
        currency: this.getBusinessDetails.currency,
        country_code: this.getBusinessDetails.country_code,
        amount: this.amount,
        success_callback_url: "",
        fail_callback_url: "",
        txref: "",
        bulk: false,
        paybill_no: "",
        email: this.getUserDetails.email,
        authToken: localStorage.accessToken,
        firstname: this.getUserDetails.first_name,
        lastname: this.getUserDetails.last_name,
        payment_options: "",
        company_code: this.getBusinessDetails.company_code,
        locale: this.getBusinessDetails.language,
        pay_direction: "PAY_OUT",
      };

      this.$paymentInit(buPayload, "withdraw-checkout");
    },
  },
};
</script>

<style>
.withdraw-container {
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  padding: 20px;
  background: white;
  width: 40%;
  margin: auto;
  margin-top: 100px;
}
.withdraw-title {
  font-weight: 500;
  font-size: 25px;
  margin-bottom: 5px;
}
.withdraw-balance-title {
  color: #606266;
  font-weight: 500;
}
.withdraw-line-items {
  font-size: 15px;
}
.withdraw-line-items-right {
  float: right;
}
.withdraw-items {
  cursor: pointer;
}
.withdraw-pending-badge {
  background: #fbdecf;
  padding: 0px 15px;
  border-radius: 15px;
  color: #9b101c;
  margin-right: 10px;
}
.withdraw-input-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}
.withdraw-transaction-fees {
  color: #909399;
  font-size: 16px;
  font-weight: 100;
  margin-top: -25px;
  margin-bottom: 50px;
}
.withdraw-transaction-error {
  margin-top: -25px;
  margin-bottom: 30px;
  font-weight: 500;
}
.withdraw-continue {
  width: 100%;
}
</style>
