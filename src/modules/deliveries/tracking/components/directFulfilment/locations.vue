<template>
  <div class="direct-fulfilment-location-container mt-3">
    <div class="location-titles-containers">
      <p class="location-desc-titles">Locations</p>
      <a class="location-desc-titles add-changes-popup">Add/Change</a>
    </div>
    <el-timeline class="location-el-timeline-override">
      <el-timeline-item
        class="location-el-timeline-item-override"
        :color="color2"
      >
        <div class="destination-points-container">
          <div class="destination-pickup-info-container">
            <span>Pickup Location</span>
            <p>Afya Center, Moi Avenue, Nairobi</p>
          </div>
          <div class="destination-delivery-info-container">
            <span>ETA</span>
            <p>23 May, 9:45am</p>
          </div>
        </div>
      </el-timeline-item>
      <el-timeline-item :color="color1">
        <div class="destination-points-container">
          <div class="destination-pickup-info-container">
            <span>Pickup Location</span>
            <p>Afya Center, Moi Avenue, Nairobi</p>
          </div>
          <div class="destination-delivery-info-container">
            <span>ETA</span>
            <p>23 May, 9:45am</p>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  data() {
    return {
      color1: "#324ba8",
      color2: "#ee7d00",
      location: [
        {
          heading: "Pickup Location",
          content: "Afya Center, Moi Avenue, Nairobi",
        },
        {
          heading: "Delivery Location",
          content: "Kenya High School, Nairobi",
        },
      ],
    };
  },
};
</script>
<style>
.location-desc-titles {
  font-size: 17px;
  font-weight: 400;
  margin-bottom: 0px !important;
  color: #606266;
}
.location-titles-containers {
  display: flex;
}
.location-el-timeline-override {
  padding-left: 0px !important;
  padding-top: 20px;
}
.add-changes-popup {
  margin-left: auto;
}
.destination-points-container {
  display: flex;
}
.destination-delivery-info-container {
  margin-left: auto;
}
.destination-pickup-info-container > p,
.destination-delivery-info-container > span {
  color: #606266;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
}
destination-delivery-info-container > p {
  margin-bottom: 0px !important;
}
.location-el-timeline-item-override {
  padding-bottom: 0px !important;
}
.add-changes-popup {
  color: #324ba8;
}
</style>
