<template>
  <div>
    <div class="tracking-order-no">
      <i
        class="mdi mdi-arrow-left tracking-arrow-back"
        @click="$router.go(-1)"
      ></i>
      <p class="tracking-order-title">
        <span :class="$store.getters.getLoader">
          {{ $t("deliveries.orderNo") }} {{ orderNo }}
        </span>
        <span>
          <v-menu transition="slide-y-transition" anchor="bottom center">
            <template v-slot:activator="{ props }">
              <v-btn class="tracking-order-actions-btn" v-bind="props">
                {{ $t("deliveries.actions") }}
              </v-btn>
            </template>
            <v-list class="users-actions-popup">
              <v-list-item
                v-for="(action, i) in $store.getters.getDeliveryActions"
                :key="i"
              >
                <v-list-item-title @click="overlayStatus(i, true)">
                  {{ $t(action.label) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
      </p>
      <p class="tracking-order-time-est">
        <span :class="$store.getters.getLoader">
          {{ $t("deliveries.timeOfArrival") }} {{ timeOfArrival }}
        </span>
      </p>
    </div>
    <failed-delivery />
    <div class="tracking-section-container">
      <div>
        <timeline />
      </div>
      <div>
        <deliveryInfo />
        <products />
      </div>
    </div>
    <overlays :overlayVal="overlay" />
  </div>
</template>

<script>
import timeline from "./components/timeline.vue";
import deliveryInfo from "./components/deliveryInfo.vue";
import products from "./components/products.vue";
import failedDelivery from "./components/failedDelivery.vue";
import overlays from "./components/overlays.vue";

export default {
  components: {
    timeline,
    deliveryInfo,
    products,
    failedDelivery,
    overlays,
  },
  data() {
    return {
      orderNo: "AQW4567787",
      timeOfArrival: "Thursday, 25th Jan  2pm - 4pm",
      overlay: false,
    };
  },
  watch: {
    "$store.state.overlay": function (val) {
      this.overlayStatus(val.index, val.status);
    },
  },
  mounted() {
    if (this.$router.options.history.state.back === "/deliveries/sendy") {
      this.$store.commit(
        "setComponent",
        this.$t("deliveries.trackDeliveryToSendy")
      );
    }
    if (this.$router.options.history.state.back === "/deliveries/customer") {
      this.$store.commit(
        "setComponent",
        this.$t("deliveries.trackDeliveryToCustomer")
      );
    }
  },
  methods: {
    overlayStatus(index, status) {
      this.actions = this.$store.getters.getDeliveryActions;
      this.actions.forEach((row) => {
        row.trigger = false;
      });
      this.actions[index].trigger = status;
      this.$store.commit("setDeliveryActions", this.actions);
      this.overlay = status;
    },
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
</style>
