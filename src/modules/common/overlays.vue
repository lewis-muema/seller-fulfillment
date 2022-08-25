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
      <v-btn
        class="tracking-reschedule-submit-button"
        v-loading="buttonLoader"
        @click="reschedule()"
      >
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
      <v-radio-group v-model="cancelReason">
        <v-radio
          v-for="(reason, x) in cancelReasons"
          :key="x"
          :label="$t(reason.label)"
          :value="$t(reason.value)"
        ></v-radio>
      </v-radio-group>
      <v-btn
        class="tracking-cancel-button"
        v-loading="buttonLoader"
        @click="cancel()"
      >
        {{ $t("deliveries.cancelOrder") }}
      </v-btn>
    </div>
    <div v-if="popup === 'pickupInfo'" class="view-products-container">
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
        :value="location"
        :options="getMapOptions"
        :placeholder="$t('settings.searchLocation')"
        @place_changed="setPickUp"
      >
      </GMapAutocomplete>
      <label for="instructions" class="edit-info-label">
        {{ $t("deliveries.pickUpInstructionsOptional") }}
      </label>
      <textarea
        name=""
        :placeholder="$t('deliveries.enterInstructions')"
        class="edit-info-instructions"
        v-model="instructions"
        id="instructions"
        cols="30"
        rows="5"
      ></textarea>
      <label for="phone-number" class="edit-info-label">
        {{ $t("deliveries.phoneNumber") }}
      </label>
      <vue-tel-input
        class="invite-phone"
        id="phone-number"
        v-model="phone"
        mode="international"
        v-bind="getSendyPhoneProps"
      ></vue-tel-input>
      <label
        for="phone-number"
        v-if="secondaryPhoneStatus"
        class="edit-info-label"
      >
        {{ $t("deliveries.phoneNumber") }}
      </label>
      <vue-tel-input
        v-bind="getSendyPhoneProps"
        v-if="secondaryPhoneStatus"
        class="invite-phone"
        id="phone-number"
        v-model="secPhone"
        mode="international"
      ></vue-tel-input>
      <div
        class="add-phone-number mb-4"
        v-if="!secondaryPhoneStatus"
        @click="secondaryPhoneStatus = !secondaryPhoneStatus"
      >
        <v-icon class="add-phone-number-icon">mdi mdi-plus</v-icon>
        {{ $t("inventory.addAnotherPhoneNo") }}
      </div>
      <div
        class="add-phone-number mb-4"
        v-if="secondaryPhoneStatus"
        @click="secondaryPhoneStatus = !secondaryPhoneStatus"
      >
        <v-icon class="add-phone-number-icon">mdi mdi-minus</v-icon>
        {{ $t("deliveries.removePhoneNumber") }}
      </div>
      <v-btn
        class="edit-info-submit-button"
        v-loading="buttonLoader"
        @click="submitConsignment()"
      >
        {{ $t("deliveries.submit") }}
      </v-btn>
    </div>
    <div v-if="popup === 'deliveryInfo'" class="view-products-container">
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
        :value="location"
        :options="getMapOptions"
        :placeholder="$t('settings.searchLocation')"
        @place_changed="setLocation"
      >
      </GMapAutocomplete>
      <label for="phone-number" class="edit-info-label">
        {{ $t("deliveries.phoneNumber") }}
      </label>
      <vue-tel-input
        v-bind="getSendyPhoneProps"
        class="invite-phone"
        id="phone-number"
        v-model="phone"
        mode="international"
      ></vue-tel-input>
      <label
        for="sec-phone-number"
        v-if="secondaryPhoneStatus"
        class="edit-info-label"
      >
        {{ $t("deliveries.phoneNumber") }}
      </label>
      <vue-tel-input
        v-bind="getSendyPhoneProps"
        v-if="secondaryPhoneStatus"
        class="invite-phone"
        id="sec-phone-number"
        v-model="secPhone"
        mode="international"
      ></vue-tel-input>
      <div
        class="add-phone-number mb-4"
        v-if="!secondaryPhoneStatus"
        @click="secondaryPhoneStatus = !secondaryPhoneStatus"
      >
        <v-icon class="add-phone-number-icon">mdi mdi-plus</v-icon>
        {{ $t("inventory.addAnotherPhoneNo") }}
      </div>
      <div
        class="add-phone-number mb-4"
        v-if="secondaryPhoneStatus"
        @click="secondaryPhoneStatus = !secondaryPhoneStatus"
      >
        <v-icon class="add-phone-number-icon">mdi mdi-minus</v-icon>
        {{ $t("deliveries.removePhoneNumber") }}
      </div>
      <label for="instructions" class="edit-info-label">
        {{ $t("inventory.deliveryInstructions") }}
      </label>
      <textarea
        name=""
        :placeholder="$t('deliveries.enterInstructionsForTheDeliveryPartner')"
        class="edit-info-instructions"
        v-model="instructions"
        id="instructions"
        cols="30"
        rows="5"
      ></textarea>
      <v-btn
        class="edit-info-submit-button"
        v-loading="buttonLoader"
        @click="submitDelivery()"
      >
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
      <div v-for="(product, i) in getOrderTrackingData.order.products" :key="i">
        <div class="view-products-row-top">
          <v-badge
            color="#324BA8"
            text-color="white"
            max="10"
            :content="`${product.received_quantity}`"
          >
            <img
              :src="product.product_variant_image_link"
              class="view-products-img"
              alt=""
            />
          </v-badge>
          <div class="view-products-row-top-left">
            <div class="view-products-row-top-name">
              {{ product.product_variant_description }}
            </div>
            <!-- <div class="view-products-row-top-variant">
              {{ product.product_variant_description }}
            </div> -->
          </div>
          <p class="view-products-row-top-right">
            {{ product.currency }}
            {{ product.unit_price }}
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
      <div v-for="(attempt, i) in getDeliveryAttempts" :key="i">
        <div class="timeline-failed-attempt-row-top">
          <p class="timeline-failed-attempt-row-top-left">
            {{ $t("deliveries.attempt") }} {{ attempt.attempt_index }}
          </p>
          <p class="timeline-failed-attempt-row-top-right">
            {{ formatTime(attempt.attempt_date) }}
          </p>
        </div>
        <p class="timeline-failed-attempt-row-bottom">
          {{ attempt.failure_reason }}
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
          {{
            $t("payments.hiPleaseMakeYourPayment", {
              name: `${getUserDetails.first_name} ${getUserDetails.last_name}`,
            })
          }}
          <span class="make-payment-amount"
            >{{ getBusinessDetails.currency }}
            {{ getActivePayment.amount_to_charge }}</span
          >
          {{
            $t("payments.forCompletedOrders", {
              orders: getActivePayment.order_count,
            })
          }}
        </p>
        <v-btn
          @click="
            redirect(
              false,
              'payments',
              `/payments/payment-summary/${getActivePayment.billing_cycle_instance_id}`
            )
          "
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
          :prefix="newCurrency"
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
      </div>
      <div>
        <v-btn
          @click="updatePrice()"
          class="edit-info-submit-button margin-override"
        >
          {{ $t("inventory.updatePrice") }}
        </v-btn>
      </div>
    </div>
    <div v-if="popup === 'fees'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <p class="edit-price-title">
          {{ $t("inventory.fulfillmentFeeCalculation") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'fees')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <div class="fees-row fees-divider">
          <span>
            {{ $t("inventory.totalValue") }}
          </span>
          <span class="fees-left-override">
            {{ getFulfillmentFees.currency }}
            {{ getFulfillmentFees.total_product_value }}
          </span>
        </div>
        <div class="fees-row fees-bold fees-title">
          {{ $t("inventory.fees") }}
        </div>
        <div
          v-for="(promos, i) in getFulfillmentFees.promotion_adjustments"
          :key="i"
          class="fees-row"
        >
          <span>
            <div>{{ promos.adjustment_description }}</div>
            <div class="fees-subtitle">{{ promos.adjustment_subtitle }}</div>
          </span>
          <span class="fees-left-override">
            {{ getFulfillmentFees.currency }} {{ promos.adjustment_value }}
          </span>
        </div>
        <div class="fees-row fees-bold fees-divider">
          <span>{{ $t("inventory.totalFulfillmentFee") }}</span>
          <span class="fees-left-override"
            >{{ getFulfillmentFees.currency }}
            {{ getFulfillmentFees.calculated_fee }}</span
          >
        </div>
        <p class="fee-margin-top pricing-docs-link">
          {{ $t("inventory.learnMoreAboutOurPricing") }}
          <i class="mdi mdi-chevron-right"></i>
        </p>
      </div>
    </div>
    <div v-if="popup === 'promo'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <p class="edit-price-title">
          {{ $t("inventory.applyPromoCode") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'promo')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <label for="enter-promo" class="edit-info-label">
          {{ $t("inventory.enterPromoCode") }}
        </label>
        <v-text-field
          class="businessProfile-field"
          id="enter-promo"
          v-model="promoCode"
          variant="outlined"
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
      </div>
      <div>
        <v-btn
          @click="enterPromoCode()"
          class="edit-info-submit-button margin-override"
        >
          {{ $t("inventory.applyPromoCode") }}
        </v-btn>
      </div>
    </div>
    <div v-if="popup === 'code'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <p class="edit-price-title">
          {{ $t("deliveries.deliveryCode") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'code')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="delivery-code">
        {{ getOrderTrackingData.order.confirmation_pin }}
      </div>
    </div>
    <div v-if="popup === 'user'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'user')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="user-added-section-bottom">
        <i class="mdi mdi-check-circle-outline user-added-check"></i>
        <p class="user-added-title">
          {{ $t("settings.userAddedSuccessfully") }}
        </p>
        <p class="user-added-description">
          {{
            $t("settings.addedSuccessfully", {
              name: `${getUser.first_name} ${getUser.last_name}`,
            })
          }}
        </p>
        <v-btn class="edit-user-save" @click="overlayStatusSet(false, 'user')">
          {{ $t("settings.okay") }}
        </v-btn>
      </div>
    </div>
    <div v-if="popup === 'invite'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'invite')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p class="resend-invite-title">
          {{ $t("settings.resendEmailTo") }}
        </p>
        <p class="resend-invite-description">
          <span>{{ getActiveUser.email }}</span>
        </p>
        <v-btn
          v-loading="buttonLoader"
          class="edit-user-save"
          @click="resendInvite()"
        >
          {{ $t("settings.resendEmail") }}
        </v-btn>
      </div>
    </div>
    <div v-if="popup === 'deactivate'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'deactivate')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="deactivate-user-section-bottom">
        <p class="deactivate-user-title">
          {{ $t("settings.deactivateTheUser") }}
        </p>
        <p class="deactivate-user-description">
          {{ $t("settings.theUserWillNotBeAble") }}
        </p>
        <v-btn class="edit-user-save" @click="setUserAction('deactivate')">
          {{ $t("settings.yesDeactivateUser") }}
        </v-btn>
        <p
          class="deactivate-user-no"
          @click="overlayStatusSet(false, 'deactivate')"
        >
          {{ $t("settings.noDontDeactivateUser") }}
        </p>
      </div>
    </div>
    <div v-if="popup === 'activate'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'activate')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="deactivate-user-section-bottom">
        <p class="deactivate-user-title">
          {{ $t("settings.activateTheUser") }}
        </p>
        <p class="deactivate-user-description">
          {{ $t("settings.theUserWillNowBeAble") }}
        </p>
        <v-btn class="edit-user-save" @click="setUserAction('activate')">
          {{ $t("settings.yesActivateUser") }}
        </v-btn>
        <p
          class="deactivate-user-no"
          @click="overlayStatusSet(false, 'activate')"
        >
          {{ $t("settings.noDontActivateUser") }}
        </p>
      </div>
    </div>
    <div v-if="popup === 'noEdits'" class="view-products-container">
      <div class="view-products-section">
        <p class="view-products-label">{{ $t("deliveries.weAreSorry") }}</p>
        <i
          @click="overlayStatusSet(false, 'noEdits')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <p>
        {{
          getParent === "sendy"
            ? $t("deliveries.cantEditPickups")
            : $t("deliveries.cantEditDelivery")
        }}
      </p>
      <v-btn class="get-help-button">{{ $t("deliveries.getHelp") }} </v-btn>
    </div>
    <div v-if="popup === 'noEditsProducts'" class="view-products-container">
      <div class="view-products-section">
        <p class="view-products-label">{{ $t("deliveries.weAreSorry") }}</p>
        <i
          @click="overlayStatusSet(false, 'noEditsProducts')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <p>
        {{ $t("deliveries.cantEditProducts") }}
      </p>
      <v-btn class="get-help-button">{{ $t("deliveries.getHelp") }} </v-btn>
    </div>
    <div v-if="popup === 'export'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'export')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="deactivate-user-section-bottom">
        <p class="deactivate-user-title">
          {{ $t("common.exportToCSV") }}
        </p>
        <p class="export-CSV-description">
          {{
            $t("common.yourExportWillTakeAFewMinutes", {
              email: getUserDetails.email,
            })
          }}
        </p>
        <div class="export-popup-buttons">
          <div
            class="deactivate-user-no"
            @click="overlayStatusSet(false, 'export')"
          >
            {{ $t("common.cancel") }}
          </div>
          <div class="export-CSV-button">
            <v-btn
              class="edit-user-save"
              v-loading="buttonLoader"
              @click="exportData()"
            >
              {{ $t("common.exportCSV") }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<script>
import Datepicker from "vuejs3-datepicker";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { ElNotification } from "element-plus";
import moment from "moment";

export default {
  props: ["overlayVal", "editInfo"],
  watch: {
    "$store.state.overlayStatus": function (val) {
      this.overlay = val.overlay;
      this.popup = val.popup;
      this.newCurrency =
        val.popup === "editPrice"
          ? this.getSelectedProducts[this.getEditedPriceIndex].selectedOption
              .product_variant_currency
          : "";
      this.newPrice =
        val.popup === "editPrice"
          ? this.getSelectedProducts[this.getEditedPriceIndex].selectedOption
              .product_variant_unit_price
          : "";
    },
    "$store.state.orderTrackingData": function orderTrackingData(val) {
      this.customerName = val.order.destination.name;
      this.location = val.order.destination.delivery_location.description;
      this.phone = val.order.destination.phone_number;
      this.secondaryPhoneStatus =
        val.order.destination.secondary_phone_number !== null &&
        val.order.destination.secondary_phone_number !== "";
      this.secPhone = val.order.destination.secondary_phone_number;
      this.instructions = val.order.destination.delivery_instructions;
      this.date = new Date(val.order.scheduled_date);
    },
  },
  components: { Datepicker },
  computed: {
    ...mapGetters([
      "getData",
      "getDeliveryAttempts",
      "getOrderTrackingData",
      "getFulfillmentFees",
      "getParent",
      "getStorageUserDetails",
      "getEditedPriceIndex",
      "getSelectedProducts",
      "getActivePayment",
      "getBusinessDetails",
      "getUserDetails",
      "getMapOptions",
      "getSendyPhoneProps",
      "getUser",
      "getActiveUser",
      "getExportDataType",
    ]),
  },
  data() {
    return {
      overlay: false,
      popup: "",
      amount: "780",
      currency: "KES",
      name: "Judy",
      orders: 3,
      promoCode: "",
      newPrice: "",
      newCurrency: "",
      date: new Date(),
      location: "",
      locationData: {},
      instructions: "",
      cancelReasons: [
        {
          label: "deliveries.orderIsNotReady",
          value: "deliveries.orderIsNotReady",
        },
        {
          label: "deliveries.wrongLocation",
          value: "deliveries.wrongLocation",
        },
        {
          label: "deliveries.duplicateOrder",
          value: "deliveries.duplicateOrder",
        },
      ],
      cancelReason: "",
      phone: "",
      customerName: "",
      buttonLoader: false,
      secPhone: "",
      secondaryPhoneStatus: false,
    };
  },
  methods: {
    ...mapActions([
      "requestAxiosPut",
      "requestAxiosGet",
      "requestAxiosPost",
      "requestAxiosPatch",
    ]),
    ...mapMutations([
      "setLoader",
      "setOrderTrackingData",
      "setPromoCode",
      "setUserAction",
    ]),
    overlayStatusSet(overlay, popup) {
      this.overlay = overlay;
      this.popup = popup;
    },
    setPickUp(path) {
      this.locationData = path;
      this.location = document.querySelector("#pick-up").value;
    },
    setLocation(path) {
      this.locationData = path;
      this.location = document.querySelector("#location").value;
    },
    exportData() {
      this.buttonLoader = true;
      const payload = {
        business_id: this.getStorageUserDetails.business_id,
        data_query: {
          data_type: this.getExportDataType,
          data_filters: [],
        },
        output_file_types: [
          {
            file_type: "CSV",
          },
        ],
      };
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/exporttasks`,
        values: payload,
      }).then((response) => {
        if (response.status === 200) {
          ElNotification({
            title: this.$t("settings.weArePreparingYourCSVExport"),
            message: this.$t("settings.weWillNotifyYouWhenYourExport"),
            type: "success",
          });
          this.overlayStatusSet(false, "export");
          this.buttonLoader = false;
        } else {
          ElNotification({
            title: "",
            message: this.$t("settings.weCouldNotInitiateYouCSVExport"),
            type: "error",
          });
          this.buttonLoader = false;
        }
      });
    },
    resendInvite() {
      this.buttonLoader = true;
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.getActiveUser.user_id}/sendinvitationemail`,
        values: {},
      }).then((response) => {
        if (response.status === 200) {
          ElNotification({
            title: "",
            message: this.$t("settings.instunctionEmailResentSuccessfully"),
            type: "success",
          });
          this.overlayStatusSet(false, "invite");
          this.buttonLoader = false;
        } else {
          ElNotification({
            title: "",
            message: this.$t("settings.failedToResendInstructionEmail"),
            type: "error",
          });
          this.buttonLoader = false;
        }
      });
    },
    submitConsignment() {
      const order = this.getOrderTrackingData.order;
      this.buttonLoader = true;
      this.requestAxiosPatch({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/consignments/${this.getOrderTrackingData.order.order_id}`,
        values: {
          destination: {
            name: order.destination.name,
            phone_number: this.phone
              ? this.phone
              : order.destination.phone_number,
            secondary_phone_number: this.secPhone
              ? this.secPhone
              : order.destination.secondary_phone_number,
            delivery_location: {
              description: this.location
                ? this.location
                : order.destination.delivery_location.description,
              longitude: this.locationData.geometry
                ? this.locationData.geometry.location.lng()
                : order.destination.delivery_location.longitude,
              latitude: this.locationData.geometry
                ? this.locationData.geometry.location.lat()
                : order.destination.delivery_location.latitude,
            },
            house_location: order.destination.house_location,
            delivery_instructions: this.instructions
              ? this.instructions
              : order.destination.delivery_instructions,
          },
        },
      }).then((response) => {
        if (response.status === 200) {
          ElNotification({
            title: "",
            message: this.$t("deliveries.cosignmentEditedSuccessfully"),
            type: "success",
          });
          this.overlayStatusSet(false, "pickupInfo");
          this.buttonLoader = false;
          setTimeout(() => {
            this.fetchOrder();
          }, 1000);
        } else {
          ElNotification({
            title: "",
            message: this.$t("deliveries.cosignmentEditingFailed"),
            type: "error",
          });
          this.buttonLoader = false;
        }
      });
    },
    submitDelivery() {
      const order = this.getOrderTrackingData.order;
      const meansOfPayment =
        this.getOrderTrackingData.order.fulfilment_cost_means_of_payment;
      this.buttonLoader = true;
      this.requestAxiosPatch({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/deliveries/${this.getOrderTrackingData.order.order_id}`,
        values: {
          means_of_payment: {
            means_of_payment_type: meansOfPayment.means_of_payment_type,
            means_of_payment_identifier: meansOfPayment.means_of_payment_id,
            participant_type: meansOfPayment.participant_type,
            participant_id: meansOfPayment.participant_id,
            meta_data: meansOfPayment.meta_data,
          },
          destination: {
            name: this.customerName
              ? this.customerName
              : order.destination.name,
            phone_number: this.phone
              ? this.phone
              : order.destination.phone_number,
            secondary_phone_number: this.secPhone
              ? this.secPhone
              : order.destination.secondary_phone_number,
            delivery_location: {
              description: this.location
                ? this.location
                : order.destination.delivery_location.description,
              longitude: this.locationData.geometry
                ? this.locationData.geometry.location.lng()
                : order.destination.delivery_location.longitude,
              latitude: this.locationData.geometry
                ? this.locationData.geometry.location.lat()
                : order.destination.delivery_location.latitude,
            },
            house_location: order.destination.house_location,
            delivery_instructions: this.instructions
              ? this.instructions
              : order.destination.delivery_instructions,
          },
        },
      }).then((response) => {
        if (response.status === 200) {
          ElNotification({
            title: "",
            message: this.$t("deliveries.deliveryEditedSuccessfully"),
            type: "success",
          });
          this.overlayStatusSet(false, "deliveryInfo");
          this.buttonLoader = false;
          setTimeout(() => {
            this.fetchOrder();
          }, 1000);
        } else {
          ElNotification({
            title: "",
            message: this.$t("deliveries.deliveryEditingFailed"),
            type: "error",
          });
          this.buttonLoader = false;
        }
      });
    },
    reschedule() {
      this.buttonLoader = true;
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/orders/${this.getOrderTrackingData.order.order_id}/reschedule`,
        values: {
          proposed_scheduled_date: new Date(this.date).valueOf(),
        },
      }).then((response) => {
        if (response.status === 200) {
          ElNotification({
            title: "",
            message: this.$t("deliveries.deliveryRescheduledSuccessfully"),
            type: "success",
          });
          this.overlayStatusSet(false, "reschedule");
          this.buttonLoader = false;
          setTimeout(() => {
            this.fetchOrder();
          }, 1000);
        } else {
          ElNotification({
            title: "",
            message: this.$t("deliveries.deliveryReschedulingFailed"),
            type: "error",
          });
          this.buttonLoader = false;
        }
      });
    },
    cancel() {
      this.buttonLoader = true;
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/${
          this.getParent === "sendy" ? "consignments" : "deliveries"
        }/${this.getOrderTrackingData.order.order_id}/cancel`,
        values: {
          cancellation_reason: this.cancelReason,
        },
      }).then((response) => {
        if (response.status === 200) {
          ElNotification({
            title: "",
            message: this.$t("deliveries.deliveryCancelledSuccessfully"),
            type: "success",
          });
          this.overlayStatusSet(false, "reschedule");
          this.buttonLoader = false;
          setTimeout(() => {
            this.fetchOrder();
          }, 1000);
        } else {
          ElNotification({
            title: "",
            message: this.$t("deliveries.deliveryCancellingFailed"),
            type: "error",
          });
          this.buttonLoader = false;
        }
      });
    },
    fetchOrder() {
      this.setLoader({
        type: "orderTracking",
        value: "loading-text",
      });
      this.setLoader({
        type: "orderTimeline",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/${
          this.getParent === "sendy" ? "consignments" : "deliveries"
        }/${this.$route.params.order_id}`,
      }).then((response) => {
        this.setLoader({
          type: "orderTracking",
          value: "",
        });
        if (response.status === 200) {
          this.setOrderTrackingData(response.data.data);
        }
      });
    },
    redirect(status, popup, link) {
      this.overlayStatusSet(status, popup);
      this.$router.push(link);
    },
    formatTime(time) {
      return moment(time).format("Do MMM h:mm a");
    },
    updatePrice() {
      this.getSelectedProducts[
        this.getEditedPriceIndex
      ].selectedOption.product_variant_unit_price = this.newPrice;
      this.overlayStatusSet(false, "editPrice");
    },
    enterPromoCode() {
      this.setPromoCode(this.promoCode);
      this.promoCode = "";
      this.overlayStatusSet(false, "promo");
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
  border: 1px solid #e0e0e0;
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
.fees-left-override {
  float: right;
  margin-left: auto;
}
.fees-row {
  display: flex;
  height: 70px;
  align-items: center;
}
.fee-margin-top {
  margin-top: 40px;
}
.fee-padding-bottom {
  padding-bottom: 40px;
}
.fees-bold {
  font-weight: 500;
}
.fees-subtitle {
  font-size: 12px;
  color: #606266;
}
.fees-divider {
  border-bottom: 1px solid #e2e7ed;
}
.pricing-docs-link {
  color: #324ba8;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 15px;
}
.fees-title {
  display: flex;
  align-items: flex-end;
  padding-bottom: 10px;
}
.delivery-code {
  font-size: 40px;
  font-weight: 500;
  color: #324ba8;
  text-align: center;
  margin: 30px;
}
.user-added-container {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 450px;
  border-radius: 5px;
  font-family: "DM Sans";
}
.user-added-section {
  display: flex;
}
.user-added-label {
  font-size: 16px;
  width: 60%;
  font-weight: 500;
}
.user-added-close-icon {
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;
}
.user-added-row-top {
  display: flex;
  padding-bottom: 15px;
  border-bottom: 0.6px solid #c0c4cc78;
  margin-bottom: 15px;
}
.user-added-row-top-name {
  margin-bottom: 0px;
}
.user-added-row-top-variant {
  color: #606266;
}
.user-added-row-top-left {
  margin-left: 20px;
}
.user-added-row-top-right {
  font-weight: 500;
  font-size: 16px;
  margin-left: auto;
}
.user-added-row-bottom {
  color: #606266;
  margin-bottom: 20px;
}
.user-added-img {
  width: 40px;
}
.user-added-close {
  width: 100%;
  display: flex;
  align-items: flex-end;
}
.user-added-check {
  font-size: 60px;
  color: #116f28;
  margin-bottom: 20px;
  background: #defad287;
  border-radius: 40px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-added-section-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-added-title {
  color: #303133;
  font-weight: 500;
}
.user-added-description {
  color: #303133;
  font-size: 14px;
  width: 75%;
  text-align: center;
}
.resend-invite-container {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 450px;
  border-radius: 5px;
  font-family: "DM Sans";
}
.resend-invite-section {
  display: flex;
}
.resend-invite-label {
  font-size: 16px;
  width: 60%;
  font-weight: 500;
}
.resend-invite-close-icon {
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;
}
.resend-invite-row-top {
  display: flex;
  padding-bottom: 15px;
  border-bottom: 0.6px solid #c0c4cc78;
  margin-bottom: 15px;
}
.resend-invite-row-top-name {
  margin-bottom: 0px;
}
.resend-invite-row-top-variant {
  color: #606266;
}
.resend-invite-row-top-left {
  margin-left: 20px;
}
.resend-invite-row-top-right {
  font-weight: 500;
  font-size: 16px;
  margin-left: auto;
}
.resend-invite-row-bottom {
  color: #606266;
  margin-bottom: 20px;
}
.resend-invite-img {
  width: 40px;
}
.resend-invite-close {
  width: 100%;
  display: flex;
  align-items: flex-end;
}
.resend-invite-check {
  font-size: 60px;
  color: #116f28;
  margin-bottom: 20px;
}
.resend-invite-section-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.resend-invite-title {
  color: #303133;
  margin-bottom: 0px;
}
.resend-invite-description {
  color: #303133;
  font-size: 18px;
  font-weight: 500;
}
.deactivate-user-title {
  margin-top: -50px;
  font-size: 18px;
  font-weight: 500;
}
.deactivate-user-description {
  color: #909399;
}
.deactivate-user-no {
  color: #909399;
  text-align: center;
  margin-top: 25px;
  cursor: pointer;
}
.get-help-button {
  width: 100%;
  margin-top: 20px;
  height: 50px !important;
  background: #d3ddf6;
  color: #324ba8 !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
  font-weight: 400 !important;
}
.export-popup-buttons {
  display: flex;
  width: 60%;
  align-items: center;
  float: right;
}
.export-CSV-button {
  margin-left: 20px;
  width: 150px;
}
.export-CSV-description {
  color: #606266;
}
</style>
