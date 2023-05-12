<template>
  <div class="direct-location-inputs-container">
    <div class="d-flex">
      <div class="direct-location-inputs-top-left">
        <i
          v-if="getDirectOrderStep === 0"
          class="mdi mdi-arrow-left direct-location-inputs-top-left-back"
          aria-hidden="true"
          @click="this.$router.go(-1)"
        ></i>
        <div
          v-else
          @click="goBack()"
          class="direct-location-inputs-back-container"
        >
          <i
            class="mdi mdi-arrow-left direct-location-inputs-top-left-back"
            aria-hidden="true"
          ></i>
          <span class="direct-location-inputs-back-container-title">
            {{ backStatus }}
          </span>
        </div>
        <div class="direct-location-inputs-top-left-title">
          {{ $t("dashboard.hireAVehicle") }}
        </div>
        <div class="direct-location-inputs-top-left-description">
          {{ $t("deliveries.getAVehicle") }}
        </div>
      </div>
      <div class="direct-location-inputs-fleet-img">
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/fleet.png"
          alt=""
          class="direct-location-inputs-top-image"
        />
      </div>
    </div>
    <div class="direct-location-inputs-top-banner" v-if="getBanner !== false">
      <i
        class="mdi mdi-information-outline direct-location-inputs-top-banner-info"
      ></i>
      <div class="direct-location-inputs-top-banner-message">
        {{ $t("deliveries.usingThisOption") }}
      </div>
      <i
        class="mdi mdi-close direct-location-inputs-top-banner-close"
        @click="closeBanner()"
      ></i>
    </div>
  </div>
</template>

<script>
import cookieMixin from "@/mixins/cookie_mixin";
import { mapGetters, mapMutations } from "vuex";

export default {
  mixins: [cookieMixin],
  data() {
    return {
      banner: true,
    };
  },
  computed: {
    ...mapGetters([
      "getBanner",
      "getDirectOrderDetailsStep",
      "getDirectOrderStep",
    ]),
    bannerStatus() {
      return (
        this.getCookie("direct_fulfillment_banner") &&
        JSON.parse(this.getCookie("direct_fulfillment_banner"))
      );
    },
    backStatus() {
      if (
        this.getDirectOrderStep === 1 &&
        this.getDirectOrderDetailsStep === 0
      ) {
        return this.$t("deliveries.backToLocations");
      } else if (
        this.getDirectOrderStep === 2 &&
        this.getDirectOrderDetailsStep === 0
      ) {
        return this.$t("deliveries.backToVehicleTypes");
      } else if (
        this.getDirectOrderStep === 2 &&
        this.getDirectOrderDetailsStep === 1
      ) {
        return this.$t("deliveries.backToPickupInformation");
      } else if (
        this.getDirectOrderStep === 2 &&
        this.getDirectOrderDetailsStep === 2
      ) {
        return this.$t("deliveries.backToDeliveryInformation");
      }
      return "";
    },
  },
  mounted() {
    this.setBanner(
      this.getCookie("direct_fulfillment_banner") &&
        JSON.parse(this.getCookie("direct_fulfillment_banner"))
    );
  },
  methods: {
    ...mapMutations([
      "setBanner",
      "setDirectOrderDetailsStep",
      "setDirectOrderStep",
    ]),
    closeBanner() {
      this.setCookie("direct_fulfillment_banner", false, 365);
      this.setBanner(
        this.getCookie("direct_fulfillment_banner") &&
          JSON.parse(this.getCookie("direct_fulfillment_banner"))
      );
    },
    goBack() {
      if (
        this.getDirectOrderStep === 1 &&
        this.getDirectOrderDetailsStep === 0
      ) {
        this.setDirectOrderStep(0);
      } else if (
        this.getDirectOrderStep === 2 &&
        this.getDirectOrderDetailsStep === 0
      ) {
        return this.setDirectOrderStep(1);
      } else if (
        this.getDirectOrderStep === 2 &&
        this.getDirectOrderDetailsStep === 1
      ) {
        this.setDirectOrderDetailsStep(0);
      } else if (
        this.getDirectOrderStep === 2 &&
        this.getDirectOrderDetailsStep === 2
      ) {
        this.setDirectOrderDetailsStep(1);
      }
    },
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
  font-size: 20px;
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
.direct-location-inputs-fleet-img {
  display: flex;
  align-items: flex-end;
}
.direct-location-inputs-back-container {
  display: flex;
  align-items: center;
  width: 190px;
  cursor: pointer;
}
.direct-location-inputs-back-container-title {
  margin-left: 5px;
  white-space: nowrap;
  margin-top: -13px;
}
</style>
