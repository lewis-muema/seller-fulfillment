<template>
  <div>
    <div class="tracking-order-no">
      <i
        class="mdi mdi-arrow-left tracking-arrow-back"
        @click="$router.go(-1)"
      ></i>
      <p class="tracking-order-title">
        <span :class="$store.getters.getLoader">
          {{ $t("deliveries.orderNo") }} {{ orderNo }}
        </span>
      </p>
      <p class="tracking-order-time-est">
        <span :class="$store.getters.getLoader">
          {{ $t("deliveries.timeOfArrival") }} {{ timeOfArrival }}
        </span>
      </p>
    </div>
    <failed-delivery />
    <div class="tracking-section-container">
      <div>
        <timeline />
      </div>
      <div>
        <deliveryInfo />
        <products />
      </div>
    </div>
    <v-overlay v-model="overlay" class="align-center justify-center">
      <div class="tracking-reschedule-container">
        <div class="tracking-reschedule-title-section">
          <p class="tracking-reschedule-title-label">
            {{ $t("deliveries.pickATime") }}
          </p>
          <i
            @click="overlay = false"
            class="mdi mdi-close tracking-reschedule-title-close"
          ></i>
        </div>
        <datepicker
          :disabled-dates="{
            to: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0),
            from: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
          }"
          v-model="date"
          :inline="true"
          :prevent-disable-date-selection="true"
        ></datepicker>
        <v-btn class="tracking-reschedule-submit-button">
          {{ $t("deliveries.submit") }}
        </v-btn>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import timeline from "./components/timeline.vue";
import deliveryInfo from "./components/deliveryInfo.vue";
import products from "./components/products.vue";
import failedDelivery from "./components/failedDelivery.vue";
import Datepicker from "vuejs3-datepicker";

export default {
  components: {
    timeline,
    deliveryInfo,
    products,
    failedDelivery,
    Datepicker,
  },
  data() {
    return {
      orderNo: "AQW4567787",
      timeOfArrival: "Thursday, 25th Jan  2pm - 4pm",
      overlay: false,
      date: new Date(),
    };
  },
  watch: {
    "$store.state.overlay": function (val) {
      this.overlay = val;
    },
    overlay(val) {
      this.$store.commit("setOverlay", val);
    },
  },
  mounted() {
    this.$store.commit(
      "setComponent",
      this.$t("deliveries.trackDeliveryToCustomer")
    );
  },
  methods: {},
};
</script>

<style>
.tracking-section-container {
  display: grid;
  grid-template-columns: auto auto;
}
.tracking-order-no {
  margin: 30px 70px;
  line-height: 30px;
}
.tracking-arrow-back {
  font-size: 25px;
  cursor: pointer;
}
.tracking-order-title {
  font-weight: 500;
  font-size: 16px;
}
.tracking-order-time-est {
  font-size: 14px;
}
.vuejs3-datepicker__calendar-topbar {
  background-color: #ffffff !important;
  color: #000 !important;
  display: none;
}
.vuejs3-datepicker__calendar .cell.selected {
  background: #324ba8 !important;
}
.cell:not(.blank):not(.disabled).day:hover,
.cell:not(.blank):not(.disabled).month:hover,
.cell:not(.blank):not(.disabled).year:hover {
  border: 1px solid #324ba8 !important;
}
.tracking-reschedule-container {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
}
.vuejs3-datepicker div:first-child {
  display: none !important;
}
.tracking-reschedule-title-section {
  margin-bottom: 20px;
  display: flex;
}
.tracking-reschedule-title-label {
  font-size: 15px;
  width: 60%;
}
.tracking-reschedule-title-close {
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;
}
.tracking-reschedule-submit-button {
  margin-top: 40px;
  width: 150px;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: white !important;
  background: #324ba8;
  margin-left: auto;
}
.vuejs3-datepicker__calendar {
  box-shadow: none !important;
}
</style>
