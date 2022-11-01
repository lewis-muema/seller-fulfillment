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
        <p class="withdraw-input-label">
          {{ $t("payments.selectWithdrawalMethod") }}
        </p>
        <div v-if="getWithDrawalMethods.length > 0">
          <el-radio-group
            v-model="paymentMethod"
            class="withdraw-transaction-methods-radio-group"
          >
            <div v-for="(method, i) in getWithDrawalMethods" :key="i">
              <el-radio :label="i" size="large">
                <div class="withdraw-transaction-methods">
                  <img
                    :src="`https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons/${method.pay_method_name.toLowerCase()}.svg`"
                    alt=""
                    class="m-3"
                  />
                  <div>
                    <div class="withdraw-transaction-methods-top">
                      {{ method.pay_method_name }}
                    </div>
                    <div class="withdraw-transaction-methods-bottom">
                      {{ method.pay_method_details }}
                    </div>
                  </div>
                </div>
              </el-radio>
            </div>
          </el-radio-group>
        </div>
        <div class="withdraw-transaction-methods-absent" v-else>
          {{ $t("payments.noWithdrawalMethods") }}
        </div>
        <div
          class="withdraw-transaction-methods-manage"
          @click="selectWithdrawOptions()"
        >
          <v-icon class="pr-3"> mdi mdi-pencil</v-icon>
          {{ $t("payments.manageWithdrawalMethods") }}
        </div>
      </div>
      <div>
        <button
          :disabled="
            amount > getWallets[0].wallet_maximum_withdraw_amount || loading
          "
          class="btn btn-primary mt-2 btn-long submit-order-btn withdraw-continue"
          @click="withdraw()"
          v-loading="loading"
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
import { ElNotification } from "element-plus";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      amount: "",
      paymentMethod: "",
      loading: true,
    };
  },
  validations() {
    return {
      amount: { required },
    };
  },
  watch: {
    "$store.state.businessDetails": function businessDetails() {
      this.getWithdrawalMethods();
    },
  },
  computed: {
    ...mapGetters([
      "getWallets",
      "getStatisticsStats",
      "getStorageUserDetails",
      "getBusinessDetails",
      "getUserDetails",
      "getWithDrawalMethods",
    ]),
    withdrawalMethodDetails() {
      return this.paymentMethod !== "" && this.getWithDrawalMethods.length > 0
        ? this.getWithDrawalMethods[this.paymentMethod]
        : "";
    },
    meansOfPayment() {
      let paymentMethod = "";
      switch (this.withdrawalMethodDetails.pay_method_name) {
        case "M-PESA":
          paymentMethod = this.withdrawalMethodDetails.pay_method_name
            .toUpperCase()
            .replace("-", "");
          break;
        case "Card":
          paymentMethod =
            this.withdrawalMethodDetails.pay_method_name.toUpperCase();
          break;
        case "Virtual Accounts":
          paymentMethod = (
            this.withdrawalMethodDetails.pay_method_name.substring(0, 7) +
            "_" +
            this.withdrawalMethodDetails.pay_method_name.substring(
              8,
              this.withdrawalMethodDetails.pay_method_name.length
            )
          ).toUpperCase();
          break;
        default:
          paymentMethod = "";
          break;
      }
      return paymentMethod;
    },
  },
  mounted() {
    this.setComponent("payments.wallet");
    this.getUserWallets();
    this.getWithdrawalMethods();
  },
  methods: {
    ...mapActions(["requestAxiosGet", "requestAxiosPost"]),
    ...mapMutations([
      "setStatisticsStats",
      "setWallets",
      "setComponent",
      "setWithDrawalMethods",
    ]),
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
    getWithdrawalMethods() {
      this.loading = true;
      this.requestAxiosPost({
        app: process.env.AUTH,
        endpoint: `payment-gateway/payment_methods`,
        values: {
          country_code: this.getBusinessDetails.country_code,
          entity_id: "6",
          user_id: this.getBusinessDetails.business_id,
          pay_direction: "PAY_OUT",
        },
      }).then((response) => {
        this.loading = false;
        if (response.status === 200) {
          this.setWithDrawalMethods(response.data.saved_payment_methods);
        } else {
          this.setWithDrawalMethods([]);
        }
      });
    },
    withdraw() {
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
      if (this.withdrawalMethodDetails) {
        this.loading = true;
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/withdrawals`,
          values: {
            business_id: this.getBusinessDetails.business_id,
            means_of_payment: {
              means_of_payment_type: this.meansOfPayment,
              means_of_payment_id: this.withdrawalMethodDetails.pay_detail_id,
              participant_type: null,
              participant_id: null,
              meta_data: null,
            },
            currency: this.getWallets[0].currency,
            amount: this.amount,
          },
        }).then((response) => {
          this.loading = false;
          if (response.status === 200) {
            ElNotification({
              title: this.$t("payments.withdrawalSuccessful"),
              message: "",
              type: "success",
            });
            this.$router.push("/payments/wallet");
          } else {
            ElNotification({
              title: this.$t("payments.withdrawalFailed"),
              message: response.response.data.errors[0].message,
              type: "error",
            });
          }
        });
      } else {
        ElNotification({
          title: this.$t("payments.pleaseSelectAWithdrawalMethod"),
          message: "",
          type: "warning",
        });
      }
    },
    selectWithdrawOptions() {
      const buPayload = {
        user_id: this.getBusinessDetails.business_id,
        entity_id: 6,
        currency: this.getBusinessDetails.currency,
        country_code: this.getBusinessDetails.country_code,
        amount: "",
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

      this.$paymentInit(buPayload, "manage-withrawal-options");
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
.withdraw-transaction-methods {
  display: flex;
  align-items: center;
}
.withdraw-transaction-methods-radio-group {
  height: 80px;
  width: 100%;
  border-bottom: 1px solid #dcdfe65e;
}
.withdraw-transaction-methods-top {
  color: #303133;
  font-size: 15px;
  margin-bottom: 5px;
}
.withdraw-transaction-methods-bottom {
  font-weight: 100;
  font-size: 13px;
}
.withdraw-transaction-methods-absent {
  text-align: center;
  margin: 30px;
  color: #919399;
}
.withdraw-transaction-methods-manage {
  color: #324ba8;
  font-size: 14px;
  margin: 27px 0px;
  display: flex;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
  justify-content: flex-end;
}
</style>
