<template>
  <GoogleMap
    v-if="googleApiKey && getMapStatus"
    id="map"
    ref="googleMapCmp"
    class="base-map"
    map-type-id="roadmap"
    :api-key="googleApiKey"
    :center="center"
    :zoom="14"
    :map-type-control="false"
    :clickable-icons="false"
    :disableDefaultUi="true"
  >
    <Marker
      v-for="marker in markers"
      :key="JSON.stringify(marker)"
      :options="{
        title: marker.name,
        position: marker.position,
        icon: marker.icon,
      }"
    >
    </Marker>
    <InfoWindow
      v-for="marker in markers"
      :key="JSON.stringify(marker)"
      :options="{
        position: infoWindowPosition(marker.position),
        content: marker.location,
      }"
    />
    <Marker
      v-for="rider in riders"
      :key="JSON.stringify(rider)"
      :options="{
        title: rider.name,
        position: rider.position,
        icon: rider.icon,
      }"
    />
    <Polyline :options="polyline" />
  </GoogleMap>
</template>

<script>
import { defineComponent } from "vue";
import { GoogleMap, Marker, Polyline, InfoWindow } from "vue3-google-map";
import { mapGetters, mapMutations } from "vuex";

export default defineComponent({
  data() {
    return {
      center: {
        lat: -1.3084143,
        lng: 36.780982,
      },
      mapLoadedStatus: false,
    };
  },
  components: {
    GoogleMap,
    Marker,
    Polyline,
    InfoWindow,
  },
  watch: {
    markers: {
      handler(markers) {
        if (this.mapLoadedStatus && markers?.length) {
          this.fitMapToBounds();
        }
      },
      deep: true,
    },
    riders: {
      handler(riders) {
        if (this.mapLoadedStatus && riders?.length) {
          this.fitMapToBounds();
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["getMarkers", "getPolyline", "getMapStatus", "getRiders"]),
    googleApiKey() {
      return process?.env?.GOOGLE_API_KEY_TEST;
    },
    markers() {
      const markers = [];
      this.getMarkers.forEach((marker) => {
        if (marker) {
          markers.push(marker);
        }
      });
      return markers;
    },
    riders() {
      const riders = [];
      this.getRiders.forEach((rider) => {
        if (rider) {
          riders.push(rider);
        }
      });
      return riders;
    },
    polyline() {
      return this.getPolyline;
    },
  },
  mounted() {
    this.mapLoaded();
  },
  beforeUnmount() {
    this.setMapReady(false);
  },
  methods: {
    ...mapMutations([
      "setMarkers",
      "setPolyline",
      "setMapStatus",
      "setMapReady",
      "setRiders",
    ]),
    mapLoaded() {
      const mapLoaded = setInterval(() => {
        if (this?.$refs?.googleMapCmp?.mapTilesLoaded) {
          // this.setMapElements();
          this.mapLoadedStatus = true;
          clearInterval(mapLoaded);
          this.setMapReady(true);
          if (this.markers?.length) {
            this.fitMapToBounds();
          }
        }
      }, 500);
    },
    setMapElements() {
      this.setPolyline({
        path: this.decode_path(
          "lfbGcwn_Fn@FV_BH]FOx@s@`@Xj@Xb@Lf@Ff@Ap@Gr@OtAo@jBbFFPzCeAlBw@bEgB?CW]_DqG]u@gA}B{@_BuAyCqEwJwBgEaBwCy@aBUk@u@gCaA{B{A{Cg@aAuBwEm@]i@M_@EUAW@UDe@^UZm@t@SNi@P_@BeABuALs@N]Lw@d@uBjAuA~@wBtA}F|DkCvB}@`AkA~As@lAs@rBe@|Aa@pBSxBGbB?b@F|BTzBZjC~@~FLlATlBBz@DfDCpCWtEE`@W|Am@xCgAdGKj@MvCCdBFz@NhBLfA`@bBJ`@^`AXt@hApB\\h@|BjClC`Cr@t@v@|@v@jAr@tAd@dA`@pA^bBV|BH~AFnHNlD`@jCXjAZ`An@xAh@hAhCrDf@p@hAhBf@bA`@dAj@vBTdARhB|@dKx@dKxA|QxA|PNfEI~CY|B_@dByDlLcBdFoBhF_BdFa@jAgAbCmAfBwA~AgDxCeDjCsS|PeChBmBdAkC`Ae@NwIzA_AReCr@_Ab@eBlAsAjA}@`A]\\c@j@gBrBu@dAm@p@{A|BgAzBYjAALAh@Hh@V^ZTh@Ph@B\\AZEVKVSVc@Jg@Bk@AWKw@_@s@e@q@eBmB{AmB]k@m@{AQu@UyAEyA@gAH}@PgAX}@Xy@Jg@Hi@?o@UwAmAoFgDuMa@mCo@wDc@oDiBeNeA{IUiAu@qCoAkFmAeEaAkEaDiLqAeFwA}FoBmHc@oBgC_JG[i@kBsA_EYy@iAoDkAyDm@oBYk@e@kBIe@O{ACi@?w@Lm@DYOWNqAAMIMOGQ?C@C@C@ICCG?GEOAYJu@"
        ),
        geodesic: true,
        strokeColor: "#324BA8",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
    },
    fitMapToBounds() {
      // eslint-disable-next-line no-undef
      const bounds = new google.maps.LatLngBounds();
      for (const m of this.markers) {
        bounds.extend(m?.position);
      }
      for (const m of this.riders) {
        bounds.extend(m?.position);
      }
      this.$refs.googleMapCmp.map.fitBounds(bounds);
      if (this.getMarkers?.length <= 1) {
        this.$refs.googleMapCmp.map.setZoom(this.$refs.googleMapCmp.zoom - 2);
      }
    },
    decode_path(path) {
      const polyline = [];
      // eslint-disable-next-line no-undef
      new google.maps.geometry.encoding.decodePath(path).forEach((row) => {
        polyline.push({ lat: row.lat(), lng: row.lng() });
      });
      return polyline;
    },
    infoWindowPosition(position) {
      const lat = position.lat + 0.003;
      const lng = position.lng;
      return {
        lat,
        lng,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.base-map {
  height: 100%;
  border-radius: 4px;

  :deep(.vue-map) {
    border-radius: 4px;
  }
}

#map {
  width: 100%;
  height: 100%;
}
.map-marker {
  width: 10px;
}
</style>
