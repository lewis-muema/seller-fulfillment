<template>
  <div class="direct-fulfilment-destination-container mt-3">
    <div class="destination-titles-containers">
      <p class="destination-desc-titles">Delivery Information</p>
      <a class="destination-desc-titles add-changes-popup">Edit</a>
    </div>
    <span>
      <i class="mdi mdi-map-marker-outline delivery-info-marker"></i>
      Afya Centre, Tom Mboya Street, Nairobi
    </span>
    <hr class="destination-divider-line" />
    <div class="destination-titles-containers mt-3">
      <p class="destination-desc-titles dest-pickup-title">Contact person</p>
      <p class="dest-pickup-desc">0789 123 456</p>
    </div>
    <div class="destination-titles-containers mt-1">
      <p class="destination-desc-titles dest-pickup-title">
        Pickup instructions
      </p>
      <p class="dest-pickup-desc">
        Call Jonathan before you get there so that he can open the gate
      </p>
    </div>
  </div>
</template>
<script>
export default {};
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
