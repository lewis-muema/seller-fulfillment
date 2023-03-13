<template>
  <div class="direct-fulfilment-destination-container mt-3">
    <div class="destination-titles-containers">
      <p class="destination-desc-titles">Pickup Information</p>
      <a class="destination-desc-titles add-changes-popup">Edit</a>
    </div>
    <span>
      <i class="mdi mdi-map-marker-outline delivery-info-marker"></i>
      {{ pickupLocation }}
    </span>
    <hr class="destination-divider-line" />
    <div class="destination-titles-containers mt-3">
      <p class="destination-desc-titles dest-pickup-title">
        What are you sending?
      </p>
      <p class="dest-pickup-desc">{{ products }}</p>
    </div>
    <div class="destination-titles-containers mt-1">
      <p class="destination-desc-titles dest-pickup-title">Bike type?</p>
      <p class="dest-pickup-desc">Without box</p>
    </div>
    <div class="destination-titles-containers mt-1">
      <p class="destination-desc-titles dest-pickup-title">Contact person</p>
      <p class="dest-pickup-desc">{{ contactPerson }}</p>
    </div>
    <div class="destination-titles-containers mt-1">
      <p class="destination-desc-titles dest-pickup-title">
        Pickup instructions
      </p>
      <p class="dest-pickup-desc">{{ pickInstructions }}</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["pickupLocation", "contactPerson", "products", "pickInstructions"],
  data() {},
  computed: {
    ...mapGetters(["getDirectDeliveriesTrackingData"]),
  },
};
</script>
<style>
.dest-pickup-title {
  font-size: 13px;
  color: #909399;
  line-height: 16px;
}
.dest-pickup-desc {
  margin-left: auto;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
}
</style>
