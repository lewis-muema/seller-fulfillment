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
          <v-expansion-panel v-for="(summary, i) in paymentSummary" :key="i">
            <v-expansion-panel-title>
              <div class="statements-expansion-title">
                <p :class="getLoader">
                  {{ summary.description }}
                </p>
                <p
                  class="statements-expansion-title-bottom-row"
                  :class="getLoader"
                >
                  <span>
                    {{ summary.destination }}
                  </span>
                </p>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text> </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div class="payment-summary-bottom-section">
        <div class="payment-summary-show-more">
          <span>
            {{ $t("payments.showMore") }}
          </span>
        </div>
        <div class="payment-summary-amount-section">
          <div>
            <span>{{ $t("payments.amountToPay") }}</span>
            <span class="payment-summary-amount-val"
              >{{ currency }} {{ amount }}</span
            >
          </div>
          <v-btn class="edit-info-submit-button payment-summary-submit-button">
            {{ $t("payments.continueToMakePayment") }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      currency: "KES",
      amount: "700",
      paymentSummary: [
        {
          description: "Delivery to James",
          destination: "Moi Avenue",
          currency: "KES",
          amount: "100",
          time: "12:35 PM",
        },
        {
          description: "Delivery to James",
          destination: "Moi Avenue",
          currency: "KES",
          amount: "100",
          time: "12:35 PM",
        },
        {
          description: "Delivery to James",
          destination: "Moi Avenue",
          currency: "KES",
          amount: "100",
          time: "12:35 PM",
        },
        {
          description: "Delivery to James",
          destination: "Moi Avenue",
          currency: "KES",
          amount: "100",
          time: "12:35 PM",
        },
        {
          description: "Delivery to James",
          destination: "Moi Avenue",
          currency: "KES",
          amount: "100",
          time: "12:35 PM",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getLoader"]),
  },
  mounted() {
    this.setComponent(this.$t("payments.makePayment"));
    setTimeout(() => {
      this.setLoader("");
    }, 1000);
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader"]),
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
</style>
