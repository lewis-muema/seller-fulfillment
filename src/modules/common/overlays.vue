<template>
  <v-overlay v-model="overlay" class="align-center justify-center">
    <div class="tracking-reschedule-container" v-if="popup === 'reschedule'">
      <div class="tracking-reschedule-title-section">
        <p class="tracking-reschedule-title-label">
          {{ $t("deliveries.pickATime") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'reschedule')"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <datepicker
        :disabled-dates="{
          to: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0),
          from: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        }"
        v-model="date"
        :inline="true"
        :prevent-disable-date-selection="true"
      ></datepicker>
      <v-btn class="tracking-reschedule-submit-button">
        {{ $t("deliveries.submit") }}
      </v-btn>
    </div>
    <div class="tracking-reschedule-container" v-if="popup === 'cancel'">
      <div class="tracking-reschedule-title-section">
        <p class="tracking-cancel-title-label">
          {{ $t("deliveries.whyCancel") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'cancel')"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <v-radio-group v-model="radioGroup">
        <v-radio
          v-for="(reason, x) in cancelReasons"
          :key="x"
          :label="$t(reason.label)"
          :value="reason.value"
        ></v-radio>
      </v-radio-group>
      <v-btn class="tracking-cancel-button">
        {{ $t("deliveries.cancelOrder") }}
      </v-btn>
    </div>
    <div v-if="popup === 'deliveryInfo'" class="view-products-container">
      <div class="view-products-section">
        <p class="view-products-label">
          {{ $t("deliveries.editPickUpInfo") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'pickupInfo')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <label for="pick-up" class="edit-info-label">
        {{ $t("deliveries.pickUpLocation") }}
      </label>
      <GMapAutocomplete
        id="pick-up"
        class="businessProfile-address"
        :placeholder="$t('settings.searchLocation')"
        @place_changed="setPlace"
      >
      </GMapAutocomplete>
      <label for="instructions" class="edit-info-label">
        {{ $t("deliveries.pickUpInstructionsOptional") }}
      </label>
      <textarea
        name=""
        :placeholder="$t('deliveries.enterInstructions')"
        class="edit-info-instructions"
        id="instructions"
        cols="30"
        rows="5"
      ></textarea>
      <label for="phone-number" class="edit-info-label">
        {{ $t("deliveries.pickUpInstructionsOptional") }}
      </label>
      <vue-tel-input
        class="invite-phone"
        id="phone-number"
        v-model="phone"
        mode="international"
      ></vue-tel-input>
      <p class="edit-info-add-phone">
        <i class="mdi mdi-plus"></i>
        {{ $t("deliveries.addAnotherPhoneNumber") }}
      </p>
      <v-btn class="edit-info-submit-button">
        {{ $t("deliveries.submit") }}
      </v-btn>
    </div>
    <div v-if="popup === 'pickupInfo'" class="view-products-container">
      <div class="view-products-section">
        <p class="view-products-label">
          {{ $t("deliveries.editDeliveryInfo") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'deliveryInfo')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <label for="customer-name" class="edit-info-label">
        {{ $t("deliveries.nameOfCustomer") }}
      </label>
      <v-text-field
        class="businessProfile-field"
        id="customer-name"
        v-model="customerName"
        variant="outlined"
        clearable
        clear-icon="mdi-close"
      ></v-text-field>
      <label for="location" class="edit-info-label">
        {{ $t("inventory.locationOfCustomer") }}
      </label>
      <GMapAutocomplete
        id="location"
        class="businessProfile-address"
        :placeholder="$t('settings.searchLocation')"
        @place_changed="setPlace"
      >
      </GMapAutocomplete>
      <label for="phone-number" class="edit-info-label">
        {{ $t("deliveries.pickUpInstructionsOptional") }}
      </label>
      <vue-tel-input
        class="invite-phone"
        id="phone-number"
        v-model="phone"
        mode="international"
      ></vue-tel-input>
      <p class="edit-info-add-phone">
        <i class="mdi mdi-plus"></i>
        {{ $t("deliveries.addAnotherPhoneNumber") }}
      </p>
      <label for="instructions" class="edit-info-label">
        {{ $t("inventory.deliveryInstructions") }}
      </label>
      <textarea
        name=""
        :placeholder="$t('deliveries.enterInstructionsForTheDeliveryPartner')"
        class="edit-info-instructions"
        id="instructions"
        cols="30"
        rows="5"
      ></textarea>
      <v-btn class="edit-info-submit-button">
        {{ $t("deliveries.submit") }}
      </v-btn>
    </div>
    <div v-if="popup === 'viewProducts'" class="view-products-container">
      <div class="view-products-section">
        <p class="view-products-label">
          {{ $t("deliveries.products") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'viewProducts')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <div v-for="(product, i) in getData.data.products" :key="i">
        <div class="view-products-row-top">
          <v-badge
            color="#324BA8"
            text-color="white"
            max="10"
            :content="`${product.product_unit_count}`"
          >
            <img
              :src="product.product_image_link"
              class="view-products-img"
              alt=""
            />
          </v-badge>
          <div class="view-products-row-top-left">
            <div class="view-products-row-top-name">
              {{ product.product_name }}
            </div>
            <div class="view-products-row-top-variant">
              {{ product.product_variant_description }}
            </div>
          </div>
          <p class="view-products-row-top-right">
            {{ product.product_unit_currency }}
            {{ product.product_unit_price }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="popup === 'attempts'" class="timeline-failed-attempt-container">
      <div class="timeline-failed-attempt-section">
        <p class="timeline-failed-attempt-label">
          {{ $t("deliveries.attemptsAndReasons") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'attempts')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div v-for="(attempt, i) in attempts" :key="i">
        <div class="timeline-failed-attempt-row-top">
          <p class="timeline-failed-attempt-row-top-left">
            {{ attempt.attempt }}
          </p>
          <p class="timeline-failed-attempt-row-top-right">
            {{ attempt.time }}
          </p>
        </div>
        <p class="timeline-failed-attempt-row-bottom">
          {{ attempt.reason }}
        </p>
      </div>
    </div>
    <div v-if="popup === 'payments'" class="view-products-container">
      <div class="view-products-section make-payment-upper-section">
        <p class="make-payment-label">
          {{ $t("payments.pendingPayment") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'payments')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <div class="make-payment-lower-section">
        <i class="mdi mdi-alert-outline make-payment-alert-icon"></i>
        <p class="make-payment-description">
          {{ $t("payments.hiPleaseMakeYourPayment", { name }) }}
          <span class="make-payment-amount">{{ currency }} {{ amount }}</span>
          {{ $t("payments.forCompletedOrders", { orders }) }}
        </p>
        <v-btn
          @click="redirect(false, 'payments', '/payments/payment-summary')"
          class="edit-info-submit-button"
        >
          {{ $t("payments.makePayment") }}
        </v-btn>
      </div>
    </div>
    <div v-if="popup === 'editPrice'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <p class="edit-price-title">
          {{ $t("inventory.editPrice") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'editPrice')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="edit-price-description">
        <span>
          <i class="mdi mdi-information-outline"></i>
        </span>
        <span>
          <p class="edit-price-description-text">
            {{ $t("inventory.pleaseNoteThatThePrice") }}
          </p>
        </span>
      </div>
      <div>
        <label for="update-price" class="edit-info-label">
          {{ $t("inventory.updatePrice") }}
        </label>
        <v-text-field
          class="businessProfile-field"
          id="update-price"
          v-model="newPrice"
          variant="outlined"
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
      </div>
      <div>
        <v-btn class="edit-info-submit-button margin-override">
          {{ $t("inventory.updatePrice") }}
        </v-btn>
      </div>
    </div>
  </v-overlay>
</template>

<script>
import Datepicker from "vuejs3-datepicker";
import { mapGetters } from "vuex";

export default {
  props: ["overlayVal", "editInfo"],
  watch: {
    "$store.state.overlayStatus": function (val) {
      this.overlay = val.overlay;
      this.popup = val.popup;
    },
  },
  components: { Datepicker },
  computed: {
    ...mapGetters(["getData"]),
  },
  data() {
    return {
      overlay: false,
      popup: "",
      amount: "780",
      currency: "KES",
      name: "Judy",
      orders: 3,
      newPrice: "KES 450",
      date: new Date(),
      cancelReasons: [
        {
          label: "deliveries.orderIsNotReady",
          value: "",
        },
        {
          label: "deliveries.wrongLocation",
          value: "",
        },
        {
          label: "deliveries.duplicateOrder",
          value: "",
        },
      ],
      attempts: [
        {
          attempt: "Attempt 1",
          time: "6th Jan 10:23 am",
          reason: "Not unavailable",
        },
        {
          attempt: "Attempt 2",
          time: "6th Jan 11:42 am",
          reason: "Not unavailable",
        },
        {
          attempt: "Final Attempt",
          time: "6th Jan 3:42 am",
          reason: "Damaged goods",
        },
      ],
      phone: "",
      customerName: "",
    };
  },
  methods: {
    overlayStatusSet(overlay, popup) {
      this.overlay = overlay;
      this.popup = popup;
    },
    setPlace(path) {
      console.log(path);
    },
    redirect(status, popup, link) {
      this.overlayStatusSet(status, popup);
      this.$router.push(link);
    },
  },
};
</script>

<style>
.tracking-reschedule-container {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
  font-family: "DM Sans";
}
.vuejs3-datepicker div:first-child {
  display: none !important;
}
.tracking-reschedule-title-section {
  margin-bottom: 20px;
  display: flex;
}
.tracking-reschedule-title-label {
  font-size: 15px;
  width: 60%;
}
.tracking-reschedule-title-close {
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;
}
.tracking-reschedule-submit-button {
  margin-top: 40px;
  width: 150px;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: white !important;
  background: #324ba8;
  margin-left: auto;
}
.vuejs3-datepicker__calendar {
  box-shadow: none !important;
}
.tracking-order-actions-btn {
  float: right;
  margin-right: 5%;
  box-shadow: none !important;
  text-transform: capitalize;
  letter-spacing: 0px;
}
.tracking-cancel-title-label {
  font-size: 15px;
  width: 80%;
}
.tracking-cancel-button {
  width: -webkit-fill-available;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: white !important;
  background: #9b101c;
  margin-left: auto;
}
.make-payment-label {
  font-size: 18px;
  width: 100%;
  font-weight: 500;
  text-align: center;
  margin-left: 20px;
  margin-top: 40px;
}
.make-payment-lower-section {
  text-align: center;
}
.make-payment-upper-section {
  margin-bottom: 0px !important;
}
.make-payment-alert-icon {
  color: #ee7d00;
  font-size: 60px;
}
.make-payment-description {
  color: #606266;
  margin-top: 0px;
}
.make-payment-amount {
  font-weight: 700;
}
.edit-price-title {
  font-size: 16px;
  width: 60%;
  font-weight: 500;
}
.edit-price-description {
  display: flex;
  color: #7f3b02;
}
.edit-price-description-text {
  margin-left: 10px;
}
.margin-override {
  margin: 0px !important;
}
</style>
