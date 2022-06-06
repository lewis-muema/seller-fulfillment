<template>
  <v-overlay v-model="overlay" class="align-center justify-center">
    <div
      class="tracking-reschedule-container"
      v-if="$store.getters.getDeliveryActions[1].trigger"
    >
      <div class="tracking-reschedule-title-section">
        <p class="tracking-reschedule-title-label">
          {{ $t("deliveries.pickATime") }}
        </p>
        <i
          @click="overlayStatus(1, false)"
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
    <div
      class="tracking-reschedule-container"
      v-if="$store.getters.getDeliveryActions[2].trigger"
    >
      <div class="tracking-reschedule-title-section">
        <p class="tracking-cancel-title-label">
          {{ $t("deliveries.whyCancel") }}
        </p>
        <i
          @click="overlayStatus(2, false)"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <v-radio-group v-model="radioGroup">
        <v-radio
          v-for="(reason, x) in cancelReasons"
          :key="x"
          :label="$t(reason.label)"
          :value="reason.value"
        ></v-radio>
      </v-radio-group>
      <v-btn class="tracking-cancel-button">
        {{ $t("deliveries.cancelOrder") }}
      </v-btn>
    </div>
  </v-overlay>
</template>

<script>
import Datepicker from "vuejs3-datepicker";

export default {
  props: {
    overlayVal: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    overlayVal(val) {
      this.overlay = val;
    },
    overlay(val) {
      if (!val) {
        this.overlayStatus(0, val);
      }
    },
  },
  components: { Datepicker },
  data() {
    return {
      overlay: this.overlayVal,
      date: new Date(),
      cancelReasons: [
        {
          label: "deliveries.orderIsNotReady",
          value: "",
        },
        {
          label: "deliveries.wrongLocation",
          value: "",
        },
        {
          label: "deliveries.duplicateOrder",
          value: "",
        },
      ],
    };
  },
  methods: {
    overlayStatus(index, status) {
      this.actions = this.$store.getters.getDeliveryActions;
      this.actions.forEach((row) => {
        row.trigger = false;
      });
      this.actions[index].trigger = status;
      this.$store.commit("setDeliveryActions", this.actions);
      this.$store.commit("setOverlay", { index, status });
    },
  },
};
</script>

<style>
.tracking-reschedule-container {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
  font-family: "DM Sans";
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
.tracking-order-actions-btn {
  float: right;
  margin-right: 5%;
}
.tracking-cancel-title-label {
  font-size: 15px;
  width: 80%;
}
.tracking-cancel-button {
  width: -webkit-fill-available;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: white !important;
  background: #9b101c;
  margin-left: auto;
}
</style>
