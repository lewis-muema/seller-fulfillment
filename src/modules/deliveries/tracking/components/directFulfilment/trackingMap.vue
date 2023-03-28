<template>
  <div
    class="direct-fulfilment-destination-container tracking-map-container mt-3"
  >
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
  },
  mounted() {
    this.setMapStatus(true);
    this.setMarkers([]);
    this.setPolyline({});
  },
  beforeUnmount() {
    this.setMarkers([]);
    this.setPolyline({});
  },
  methods: {
    ...mapMutations(["setMarkers", "setPolyline", "setMapStatus"]),
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
  height: 95% !important;
}
</style>
