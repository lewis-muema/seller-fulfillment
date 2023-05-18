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
        {{
          postPayEnabled
            ? $t("deliveries.confirmSubmitOrder")
            : $t("deliveries.confirmMakePayment")
        }}
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
import eventsMixin from "../../../../mixins/events_mixin";

export default {
  mixins: [eventsMixin],
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
      "getDirectOrderPartner",
      "getBusinessDetails",
      "getDirectOrderNumber",
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
        pickup.pickup_phone &&
        ((this.getDirectOrderPartner?.agent_id &&
          this.getDirectOrderDetails?.selectPartner) ||
          !this.getDirectOrderDetails?.selectPartner)
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
    postPayEnabled() {
      return this.getBusinessDetails?.settings
        ?.direct_fulfilment_post_pay_enabled;
    },
  },
  mounted() {
    this.changeStage(this.getDirectOrderDetailsStep);
    this.redirectToOrder();
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
      UUID: [],
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
      "setDirectOrderPartner",
      "setDirectOrderNumber",
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
      document.querySelector(".direct-inputs-cont").scrollTop = 0;
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
    generateUUID(x) {
      const UUIDVal = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        (c) =>
          (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16)
      );
      this.UUID[x] = UUIDVal;
    },
    getPickUpActions() {
      const actions = [];
      this.UUID.forEach((UUID) => {
        actions.push({
          action_type: "PICK_PACKAGE",
          package_uuid: UUID,
          package_description:
            this.getDirectOrderDetails?.pickup?.delivery_item,
        });
      });
      return actions;
    },
    placeOrder() {
      this.getDirectOrderDetails.destinations.forEach((details, x) => {
        this.generateUUID(x);
      });
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
        actions: this.getPickUpActions(),
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
              package_uuid: this.UUID[i],
              package_description:
                this.getDirectOrderDetails?.pickup?.delivery_item,
            },
          ],
        };
      });
      if (
        this.getDirectOrderPartner?.agent_id &&
        this.getDirectOrderDetails?.selectPartner
      ) {
        payload.proposed_shipping_agent = {
          agent_id: this.getDirectOrderPartner?.agent_id,
          agent_phone_number: this.getDirectOrderPartner?.agent_phone_number,
        };
      }
      this.orderLoadingStatus = true;
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/point-to-point`,
        values: payload,
      }).then((response) => {
        this.orderLoadingStatus = false;
        if (response.status === 200) {
          this.setDirectOrderNumber(response.data.data.order_id);
          if (
            response?.data?.data?.payment_instruction?.payment_urgency ===
            "PRE_PAY"
          ) {
            const billing_cycle =
              response?.data?.data?.payment_instruction?.billing_cycle;
            this.selectPaymentOptions(
              billing_cycle?.amount_to_charge,
              billing_cycle?.billing_cycle_instance_id
            );
          } else {
            this.redirectToOrder();
          }
          this.sendSegmentEvents({
            event: "Place_Direct_Fulfillment_Order",
            data: {
              userId: this.getStorageUserDetails.business_id,
              email: this.getStorageUserDetails.email,
              data: response.data.data,
            },
          });
        } else {
          ElNotification({
            title: this.$t("deliveries.failedToCreateOrder"),
            message: response?.response?.data?.errors[0]?.message,
            type: "error",
          });
        }
      });
    },
    redirectToOrder() {
      if (this.getDirectOrderNumber) {
        const orderNumber = this.getDirectOrderNumber;
        this.resetFlow();
        this.$router.push(`/deliveries/track-direct-deliveries/${orderNumber}`);
      }
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
      this.setDirectOrderPartner({});
      this.setDirectOrderNumber("");
    },
    selectPaymentOptions(amount, billingCycleId) {
      const buPayload = {
        user_id: this.getBusinessDetails.business_id,
        entity_id: 6,
        currency: this.getBusinessDetails.currency,
        country_code: this.getBusinessDetails.country_code,
        amount: amount,
        success_callback_url: "",
        fail_callback_url: "",
        txref: billingCycleId,
        bulk: false,
        paybill_no: "",
        email: this.getUserDetails.email,
        authToken: localStorage.accessToken,
        firstname: this.getUserDetails.first_name,
        lastname: this.getUserDetails.last_name,
        payment_options: "",
        company_code: this.getBusinessDetails.company_code,
        locale: this.getBusinessDetails.language,
        pay_direction: "PAY_IN",
      };

      this.$paymentInit(buPayload, "choose-payment-checkout");
    },
  },
};
</script>

<style>
.delivery-details-header {
  display: flex;
  width: 100%;
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
