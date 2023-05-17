<template>
  <div>
    <div class="confirm-delivery-details-title">
      {{ $t("deliveries.pleaseConfirmAndPayForYourOrder") }}
    </div>
    <div class="confirm-delivery-details-container">
      <div>
        <div class="d-flex">
          <div>
            {{ $t("deliveries.pickupInformation") }}
          </div>
          <div
            class="confirm-delivery-details-edit"
            @click="setDirectOrderDetailsStep(0)"
          >
            {{ $t("deliveries.edit") }}
          </div>
        </div>
        <div class="confirm-delivery-details-location">
          <i class="mdi mdi-map-marker-outline mr-1"></i>
          <div>
            {{ pickUpLocation }}
          </div>
        </div>
      </div>
      <div>
        <div class="confirm-delivery-details-item-row">
          <div class="confirm-delivery-details-item-row-left">
            {{ $t("deliveries.whatAreYouSending") }}
          </div>
          <div class="confirm-delivery-details-item-row-right">
            {{ pickupDetails?.delivery_item }}
          </div>
        </div>
        <div class="confirm-delivery-details-item-row">
          <div class="confirm-delivery-details-item-row-left">
            {{ $t("deliveries.pickupTime") }}
          </div>
          <div class="confirm-delivery-details-item-row-right">
            {{
              pickupDetails?.schedule_option === 1
                ? formatDate(pickupDetails?.pickup_date)
                : $t("deliveries.asSoonAsPossible")
            }}
          </div>
        </div>
        <div class="confirm-delivery-details-item-row">
          <div class="confirm-delivery-details-item-row-left">
            {{ $t("deliveries.vehicleType") }}
          </div>
          <div class="confirm-delivery-details-item-row-right">
            {{
              pickupDetails?.vehicle_option
                ? pickupDetails?.vehicle_option?.option_description
                : getSelectedVehicleType?.vehicle_type
                ? getSelectedVehicleType?.vehicle_type.replaceAll("_", " ")
                : "N/A"
            }}
          </div>
        </div>
        <div class="confirm-delivery-details-item-row">
          <div class="confirm-delivery-details-item-row-left">
            {{ $t("deliveries.contactPerson") }}
          </div>
          <div class="confirm-delivery-details-item-row-right">
            {{ pickupDetails?.pickup_phone }}
          </div>
        </div>
        <div class="confirm-delivery-details-item-row">
          <div class="confirm-delivery-details-item-row-left">
            {{ $t("deliveries.pickupInstructions") }}
          </div>
          <div class="confirm-delivery-details-item-row-right">
            {{
              pickupDetails?.pickup_instructions
                ? pickupDetails?.pickup_instructions
                : "N/A"
            }}
          </div>
        </div>
        <div
          class="confirm-delivery-details-item-row"
          v-if="getDirectOrderDetails?.selectPartner"
        >
          <div class="confirm-delivery-details-item-row-left">
            {{ $t("deliveries.transporter") }}
          </div>
          <div class="confirm-delivery-details-item-row-right">
            {{ getDirectOrderPartner?.agent_name }} ({{
              getDirectOrderPartner?.vehicle_identifier
            }})
          </div>
        </div>
      </div>
    </div>
    <div class="confirm-delivery-details-container">
      <div>
        <div class="d-flex">
          <div>
            {{ $t("deliveries.deliveryInformation") }}
          </div>
          <div
            class="confirm-delivery-details-edit"
            @click="setDirectOrderDetailsStep(1)"
          >
            {{ $t("deliveries.edit") }}
          </div>
        </div>
      </div>
      <div v-for="(destination, i) in destinationDetails" :key="i" class="mb-3">
        <div class="confirm-delivery-details-location">
          <i class="mdi mdi-map-marker-outline mr-1"></i>
          <div>
            {{ destination?.location }}
          </div>
        </div>
        <div>
          <div class="confirm-delivery-details-item-row">
            <div class="confirm-delivery-details-item-row-left">
              {{ $t("deliveries.contactPerson") }}
            </div>
            <div class="confirm-delivery-details-item-row-right">
              <div class="confirm-delivery-details-contact-person">
                <div>
                  {{ destination?.delivery_name }}
                </div>
                <div>
                  {{ destination?.delivery_phone }}
                </div>
              </div>
            </div>
          </div>
          <div class="confirm-delivery-details-item-row">
            <div class="confirm-delivery-details-item-row-left">
              {{ $t("deliveries.pickupInstructions") }}
            </div>
            <div class="confirm-delivery-details-item-row-right">
              {{
                destination?.delivery_instructions
                  ? destination?.delivery_instructions
                  : "N/A"
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="confirm-delivery-details-payment">
      <div class="confirm-delivery-details-payment-title">
        {{ $t("inventory.payment") }}
      </div>
      <div class="confirm-delivery-details-payment-fees">
        <div>{{ $t("deliveries.deliveryFees") }}</div>
        <div class="confirm-delivery-details-payment-fees-right">
          {{ getSelectedVehicleType.currency }}
          {{ getSelectedVehicleType.total_cost }}
        </div>
      </div>
      <div v-if="paymentEnabled">
        <div
          class="confirm-delivery-details-payment-default"
          v-for="(method, i) in defaultPaymentMethod"
          :key="i"
        >
          <img
            class="mr-2"
            :src="`https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons/${method.pay_method_name.toLowerCase()}.svg`"
            alt=""
          />
          <span class="ml-3">{{ formatPaymentMethod(method) }}</span>
          <span
            class="payment-default-right payment-default-trigger"
            @click="selectPaymentMethod"
          >
            <v-icon class="payment-method-icon">mdi-chevron-right</v-icon></span
          >
        </div>
        <div
          class="confirm-delivery-details-payment-default"
          v-if="defaultPaymentMethod.length === 0"
        >
          <span class="confirm-delivery-details-no-payment-left">{{
            $t("payments.noDefaultPaymentMethodSelected")
          }}</span>
          <span
            class="confirm-delivery-details-no-payment-right payment-default-trigger"
            @click="selectPaymentMethod"
            >{{ $t("inventory.change") }}
            <v-icon class="payment-method-icon">mdi-chevron-right</v-icon></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
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
      "getBusinessDetails",
      "getPaymnetMethods",
      "getUserDetails",
      "getDirectOrderPartner",
    ]),
    pickUpLocation() {
      return this.getMarkers[0]?.location;
    },
    pickupDetails() {
      const pickup = this.getDirectOrderDetails.pickup;
      return pickup;
    },
    destinationDetails() {
      const destinations = this.getDirectOrderDetails.destinations;
      return destinations;
    },
    paymentEnabled() {
      if (
        this.getBusinessDetails.settings &&
        this.getBusinessDetails.settings.payments_enabled
      ) {
        return true;
      }
      return false;
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
    this.getDefaultPaymentMethod();
  },
  methods: {
    ...mapActions(["requestAxiosPost"]),
    ...mapMutations(["setPaymentMethods", "setDirectOrderDetailsStep"]),
    formatDate(date) {
      return moment(date).format("ddd, Do MMM");
    },
    getDefaultPaymentMethod() {
      this.requestAxiosPost({
        app: process.env.AUTH,
        endpoint: "payment-gateway/payment_methods",
        values: {
          country_code: this.getBusinessDetails.country_code
            ? this.getBusinessDetails.country_code
            : localStorage.country,
          entity_id: "6",
          user_id: this.getBusinessDetails.business_id
            ? this.getBusinessDetails.business_id
            : JSON.parse(localStorage.userDetails).business_id,
          pay_direction: "PAY_IN",
        },
      }).then((response) => {
        if (response.data) {
          this.setPaymentMethods(response.data.saved_payment_methods);
        }
      });
    },
    formatPaymentMethod(method) {
      if (method.pay_method_id === 20) {
        return "Pay by Bank";
      }
      return method.pay_method_details
        ? method.pay_method_details
        : method.pay_method_name;
    },
    selectPaymentMethod() {
      const buPayload = {
        user_id: this.getBusinessDetails.business_id,
        entity_id: 6,
        currency: this.getBusinessDetails.currency,
        country_code: this.getBusinessDetails.country_code,
        amount: "",
        success_callback_url: "",
        fail_callback_url: "",
        txref: "",
        bulk: false,
        paybill_no: "",
        email: this.getUserDetails.email,
        authToken: localStorage.accessToken,
        firstname: this.getUserDetails.first_name,
        lastname: this.getUserDetails.last_name,
        payment_options: "",
        company_code: this.getBusinessDetails.company_code,
        locale: this.getBusinessDetails.language,
      };
      this.$paymentInit(buPayload, "choose-payment");
    },
  },
};
</script>

<style>
.confirm-delivery-details-title {
  margin-top: 25px;
  text-align: center;
  font-size: 15px;
  margin-bottom: 25px;
}
.confirm-delivery-details-container {
  border: 1px solid #dddfe6;
  border-radius: 5px;
  margin: 15px;
  padding: 15px;
}
.confirm-delivery-details-edit {
  margin-left: auto;
  color: #324ba8;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
}
.confirm-delivery-details-location {
  display: flex;
  font-size: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #dddfe6;
  padding-bottom: 10px;
}
.confirm-delivery-details-item-row {
  display: flex;
  height: 40px;
  align-items: center;
  font-size: 13px;
}
.confirm-delivery-details-item-row-left {
  color: #909399;
}
.confirm-delivery-details-item-row-right {
  font-size: 13px;
  margin-left: auto;
  text-transform: capitalize;
  color: #606266;
  font-weight: 500;
}
.confirm-delivery-details-payment {
  margin: 15px;
}
.confirm-delivery-details-payment-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 15px;
  margin-top: 35px;
}
.confirm-delivery-details-payment-fees {
  display: flex;
  font-size: 13px;
  border-bottom: 1px solid #dddfe6;
  padding-bottom: 15px;
}
.confirm-delivery-details-payment-fees-right {
  font-size: 14px;
  font-weight: 500;
  margin-left: auto;
}
.confirm-delivery-details-payment-default {
  height: 60px;
  border-radius: 5px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
}
.confirm-delivery-details-no-payment-left {
  font-size: 13px;
  color: #919399;
}
.confirm-delivery-details-no-payment-right {
  font-size: 13px;
  color: #606266;
  margin-left: auto;
  cursor: pointer;
}
.confirm-delivery-details-contact-person {
  text-align: right;
}
</style>
