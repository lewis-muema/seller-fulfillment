<template>
  <div class="direct-location-inputs-container">
    <div class="d-flex">
      <div class="direct-location-inputs-top-left">
        <i
          class="mdi mdi-arrow-left direct-location-inputs-top-left-back"
          aria-hidden="true"
          @click="this.$router.go(-1)"
        ></i>
        <div class="direct-location-inputs-top-left-title">
          {{ $t("deliveries.deliverOnDemand") }}
        </div>
        <div class="direct-location-inputs-top-left-description">
          {{ $t("deliveries.getAVehicle") }}
        </div>
      </div>
      <div>
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/rider.png"
          alt=""
          class="direct-location-inputs-top-image"
        />
      </div>
    </div>
    <div class="direct-location-inputs-top-banner" v-if="banner">
      <i
        class="mdi mdi-information-outline direct-location-inputs-top-banner-info"
      ></i>
      <div class="direct-location-inputs-top-banner-message">
        {{ $t("deliveries.usingThisOption") }}
      </div>
      <i
        class="mdi mdi-close direct-location-inputs-top-banner-close"
        @click="banner = false"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      banner: true,
    };
  },
};
</script>

<style>
.direct-location-inputs-container {
  color: black;
}
.direct-location-inputs-top-image {
  width: 175px;
  margin-top: -15px;
  margin-right: 15px;
  margin-bottom: -5px;
}
.direct-location-inputs-top-left {
  margin-left: 15px;
  margin-top: 10px;
}
.direct-location-inputs-top-left-back {
  font-size: 25px;
  cursor: pointer;
  margin-bottom: 14px;
}
.direct-location-inputs-top-left-title {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 500;
}
.direct-location-inputs-top-left-description {
  color: #606266;
  font-size: 13px;
}
.direct-location-inputs-top-banner {
  display: flex;
  margin: 15px;
  align-items: center;
  border-radius: 5px;
  background: #ddf0ff;
}
.direct-location-inputs-top-banner-info {
  margin: 10px;
  font-size: 25px;
  color: #324ba8;
}
.direct-location-inputs-top-banner-message {
  font-size: 13px;
  margin: 15px 0px;
}
.direct-location-inputs-top-banner-close {
  margin-right: 10px;
  margin-bottom: 40px;
  cursor: pointer;
}
</style>
