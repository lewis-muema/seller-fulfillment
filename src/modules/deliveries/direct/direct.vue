<template>
  <div class="d-flex">
    <div class="direct-navigation-bar">
      <directTemplate />
      <locationInputs />
    </div>
    <div class="direct-map">
      <routeMap />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import routeMap from "./components/map.vue";
import directTemplate from "./components/directTemplate.vue";
import locationInputs from "./components/locationInputs.vue";

export default {
  components: {
    routeMap,
    directTemplate,
    locationInputs,
  },
  computed: {
    ...mapGetters(["getStorageUserDetails", "getUserDetails"]),
  },
  mounted() {
    this.setComponent("dashboard.hireAVehicle");
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader"]),
  },
};
</script>

<style>
.direct-navigation-bar {
  z-index: 1000;
  width: 400px;
  background: white;
  border-left: 1px solid #e9e9e9;
  background-image: url(https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/linear-background.png);
  background-position: top -20px center;
  background-repeat: no-repeat;
  background-size: 100vw 100%;
  box-shadow: 10px 0px 15px -5px rgb(0 0 0 / 14%) !important;
}
.direct-map {
  width: calc(100% - 400px);
}
</style>
