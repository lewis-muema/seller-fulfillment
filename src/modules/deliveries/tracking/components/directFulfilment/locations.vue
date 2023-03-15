<template>
  <div class="direct-fulfilment-destination-container mt-3">
    <div class="destination-titles-containers">
      <p class="destination-desc-titles" :class="getLoader.onDemandOrders">
        {{ $t("deliveries.locations") }}
      </p>
      <a
        class="destination-desc-titles add-changes-popup"
        v-if="editLocation"
        >{{ $t("deliveries.addOrChange") }}</a
      >
    </div>
    <el-timeline class="location-el-timeline-override">
      <el-timeline-item
        class="location-el-timeline-item-override"
        :color="color2"
      >
        <div class="destination-points-container">
          <div class="destination-pickup-info-container">
            <span :class="getLoader.onDemandOrders">{{
              $t("deliveries.pickupLocation")
            }}</span>
            <div class="dest-desc-loc" :class="getLoader.onDemandOrders">
              {{ pickupLocation }}
            </div>
          </div>
        </div>
      </el-timeline-item>
      <el-timeline-item
        :color="color1"
        class="location-el-timeline-item-override"
      >
        <div class="destination-points-container">
          <div class="destination-pickup-info-container">
            <span :class="getLoader.onDemandOrders">{{
              $t("deliveries.deliveryLocation")
            }}</span>
            <div class="dest-desc-loc" :class="getLoader.onDemandOrders">
              {{ formatDeliveryInfo(deliveryLocation) }}
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["deliveryLocation", "pickupLocation"],
  data() {
    return {
      color1: "#324ba8",
      color2: "#ee7d00",
      editLocation: false,
    };
  },
  computed: {
    ...mapGetters(["getDirectDeliveriesTrackingData", "getLoader"]),
  },
  methods: {
    formatDeliveryInfo(text) {
      if (text.length === 1) {
        return text[0];
      } else {
        return text.join(", ");
      }
    },
  },
};
</script>
<style>
.destination-desc-titles {
  font-size: 17px;
  font-weight: 400;
  margin-bottom: 0px !important;
  color: #606266;
}
.destination-titles-containers {
  display: flex;
}
.location-el-timeline-override {
  padding-left: 0px !important;
  padding-top: 20px;
}
.add-changes-popup,
.dest-info-desc {
  margin-left: auto;
}
.destination-points-container {
  display: flex;
}
.destination-delivery-info-container {
  margin-left: auto;
}
.destination-pickup-info-container > div,
.destination-delivery-info-container > span {
  color: #606266;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
}
.dest-desc-loc {
  margin-bottom: 0px !important;
}
.location-el-timeline-item-override {
  padding-bottom: 0px !important;
}
.add-changes-popup {
  color: #324ba8;
}
.el-timeline-item__wrapper {
  top: -13px !important;
}
</style>
