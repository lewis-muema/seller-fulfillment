<template>
  <div class="direct-fulfilment-destination-container mt-3 mb-5">
    <div class="destination-titles-containers">
      <p class="destination-desc-titles" :class="getLoader.onDemandOrders">
        {{ $t("deliveries.deliveryInfo") }}
      </p>
      <a
        class="destination-desc-titles add-changes-popup"
        v-if="editLocation"
        >{{ $t("deliveries.edit") }}</a
      >
    </div>
    <span class="d-flex">
      <i
        class="mdi mdi-map-marker-outline delivery-info-marker"
        :class="getLoader.onDemandOrders"
      ></i>
      <div class="destination-location-text" :class="getLoader.onDemandOrders">
        {{ deliveryLocation }}
      </div>
    </span>
    <hr class="destination-divider-line" />
    <div class="destination-titles-containers mt-3">
      <p
        class="destination-desc-titles dest-pickup-title"
        :class="getLoader.onDemandOrders"
      >
        {{ $t("deliveries.contactPerson") }}
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
        {{ $t("deliveries.dropOffInstructions") }}
      </p>
      <p class="dest-pickup-desc" :class="getLoader.onDemandOrders">
        {{ dropInstructions }}
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["deliveryLocation", "contactPerson", "dropInstructions"],
  data() {
    return {
      editLocation: false,
    };
  },
  computed: {
    ...mapGetters(["getLoader"]),
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
