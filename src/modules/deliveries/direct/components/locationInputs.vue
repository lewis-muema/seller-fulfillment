<template>
  <div class="direct-inputs-container">
    <div class="location-divider" />
    <div class="d-flex">
      <div class="direct-inputs-prefix-icon" />
      <GMapAutocomplete
        id="pick-up"
        class="businessProfile-address direct-inputs"
        :value="pickup.name"
        :options="getMapOptions"
        :placeholder="$t('deliveries.enterPickupLocation')"
        @place_changed="setPickUp"
        @click="showSuggestions('pick-up', 0)"
      >
      </GMapAutocomplete>
    </div>
    <div class="d-flex">
      <div class="direct-inputs-prefix-icon" />
      <GMapAutocomplete
        id="destination"
        class="businessProfile-address direct-inputs"
        :value="location.name"
        :options="getMapOptions"
        :placeholder="$t('deliveries.enterDestination')"
        @place_changed="setDestination"
        @click="showSuggestions('destination', 1)"
      >
      </GMapAutocomplete>
    </div>
    <div class="d-flex" v-for="(destination, x) in destinations" :key="x">
      <div class="direct-inputs-prefix-icon" />
      <GMapAutocomplete
        :id="`destination${x}`"
        class="businessProfile-address direct-inputs"
        :value="destination.name"
        :options="getMapOptions"
        :placeholder="$t('deliveries.enterDestination')"
        @place_changed="setExtraDestination($event, x)"
        @click="showSuggestions('destination', x + 2)"
      >
      </GMapAutocomplete>
      <i
        class="mdi mdi-close direct-inputs-close-destination"
        @click="removeDestination(x + 2)"
      ></i>
    </div>
    <div v-if="getDirectOrderStep === 0">
      <div class="direct-inputs-add-destination" @click="addDestination()">
        <i class="mdi mdi-plus"></i>
        {{ $t("deliveries.addDestination") }}
      </div>
      <div
        class="mt-3 direct-inputs-suggestions-container"
        v-if="suggestionsActive && getLocationSuggestions?.length"
      >
        <div
          v-for="(location, l) in getLocationSuggestions"
          :key="l"
          class="direct-inputs-suggestion"
          @click="selectSuggestion(location)"
        >
          <i
            class="mdi mdi-map-marker-outline direct-inputs-suggestion-icon"
          ></i>
          <div>
            <div>
              {{ location.description }}
            </div>
            <div class="direct-inputs-suggestion-description">
              {{ location?.zone_name?.replaceAll("-", " ") }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <button
          class="btn desktop-select-continue-button"
          @click="fetchVehicleTypes()"
          v-loading="pricingLoadingStatus"
          :disabled="pricingLoadingStatus"
          :class="
            getMarkers?.length > 1 && getMarkers[0]?.name === 'pick-up'
              ? 'btn-primary'
              : 'disabled-continue'
          "
        >
          {{ $t("deliveries.continueToVehicleType") }}
        </button>
      </div>
    </div>
    <div v-if="getDirectOrderStep === 1">
      <pricingTiers />
    </div>
    <div v-if="getDirectOrderStep === 2">
      <deliveryDetails />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { ElNotification } from "element-plus";
import pricingTiers from "./pricingTiers.vue";
import deliveryDetails from "./deliveryDetails.vue";

export default {
  data() {
    return {
      pickup: {
        name: "",
        place: {},
      },
      location: {
        name: "",
        place: {},
      },
      destinations: [],
      showInputs: false,
      suggestionsActive: false,
      locationType: "",
      locationIndex: 0,
      pricingLoadingStatus: false,
    };
  },
  components: {
    pricingTiers,
    deliveryDetails,
  },
  computed: {
    ...mapGetters([
      "getPricing",
      "getMapOptions",
      "getMapStatus",
      "getMarkers",
      "getLocationSuggestions",
      "getStorageUserDetails",
      "getDirectOrderStep",
    ]),
    pricingInstructions() {
      const instructions = [];
      this.getMarkers.forEach((marker) => {
        if (marker) {
          const destination = {
            actions: [
              {
                action_type:
                  marker.name === "pick-up" ? "PICK_PACKAGE" : "DROP_PACKAGE",
                package_description: "",
                package_uuid: "",
              },
            ],
          };
          destination.delivery_location = {
            description: marker.location,
            longitude: marker.position.lng,
            latitude: marker.position.lat,
          };
          instructions.push(destination);
        }
      });
      return instructions;
    },
  },
  mounted() {
    this.mapLoaded();
    this.fetchSuggestions();
  },
  methods: {
    ...mapMutations([
      "setMarkers",
      "setMapStatus",
      "setLocationSuggestions",
      "setPricing",
      "setPolyline",
      "setDirectOrderStep",
    ]),
    ...mapActions(["requestAxiosGet", "requestAxiosPost"]),
    preloadExistingLocations() {
      this.getMarkers.forEach((marker, i) => {
        if (i === 0) {
          this.pickup.name = marker.location;
        } else if (i === 1) {
          this.location.name = marker.location;
        } else {
          this.destinations.splice(i - 2, 1, {
            name: marker.location,
          });
        }
      });
    },
    mapLoaded() {
      this.setMapStatus(false);
      const mapLoaded = setInterval(() => {
        if (typeof google === "object") {
          this.setMapStatus(true);
          clearInterval(mapLoaded);
          this.preloadExistingLocations();
        }
      }, 500);
    },
    setPickUp(place) {
      const location = document.querySelector(`#pick-up`).value;
      this.pickup = {
        name: location,
        place,
      };
      this.addMarker(0, place, "pick-up", location);
    },
    setDestination(place) {
      const location = document.querySelector(`#destination`).value;
      this.location = {
        name: location,
        place,
      };
      this.addMarker(1, place, "destination", location);
    },
    setExtraDestination(place, x) {
      const location = document.querySelector(`#destination${x}`).value;
      this.destinations.splice(x, 1, {
        name: location,
        place,
      });
      this.addMarker(x + 2, place, "destination", location);
    },
    addDestination() {
      this.destinations.push({
        name: "",
        location: {},
      });
    },
    addMarker(x, place, type, location) {
      this.resetSuggestion();
      const markers = this.getMarkers;
      markers[x] = {
        name: type,
        position: {
          lat: Number(place.geometry.location.lat()),
          lng: Number(place.geometry.location.lng()),
        },
        location,
        icon: {
          url: `https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/${
            type === "pick-up" ? "pickup" : "destination"
          }.png`,
          scaledSize: { width: 20, height: 20 },
        },
      };
    },
    removeDestination(x) {
      this.destinations.splice(x - 2, 1);
      const markers = this.getMarkers;
      markers.splice(x, 1);
      this.setDirectOrderStep(0);
    },
    fetchVehicleTypes() {
      if (
        this.getMarkers?.length > 1 &&
        this.getMarkers[0]?.name === "pick-up"
      ) {
        this.submitLocations();
      } else {
        ElNotification({
          title: "",
          message: this.$t("deliveries.pleaseEnterAPickupAndDestination"),
          type: "warning",
        });
      }
    },
    submitLocations() {
      this.pricingLoadingStatus = true;
      const payload = {
        instructions: this.pricingInstructions,
      };
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/point-to-point/calculate-pricing`,
        values: payload,
      }).then((response) => {
        this.pricingLoadingStatus = false;
        if (response.status === 200) {
          response.data.data.path_data.path_polyline.forEach((polyline) => {
            this.setPolyline({
              path: this.decode_path(polyline),
              geodesic: true,
              strokeColor: "#324BA8",
              strokeOpacity: 1.0,
              strokeWeight: 2,
            });
          });
          this.formatPricing(response.data.data);
          this.setDirectOrderStep(1);
        } else {
          ElNotification({
            title: "",
            message: this.$t("deliveries.couldNotFetchPricingTiers"),
            type: "error",
          });
        }
      });
    },
    formatPricing(pricing) {
      const tiers = [];
      pricing.pricing_options.forEach((price) => {
        if (!tiers.includes(price.pricing_tier_group)) {
          tiers.push(price.pricing_tier_group);
        }
      });
      const filteredTiers = {};
      tiers.forEach((tier) => {
        const pricing_tiers = pricing.pricing_options.filter((price) => {
          return price.pricing_tier_group === tier;
        });
        filteredTiers[tier] = pricing_tiers;
      });
      this.setPricing(filteredTiers);
    },
    fetchSuggestions() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/locations`,
      }).then((response) => {
        if (response.status === 200) {
          this.setLocationSuggestions(response.data.data.addresses);
        }
      });
    },
    showSuggestions(type, index) {
      this.locationType = type;
      this.locationIndex = index;
      this.suggestionsActive = true;
      this.setDirectOrderStep(0);
    },
    selectSuggestion(location) {
      if (this.locationIndex === 0) {
        this.pickup.name = location.description;
      } else if (this.locationIndex === 1) {
        this.location.name = location.description;
      } else {
        this.destinations[this.locationIndex - 2] = {
          name: location.description,
          place: {},
        };
      }
      const markers = this.getMarkers;
      markers[this.locationIndex] = {
        name: this.locationType,
        position: {
          lat: Number(location.latitude),
          lng: Number(location.longitude),
        },
        location: location.description,
        icon: {
          url: `https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/${
            this.locationType === "pick-up" ? "pickup" : "destination"
          }.png`,
          scaledSize: { width: 20, height: 20 },
        },
      };
      this.resetSuggestion();
    },
    resetSuggestion() {
      this.locationType = "";
      this.locationIndex = 0;
      this.suggestionsActive = false;
    },
    decode_path(path) {
      const polyline = [];
      // eslint-disable-next-line no-undef
      new google.maps.geometry.encoding.decodePath(path).forEach((row) => {
        polyline.push({ lat: row.lat(), lng: row.lng() });
      });
      return polyline;
    },
  },
};
</script>

<style>
.direct-inputs-container {
  margin: 25px;
  position: relative;
  height: 60vh;
  overflow-y: scroll;
}
.direct-inputs-prefix-icon {
  margin: 15px 15px 0px 5px;
  width: 8px;
  height: 8px;
  background: #324ba8;
  border-radius: 10px;
}
.direct-inputs {
  height: 40px;
}
.direct-inputs-divider {
  width: 1px;
  position: absolute;
  height: 50px;
  background: #909399;
  margin-top: 30px;
  margin-left: 8px;
}
.direct-inputs-add-destination {
  color: #909399;
  cursor: pointer;
}
.direct-inputs-close-destination {
  margin-top: 8px;
  margin-left: 10px;
  cursor: pointer;
}
.direct-inputs-suggestions-container {
  height: 240px;
  overflow-y: scroll;
}
.direct-inputs-suggestion {
  display: flex;
  min-height: 60px;
  border-top: 1px solid #9093996e;
  align-items: center;
  padding: 10px 0px;
  cursor: pointer;
}
.direct-inputs-suggestion-icon {
  margin-right: 20px;
  font-size: 25px;
  color: #909399;
}
.direct-inputs-suggestion-description {
  color: #909399;
  text-transform: lowercase;
  font-size: 13px;
}
.disabled-continue {
  background: #909399 !important;
  border-color: #909399 !important;
  color: white !important;
}
.location-divider {
  height: 55px;
  position: absolute;
  width: 1px;
  background: #90939980;
  top: 27px;
  left: 8px;
}
</style>
