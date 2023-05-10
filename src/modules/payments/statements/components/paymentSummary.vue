<template>
  <div class="payment-summary-container">
    <div class="payment-summary-inner-container">
      <div class="payment-summary-top-section">
        <i
          class="mdi mdi-arrow-left payment-summary-arrow-back"
          @click="$router.go(-1)"
        ></i>
        <span class="payment-summary-top-section-title">
          {{ $t("payments.orderSummary") }}
        </span>
      </div>
      <div class="payment-summary-expansion-section">
        <v-expansion-panels multiple class="payment-summary-expansion-panel">
          <v-expansion-panel v-for="(summary, i) in getCycleLineItems" :key="i">
            <v-expansion-panel-title>
              <div class="summary-items-container">
                <div class="summary-items">
                  <div>
                    <p :class="getLoader.cycleLineItems">
                      {{ summary.line_item_title }}
                    </p>
                    <p
                      class="statements-expansion-title-bottom-row"
                      :class="getLoader.cycleLineItems"
                    >
                      <span>
                        {{ summary.line_item_subtitle }}
                      </span>
                    </p>
                  </div>
                  <div class="summary-items-right">
                    <p :class="getLoader.cycleLineItems">
                      {{ getBusinessDetails.currency }} {{ summary.amount }}
                    </p>
                    <p
                      class="statements-expansion-title-bottom-row"
                      :class="getLoader.cycleLineItems"
                    >
                      <span>
                        {{ formatDate(summary.created_date) }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="summary-items-container">
                <div class="summary-items">
                  <div>
                    <p :class="getLoader.cycleLineItems">
                      {{ $t("settings.invoice") }}
                    </p>
                    <p
                      class="statements-expansion-title-bottom-row"
                      :class="getLoader.cycleLineItems"
                    >
                      <span>
                        {{ summary.line_item_id }}
                      </span>
                    </p>
                  </div>
                  <div class="summary-items-right mr-8">
                    <p :class="getLoader.cycleLineItems">
                      {{ $t("payments.orderNumber") }}
                    </p>
                    <p
                      class="statements-expansion-title-bottom-row"
                      :class="getLoader.cycleLineItems"
                    >
                      <span>
                        {{ summary.resource_id }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div class="payment-summary-bottom-section">
        <div class="payment-summary-amount-section">
          <div>
            <span>{{ $t("payments.amountToPay") }}</span>
            <span
              class="payment-summary-amount-val"
              :class="getLoader.cycleLineItems"
              >{{ getBusinessDetails.currency }}
              {{ getActivePayment.amount_to_charge }}</span
            >
          </div>
          <v-btn
            @click="selectPaymentMethod"
            class="edit-info-submit-button payment-summary-submit-button"
          >
            {{ $t("payments.continueToMakePayment") }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      currency: "KES",
      amount: "700",
    };
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getBillingCycles",
      "getBusinessDetails",
      "getStorageUserDetails",
      "getLineItems",
      "getCycleLineItems",
      "getActivePayment",
      "getUserDetails",
    ]),
  },
  mounted() {
    this.setComponent("payments.makePayment");
    this.getCycles();
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations(["setCycleLineItems", "setActivePayment"]),
    formatDate(date) {
      return moment(date).format("h:mm a");
    },
    ...mapMutations(["setComponent", "setLoader"]),
    getCycles() {
      this.setLoader({
        type: "cycleLineItems",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/${this.$route.params.cycle_id}/lineitems`,
      }).then((response) => {
        this.setLoader({
          type: "cycleLineItems",
          value: "",
        });
        if (response.status === 200) {
          this.setCycleLineItems(response.data.data.billing_cycle_line_items);
          this.getActiveCycle();
        } else {
          this.setActivePayment({});
          this.$router.push("/");
        }
      });
    },
    getActiveCycle() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/${this.$route.params.cycle_id}`,
      }).then((response) => {
        if (response.status === 200) {
          this.setActivePayment(response.data.data);
          if (this.$route.path.includes("/payments/payment-summary")) {
            this.setLoader({
              type: "cycleLineItems",
              value: "",
            });
          }
        } else {
          this.setActivePayment({});
          this.$router.push("/");
        }
      });
    },
    selectPaymentMethod() {
      const buPayload = {
        user_id: this.getBusinessDetails.business_id,
        entity_id: 6,
        currency: this.getBusinessDetails.currency,
        country_code: this.getBusinessDetails.country_code,
        amount: this.getActivePayment.amount_to_charge,
        success_callback_url: "",
        fail_callback_url: "",
        txref: this.getActivePayment.billing_cycle_instance_id,
        bulk: false,
        paybill_no: "",
        email: this.getUserDetails.email,
        authToken: localStorage.accessToken,
        firstname: this.getUserDetails.first_name,
        lastname: this.getUserDetails.last_name,
        payment_options: "",
        company_code: this.getBusinessDetails.company_code,
        locale: this.getBusinessDetails.language,
      };

      this.$paymentInit(buPayload, "checkout");
    },
  },
};
</script>

<style>
.payment-summary-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 95%;
  background: #fcfdff;
}
.payment-summary-inner-container {
  width: 50%;
  height: 85%;
  border: 1px solid #e2e7ed;
  padding: 20px;
  background: white;
  position: relative;
}
.payment-summary-arrow-back {
  font-size: 25px;
  cursor: pointer;
  color: #909399;
}
.payment-summary-top-section {
  display: flex;
  align-items: center;
}
.payment-summary-top-section-title {
  margin-left: 20px;
  font-size: 20px;
  font-weight: 500;
}
.payment-summary-expansion-panel {
  margin-top: 30px;
}
.payment-summary-expansion-section {
  max-height: calc(97% - 200px);
  overflow: scroll;
}
.payment-summary-show-more {
  color: #324ba8;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  cursor: pointer;
}
.payment-summary-amount-section {
  border-top: 1px solid #e2e7ed;
  padding: 20px;
  font-size: 18px;
}
.payment-summary-submit-button {
  margin-top: 20px !important;
  height: 50px !important;
}
.payment-summary-amount-val {
  float: right;
}
.payment-summary-bottom-section {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 200px;
  margin-left: -20px;
}
.summary-items {
  display: flex;
}
.summary-items-right {
  margin-left: auto;
  text-align: right;
}
.summary-items-container {
  text-align: left;
  margin: 15px;
  width: 100%;
}
</style>
