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
    },
  },
  computed: {
    ...mapGetters(["getDirectDeliveriesTrackingData", "getLoader"]),
  },
  mounted() {
    this.setMapStatus(true);
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
    setPolyline() {},
  },
};
</script>
<style>
.tracking-map-container {
  height: 95% !important;
}
</style>
