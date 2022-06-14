<template>
  <div>
    <div class="tracking-order-no">
      <i
        class="mdi mdi-arrow-left tracking-arrow-back"
        @click="$router.go(-1)"
      ></i>
      <p class="tracking-order-title">
        <span :class="getLoader">
          {{ $t("deliveries.orderNo") }} {{ orderNo }}
        </span>
        <span>
          <v-menu transition="slide-y-transition" anchor="bottom center">
            <template v-slot:activator="{ props }">
              <v-btn
                class="tracking-order-actions-btn"
                append-icon="mdi-chevron-down"
                v-bind="props"
              >
                {{ $t("deliveries.actions") }}
              </v-btn>
            </template>
            <v-list class="users-actions-popup">
              <v-list-item v-for="(action, i) in getDeliveryActions" :key="i">
                <v-list-item-title
                  @click="
                    setOverlayStatus({
                      overlay: true,
                      popup: action.popup,
                    })
                  "
                >
                  {{ $t(action.label) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
      </p>
      <p class="tracking-order-time-est">
        <span :class="getLoader">
          {{ $t("deliveries.timeOfArrival") }} {{ timeOfArrival }}
        </span>
      </p>
    </div>
    <div class="tracking-order-failed-delivery">
      <failed-delivery />
    </div>
    <div class="tracking-section-container">
      <div>
        <timeline />
      </div>
      <div>
        <deliveryInfo />
        <products />
      </div>
    </div>
  </div>
</template>

<script>
import timeline from "./components/timeline.vue";
import deliveryInfo from "./components/deliveryInfo.vue";
import products from "./components/products.vue";
import failedDelivery from "./components/failedDelivery.vue";
import { mapMutations, mapGetters } from "vuex";

export default {
  components: {
    timeline,
    deliveryInfo,
    products,
    failedDelivery,
  },
  data() {
    return {
      orderNo: "AQW4567787",
      timeOfArrival: "Thursday, 25th Jan  2pm - 4pm",
      overlay: false,
    };
  },
  computed: {
    ...mapGetters(["getLoader", "getDeliveryActions"]),
  },
  mounted() {
    if (this.$router.options.history.state.back === "/deliveries/sendy") {
      this.setComponent(this.$t("deliveries.trackDeliveryToSendy"));
    }
    if (this.$router.options.history.state.back === "/deliveries/customer") {
      this.setComponent(this.$t("deliveries.trackDeliveryToCustomer"));
    }
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setOverlayStatus",
    ]),
  },
};
</script>

<style>
.tracking-section-container {
  display: grid;
  grid-template-columns: auto auto;
}
.tracking-order-no {
  margin: 30px 70px;
  line-height: 30px;
}
.tracking-arrow-back {
  font-size: 25px;
  cursor: pointer;
}
.tracking-order-title {
  font-weight: 500;
  font-size: 16px;
}
.tracking-order-time-est {
  font-size: 14px;
}
.vuejs3-datepicker__calendar-topbar {
  background-color: #ffffff !important;
  color: #000 !important;
  display: none;
}
.vuejs3-datepicker__calendar .cell.selected {
  background: #324ba8 !important;
}
.cell:not(.blank):not(.disabled).day:hover,
.cell:not(.blank):not(.disabled).month:hover,
.cell:not(.blank):not(.disabled).year:hover {
  border: 1px solid #324ba8 !important;
}
.tracking-order-failed-delivery {
  margin: 0px 40px;
}
</style>
