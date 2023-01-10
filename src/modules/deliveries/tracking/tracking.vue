<template>
  <div>
    <div class="tracking-order-no">
      <i
        class="mdi mdi-arrow-left tracking-arrow-back"
        @click="$router.back()"
      ></i>
      <div class="tracking-order-title mb-0">
        <span :class="getLoader.orderTracking">
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
        <!-- <span>
          <v-menu transition="slide-y-transition" anchor="bottom center">
            <template v-slot:activator="{ props }">
              <v-btn
                class="tracking-order-actions-btn elevation-0"
                append-icon="mdi-chevron-down"
                v-bind="props"
              >
                {{ $t("deliveries.actions") }}
              </v-btn>
            </template>
            <v-list class="users-actions-popup">
              <v-list-item v-for="(action, i) in deliveryActions" :key="i">
                <v-list-item-title
                  @click="
                    setOverlayStatus({
                      overlay: true,
                      popup: action.popup,
                    })
                  "
                >
                  {{ $t(action.label) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </span> -->
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
        v-for="(order, i) in getOrderTrackingData.order
          .cross_dock_linked_orders"
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
        <div class="tracking-pickup-banner-link row">
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
import moment from "moment";
import timeline from "./components/timeline.vue";
import deliveryInfo from "./components/deliveryInfo.vue";
import products from "./components/products.vue";
import failedDelivery from "./components/failedDelivery.vue";
import { mapMutations, mapGetters, mapActions } from "vuex";
import trackingPayloadMixin from "../../../mixins/tracking_payload";

export default {
  components: {
    timeline,
    deliveryInfo,
    products,
    failedDelivery,
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
    ]),
    deliveryActions() {
      const actions = [];
      this.getDeliveryActions.forEach((row) => {
        let showCancel = true;
        if (row.popup === "cancel") {
          showCancel =
            ["ORDER_RECEIVED", "ORDER_IN_PROCESSING"].includes(
              this.getOrderTrackingData.order.order_status
            ) ||
            this.getOrderTrackingData.order.order_event_status.includes(
              "pickup"
            );
        }
        if (row.show && showCancel) {
          actions.push(row);
        }
      });
      return actions;
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
    formatDate(date) {
      const finalTime = moment(date).add(2, "hours");
      return `${moment(date).format("dddd, Do MMM")} ${moment(date).format(
        "ha"
      )} - ${moment(finalTime).format("ha")}`;
    },
    formatLongDate(date) {
      return moment(date).format("ddd, Do MMM");
    },
    formatDateComplete(date) {
      return moment(date).format("dddd, Do MMM YYYY");
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
  margin-right: 55px;
  padding: 20px 0px;
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
  font-size: 1.12rem;
  color: #324ba8;
  cursor: pointer;
  border: 1px #c0c4cc solid;
  border-radius: 5px;
  padding: 5px;
  font-weight: 400;
}
</style>
