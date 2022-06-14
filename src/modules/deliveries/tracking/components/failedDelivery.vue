<template>
  <div class="failed-delivery-container">
    <i class="mdi mdi-alert-circle-outline failed-delivery-warning-icon"></i>
    <div>
      <p class="delivery-failed-title">
        <span :class="getLoader">
          {{ $t("deliveries.weAttemptedToPickUpYourItems") }}
        </span>
      </p>
      <p class="delivery-failed-description">
        <span :class="getLoader">
          {{ $t("deliveries.weTriedToReachYourCustomer") }}
        </span>
      </p>
    </div>
    <div class="delivery-failed-button-container">
      <v-btn @click="showTimepicker()" class="delivery-failed-button">
        {{ $t("deliveries.rescheduleDelivery") }}
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
    showTimepicker() {
      this.setOverlayStatus({
        overlay: true,
        popup: "reschedule",
      });
    },
  },
};
</script>

<style>
.failed-delivery-container {
  display: flex;
  border: 1px solid #9b101c;
  padding: 12px;
  border-radius: 10px;
  margin: 30px;
  width: 92%;
}
.failed-delivery-warning-icon {
  color: #9b101c;
  margin: 0px 30px;
  font-size: 25px;
}
.delivery-failed-title {
  color: #9b101c;
  font-weight: 500;
  margin: 5px 0px;
}
.delivery-failed-button-container {
  margin: auto 15px;
  margin-left: auto;
}
.delivery-failed-button {
  height: 40px !important;
  width: max-content;
  text-transform: capitalize;
  letter-spacing: 0px;
  background: #9b101c;
  color: white !important;
}
.delivery-failed-description {
  font-size: 16px;
  width: 90%;
}
</style>
