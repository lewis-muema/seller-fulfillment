<template>
  <div class="tracking-order-no">
    <i
      class="mdi mdi-arrow-left tracking-arrow-back"
      @click="$router.push('/deliveries/direct-deliveries/')"
    ></i>
    <div class="tracking-order-title mb-0">
      <span :class="getLoader.onDemandOrders">
        {{ $t("deliveries.orderNo") }}
        {{ getDirectDeliveriesTrackingData.order?.order_id }}
      </span>
      <div class="tracking-options-container">
        <span
          v-for="(action, i) in deliveryActions"
          :key="i"
          @click="
            setOverlayStatus({
              overlay: true,
              popup: action.popup,
            })
          "
          class="tracking-option-content"
        >
          <i :class="action.icon" aria-hidden="true"></i>
          {{ $t(action.label) }}</span
        >
      </div>
    </div>
    <p class="tracking-order-time-est">
      <span
        :class="getLoader.orderTracking"
        v-if="
          getDirectDeliveriesTrackingData.order?.order_status ===
          'ORDER_COMPLETED'
        "
      >
        {{ $t("deliveries.dateOfCompletion") }}
        {{
          formatDateComplete(
            getDirectDeliveriesTrackingData.order?.completed_date
          )
        }}
      </span>
      <span :class="getLoader.orderTracking" v-else>
        {{ $t("deliveries.timeOfArrival") }}
        {{ formatDate(getDirectDeliveriesTrackingData.order?.scheduled_date) }}
      </span>
    </p>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import moment from "moment/moment";

export default {
  props: ["linkedPickup"],
  computed: {
    ...mapGetters([
      "getLoader",
      "getOrderTrackingData",
      "getDeliveryActions",
      "getDirectDeliveriesTrackingData",
    ]),
    deliveryActions() {
      return this.getDeliveryActions;
    },
  },
  methods: {
    ...mapMutations(["setOverlayStatus"]),
    formatDateComplete(date) {
      return moment(date).format("dddd, Do MMM YYYY");
    },
    formatDate(date) {
      const finalTime = moment(date).add(2, "hours");
      return `${moment(date).format("dddd, Do MMM")} ${moment(date).format(
        "ha"
      )} - ${moment(finalTime).format("ha")}`;
    },
    formatLongDate(date) {
      return moment(date).format("ddd, Do MMM");
    },
  },
};
</script>
<style></style>
