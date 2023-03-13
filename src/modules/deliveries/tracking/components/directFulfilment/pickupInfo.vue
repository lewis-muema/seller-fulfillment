<template>
  <div class="direct-fulfilment-destination-container mt-3">
    <div class="destination-titles-containers">
      <p class="destination-desc-titles" :class="getLoader.onDemandOrders">
        Pickup Information
      </p>
      <a class="destination-desc-titles add-changes-popup" v-if="editLocation"
        >Edit</a
      >
    </div>
    <span class="d-flex">
      <i
        class="mdi mdi-map-marker-outline delivery-info-marker"
        :class="getLoader.onDemandOrders"
      ></i>
      <div :class="getLoader.onDemandOrders" class="destination-location-text">{{ pickupLocation }}</div>
    </span>
    <hr class="destination-divider-line" />
    <div class="destination-titles-containers mt-3">
      <p
        class="destination-desc-titles dest-pickup-title"
        :class="getLoader.onDemandOrders"
      >
        What are you sending?
      </p>
      <p class="dest-pickup-desc" :class="getLoader.onDemandOrders">
        {{ products }}
      </p>
    </div>
    <div class="destination-titles-containers mt-1">
      <p
        class="destination-desc-titles dest-pickup-title"
        :class="getLoader.onDemandOrders"
      >
        Bike type?
      </p>
      <p class="dest-pickup-desc" :class="getLoader.onDemandOrders">
        Without box
      </p>
    </div>
    <div class="destination-titles-containers mt-1">
      <p
        class="destination-desc-titles dest-pickup-title"
        :class="getLoader.onDemandOrders"
      >
        Contact person
      </p>
      <p class="dest-pickup-desc" :class="getLoader.onDemandOrders">
        {{ contactPerson }}
      </p>
    </div>
    <div class="destination-titles-containers mt-1">
      <p
        class="destination-desc-titles dest-pickup-title"
        :class="getLoader.onDemandOrders"
      >
        Pickup instructions
      </p>
      <p class="dest-pickup-desc" :class="getLoader.onDemandOrders">
        {{ pickInstructions }}
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["pickupLocation", "contactPerson", "products", "pickInstructions"],
  data() {
    return {
      editLocation: false,
    };
  },
  computed: {
    ...mapGetters(["getDirectDeliveriesTrackingData", "getLoader"]),
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
.destination-location-text {
  margin-top: 5px;
}
</style>
