<template>
  <div class="on-demand-tracking-container">
    <makePayment class="on-demand-make-payment" />
    <tracking-top-card />
    <div class="row">
      <div class="col-7">
        <div>
          <tracking-map />
        </div>
      </div>
      <div class="col-4 right-tracking-column">
        <locations
          :dropInstructions="this.dropOffInstructions"
          :pickupLocation="this.pickUpLocation"
        />
        <timeline />
        <pickup-info
          :pickupLocation="this.pickUpLocation"
          :contactPerson="this.pickupContactPerson"
          :products="this.products"
          :pickInstructions="this.pickupInstructions"
        />
        <deliveryInfo :dropInstructions="this.dropOffInstructions" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import mqtt from "../../../../mixins/mqtt";
import locations from "../components/directFulfilment/locations.vue";
import pickupInfo from "../components/directFulfilment/pickupInfo.vue";
import deliveryInfo from "./directFulfilment/deliveryInfo.vue";
import timeline from "../components/directFulfilment/timeline.vue";
import trackingMap from "../components/directFulfilment/trackingMap.vue";
import trackingTopCard from "./directFulfilment/topTrackingCard.vue";
import makePayment from "../../../payments/statements/components/makePayment.vue";
import placeholders from "@/mixins/placeholders";
export default {
  components: {
    locations,
    trackingMap,
    pickupInfo,
    deliveryInfo,
    timeline,
    trackingTopCard,
    makePayment,
  },
  data() {
    return {
      scrollInvoked: 0,
      pickUpLocation: "",
      deliveryLocation: [],
      pickupContactPerson: "",
      products: "",
      pickupInstructions: "",
      dropOffInstructions: [],
      partnerPolling: "",
    };
  },
  mixins: [mqtt, placeholders],
  computed: {
    ...mapGetters([
      "getLoader",
      "getOrderTrackingData",
      "getStorageUserDetails",
      "getDirectDeliveriesTrackingData",
    ]),
  },
  mounted() {
    this.setComponent("deliveries.trackHiredVehicles");
    this.fetchOrder();
    this.cancellationReasons();
    this.setActivePayment({});
  },
  beforeUnmount() {
    clearInterval(this.partnerPolling);
    clearInterval(this.orderPolling);
    this.setDirectDeliveriesTrackingData(this.placeholderOnDemand);
  },
  watch: {
    "$store.getters.getDirectDeliveriesTrackingData":
      function pointToPointOrders(val) {
        const instructions = val.order.instructions;
        const pickInstructions = instructions.filter((instruction) =>
          instruction.actions.some(
            (action) => action.action_type === "PICK_PACKAGE"
          )
        );
        if (pickInstructions.length > 0) {
          const instruction = pickInstructions[0];
          const action = instruction.actions.find(
            (a) => a.action_type === "PICK_PACKAGE"
          );
          this.pickUpLocation = instruction.delivery_location.description;
          this.pickupContactPerson = instruction.phone_number || "_";
          this.products = action.package_description;
          this.pickupInstructions = instruction.delivery_instructions || "_";
        }
        const dropInstructions = instructions.filter((instruction) =>
          instruction.actions.some(
            (action) => action.action_type === "DROP_PACKAGE"
          )
        );
        this.dropOffInstructions = dropInstructions;
      },
    "$route.params.order_id": {
      handler: function (new_order, last_order) {
        if (last_order !== new_order && last_order && new_order) {
          this.fetchOrder();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapMutations([
      "setOverlayStatus",
      "setLoader",
      "setOrderTrackingData",
      "setDirectDeliveriesTrackingData",
      "setComponent",
      "setCancellationReasons",
      "setActivePayment",
    ]),
    ...mapActions(["requestAxiosGet"]),
    onScroll(e) {
      this.scrollInvoked = e.target.scrollTop;
    },
    fetchOrder() {
      this.setLoader({
        type: "onDemandOrders",
        value: "loading-text",
      });
      this.setLoader({
        type: "locationDetails",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/point-to-point/${this.$route.params.order_id}`,
      }).then((response) => {
        this.setLoader({
          type: "orderTracking",
          value: "",
        });
        this.setLoader({
          type: "onDemandOrders",
          value: "",
        });
        if (response.status === 200) {
          this.setDirectDeliveriesTrackingData(response?.data?.data);
          if (
            response?.data?.data?.order?.error_status ===
            "WAITING_FOR_PRE_PAYMENT"
          ) {
            this.setLoader({
              type: "pendingPayment",
              value: "",
            });
            const activePayment =
              response?.data?.data?.order?.invoice_summary?.billing_cycle;
            activePayment.type = "on-demand";
            this.setActivePayment(activePayment);
          }
          if (response?.data?.data?.order?.assigned_shipping_agent?.agent_id) {
            this.getPartnersLastPosition();
            this.partnerPolling = setInterval(() => {
              if (
                this.$route.path.includes(
                  "/deliveries/track-direct-deliveries/"
                )
              ) {
                this.getPartnersLastPosition();
              }
            }, 30000);
            // this.initiateMQTT();
          }
          if (
            !["ORDER_CANCELED", "ORDER_COMPLETED"].includes(
              response?.data?.data?.order?.order_status
            )
          ) {
            this.orderPolling = setInterval(() => {
              if (
                this.$route.path.includes(
                  "/deliveries/track-direct-deliveries/"
                )
              ) {
                this.fetchOrderPolling();
              }
            }, 300000);
          }
        }
      });
    },
    cancellationReasons() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/cancellation-reasons?order_type=POINT_TO_POINT`,
      }).then((response) => {
        if (response.status === 200) {
          this.setCancellationReasons(
            response.data.data["cancellation-reasons"]
          );
        }
      });
    },
    fetchOrderPolling() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/point-to-point/${this.$route.params.order_id}`,
      }).then((response) => {
        if (response.status === 200) {
          this.setDirectDeliveriesTrackingData(response?.data?.data);
        }
      });
    },
  },
};
</script>
<style>
.direct-fulfilment-destination-container {
  border: 1px solid #e2e7ed;
  border-radius: 10px;
  width: calc(100% - 30px);
  font-size: 14px;
  background: white;
  margin-left: 70px;
  background: #fff;
}
.direct-fulfilment-destination-container-right {
  border: 1px solid #e2e7ed;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  padding: 30px 30px 20px 30px;
  margin-left: 30px;
  background: #fff;
}
.destination-divider-line {
  margin-top: 20px !important;
  height: 2px !important;
}
.right-tracking-column {
  height: max-content !important;
  overflow-y: scroll;
  height: calc(100vh - 205px) !important;
  margin-bottom: 20px;
}
.on-demand-make-payment {
  margin-left: 65px;
  width: 87%;
  margin-top: 30px;
  margin-bottom: -10px;
}
.on-demand-tracking-container {
  height: calc(100vh - 60px);
}
.on-demand-failed-transporter-banner {
  width: 90%;
  background: #d3ddf6;
  padding: 15px 35px;
  border-radius: 5px;
  display: flex;
  margin: auto;
  margin-top: 20px;
}
.on-demand-failed-transporter-banner-icon {
  font-size: 25px;
  color: #324ba8;
  margin-right: 10px;
}
.on-demand-failed-transporter-banner-text {
  font-size: 14px;
  color: #303133;
}
.on-demand-failed-transporter-rider-img {
  width: 368px;
  margin-top: 50px;
}
.on-demand-failed-transporter-rider-img-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
