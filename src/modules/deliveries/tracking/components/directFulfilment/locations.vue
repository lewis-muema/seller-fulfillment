<template>
  <div class="direct-fulfilment-destination-container-right mt-3">
    <div class="destination-titles-containers">
      <p class="destination-desc-titles" :class="getLoader.onDemandOrders">
        {{ $t("deliveries.orderDetails") }}
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
        v-for="(location, i) in dropInstructions"
        :key="i"
      >
        <div class="destination-points-container">
          <div class="destination-pickup-info-container">
            <span :class="getLoader.onDemandOrders">{{
              $t("deliveries.deliveryLocation")
            }}</span>
            <div class="dest-desc-loc" :class="getLoader.onDemandOrders">
              {{ location.delivery_location.description }}
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <p
      class="destination-points-delivery-fee"
      :class="getLoader.onDemandOrders"
    >
      <span class="destination-points-delivery-fee-title">
        {{ $t("deliveries.deliveryFee") }}
      </span>
      <i class="mdi mdi-information"></i>
      <span class="destination-points-delivery-fee-amount">
        {{ getDirectDeliveriesTrackingData.order?.invoice_summary?.currency }}
        {{
          getDirectDeliveriesTrackingData.order?.invoice_summary
            ?.invoiced_amount
        }}
      </span>
    </p>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["dropInstructions", "pickupLocation"],
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
.destination-points-delivery-fee {
  font-size: 14px;
  color: #606266;
  margin-bottom: 0px;
}
.destination-points-delivery-fee-title {
  padding-right: 5px;
  font-weight: 500;
}
.destination-points-delivery-fee-amount {
  float: right;
  font-size: 15px;
  font-weight: 500;
}
</style>
