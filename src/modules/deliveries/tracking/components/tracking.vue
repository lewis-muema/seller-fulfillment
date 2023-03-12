<template>
  <tracking-top-card />
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
import { mapGetters, mapMutations, mapActions } from "vuex";
import locations from "../components/directFulfilment/locations.vue";
import pickupInfo from "../components/directFulfilment/pickupInfo.vue";
import deliveryInfo from "../components/directFulfilment/driverInfo.vue";
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
    };
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getOrderTrackingData",
      "getStorageUserDetails",
    ]),
  },
  mounted() {
    this.fetchOrder();
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
      // this.setLoader({
      //   type: "orderTracking",
      //   value: "loading-text",
      // });
      // this.setLoader({
      //   type: "orderTimeline",
      //   value: "loading-text",
      // });
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
          type: "locationDetails",
          value: "",
        });
        if (response.status === 200) {
          this.setDirectDeliveriesTrackingData(response.data.data);
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
