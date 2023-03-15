<template>
  <div>
    <top-tracking-card :linkedPickup="this.linkedPickup" />
    <div class="tracking-order-failed-delivery">
      <failed-delivery v-if="failedStatus" />
    </div>
    <div class="tracking-section-container">
      <div>
        <timeline />
      </div>
      <div>
        <deliveryInfo />
        <products />
      </div>
    </div>
  </div>
</template>

<script>
import timeline from "./components/normalFulfilment/timeline.vue";
import deliveryInfo from "./components/normalFulfilment/deliveryInfo.vue";
import topTrackingCard from "./components/normalFulfilment/topTrackingCard.vue";
import products from "./components/normalFulfilment/products.vue";
import failedDelivery from "./components/normalFulfilment/failedDelivery.vue";
import { mapMutations, mapGetters, mapActions } from "vuex";
import trackingPayloadMixin from "../../../mixins/tracking_payload";

export default {
  components: {
    timeline,
    deliveryInfo,
    products,
    failedDelivery,
    topTrackingCard,
  },
  mixins: [trackingPayloadMixin],
  data() {
    return {
      orderNo: "AQW4567787",
      timeOfArrival: "Thursday, 25th Jan  2pm - 4pm",
      overlay: false,
      failedStatus: false,
      linkedPickup: {},
    };
  },
  watch: {
    "$store.state.orderTimelines": function orderTimelines(val) {
      if (val[val.length - 1].event_code === "EVENT_DELIVERY_FAILED") {
        this.failedStatus = true;
      } else {
        this.failedStatus = false;
      }
    },
    "$store.state.parent": function parentVal(val) {
      this.rescheduleStatus(val);
      if (val === "sendy") {
        this.setComponent("deliveries.trackDeliveryToSendy");
      } else if (val === "customer") {
        this.setComponent("deliveries.trackDeliveryToCustomer");
      }
    },
    "$route.params.order_id": function orderId(val) {
      if (val) {
        this.fetchOrder();
      }
    },
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getDeliveryActions",
      "getOrderTrackingData",
      "getParent",
      "getStorageUserDetails",
      "getParent",
      "getEditableFields",
    ]),
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
  mounted() {
    if (this.$router.options.history.state.back === "/deliveries/sendy") {
      this.setParent("sendy");
      this.rescheduleStatus("sendy");
    }
    if (
      this.$router.options.history.state.back === "/deliveries/customer" ||
      this.$router.options.history.state.back ===
        "/payments/transaction-details"
    ) {
      this.setParent("customer");
      this.rescheduleStatus("customer");
    }
    this.fetchOrder();
    this.cancellationReasons();
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setOverlayStatus",
      "setOrderTrackingData",
      "setParent",
      "setDeliveryActions",
      "setProductsToSubmit",
      "setDeliverySpeed",
      "setFinalDocumentsToEdit",
      "setCancellationReasons",
      "setEditableFields",
    ]),
    ...mapActions(["requestAxiosGet", "requestAxiosPost"]),
    fetchOrder() {
      this.setLoader({
        type: "orderTracking",
        value: "loading-text",
      });
      this.setLoader({
        type: "orderTimeline",
        value: "loading-text",
      });
      this.setLoader({
        type: "pickUpDetails",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/${
          this.getParent === "sendy" ? "consignments" : "deliveries"
        }/${this.$route.params.order_id}`,
      }).then((response) => {
        this.setLoader({
          type: "orderTracking",
          value: "",
        });
        if (response.status === 200) {
          this.setOrderTrackingData(response.data.data);
          this.setFinalDocumentsToEdit(
            this.getOrderTrackingData.order.documents
          );
          this.setProductsToSubmit(response.data.data.order.products);
          this.getParent === "customer"
            ? this.editableFieldsOnConsignmemts()
            : this.editableFieldsOnPickups();
          if (response.data.data.order.order_type === "PICKUP") {
            this.setParent("sendy");
            this.setLoader({
              type: "pickUpDetails",
              value: "",
            });
          } else {
            this.setParent("customer");
            this.fetchPickup();
          }
        }
      });
    },
    cancellationReasons() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/cancellation-reasons`,
      }).then((response) => {
        if (response.status === 200) {
          this.setCancellationReasons(
            response.data.data["cancellation-reasons"]
          );
        }
      });
    },
    editableFieldsOnConsignmemts() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/deliveries/${this.getOrderTrackingData.order.order_id}/editablefields`,
      }).then((response) => {
        if (response.status === 200) {
          this.setEditableFields(response.data.data.editablefields);
        }
      });
    },
    editableFieldsOnPickups() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/consignments/${this.getOrderTrackingData.order.order_id}/editablefields`,
      }).then((response) => {
        if (response.status === 200) {
          this.setEditableFields(response.data.data.editablefields);
        }
      });
    },
    fetchPickup() {
      const pickups =
        this.getOrderTrackingData.order.cross_dock_linked_orders.filter(
          (row) => {
            return row.order_type === "PICKUP";
          }
        );
      if (pickups.length) {
        this.requestAxiosGet({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/consignments/${pickups[0].order_id}`,
        }).then((response) => {
          this.setLoader({
            type: "pickUpDetails",
            value: "",
          });
          if (response.status === 200) {
            this.linkedPickup = response.data.data.order;
          }
        });
      }
    },
    rescheduleStatus(val) {
      let actions = this.getDeliveryActions;
      actions[1].show = val === "customer";
      this.setDeliveryActions(actions);
    },
    calculateSpeed() {
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/crossdocked-delivery/calculate-speed`,
        values: this.calculateSpeedPayload,
      }).then((response) => {
        if (response.status === 200) {
          this.setDeliverySpeed(response.data.data.deliveries);
        }
      });
    },
  },
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
  width: calc(89% + 70px);
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
.tracking-order-failed-delivery {
  margin: 0px 40px;
}
.tracking-reference-number {
  margin-left: 20px;
  padding-left: 10px;
  border-left: 1px solid #909399;
  color: #303133;
  font-weight: 100;
}
.tracking-pickup-banner {
  border: 1px solid #324ba8;
  border-radius: 5px;
  padding: 20px 30px 20px 0px;
  width: calc(88% + 70px);
  margin-bottom: 20px;
}
.tracking-pickup-banner-icon {
  font-size: 25px;
  color: #324ba8;
  float: right;
}
.tracking-pick-up-banner-text {
  font-size: 18px;
}
.tracking-pickup-banner-link {
  color: #324ba8;
  font-weight: 600;
  cursor: pointer;
}
.tracking-options-container {
  float: right;
}
.tracking-option-content {
  margin-right: 10px;
  font-size: 15px;
  color: #324ba8;
  cursor: pointer;
  border: 1px #c0c4cc solid;
  border-radius: 5px;
  padding: 5px;
  font-weight: 400;
}
</style>
