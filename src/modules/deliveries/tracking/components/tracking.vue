<template>
  <div class="tracking-order-no">
    <i
      class="mdi mdi-arrow-left tracking-arrow-back"
      @click="$router.back()"
    ></i>
    <div class="tracking-order-title mb-0">
      <span> {{ $t("deliveries.orderNo") }}1234556 </span>
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
      {{ $t("deliveries.dateOfCompletion") }}
      <span> 12/2/2020 </span>
    </p>
  </div>
  <div class="row">
    <div class="col-7">
      <tracking-map />
    </div>
    <div class="col-4" v-scroll:#scroll-target="onScroll">
      <locations />
      <timeline />
      <pickup-info />
      <deliveryInfo />
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { mapGetters, mapMutations } from "vuex";
import locations from "../components/directFulfilment/locations.vue";
import pickupInfo from "../components/directFulfilment/pickupInfo.vue";
import deliveryInfo from "../components/directFulfilment/driverInfo.vue";
import timeline from "../components/directFulfilment/timeline.vue";
import trackingMap from "../components/directFulfilment/trackingMap.vue";
export default {
  components: { locations, trackingMap, pickupInfo, deliveryInfo, timeline },
  data() {
    return {
      scrollInvoked: 0,
      deliveryActions: [
        {
          label: "deliveries.getDeliveryCode",
          trigger: false,
          popup: "code",
          show: true,
        },
        {
          label: "deliveries.rescheduleOrder",
          trigger: false,
          popup: "reschedule",
          show: true,
          icon: "mdi mdi-clock-outline",
        },
        {
          label: "deliveries.cancelOrder",
          trigger: false,
          popup: "cancelOptions",
          show: true,
          icon: "mdi mdi-close-circle-outline",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getLoader", "getOrderTrackingData", "getDeliveryActions"]),
    deliveryActionss() {
      const actions = [];
      this.getDeliveryActions.forEach((row) => {
        let showCancel = true;
        if (row.popup === "cancelOptions") {
          showCancel = ["ORDER_RECEIVED", "ORDER_IN_PROCESSING"].includes(
            this.getOrderTrackingData.order.order_status
          );
        }
        let showCode =
          (row.popup === "code" &&
            this.getOrderTrackingData.order.confirmation_pin &&
            this.$route.params.order_id ===
              this.getOrderTrackingData.order.order_id) ||
          row.popup !== "code";
        if (row.show && showCancel && showCode) {
          actions.push(row);
        }
      });
      return actions;
    },
    hideActionButtons() {
      return (
        this.getOrderTrackingData.order.order_status === "ORDER_COMPLETED" ||
        this.getOrderTrackingData.order.order_status === "ORDER_CANCELED" ||
        this.getOrderTrackingData.order.order_status === "ORDER_FAILED"
      );
    },
  },
  methods: {
    ...mapMutations(["setOverlayStatus"]),
    onScroll(e) {
      this.scrollInvoked = e.target.scrollTop;
    },
    formatDateComplete(date) {
      return moment(date).format("dddd, Do MMM YYYY");
    },
  },
};
</script>
<style>
.direct-fulfilment-destination-container {
  border: 1px solid #e2e7ed;
  border-radius: 10px;
  width: 100%;
  font-size: 14px;
  background: white;
  padding: 30px 30px 20px 30px;
  margin-left: 70px;
  background: #fff;
}
.destination-divider-line {
  margin-top: 20px !important;
  height: 2px !important;
}
</style>
