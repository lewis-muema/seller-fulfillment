<template>
  <div class="make-payment-container">
    <i class="mdi mdi-alert-circle-outline make-payment-warning-icon"></i>
    <div>
      <p class="make-payment-title">
        <span :class="getLoader">
          {{ $t("payments.pleaseMakePayment") }}
        </span>
      </p>
      <p class="make-payment-description">
        <span :class="getLoader">
          {{
            $t("payments.pleaseMakeYourPayment", {
              amount: "KES 780",
              total: 3,
            })
          }}
        </span>
      </p>
    </div>
    <div class="make-payment-button-container">
      <v-btn @click="showPendingPaymnets()" class="make-payment-button">
        {{ $t("payments.makePayment") }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getLoader"]),
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setOverlayStatus"]),
    showPendingPaymnets() {
      this.setOverlayStatus({
        overlay: true,
        popup: "payments",
      });
    },
  },
};
</script>

<style>
.make-payment-container {
  display: flex;
  border: 1px solid #9b101c;
  padding: 12px;
  border-radius: 10px;
  margin: 30px;
  width: 95%;
  background: white;
}
.make-payment-warning-icon {
  color: #9b101c;
  margin: 0px 30px;
  font-size: 25px;
}
.make-payment-title {
  color: #9b101c;
  font-weight: 500;
  margin: 5px 0px;
}
.make-payment-button-container {
  margin: auto 15px;
  margin-left: auto;
}
.make-payment-button {
  height: 40px !important;
  width: max-content;
  text-transform: capitalize;
  letter-spacing: 0px;
  background: #9b101c;
  color: white !important;
}
.make-payment-description {
  font-size: 16px;
}
</style>
