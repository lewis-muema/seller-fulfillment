<template>
  <div class="tracking-order-no">
    <i
      class="mdi mdi-arrow-left tracking-arrow-back"
      @click="redirectToOrderList()"
    ></i>
    <div class="tracking-order-title mb-0">
      <span :class="getLoader.orderTracking" class="tracking-pickup-order-id">
        {{ $t("deliveries.orderNo") }}
        {{ getOrderTrackingData.order.order_id }}
      </span>
      <span
        class="tracking-reference-number"
        v-if="getOrderTrackingData.order.seller_order_reference_id"
      >
        {{
          $t("inventory.referenceNumber", {
            Ref: getOrderTrackingData.order.seller_order_reference_id,
          })
        }}
      </span>
      <div class="tracking-options-container" v-if="!hideActionButtons">
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
        v-if="getOrderTrackingData.order.order_status === 'ORDER_COMPLETED'"
      >
        {{ $t("deliveries.dateOfCompletion") }}
        {{ formatDateComplete(getOrderTrackingData.order.completed_date) }}
      </span>
      <span :class="getLoader.orderTracking" v-else>
        {{ $t("deliveries.timeOfArrival") }}
        {{ formatDate(getOrderTrackingData.order.scheduled_date) }}
      </span>
    </p>
    <div
      class="tracking-pickup-banner"
      v-for="(order, i) in getOrderTrackingData.order.cross_dock_linked_orders"
      :key="i"
    >
      <div class="d-flex row">
        <span class="col-1">
          <i class="mdi mdi-information tracking-pickup-banner-icon"></i>
        </span>
        <span class="tracking-pick-up-banner-text col-11">
          <span :class="getLoader.pickUpDetails">
            {{
              order.order_type === "DELIVERY"
                ? $t("inventory.thereIsADeliveryLinkedToThisPickUp")
                : $t("inventory.orderIsPendingBecause", {
                    Date: linkedPickup.scheduled_date
                      ? formatLongDate(linkedPickup.scheduled_date)
                      : "",
                    Location: linkedPickup.destination
                      ? linkedPickup.destination.delivery_location.description
                      : "",
                  })
            }}
          </span>
        </span>
      </div>
      <div
        class="tracking-pickup-banner-link row tracking-crossdocked-pickup-banner"
      >
        <div class="col-1"></div>
        <div
          class="col-11"
          @click="$router.push(`/deliveries/tracking/${order.order_id}`)"
        >
          <span>
            {{
              order.order_type === "DELIVERY"
                ? $t("inventory.trackDeliveryOrder")
                : $t("inventory.trackPickUpOrder")
            }}
          </span>
          <span>
            <i class="mdi mdi-chevron-right"></i>
          </span>
        </div>
      </div>
    </div>
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
      "getComponent",
    ]),
    route() {
      return this.getComponent;
    },
    deliveryActions() {
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
    redirectToOrderList() {
      if (this.route === "deliveries.trackDeliveryToCustomer") {
        this.$router.push("/deliveries/customer");
      } else if (this.route === "deliveries.trackDeliveryToSendy") {
        this.$router.push("/deliveries/sendy");
      }
    },
  },
};
</script>
<style></style>
