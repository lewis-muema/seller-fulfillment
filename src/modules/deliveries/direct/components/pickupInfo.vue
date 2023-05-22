<template>
  <div>
    <div class="delivery-details-section">
      <div>{{ $t("deliveries.pickupInformation") }}</div>
      <div class="delivery-details-section-pick-up">{{ pickUpLocation }}</div>
    </div>
    <div class="delivery-details-section">
      <div class="delivery-details-section-title">
        <i class="mdi mdi-archive-outline delivery-details-section-icon"></i>
        <div>
          {{ $t("deliveries.whatAreYouSending") }}
        </div>
      </div>
      <div class="delivery-details-section-items">
        <div
          v-for="(item, x) in items"
          :key="x"
          class="delivery-details-section-item-badges"
          @click="getDirectOrderDetails.pickup.delivery_item = item"
          :class="
            getDirectOrderDetails.pickup.delivery_item === item
              ? 'active-delivery-item'
              : ''
          "
        >
          {{ $t(`deliveries.${item}`) }}
        </div>
      </div>
    </div>
    <div class="delivery-details-section">
      <div class="delivery-details-section-title">
        <i class="mdi mdi-clock-outline delivery-details-section-icon"></i>
        <div>
          {{ $t("deliveries.pickUpTime") }}
        </div>
      </div>
      <div class="d-flex">
        <div
          class="delivery-details-section-pickup-items"
          @click="getDirectOrderDetails.pickup.schedule_option = 0"
          :class="
            getDirectOrderDetails.pickup.schedule_option === 0
              ? 'active-time-option'
              : ''
          "
        >
          <div>
            {{ $t("deliveries.asSoonAsPossible") }}
          </div>
        </div>
        <div
          class="delivery-details-section-pickup-items"
          @click="reschedule()"
          :class="
            getDirectOrderDetails.pickup.schedule_option === 1
              ? 'active-time-option'
              : ''
          "
        >
          <div>
            {{ $t("deliveries.scheduleTime") }}
          </div>
          <div class="as-soon-as-possible">
            {{
              getDirectOrderDetails.pickup.pickup_date
                ? formattedDate(getDirectOrderDetails.pickup.pickup_date)
                : ""
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="delivery-details-section">
      <div v-if="vehicleTypes?.length">
        <div class="delivery-details-section-title">
          <i class="mdi mdi-motorbike delivery-details-section-icon"></i>
          <div>
            {{ $t("deliveries.whatTypeOfBikeDoYouWant") }}
          </div>
        </div>
        <div class="delivery-details-section-items">
          <div
            v-for="(vehicleType, v) in vehicleTypes"
            :key="v"
            class="delivery-details-section-vehicle-types"
            @click="getDirectOrderDetails.pickup.vehicle_option = vehicleType"
            :class="
              getDirectOrderDetails?.pickup?.vehicle_option
                ?.option_description === vehicleType?.option_description
                ? 'active-vehicle-option'
                : ''
            "
          >
            {{ vehicleType.option_description }}
          </div>
        </div>
      </div>
    </div>
    <div class="delivery-details-section d-flex">
      <div class="delivery-details-section-title contact-person">
        <i class="mdi mdi-phone-outline delivery-details-section-icon"></i>
        <div>
          {{ $t("deliveries.contactPerson") }}
        </div>
      </div>
      <div>
        <vue-tel-input
          class="contact-person-fields-input"
          v-model="getDirectOrderDetails.pickup.pickup_phone"
          v-bind="getSendyPhoneProps"
          :input-options="getVueTelInputProps"
        ></vue-tel-input>
      </div>
    </div>
    <div class="delivery-details-section">
      <div class="delivery-details-section-title">
        <i
          class="mdi mdi-file-document-outline delivery-details-section-icon"
        ></i>
        <div>
          {{ $t("deliveries.addPickupInstructionsOptional") }}
        </div>
      </div>
      <div>
        <textarea
          name=""
          :placeholder="$t('deliveries.addPickupInstructionsHere')"
          class="edit-info-instructions mb-0"
          v-model="getDirectOrderDetails.pickup.pickup_instructions"
          id="instructions"
          cols="37"
          rows="5"
        ></textarea>
      </div>
    </div>
    <div class="delivery-details-section">
      <div class="delivery-details-section-select-partner-title">
        <i class="mdi mdi-racing-helmet delivery-details-section-icon"></i>
        {{ $t("deliveries.doYouHaveAPreferredRider") }}
        <v-switch
          v-model="getDirectOrderDetails.selectPartner"
          class="partner-select-switch"
          color="indigo"
          hide-details
        ></v-switch>
      </div>
      <div
        class="delivery-details-section-items"
        v-if="getDirectOrderDetails.selectPartner"
      >
        {{ $t("deliveries.enterDriversPhone") }}
      </div>
      <partnerSearch v-if="getDirectOrderDetails.selectPartner" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import moment from "moment";
import partnerSearch from "../../../common/partnerSearch.vue";
import eventsMixin from "../../../../mixins/events_mixin";

export default {
  mixins: [eventsMixin],
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
      "getDirectOrderPartner",
    ]),
    pickUpLocation() {
      return this.getMarkers[0]?.location;
    },
    vehicleTypes() {
      return this.getSelectedVehicleType?.vehicle_type_options;
    },
  },
  components: { partnerSearch },
  data() {
    return {
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
    };
  },
  watch: {
    "$store.state.directOrderDetails.pickup.delivery_item": {
      handler(val) {
        this.sendSegmentEvents({
          event: "Add_Pickup_item_Direct_Fulfillment",
          data: {
            userId: this.getStorageUserDetails.business_id,
            email: this.getStorageUserDetails.email,
            data: val,
          },
        });
      },
      deep: true,
    },
    "$store.state.directOrderDetails.pickup.pickup_date": {
      handler(val) {
        this.sendSegmentEvents({
          event: "Add_Pickup_Time_Direct_Fulfillment",
          data: {
            userId: this.getStorageUserDetails.business_id,
            email: this.getStorageUserDetails.email,
            data: val,
          },
        });
      },
      deep: true,
    },
    "$store.state.directOrderDetails.pickup.pickup_phone": {
      handler(val) {
        this.sendSegmentEvents({
          event: "Add_Pickup_Contact_Direct_Fulfillment",
          data: {
            userId: this.getStorageUserDetails.business_id,
            email: this.getStorageUserDetails.email,
            data: val,
          },
        });
      },
      deep: true,
    },
    "$store.state.directOrderDetails.pickup.pickup_instructions": {
      handler(val) {
        this.sendSegmentEvents({
          event: "Add_Pickup_Instructions_Direct_Fulfillment",
          data: {
            userId: this.getStorageUserDetails.business_id,
            email: this.getStorageUserDetails.email,
            data: val,
          },
        });
      },
      deep: true,
    },
    "$store.state.directOrderPartner": {
      handler(val) {
        this.sendSegmentEvents({
          event: "Select_Preferred_Pairing_Partner_Direct_Fulfillment",
          data: {
            userId: this.getStorageUserDetails.business_id,
            email: this.getStorageUserDetails.email,
            data: val,
          },
        });
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations(["setOverlayStatus", "setDirectOrderPartner"]),
    reschedule() {
      this.setOverlayStatus({
        overlay: true,
        popup: "rescheduleDirect",
      });
      this.getDirectOrderDetails.pickup.schedule_option = 1;
    },
    formattedDate(date) {
      return moment(date).format("hh:mm a, ddd, Do MMM");
    },
  },
};
</script>

<style>
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
.delivery-details-section-select-partner {
  width: 100px;
}
.delivery-details-section-select-partner-title {
  font-size: 16px;
  margin-top: 15px;
  display: flex;
  align-items: center;
}
.delivery-details-section-selected-partner {
  padding: 15px 15px;
  background: #dddfe6;
  border-radius: 5px;
  margin-top: 10px;
}
.partner-description {
  width: 240px !important;
}
.selected-partner-remove {
  font-size: 11px;
  position: absolute;
  right: 20px;
  cursor: pointer;
  text-decoration: underline;
  color: #324aa8;
}
.partner-select-switch .v-input__control .v-selection-control {
  float: right;
}
</style>
