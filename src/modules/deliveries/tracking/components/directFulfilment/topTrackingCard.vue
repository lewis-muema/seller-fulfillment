<template>
  <div class="tracking-order-no mb-0">
    <i
      class="mdi mdi-arrow-left tracking-arrow-back"
      @click="$router.push('/deliveries/direct-deliveries/')"
    ></i>
    <div class="tracking-order-title mb-0">
      <span :class="getLoader.onDemandOrders">
        {{ $t(trackingStatus) }}
      </span>
      <div
        class="tracking-options-container"
        v-if="
          !['ORDER_CANCELED', 'ORDER_COMPLETED'].includes(
            getDirectDeliveriesTrackingData.order?.order_status
          )
        "
      >
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
    <div class="tracking-order-title mb-0">
      <span
        class="on-demand-tracking-order-number"
        :class="getLoader.onDemandOrders"
      >
        {{ $t("deliveries.orderNo") }}
        {{ getDirectDeliveriesTrackingData.order?.order_id }}
      </span>
    </div>
    <p class="tracking-order-time-est d-none">
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
      "getOnDemandDeliveryActions",
      "getDirectDeliveriesTrackingData",
    ]),
    deliveryActions() {
      return this.getOnDemandDeliveryActions;
    },
    trackingStatus() {
      if (
        this.getDirectDeliveriesTrackingData.order?.error_status ===
        "WAITING_FOR_PRE_PAYMENT"
      ) {
        return "deliveries.awaitingPayment";
      } else if (
        this.getDirectDeliveriesTrackingData.order?.error_status ===
          "FAILED_TRANSPORTER_ASSIGNMENT" ||
        ["ORDER_RECEIVED", "ORDER_IN_PROCESSING"].includes(
          this.getDirectDeliveriesTrackingData.order?.order_status
        )
      ) {
        return "deliveries.weAreTringToFindYouARider";
      } else if (
        this.getDirectDeliveriesTrackingData.order?.order_status ===
        "ORDER_IN_TRANSIT"
      ) {
        return "deliveries.yourDriverIsOnTheWy";
      }
      return "";
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
<style>
.on-demand-tracking-order-number {
  font-size: 14px;
  font-weight: 400;
  color: #303133;
}
</style>
