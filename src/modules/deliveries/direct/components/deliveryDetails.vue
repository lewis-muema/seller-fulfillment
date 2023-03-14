<template>
  <div>
    <div class="delivery-details-header">
      <div
        v-for="(stage, i) in stages"
        :key="i"
        class="delivery-details-header-item"
        @click="stage.status === 'done' ? setDirectOrderDetailsStep(i) : ''"
      >
        <div
          class="delivery-details-header-position"
          :class="`delivery-details-header-position-${stage.status}`"
        >
          <div v-if="stage.status === 'done'">
            <i class="mdi mdi-check"></i>
          </div>
          <div v-else>
            {{ stage.position }}
          </div>
        </div>
        <div :class="`delivery-details-header-title-${stage.status}`">
          {{ $t(stage.title) }}
        </div>
      </div>
    </div>
    <div v-if="activeStage === 0">
      <pickupInfo />
      <button
        class="btn desktop-select-continue-button pricing-tier-continue-btn"
        :class="pickUpValidation ? 'btn-primary' : 'disabled-continue'"
        @click="
          pickUpValidation
            ? setDirectOrderDetailsStep(1)
            : pickupValidationError()
        "
      >
        {{ $t("deliveries.continueToDeliveryInformation") }}
      </button>
    </div>
    <div v-if="activeStage === 1">
      <deliveryInfo />
      <button
        class="btn desktop-select-continue-button pricing-tier-continue-btn"
        :class="deliveryValidation ? 'btn-primary' : 'disabled-continue'"
        @click="
          deliveryValidation
            ? setDirectOrderDetailsStep(2)
            : deliveryValidationError()
        "
      >
        {{ $t("deliveries.continueToPayment") }}
      </button>
    </div>
    <div v-if="activeStage === 2">
      <confirmDetails />
      <button
        class="btn desktop-select-continue-button"
        :class="paymentValidation ? 'btn-primary' : 'disabled-continue'"
        v-loading="orderLoadingStatus"
        @click="paymentValidation ? placeOrder() : paymentValidationError()"
      >
        {{ $t("deliveries.confirmMakePayment") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { ElNotification } from "element-plus";
import pickupInfo from "./pickupInfo.vue";
import deliveryInfo from "./deliveryInfo.vue";
import confirmDetails from "./confirmDetails.vue";
import moment from "moment";

export default {
  components: { pickupInfo, deliveryInfo, confirmDetails },
  watch: {
    "$store.state.directOrderDetailsStep": function step(val) {
      this.changeStage(val);
    },
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
      "getSelectedVehicleType",
      "getSendyPhoneProps",
      "getVueTelInputProps",
      "getDirectOrderDetails",
      "getDirectOrderDetailsStep",
      "getPaymnetMethods",
      "getUserDetails",
    ]),
    pickUpLocation() {
      return this.getMarkers[0]?.location;
    },
    vehicleTypes() {
      return this.getSelectedVehicleType?.vehicle_type_options;
    },
    pickUpValidation() {
      const pickup = this.getDirectOrderDetails.pickup;
      return (
        pickup.delivery_item &&
        (pickup.schedule_option === 0 ||
          (pickup.schedule_option === 1 && pickup.pickup_date)) &&
        pickup.pickup_phone
      );
    },
    deliveryValidation() {
      const delivery = this.getDirectOrderDetails.destinations;
      const status = [];
      delivery.forEach((details) => {
        if (details.delivery_phone) {
          status.push(true);
        } else {
          status.push(false);
        }
      });
      return !status.includes(false);
    },
    paymentValidation() {
      return this.defaultPaymentMethod.length;
    },
    defaultPaymentMethod() {
      const method = [];
      this.getPaymnetMethods.forEach((row) => {
        if (row.default === 1) {
          method.push(row);
        }
      });
      return method;
    },
  },
  mounted() {
    this.changeStage(this.getDirectOrderDetailsStep);
  },
  data() {
    return {
      stages: [
        {
          title: "deliveries.pickup",
          position: 1,
          status: "active",
        },
        {
          title: "deliveries.delivery",
          position: 2,
          status: "inactive",
        },
        {
          title: "deliveries.payment",
          position: 3,
          status: "inactive",
        },
      ],
      activeStage: 0,
      items: [
        "furniture",
        "stationery",
        "clothing",
        "food",
        "toys",
        "beverages",
        "electronics",
        "homeOffice",
        "industrial",
        "livestock",
        "juice",
        "others",
      ],
      orderLoadingStatus: false,
    };
  },
  methods: {
    ...mapMutations([
      "setOverlayStatus",
      "setDirectOrderDetailsStep",
      "setMarkers",
      "setPolyline",
      "setPricing",
      "setDirectOrderStep",
      "setSelectedVehicleType",
      "setDirectOrderDetails",
      "setDirectOrderDetailsStep",
    ]),
    ...mapActions(["requestAxiosPost"]),
    changeStage(stage) {
      if (stage === 0) {
        this.stages[stage].status = "active";
        this.stages[stage + 1].status = "inactive";
        this.stages[stage + 2].status = "inactive";
      } else if (stage === 1) {
        this.stages[stage].status = "active";
        this.stages[stage - 1].status = "done";
        this.stages[stage + 1].status = "inactive";
      } else {
        this.stages[stage].status = "active";
        this.stages[stage - 1].status = "done";
        this.stages[stage - 2].status = "done";
      }
      this.activeStage = stage;
    },
    pickupValidationError() {
      ElNotification({
        title: "",
        message: this.$t("deliveries.pleaseEnterPickupDetails"),
        type: "warning",
      });
    },
    deliveryValidationError() {
      ElNotification({
        title: "",
        message: this.$t("deliveries.pleaseEnterDeliveryDetails"),
        type: "warning",
      });
    },
    paymentValidationError() {
      ElNotification({
        title: "",
        message: this.$t("deliveries.pleaseSelectAPaymentMethod"),
        type: "warning",
      });
    },
    generateUUID() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    },
    placeOrder() {
      const packageUUID = this.generateUUID();
      const payload = {
        instructions: [],
        pricing_uuid: this.getSelectedVehicleType.pricing_uuid,
        vehicle_type: this.getSelectedVehicleType.vehicle_type,
        vehicle_type_option: this.getDirectOrderDetails?.pickup?.vehicle_option
          ?.option_type
          ? this.getDirectOrderDetails?.pickup?.vehicle_option?.option_type
          : "",
        proposed_scheduled_date:
          this.getDirectOrderDetails.pickup.schedule_option === 0
            ? 0
            : moment(this.getDirectOrderDetails.pickup.pickup_date).valueOf(),
      };
      payload.instructions[0] = {
        name: `${this.getUserDetails.first_name} ${this.getUserDetails.last_name}`,
        phone_number: this.getDirectOrderDetails.pickup.pickup_phone,
        secondary_phone_number: "",
        delivery_location: {
          description: this.getMarkers[0]?.location,
          longitude: this.getMarkers[0]?.position?.lng,
          latitude: this.getMarkers[0]?.position?.lat,
        },
        house_location: this.getMarkers[0]?.location,
        delivery_instructions: this.getDirectOrderDetails?.pickup
          ?.pickup_instructions
          ? this.getDirectOrderDetails?.pickup?.pickup_instructions
          : "",
        actions: [
          {
            action_type: "PICK_PACKAGE",
            package_uuid: packageUUID,
            package_description:
              this.getDirectOrderDetails?.pickup?.delivery_item,
          },
        ],
      };
      this.getDirectOrderDetails.destinations.forEach((destination, i) => {
        payload.instructions[i + 1] = {
          name: destination.delivery_name,
          phone_number: destination.delivery_phone,
          secondary_phone_number: "",
          delivery_location: {
            description: destination?.location,
            longitude: destination?.position?.lng,
            latitude: destination?.position?.lat,
          },
          house_location: destination.location,
          delivery_instructions: destination.delivery_instructions
            ? destination.delivery_instructions
            : "",
          actions: [
            {
              action_type: "DROP_PACKAGE",
              package_uuid: packageUUID,
              package_description:
                this.getDirectOrderDetails?.pickup?.delivery_item,
            },
          ],
        };
      });
      this.orderLoadingStatus = true;
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/point-to-point`,
        values: payload,
      }).then((response) => {
        this.orderLoadingStatus = false;
        if (response.status === 200) {
          this.resetFlow();
          this.$router.push(
            `/deliveries/track-direct-deliveries/${response.data.data.order_id}`
          );
        } else {
          ElNotification({
            title: "",
            message: this.$t("deliveries.failedToCreateOrder"),
            type: "error",
          });
        }
      });
    },
    resetFlow() {
      this.setMarkers([]);
      this.setPolyline({});
      this.setPricing([]);
      this.setDirectOrderStep(0);
      this.setSelectedVehicleType({});
      this.setDirectOrderDetails({
        pickup: {},
        destinations: [],
      });
      this.setDirectOrderDetailsStep(0);
    },
  },
};
</script>

<style>
.delivery-details-header {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #dcdfe6;
  height: 60px;
  align-items: center;
}
.delivery-details-header-item {
  width: -webkit-fill-available;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #909399;
  cursor: pointer;
}
.delivery-details-header-position {
  width: 30px;
  height: 30px;
  border-radius: 27px;
  background: #dcdfe6;
  color: rgba(0, 0, 0, 0.3);
  margin-right: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.delivery-details-header-position-active {
  color: #303133 !important;
  background: #f9b87d !important;
}
.delivery-details-header-position-done {
  color: white !important;
  background: #20be47 !important;
}
.delivery-details-section {
  padding: 20px 5px;
  border-bottom: 1px solid #dcdfe6;
}
.delivery-details-section-title {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.delivery-details-section-icon {
  font-size: 20px;
  color: #909399;
  margin-right: 5px;
}
.delivery-details-section-item-badges {
  padding: 5px 15px;
  width: fit-content;
  border-radius: 30px;
  border: 1px solid #dcdfe6;
  margin: 3px 5px;
  cursor: pointer;
  font-size: 13px;
}
.delivery-details-section-items {
  display: flex;
  flex-wrap: wrap;
}
.delivery-details-section-pickup-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  margin: 5px;
  font-size: 14px;
  cursor: pointer;
  min-width: 140px;
  text-align: center;
}
.as-soon-as-possible {
  font-size: 13px;
}
.delivery-details-section-vehicle-types {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  margin: 5px;
  font-size: 14px;
  cursor: pointer;
}
.active-delivery-item,
.active-time-option,
.active-vehicle-option {
  background: #c8e5fc !important;
}
.delivery-details-section-pick-up {
  font-size: 13px;
  margin-top: 5px;
}
</style>
