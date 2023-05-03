<template>
  <tracking-top-card />
  <div class="row">
    <div class="col-7">
      <tracking-map />
    </div>
    <div class="col-4 right-tracking-column">
      <locations
        :deliveryLocation="this.deliveryLocation"
        :pickupLocation="this.pickUpLocation"
      />
      <timeline />
      <pickup-info
        :pickupLocation="this.pickUpLocation"
        :contactPerson="this.pickupContactPerson"
        :products="this.products"
        :pickInstructions="this.pickupInstructions"
      />
      <deliveryInfo
        :deliveryLocation="formatDeliveryLocation"
        :contactPerson="this.deliveryContactPerson"
        :dropInstructions="this.dropOffInstructions"
      />
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
export default {
  components: {
    locations,
    trackingMap,
    pickupInfo,
    deliveryInfo,
    timeline,
    trackingTopCard,
  },
  data() {
    return {
      scrollInvoked: 0,
      pickUpLocation: "",
      deliveryLocation: [],
      pickupContactPerson: "",
      deliveryContactPerson: "",
      products: "",
      pickupInstructions: "",
      dropOffInstructions: "",
      partnerPolling: "",
    };
  },
  mixins: [mqtt],
  computed: {
    ...mapGetters([
      "getLoader",
      "getOrderTrackingData",
      "getStorageUserDetails",
      "getDirectDeliveriesTrackingData",
    ]),
    formatDeliveryLocation() {
      if (this.deliveryLocation.length === 1) {
        return this.deliveryLocation[0];
      } else {
        return this.deliveryLocation.join(", ");
      }
    },
  },
  mounted() {
    this.fetchOrder();
  },
  beforeUnmount() {
    clearInterval(this.partnerPolling);
  },
  watch: {
    "$store.getters.getDirectDeliveriesTrackingData":
      function pointToPointOrders(val) {
        val.order?.instructions.forEach((instruction) => {
          instruction.actions?.forEach((action) => {
            if (action.action_type === "PICK_PACKAGE") {
              this.pickUpLocation = instruction.delivery_location.description;
              this.pickupContactPerson = instruction.phone_number
                ? instruction.phone_number
                : "_";
              this.products = action.package_description;
              this.pickupInstructions = instruction.delivery_instructions
                ? instruction.delivery_instructions
                : "_";
            }
            if (action.action_type === "DROP_PACKAGE") {
              this.deliveryLocation.push(
                instruction.delivery_location.description
              );
              this.deliveryContactPerson = instruction.phone_number;
              this.dropOffInstructions = instruction.delivery_instructions
                ? instruction.delivery_instructions
                : "_";
            }
          });
        });
      },
  },
  methods: {
    ...mapMutations([
      "setOverlayStatus",
      "setLoader",
      "setOrderTrackingData",
      "setDirectDeliveriesTrackingData",
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
  height: 80vh;
  overflow-y: scroll;
}
</style>