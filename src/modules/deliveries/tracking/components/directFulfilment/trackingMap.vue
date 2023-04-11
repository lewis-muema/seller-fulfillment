<template>
  <div
    class="direct-fulfilment-destination-container tracking-map-container mt-3"
  >
    <div class="tracking-map-rider-label" v-if="shippingAgent">
      <div>
        <img
          src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/default_pic.jpg"
          alt=""
          class="rider-icon"
        />
      </div>
      <div>
        <div class="rider-title">{{ $t("deliveries.driver") }}</div>
        <div>{{ shippingAgent?.agent_name }}</div>
        <div class="rider-contacts">
          <span><i class="mdi mdi-phone rider-contacts-icon"></i></span>
          <span>{{ shippingAgent?.agent_phone_number }}</span>
        </div>
        <div class="rider-contacts">
          <span
            ><img
              class="rider-vehicle-image"
              :src="shippingAgent?.vehicle_type_image_url"
              alt=""
          /></span>
          <span>
            {{ shippingAgent?.vehicle_type.replaceAll("_", " ") }} ({{
              shippingAgent?.vehicle_identifier
            }})
          </span>
        </div>
      </div>
    </div>
    <directMap />
  </div>
</template>
<script>
import directMap from "../../../direct/components/map.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    directMap,
  },
  watch: {
    "$store.state.directDeliveriesTrackingData": function step() {
      this.setMapMarkers();
      this.setMapPolyline();
    },
    "$store.state.mapReady": function step() {
      this.setMapMarkers();
      this.setMapPolyline();
    },
  },
  computed: {
    ...mapGetters(["getDirectDeliveriesTrackingData", "getLoader"]),
    shippingAgent() {
      return this.getDirectDeliveriesTrackingData?.order
        ?.assigned_shipping_agent;
    },
  },
  mounted() {
    this.setMapStatus(true);
    this.setMarkers([]);
    this.setPolyline({});
    this.setRiders([]);
  },
  beforeUnmount() {
    this.setMarkers([]);
    this.setRiders([]);
    this.setPolyline({});
  },
  methods: {
    ...mapMutations(["setMarkers", "setPolyline", "setMapStatus", "setRiders"]),
    setMapMarkers() {
      const markers = [];
      this.getDirectDeliveriesTrackingData.order?.instructions.forEach(
        (instruction, i) => {
          markers.push({
            name: i === 0 ? "pick-up" : "destination",
            position: {
              lat: instruction.delivery_location.latitude,
              lng: instruction.delivery_location.longitude,
            },
            location: instruction.delivery_location.description,
            icon: {
              url: `https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/${
                i === 0 ? "pickup" : "destination"
              }.png`,
              scaledSize: { width: 20, height: 20 },
            },
          });
        }
      );
      this.setMarkers(markers);
    },
    setMapPolyline() {
      this.getDirectDeliveriesTrackingData.order?.path_data?.path_polyline?.forEach(
        (polyline) => {
          this.setPolyline({
            path: this.decode_path(polyline),
            geodesic: true,
            strokeColor: "#324BA8",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
        }
      );
    },
    decode_path(path) {
      const polyline = [];
      if (typeof google === "object") {
        // eslint-disable-next-line no-undef
        new google.maps.geometry.encoding.decodePath(path).forEach((row) => {
          polyline.push({ lat: row.lat(), lng: row.lng() });
        });
      }
      return polyline;
    },
  },
};
</script>
<style>
.tracking-map-container {
  height: 70vh !important;
  position: relative;
}
.tracking-map-rider-label {
  position: absolute;
  top: 0px;
  z-index: 10000;
  right: 0px;
  background: white;
  margin: 15px;
  width: max-content;
  border-radius: 5px;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
  padding: 5px 15px;
  display: flex;
  align-items: center;
}
.rider-icon {
  width: 70px;
  margin-right: 10px;
}
.rider-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}
.rider-contacts {
  font-size: 12px;
  height: 20px;
  display: flex;
  align-items: center;
}
.rider-vehicle-image {
  width: 20px;
  margin-right: 5px;
}
.rider-contacts-icon {
  font-size: 16px;
  margin-left: 3px;
  margin-right: 5px;
}
</style>
