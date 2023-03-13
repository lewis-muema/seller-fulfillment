<template>
  <div class="direct-fulfilment-destination-container mt-3 mb-5">
    <div class="destination-titles-containers">
      <p class="destination-desc-titles">Delivery Information</p>
      <a class="destination-desc-titles add-changes-popup">Edit</a>
    </div>
    <span>
      <i class="mdi mdi-map-marker-outline delivery-info-marker"></i>
      {{ deliveryLocation }}
    </span>
    <hr class="destination-divider-line" />
    <div class="destination-titles-containers mt-3">
      <p class="destination-desc-titles dest-pickup-title">Contact person</p>
      <p class="dest-pickup-desc">{{ contactPerson }}</p>
    </div>
    <div class="destination-titles-containers mt-1">
      <p class="destination-desc-titles dest-pickup-title">
        Drop off instructions
      </p>
      <p class="dest-pickup-desc">
        {{ dropInstructions }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: ["deliveryLocation", "contactPerson", "dropInstructions"],
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
