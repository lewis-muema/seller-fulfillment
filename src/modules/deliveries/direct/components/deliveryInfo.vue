<template>
  <div>
    <div v-for="(marker, x) in getDirectOrderDetails.destinations" :key="x">
      <div class="delivery-details-section">
        <div>{{ $t("deliveries.deliveryInformation") }}</div>
        <div class="delivery-details-section-pick-up">
          {{ marker.location }}
        </div>
      </div>
      <div class="delivery-details-section">
        <div class="delivery-details-section-title contact-person">
          <i class="mdi mdi-phone-outline delivery-details-section-icon"></i>
          <div>
            {{ $t("deliveries.contactPerson") }}
          </div>
        </div>
        <div class="d-flex mb-3 contact-person-fields">
          <div>
            {{ $t("deliveries.name") }}
          </div>
          <div class="ml-auto">
            <input
              class="contact-person-name contact-person-fields-input"
              type="text"
              v-model="marker.delivery_name"
              :placeholder="$t('deliveries.enterName')"
            />
          </div>
        </div>
        <div class="d-flex mb-3 contact-person-fields">
          <div>
            {{ $t("deliveries.phone") }}
          </div>
          <div class="ml-auto">
            <vue-tel-input
              class="contact-person-fields-input"
              v-model="marker.delivery_phone"
              v-bind="getSendyPhoneProps"
              :input-options="getVueTelInputProps"
              @input="
                sendEvent(
                  marker.delivery_name,
                  'Enter_Destination_Contact_Person_Direct_Fulfillment'
                )
              "
            ></vue-tel-input>
          </div>
        </div>
        <div
          v-if="
            marker.delivery_phone &&
            !/^\+([0-9 ]+)$/i.test(marker.delivery_phone)
          "
          class="row error-msg withdraw-transaction-error mb-2 mt-1 field-required-error"
        >
          <div>
            {{ $t("inventory.pleaseMakeSureThisNumberIsValid") }}
          </div>
        </div>
        <div class="delivery-details-section-title">
          <i
            class="mdi mdi-file-document-outline delivery-details-section-icon"
          ></i>
          <div>
            {{ $t("deliveries.addDeliveryInstructionsOptional") }}
          </div>
        </div>
        <div>
          <textarea
            name=""
            :placeholder="$t('deliveries.addDeliveryInstructionsHere')"
            class="edit-info-instructions mb-0"
            v-model="marker.delivery_instructions"
            id="instructions"
            cols="37"
            rows="5"
            @input="
              sendEvent(
                marker.delivery_phone,
                'Add_Destination_Instructions_Direct_Fulfillment'
              )
            "
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
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
    ]),
    pickUpLocation() {
      return this.getMarkers[0]?.location;
    },
    vehicleTypes() {
      return this.getSelectedVehicleType?.vehicle_type_options;
    },
    markers() {
      const markers = [];
      this.getMarkers.forEach((marker, i) => {
        if (i > 0) {
          markers.push(marker);
        }
      });
      return markers;
    },
  },
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
  mounted() {
    this.getDirectOrderDetails.destinations = this.markers;
  },
  methods: {
    ...mapMutations(["setOverlayStatus"]),
    sendEvent(val, event) {
      this.sendSegmentEvents({
        event,
        data: {
          userId: this.getStorageUserDetails.business_id,
          email: this.getStorageUserDetails.email,
          data: val,
        },
      });
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
.contact-person {
  margin-right: 6px;
  margin-bottom: 0px !important;
  white-space: nowrap;
  font-size: 14px;
}
.contact-person-name {
  border: 1px solid #ced4da;
  width: 240px;
  height: 60px;
  border-radius: 3px;
  padding: 5px 10px;
}
.contact-person-fields {
  align-items: center;
  font-size: 14px;
}
.contact-person-fields-input {
  height: 40px;
}
.contact-person-fields .ml-auto input::placeholder,
.contact-person-fields-input input::placeholder {
  color: #909399;
  opacity: 1;
  font-size: 14px;
}
</style>
