<template>
  <div>
    <div class="statistics-container">
      <p class="statistics-title">{{ $t("payments.actions") }}</p>
      <p
        class="mt-3 statistics-items"
        @click="$router.push('/payments/pending-payment-collections')"
      >
        <span class="statistics-line-items">{{
          $t("payments.pendingPaymentCollections")
        }}</span>
        <span class="statistics-line-items-right">
          <span class="statistics-pending-badge">{{
            getStatisticsStats.transaction_type_count
          }}</span>
          <i class="mdi mdi-chevron-right"></i>
        </span>
      </p>
      <hr />
      <p
        class="mt-3 statistics-items"
        @click="selectPaymentOptions()"
        v-if="canViewPaymentOptions"
      >
        <span class="statistics-line-items">{{
          $t("payments.paymentOptions")
        }}</span>
        <span class="statistics-line-items-right"
          ><i class="mdi mdi-chevron-right"></i
        ></span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "getStatisticsStats",
      "getStorageUserDetails",
      "getBusinessDetails",
      "getUserDetails",
    ]),
    canViewPaymentOptions() {
      let status = false;
      this.getUserDetails.user_access_permissions.forEach((row) => {
        if (
          row.permission_id === "CAN_ACCESS_PAYMENT_OPTIONS_MODULE" &&
          row.permission_granted
        ) {
          status = true;
        }
      });
      return status;
    },
  },
  mounted() {
    this.getTransactionStats();
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations(["setStatisticsStats"]),
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
    selectPaymentOptions() {
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
        pay_direction: "PAY_IN",
      };

      this.$paymentInit(buPayload, "choose-payment");
    },
  },
};
</script>

<style>
.statistics-container {
  margin: 45px 60px 0px 0px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  padding: 20px;
}
.statistics-title {
  font-weight: 500;
}
.statistics-line-items {
  font-size: 15px;
}
.statistics-line-items-right {
  float: right;
}
.statistics-items {
  cursor: pointer;
}
.statistics-pending-badge {
  background: #fbdecf;
  padding: 0px 15px;
  border-radius: 15px;
  color: #9b101c;
  margin-right: 10px;
}
</style>
