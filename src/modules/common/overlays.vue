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
          from: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
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
      <div>
        <span
          class="cancel-back-text"
          @click="
            setOverlayStatus({
              overlay: true,
              popup: 'cancelOptions',
            })
          "
        >
          <i class="mdi mdi-arrow-left delivery-info-marker"></i>
          Back
        </span>
        <p class="tracking-cancel-title-label">
          {{ $t("deliveries.whyCancel") }}
        </p>
      </div>
      <v-radio-group v-model="cancelReason">
        <v-radio
          v-for="(reason, x) in getCancellationReasons"
          :key="x"
          :label="$t(reason.reason_description)"
          :value="$t(reason.reason_id)"
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
    <div
      class="tracking-reschedule-container cancel-options-contain"
      v-if="popup === 'cancelOptions'"
    >
      <div class="tracking-reschedule-title-section">
        <p class="tracking-cancel-title-label">
          {{ $t("deliveries.cancelOrder") }} ?
        </p>
        <i
          @click="overlayStatusSet(false, 'cancelOptions')"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <div class="cancel-options-text">
        <p>
          {{ $t("deliveries.cancelText") }}
        </p>
      </div>
      <div class="d-flex cancel-options-container">
        <i class="mdi mdi-map-marker-outline mr-3 delivery-info-marker"></i>
        <div class="cancel-options-text" v-if="getParent === 'sendy'">
          <p>{{ $t("deliveries.wrongPickUpInfo") }}</p>
          <span
            class="cancel-options-desc"
            @click="
              setOverlayStatus({
                overlay: true,
                popup: cantEditDeliveryRecipientInfo ? 'noEdits' : 'pickupInfo',
                popText: this.pickups,
              })
            "
          >
            {{ $t("deliveries.editPickupInfo") }}
          </span>
        </div>
        <div class="cancel-options-text" v-else>
          <p>{{ $t("deliveries.wrongDeliveryInfo") }}</p>
          <span
            class="cancel-options-desc"
            @click="
              setOverlayStatus({
                overlay: true,
                popup: cantEditDeliveryRecipientInfo
                  ? 'noEdits'
                  : 'deliveryInfo',
                popText: this.deliveryInfo,
              })
            "
          >
            {{ $t("deliveries.editDeliveryInfo") }}
          </span>
        </div>
      </div>
      <div
        class="d-flex cancel-options-container"
        v-if="getParent === 'customer'"
      >
        <i class="mdi mdi-account-outline mr-3 delivery-info-marker"></i>
        <div class="cancel-options-text">
          <p>{{ $t("deliveries.wrongRecipientInfo") }}</p>
          <span
            class="cancel-options-desc"
            @click="
              setOverlayStatus({
                overlay: true,
                popup: cantEditDeliveryRecipientInfo
                  ? 'noEdits'
                  : 'recepientInfo',
                popText: this.recipientInfo,
              })
            "
          >
            {{ $t("deliveries.editRecipientInfo") }}
          </span>
        </div>
      </div>
      <div
        class="d-flex cancel-options-container"
        v-if="showEditIconOnProducts"
      >
        <i class="mdi mdi-archive-outline mr-3 delivery-info-marker"></i>
        <div class="cancel-options-text">
          <p>{{ $t("deliveries.wrongQuantity") }}</p>
          <p
            class="cancel-options-desc"
            @click="navigateToEditProducts"
            v-if="checkEditProducts"
          >
            {{ $t("deliveries.editProducts") }}
          </p>
          <span
            :class="getLoader.orderTracking"
            class="cancel-options-desc"
            @click="
              setOverlayStatus({
                overlay: true,
                popup: 'noEdits',
                popText: this.cantEditProducts,
              })
            "
            v-else
          >
            {{ $t("deliveries.editProducts") }}
          </span>
        </div>
      </div>
      <div
        class="d-flex cancel-options-container"
        v-if="getParent === 'customer'"
      >
        <i class="mdi mdi-clock-outline mr-3 delivery-info-marker"></i>
        <div class="cancel-options-text">
          <p>{{ $t("deliveries.unavailable") }}</p>
          <span
            class="cancel-options-desc"
            @click="
              setOverlayStatus({
                overlay: true,
                popup: 'reschedule',
              })
            "
          >
            {{ $t("deliveries.rescheduleOrder") }}
          </span>
        </div>
      </div>
      <div class="cancel-options-container">
        <div class="row">
          <div class="col-5">
            <p
              class="cancel-options-desc dont-cancel-text"
              @click="
                setOverlayStatus({
                  overlay: false,
                  popup: 'cancelOptions',
                })
              "
            >
              {{ $t("deliveries.dontCancel") }}
            </p>
          </div>
          <div class="col-7">
            <v-btn
              class="tracking-cancel-button"
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'cancel',
                })
              "
            >
              {{ $t("deliveries.continueToCancel") }}
            </v-btn>
          </div>
        </div>
      </div>
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
        :disabled="!partnerNotAssigned"
      >
      </GMapAutocomplete>
      <label for="instructions" class="edit-info-label">
        {{ $t("deliveries.pickUpInstructionsOptional") }}
      </label>
      <textarea
        name=""
        :placeholder="$t('deliveries.enterInstructions')"
        class="edit-info-instructions destination-pickup-instructions"
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
        class="edit-info-submit-button submit-pickup-button"
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
        :disabled="!partnerNotAssigned"
      >
      </GMapAutocomplete>
      <label for="apartment-name" class="edit-info-label">
        {{ $t("deliveries.apartmentName") }}
      </label>
      <v-text-field
        class="businessProfile-field crossdocking-input-fields-v-text"
        id="customer-name"
        v-model="apartmentName"
        variant="outlined"
        clearable
        clear-icon="mdi-close"
        :disabled="!partnerNotAssigned"
      ></v-text-field>
      <label for="instructions" class="edit-info-label">
        {{ $t("inventory.deliveryInstructions") }}
      </label>
      <textarea
        name=""
        :placeholder="$t('deliveries.enterInstructionsForTheDeliveryPartner')"
        class="edit-info-instructions destination-delivery-instructions"
        v-model="instructions"
        id="instructions"
        cols="30"
        rows="5"
      ></textarea>
      <v-btn
        class="edit-info-submit-button submit-delivery-button"
        v-loading="buttonLoader"
        @click="submitDelivery()"
      >
        {{ $t("deliveries.saveDetails") }}
      </v-btn>
    </div>
    <div v-if="popup === 'recepientInfo'" class="view-products-container">
      <div class="view-products-section">
        <p class="view-products-label view-products-label-recepient-info">
          {{ $t("deliveries.receivingItems") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'recepientInfo')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <div
        v-if="v$.recepientOption.$error"
        class="error-msg withdraw-transaction-error"
      >
        <i class="mdi mdi-alert mr-3"></i>
        {{ $t("inventory.pleaseSelectAnOptionToProceed") }}
      </div>
      <el-radio-group v-model="recepientOption" class="">
        <div class="payment-collection-overlay-border-top padding-override">
          <el-radio label="INDIVIDUAL" size="large">
            <span class="mb-0 ml-3 font-override recepient-info-label">
              <i
                class="mdi mdi-account-outline cross-docking-checkout-icons recepient-info-icons"
              ></i
              >{{ $t("deliveries.individual") }}
            </span>
          </el-radio>
        </div>
        <div class="payment-collection-overlay-border-bottom padding-override">
          <el-radio label="BUSINESS" size="large">
            <span class="mb-0 ml-3 font-override recepient-info-label">
              <i
                class="mdi mdi-domain cross-docking-checkout-icons recepient-info-icons"
              ></i
              >{{ $t("deliveries.business") }}
            </span>
          </el-radio>
        </div>
      </el-radio-group>
      <div v-if="recepientOption">
        <p class="crossdock-recipient-details-text">
          {{
            recepientOption === "INDIVIDUAL"
              ? $t("deliveries.enterRecipientDetails")
              : $t("deliveries.enterBusinessDetails")
          }}
        </p>
        <label for="customer-name" class="edit-info-label">
          {{
            recepientOption === "INDIVIDUAL"
              ? $t("deliveries.recipientName")
              : $t("deliveries.businessName")
          }}
        </label>
        <v-text-field
          class="businessProfile-field crossdocking-input-fields-v-text"
          id="customer-name"
          v-model="customerName"
          variant="outlined"
          placeholder="Enter customer name"
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
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
          @click="removePhoneNumber()"
        >
          <v-icon class="add-phone-number-icon">mdi mdi-minus</v-icon>
          {{ $t("deliveries.removePhoneNumber") }}
        </div>
      </div>
      <div @click="validateFields()">
        <v-btn
          :disabled="!isRecipientFieldsValid"
          v-loading="buttonLoader"
          class="edit-info-submit-button"
          @click="submitDelivery()"
        >
          {{ $t("deliveries.saveInfo") }}
        </v-btn>
      </div>
    </div>
    <div
      v-if="popup === 'deliveryInfoCrossdock'"
      class="view-products-container"
    >
      <div class="view-products-section">
        <p class="view-products-label">
          {{ $t("deliveries.deliveryInfo") }}
        </p>

        <i
          @click="overlayStatusSet(false, 'deliveryInfoCrossdock')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <label for="location" class="edit-info-label">
        {{ $t("inventory.locationOfCustomer") }} {{ $t("inventory.required") }}
      </label>
      <GMapAutocomplete
        id="location"
        class="businessProfile-address crossdocking-input-fields"
        :value="location"
        :options="getMapOptions"
        :placeholder="$t('settings.searchLocation')"
        @place_changed="setLocation"
      >
      </GMapAutocomplete>
      <div
        v-if="v$.location.$error"
        class="error-msg withdraw-transaction-error"
      >
        {{ $t("inventory.locationIsRequired") }}
      </div>
      <label for="apartment-name" class="edit-info-label">
        {{ $t("deliveries.apartmentName") }}
      </label>
      <v-text-field
        class="businessProfile-field crossdocking-input-fields-v-text"
        id="customer-name"
        v-model="apartmentName"
        variant="outlined"
        clearable
        clear-icon="mdi-close"
      ></v-text-field>
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
      <div @click="validateFields()">
        <v-btn
          class="edit-info-submit-button"
          :disabled="!isDeliveryFieldsValid"
          v-loading="buttonLoader"
          @click="submitDeliveryInfo()"
        >
          {{ $t("inventory.done") }}
        </v-btn>
      </div>
    </div>
    <div
      v-if="popup === 'recepientInfoCrossdock'"
      class="view-products-container"
    >
      <div class="view-products-section">
        <p class="view-products-label view-products-label-recepient-info">
          {{ $t("deliveries.receivingItems") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'recepientInfoCrossdock')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <div
        v-if="v$.recepientOption.$error"
        class="error-msg withdraw-transaction-error"
      >
        <i class="mdi mdi-alert mr-3"></i>
        {{ $t("inventory.pleaseSelectAnOptionToProceed") }}
      </div>
      <el-radio-group v-model="recepientOption" class="">
        <div class="payment-collection-overlay-border-top padding-override">
          <el-radio label="INDIVIDUAL" size="large">
            <span class="mb-0 ml-3 font-override recepient-info-label">
              <i
                class="mdi mdi-account-outline cross-docking-checkout-icons recepient-info-icons"
              ></i
              >{{ $t("deliveries.individual") }}
            </span>
          </el-radio>
        </div>
        <div class="payment-collection-overlay-border-bottom padding-override">
          <el-radio label="business" size="large">
            <span class="mb-0 ml-3 font-override recepient-info-label">
              <i
                class="mdi mdi-domain cross-docking-checkout-icons recepient-info-icons"
              ></i
              >{{ $t("deliveries.business") }}
            </span>
          </el-radio>
        </div>
      </el-radio-group>
      <div v-if="recepientOption">
        <p class="crossdock-recipient-details-text">
          {{
            recepientOption === "INDIVIDUAL"
              ? $t("deliveries.enterRecipientDetails")
              : $t("deliveries.enterBusinessDetails")
          }}
        </p>
        <label for="customer-name" class="edit-info-label">
          {{
            recepientOption === "INDIVIDUAL"
              ? $t("deliveries.recipientName")
              : $t("deliveries.businessName")
          }}
        </label>
        <v-text-field
          class="businessProfile-field crossdocking-input-fields-v-text"
          id="customer-name"
          v-model="customerName"
          variant="outlined"
          placeholder="Enter customer name"
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
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
          @click="removePhoneNumber()"
        >
          <v-icon class="add-phone-number-icon">mdi mdi-minus</v-icon>
          {{ $t("deliveries.removePhoneNumber") }}
        </div>
      </div>
      <div @click="validateFields()">
        <v-btn
          :disabled="!isRecipientFieldsValid"
          v-loading="buttonLoader"
          class="edit-info-submit-button"
          @click="submitRecepientInfo()"
        >
          {{ $t("deliveries.saveInfo") }}
        </v-btn>
      </div>
    </div>
    <div
      v-if="popup === 'viewProducts'"
      class="view-products-container view-products-container-inner"
    >
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
          <span class="product-image-frame-container">
            <v-badge
              color="#324BA8"
              text-color="white"
              :content="`${product.received_quantity}`"
            >
              <div class="product-image-frame">
                <img
                  :src="product.product_variant_image_link"
                  class="product-select-img"
                  alt=""
                />
              </div>
            </v-badge>
          </span>
          <div class="view-products-row-top-left">
            <div class="view-products-row-top-name">
              {{ product.product_variant_description }}
            </div>
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
    <div
      v-if="popup === 'pickupfees'"
      class="view-products-container fees-container"
    >
      <div class="timeline-failed-attempt-section">
        <p class="edit-price-title">
          {{ $t("inventory.pickUpFeeCalculation") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'pickupfees')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div
        class="m-auto"
        v-if="!getFulfillmentFees.pricing.pricing_pickups.length"
      >
        {{ $t("inventory.noFeesCaluclatedYet") }}
      </div>
      <div
        v-for="(fulfillmentFees, i) in getFulfillmentFees.pricing
          .pricing_pickups"
        :key="i"
      >
        <div class="fees-row fees-divider">
          <span>
            {{ $t("inventory.totalValue") }}
          </span>
          <span class="fees-left-override">
            {{ fulfillmentFees.currency }}
            {{ fulfillmentFees.total_product_value }}
          </span>
        </div>
        <div class="fees-row fees-bold fees-title">
          {{ $t("inventory.fees") }}
        </div>
        <div
          v-for="(promos, i) in fulfillmentFees.promotion_adjustments"
          :key="i"
          class="fees-row"
        >
          <span>
            <div>{{ promos.adjustment_description }}</div>
            <div class="fees-subtitle">{{ promos.adjustment_subtitle }}</div>
          </span>
          <span class="fees-left-override">
            {{ fulfillmentFees.currency }} {{ promos.adjustment_value }}
          </span>
        </div>
        <div class="fees-row fees-bold fees-divider">
          <span>{{ $t("inventory.totalFulfillmentFee") }}</span>
          <span class="fees-left-override"
            >{{ fulfillmentFees.currency }}
            {{ fulfillmentFees.calculated_fee }}</span
          >
        </div>
        <p class="fee-margin-top pricing-docs-link">
          {{ $t("inventory.learnMoreAboutOurPricing") }}
          <i class="mdi mdi-chevron-right"></i>
        </p>
      </div>
    </div>
    <div
      v-if="popup === 'fulfillmentFees'"
      class="view-products-container fees-container"
    >
      <div class="timeline-failed-attempt-section">
        <p class="edit-price-title">
          {{ $t("inventory.fulfillmentFeeCalculation") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'fulfillmentFees')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div
        class="m-auto"
        v-if="!getFulfillmentFees.pricing.pricing_deliveries.length"
      >
        {{ $t("inventory.noFeesCaluclatedYet") }}
      </div>
      <div
        v-for="(fulfillmentFees, i) in getFulfillmentFees.pricing
          .pricing_deliveries"
        :key="i"
      >
        <div class="fees-row fees-divider">
          <span>
            {{ $t("inventory.totalValue") }}
          </span>
          <span class="fees-left-override">
            {{ fulfillmentFees.currency }}
            {{ fulfillmentFees.total_product_value }}
          </span>
        </div>
        <div class="fees-row fees-bold fees-title">
          {{ $t("inventory.fees") }}
        </div>
        <div
          v-for="(promos, i) in fulfillmentFees.promotion_adjustments"
          :key="i"
          class="fees-row"
        >
          <span>
            <div>{{ promos.adjustment_description }}</div>
            <div class="fees-subtitle">{{ promos.adjustment_subtitle }}</div>
          </span>
          <span class="fees-left-override">
            {{ fulfillmentFees.currency }} {{ promos.adjustment_value }}
          </span>
        </div>
        <div class="fees-row fees-bold fees-divider">
          <span>{{ $t("inventory.totalFulfillmentFee") }}</span>
          <span class="fees-left-override"
            >{{ fulfillmentFees.currency }}
            {{ fulfillmentFees.calculated_fee }}</span
          >
        </div>
      </div>
      <p class="fee-margin-top pricing-docs-link">
        {{ $t("inventory.learnMoreAboutOurPricing") }}
        <i class="mdi mdi-chevron-right"></i>
      </p>
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
    <div v-if="getVirtualTour">
      <div v-if="popup === 'tour'" class="">
        <div>
          <img
            class="image-tour-overlay"
            src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/tour.png"
            alt=""
          />
        </div>
        <div class="view-products-container tour-container-override">
          <p class="tour-container-override-title">
            {{ $t("common.newHomeScreen") }}
          </p>
          <p>{{ $t("common.letsCheckout") }}</p>
          <div>
            <v-btn
              @click="takeTour()"
              class="edit-info-submit-button margin-override tour-button"
            >
              {{ $t("common.takeTour") }}
            </v-btn>
            <p class="skip-tour-text" @click="skipTour()">
              {{ $t("common.skipTour") }}
            </p>
          </div>
        </div>
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
      <div class="make-payment-lower-section">
        {{ $t("deliveries.kindlyGiveThisCode") }}
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
        {{ popText }}
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
          <div class="export-CSV-button click-to-export-button">
            <v-btn
              class="edit-user-save click-to-export-button"
              v-loading="buttonLoader"
              @click="exportData()"
            >
              {{ $t("common.exportCSV") }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div v-if="popup === 'paymentCollection'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'paymentCollection')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="deactivate-user-section-bottom">
        <p class="payment-collection-overlay-title">
          {{ $t("inventory.doYouWantPaymentToBeCollected") }}
        </p>
        <div class="payment-charges-communication">
          <i class="mdi mdi-information payment-charges-info-icon"></i>
          <span class="payment-charges-communication-desc">
            {{ $t("inventory.collectionFee") }}</span
          >
        </div>
        <div
          v-if="v$.deliveryFeeCollection.$error"
          class="error-msg withdraw-transaction-error mt-2 mb-3"
        >
          <i class="mdi mdi-alert mr-3"></i>
          {{ $t("inventory.pleaseSelectAnOptionToProceed") }}
        </div>
        <p
          class="select-payment-collection-error"
          v-if="selectPaymentCollection"
        >
          <i class="mdi mdi-alert mr-3"></i>
          <span class="select-payment-collection-error-text">{{
            $t("inventory.pleaseSelectPaymentCollectionOption")
          }}</span>
        </p>
        <el-radio-group
          v-model="deliveryFeeCollection"
          @change="
            setPaymentCollectionStatus({
              amountToBeCollected: deliveryFeeCollection,
              deliveryFee: getPaymentCollectionStatus.deliveryFee,
            })
          "
          class=""
        >
          <div class="payment-collection-overlay-border-top">
            <el-radio label="nofee" size="large">
              <p class="mb-2 ml-3 font-override">
                {{ $t("inventory.priceOfProducts") }}
              </p>
              <p class="mb-2 ml-3">
                {{
                  deliveryPricing
                    ? deliveryPricing.currency
                    : getBusinessDetails.currency
                }}
                {{ deliveryPricing ? deliveryPricing.total_product_value : 0 }}
              </p>
            </el-radio>
          </div>
          <div class="payment-collection-overlay-border-middle">
            <el-radio label="fee" size="large">
              <p class="mb-2 ml-3 font-override">
                {{ $t("inventory.priceOfProducts&DeliveryFee") }}
              </p>
              <p class="mb-2 ml-3">
                {{
                  $t("inventory.deliveryFeeAmount", {
                    Amount: `${
                      deliveryPricing
                        ? deliveryPricing.currency
                        : getBusinessDetails.currency
                    }
                                ${
                                  deliveryPricing
                                    ? deliveryPricing.total_product_value
                                    : 0
                                }`,
                  })
                }}
              </p>
            </el-radio>
            <div
              class="payment-collection-overlay-amount-field"
              v-if="getPaymentCollectionStatus.amountToBeCollected === 'fee'"
            >
              <p
                class="select-payment-collection-error"
                v-if="enterDeliveryFee"
              >
                <i class="mdi mdi-alert mr-3"></i>
                <span class="select-payment-collection-error-text">{{
                  $t("inventory.pleaseEnterTheDeliveryFeeAmount")
                }}</span>
              </p>
              <p class="delivery-fee-collection-overlay-title">
                {{ $t("inventory.deliveryFeeToBeCollected") }}
              </p>
              <v-text-field
                :label="`${
                  deliveryPricing
                    ? deliveryPricing.currency
                    : getBusinessDetails.currency
                } 60`"
                @input="
                  setPaymentCollectionStatus({
                    amountToBeCollected:
                      getPaymentCollectionStatus.amountToBeCollected,
                    deliveryFee: deliveryFeeAmount,
                  })
                "
                v-model="deliveryFeeAmount"
                variant="outlined"
                :prefix="
                  deliveryPricing
                    ? deliveryPricing.currency
                    : getBusinessDetails.currency
                "
                clearable
                clear-icon="mdi-close"
                @click:clear="
                  setPaymentCollectionStatus({
                    amountToBeCollected:
                      getPaymentCollectionStatus.amountToBeCollected,
                    deliveryFee: deliveryFeeAmount,
                  })
                "
              ></v-text-field>
            </div>
          </div>
          <div
            class="payment-collection-overlay-border-bottom padding-override"
          >
            <el-radio label="none" size="large">
              <p class="mb-0 ml-3 font-override">
                {{ $t("inventory.noDontCollectPayment") }}
              </p>
            </el-radio>
          </div>
        </el-radio-group>
        <div class="export-popup-buttons mt-3" @click="validateFields()">
          <v-btn
            class="edit-user-save edit-info-submit-button"
            :disabled="!isPaymentCollectionValid"
            v-loading="buttonLoader"
            @click="setPaymentCollection()"
          >
            {{ $t("inventory.done") }}
          </v-btn>
        </div>
      </div>
    </div>

    <div
      v-if="popup === 'editpaymentCollection'"
      class="view-products-container"
    >
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'editpaymentCollection')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="deactivate-user-section-bottom">
        <p class="payment-collection-overlay-title">
          {{ $t("inventory.doYouWantPaymentToBeCollected") }}
        </p>
        <div class="payment-charges-communication">
          <i class="mdi mdi-information payment-charges-info-icon"></i>
          <span class="payment-charges-communication-desc">
            {{ $t("inventory.collectionFee") }}</span
          >
        </div>
        <div
          v-if="v$.deliveryFeeCollection.$error"
          class="error-msg withdraw-transaction-error mt-2 mb-3"
        >
          <i class="mdi mdi-alert mr-3"></i>
          {{ $t("inventory.pleaseSelectAnOptionToProceed") }}
        </div>
        <p
          class="select-payment-collection-error"
          v-if="selectPaymentCollection"
        >
          <i class="mdi mdi-alert mr-3"></i>
          <span class="select-payment-collection-error-text">{{
            $t("inventory.pleaseSelectPaymentCollectionOption")
          }}</span>
        </p>
        <el-radio-group v-model="deliveryFeeCollection" class="">
          <div class="payment-collection-overlay-border-top">
            <el-radio label="nofee" size="large">
              <p class="mb-2 ml-3 font-override">
                {{ $t("inventory.priceOfProducts") }}
              </p>
              <p class="mb-2 ml-3">
                {{ productCurrency }}
                {{ productPrice }}
              </p>
            </el-radio>
          </div>
          <div class="payment-collection-overlay-border-middle">
            <el-radio label="fee" size="large">
              <p class="mb-2 ml-3 font-override">
                {{ $t("inventory.priceOfProducts&DeliveryFee") }}
              </p>
              <p class="mb-2 ml-3">
                {{
                  $t("inventory.deliveryFeeAmount", {
                    Amount: `${currency} ${productPrice}`,
                  })
                }}
              </p>
            </el-radio>
            <div
              class="payment-collection-overlay-amount-field"
              v-if="deliveryFeeCollection === 'fee'"
            >
              <p
                class="select-payment-collection-error"
                v-if="enterDeliveryFee"
              >
                <i class="mdi mdi-alert mr-3"></i>
                <span class="select-payment-collection-error-text">{{
                  $t("inventory.pleaseEnterTheDeliveryFeeAmount")
                }}</span>
              </p>
              <p class="delivery-fee-collection-overlay-title">
                {{ $t("inventory.deliveryFeeToBeCollected") }}
              </p>
              <v-text-field
                :label="`${getOrderTrackingData.order.sale_of_goods_invoice.currency} 60`"
                v-model="deliveryFeeAmount"
                variant="outlined"
                :prefix="
                  getOrderTrackingData.order.sale_of_goods_invoice.currency
                "
                clearable
                clear-icon="mdi-close"
              ></v-text-field>
            </div>
          </div>
          <div
            class="payment-collection-overlay-border-bottom padding-override"
          >
            <el-radio label="none" size="large">
              <p class="mb-0 ml-3 font-override">
                {{ $t("inventory.noDontCollectPayment") }}
              </p>
            </el-radio>
          </div>
        </el-radio-group>
        <div class="export-popup-buttons mt-3" @click="validateFields()">
          <v-btn
            class="edit-user-save edit-info-submit-button"
            :disabled="!isPaymentCollectionValid"
            v-loading="buttonLoader"
            @click="submitDelivery()"
          >
            {{ $t("inventory.done") }}
          </v-btn>
        </div>
      </div>
    </div>
    <div v-if="popup === 'deliveryDocuments'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'deliveryDocuments')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="deactivate-user-section-bottom">
        <p class="payment-collection-overlay-title">
          {{ $t("inventory.uploadDocument") }}
        </p>
        <div
          v-if="v$.PDF.$error"
          class="error-msg withdraw-transaction-error mt-2 mb-3"
        >
          <i class="mdi mdi-alert mr-3"></i>
          {{ $t("inventory.pleaseUploadDocumentToProceed") }}
        </div>
        <div
          class="crossdocking-add-document-drop"
          @click="uploadPDFFile()"
          v-loading="PDFUploadStatus"
        >
          <input
            type="file"
            name
            value
            class="form-control"
            placeholder="Upload"
            accept="application/pdf"
            id="upload-pdf-card"
            style="display: none"
            @change="uploadPDF('upload-pdf-card', 'option')"
          />
          <div v-if="PDF">
            <iframe
              style="border: 1px solid #666ccc"
              title="Document"
              :src="PDF"
              frameborder="1"
              scrolling="auto"
              width="100%"
              height="300px"
            ></iframe>
          </div>
          <div class="crossdocking-add-document-drop-inner" v-else>
            <p class="upload">
              <i class="mdi mdi-upload" aria-hidden="true"></i>
              {{ $t("inventory.uploadDocuments") }}
            </p>
            <p class="crossdocking-add-document-drop-inner-bottom">
              {{ $t("inventory.PDFonly") }}
            </p>
          </div>
        </div>
        <div class="mt-3">
          <p class="crossdocking-add-document-titles">
            {{ $t("inventory.whatTypeOfDocumentIsThis") }}
          </p>
          <v-select
            v-model="documentType"
            :items="documentTypes"
            :label="$t('inventory.select')"
            return-object
            density="compact"
          >
          </v-select>
        </div>
        <div
          v-if="v$.documentType.$error"
          class="error-msg withdraw-transaction-error"
        >
          {{ $t("inventory.pleaseSelectADocumentTypeToProceed") }}
        </div>
        <div v-if="documentType === 'Other'">
          <p class="crossdocking-add-document-titles">
            {{ $t("inventory.enterTheTitleOfTheDocument") }}
          </p>
          <v-text-field
            :label="$t('inventory.enterTitle')"
            v-model="documentTitle"
            variant="outlined"
            clearable
            clear-icon="mdi-close"
            density="compact"
          ></v-text-field>
        </div>
        <div class="mt-3" @click="validateFields()">
          <v-btn
            v-loading="buttonLoader"
            :disabled="
              !PDF ||
              documentType === '' ||
              (documentType === 'Other' && !documentTitle)
            "
            class="cross-docking-upload-doc"
            @click="editStatus === true ? editPDFDocument() : addPDFDocument()"
          >
            {{ $t("inventory.uploadDocument") }}
          </v-btn>
        </div>
      </div>
    </div>
    <div v-if="popup === 'viewDocument'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'viewDocument')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p>{{ $t("inventory.viewDocument") }}</p>
        <iframe
          style="border: 1px solid #666ccc"
          title="Document"
          :src="getDocumentURL"
          frameborder="1"
          scrolling="auto"
          width="100%"
          height="600px"
        ></iframe>
      </div>
    </div>
    <div v-if="popup === 'addRemoveDocument'" class="view-products-container">
      <div class="view-products-section">
        <p class="view-products-label view-products-label-recepient-info">
          {{ $t("deliveries.addRemoveDocuments") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'addRemoveDocument')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <div
        v-for="(docs, x) in mapEdittedDocuments"
        :key="x"
        class="crossdocking-documents-list"
      >
        <div class="crossdocking-documents-list-inner">
          <i class="mdi mdi-text-box-outline"></i>
          <span class="ml-3 document-type-text">{{
            docs.document_type === "OTHER"
              ? docs.document_description
              : docs.document_type
          }}</span>
          <v-menu>
            <template v-slot:activator="{ props }">
              <i
                class="mdi mdi-dots-vertical payment-method-icon"
                v-bind="props"
              ></i>
            </template>
            <v-list>
              <v-list-item v-for="(option, i) in options" :key="i">
                <v-list-item-title @click="execute(option.action, x)">{{
                  option.title
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <p class="edit-delivery edit-delivery-override">
        <span @click="uploadAnotherDocument()"
          >+ {{ $t("deliveries.uploadAnotherDocument") }}
        </span>
      </p>
      <v-btn
        class="edit-info-submit-button"
        v-loading="buttonLoader"
        @click="submitDelivery()"
      >
        {{ $t("deliveries.save") }}
      </v-btn>
    </div>
    <div v-if="popup === 'pickItems'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'pickItems')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p>{{ $t("inventory.howDoYouWantTheItemsToBePicked") }}</p>
        <div>
          <el-radio-group v-model="pickItems" class="">
            <div class="payment-collection-overlay-border-top">
              <el-radio label="driver" size="large">
                <p class="mb-2 ml-3 font-override crossdocking-pick-items-text">
                  {{ $t("inventory.sendDriverToPickTheItems") }}
                </p>
              </el-radio>
            </div>
            <div class="payment-collection-overlay-border-bottom">
              <el-radio label="self" size="large" disabled>
                <p class="mb-0 ml-3 font-override crossdocking-pick-items-text">
                  {{ $t("inventory.IllTakeTheItems") }}
                </p>
              </el-radio>
            </div>
          </el-radio-group>
        </div>
      </div>
      <div>
        <v-btn
          v-loading="buttonLoader"
          :disabled="!pickItems"
          class="cross-docking-upload-doc mt-3"
          @click="selectPickUpOption()"
        >
          {{ $t("inventory.done") }}
        </v-btn>
      </div>
    </div>
    <div v-if="popup === 'stations'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'stations')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p>{{ $t("inventory.selectThePickUpStation") }}</p>
        <div class="crossdocking-stations-container">
          <el-radio-group v-model="pickUpStation">
            <div
              class="crossdocking-pickup-stations"
              v-for="(station, i) in getStations"
              :key="i"
            >
              <el-radio :label="i" size="large">
                <p class="mb-2 ml-3 font-override crossdocking-pick-items-text">
                  {{ station.name }}
                </p>
                <p class="mb-2 ml-3 font-override crossdocking-pick-items-text">
                  {{ station.location }}
                </p>
                <p class="mb-2 ml-3 font-override crossdocking-pick-items-text">
                  {{ station.room }}
                </p>
                <p class="mb-2 ml-3 font-override crossdocking-pick-items-text">
                  {{ station.hours }}
                </p>
              </el-radio>
            </div>
          </el-radio-group>
        </div>
      </div>
      <v-btn
        class="edit-info-submit-button"
        :disabled="pickUpStation === ''"
        v-loading="buttonLoader"
        @click="submitPickStation()"
      >
        {{ $t("inventory.done") }}
      </v-btn>
    </div>
    <div v-if="popup === 'editSpeed'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'editSpeed')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p class="delivery-option-crossdock-title">
          {{ $t("inventory.selectDeliveryOption") }}
        </p>
        <el-radio-group
          v-model="deliveryOption"
          class="delivery-option-crossdock-radio-group"
        >
          <div
            class="delivery-option-crossdock-radio padding-override"
            v-for="(speed, i) in deliverySpeedOptions"
            :key="i"
          >
            <el-radio
              :label="i"
              size="large"
              class="delivery-option-crossdock-radio-group"
            >
              <div class="font-override recepient-info-label">
                <div class="delivery-option-crossdock-radio-group">
                  <span>
                    {{
                      speed.transport_provider === "SENDY"
                        ? $t(`inventory.${speed.speed_pricing_type}_DELIVERY`)
                        : speed.transport_provider.replace("_", " ")
                    }}
                  </span>
                  <span class="delivery-option-crossdock-radio-right">
                    {{ speed.currency }} {{ speed.price }}
                  </span>
                </div>
                <div class="delivery-option-crossdock-radio-group-bottom">
                  {{
                    speed.transport_provider === "SENDY"
                      ? speed.speed_pricing_type === "SENDY_SCHEDULED"
                        ? $t("inventory.selectADateOfYourChoice")
                        : formatDate(speed.speed_pricing_upper_limit_date)
                      : formatDate(speed.speed_pricing_upper_limit_date)
                  }}
                </div>
              </div>
            </el-radio>
          </div>
        </el-radio-group>
        <v-btn
          class="edit-info-submit-button"
          v-loading="buttonLoader"
          @click="editDeliverySpeed()"
        >
          {{ $t("inventory.done") }}
        </v-btn>
      </div>
    </div>
    <div v-if="popup === 'removeDestination'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'removeDestination')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p>{{ $t("inventory.areYouSureYouWantToRemoveThisOrder") }}</p>
      </div>
      <v-btn class="crossdocking-remove-order-button" @click="removeLocation()">
        {{ $t("inventory.removeOrder") }}
      </v-btn>
      <div
        class="crossdocking-dont-remove-order-button"
        @click="overlayStatusSet(false, 'removeDestination')"
      >
        {{ $t("inventory.dontRemoveOrder") }}
      </div>
    </div>
    <div v-if="popup === 'pickUpInfoCrossDock'" class="view-products-container">
      <div class="view-products-section">
        <p class="view-products-label">
          {{ $t("inventory.pickUpInfo") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'pickUpInfoCrossDock')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <label for="location" class="edit-info-label">
        {{ $t("inventory.pickupInfo") }}
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
        {{ $t("inventory.phoneNumberOfTheContactPerson") }}
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
        {{ $t("inventory.phoneNumberOfTheContactPerson") }}
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
        @click="removePhoneNumber()"
      >
        <v-icon class="add-phone-number-icon">mdi mdi-minus</v-icon>
        {{ $t("deliveries.removePhoneNumber") }}
      </div>
      <label for="instructions" class="edit-info-label">
        {{ $t("inventory.pickupInstructionsOptional") }}
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
        :disabled="!isPickUpFieldsValid"
        v-loading="buttonLoader"
        @click="submitPickUpInfo()"
      >
        {{ $t("inventory.done") }}
      </v-btn>
    </div>

    <div v-if="popup === 'paymentBreakdown'" class="view-products-container">
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'paymentBreakdown')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div class="deactivate-user-section-bottom">
        <p class="deactivate-user-title">
          {{ $t("inventory.paymentCollection") }}
        </p>
        <p class="payment-breakdown-amount">
          {{ $t("inventory.amountToBeCollected") }}
        </p>
        <p class="payment-breakdown-title" v-if="deliveryFee">
          {{ $t("inventory.priceOfProducts&DeliveryFee") }}
        </p>
        <p class="payment-breakdown-title" v-else>
          {{ $t("inventory.priceOfProducts") }}
        </p>
        <p class="payment-breakdown-title mt-4">
          {{ $t("inventory.priceBreakdown") }}
        </p>
        <div
          v-for="(product, i) in getOrderTrackingData.order.products"
          :key="i"
          class="payment-breakdown-title"
        >
          <div class="row mb-3 mt-3">
            <div class="col-2">
              <div class="payment-breakdown-products-count">
                {{ product.quantity }}
              </div>
            </div>
            <div class="col-6">
              {{ product.product_name }}
            </div>
            <div class="col-4 header-section-right">
              {{ product.currency }} {{ product.unit_price }}
            </div>
          </div>
          <hr />
        </div>
        <p class="mt-3 mb-2 payment-breakdown-title">
          <span>{{ $t("inventory.subtotal") }}</span>
          <span class="payment-method-icon">
            {{ getOrderTrackingData.order.invoice_summary.currency }}
            {{ getOrderTrackingData.order.invoice_summary.total_cost }}
          </span>
        </p>
        <p class="mb-3 payment-breakdown-title" v-if="deliveryFee">
          <span>{{ $t("inventory.deliveryFee") }}</span>
          <span class="payment-method-icon">
            {{ getOrderTrackingData.order.sale_of_goods_invoice.currency }}
            {{ deliveryFee }}
          </span>
        </p>
        <hr />
        <p class="mt-3 fees-bold">
          <span>{{ $t("inventory.total") }}</span>
          <span class="payment-method-icon">
            {{ getOrderTrackingData.order.invoice_summary.currency }}
            {{
              parseInt(getOrderTrackingData.order.invoice_summary.total_cost) +
              parseInt(deliveryFee)
            }}
          </span>
        </p>
      </div>
    </div>

    <div
      v-if="popup === 'deliveryOptionCrossdock'"
      class="view-products-container"
    >
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'deliveryOptionCrossdock')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p
          class="error-msg withdraw-transaction-error field-required-error"
          v-if="misMatchedDatesError"
        >
          {{ misMatchedDatesError }}
        </p>
        <p class="delivery-option-crossdock-title">
          {{ $t("inventory.selectDeliveryOption") }}
        </p>
        <div class="payment-charges-communication" v-if="!isWithinGeoFence">
          <i class="mdi mdi-information payment-charges-info-icon"></i>
          <span class="speed-charges-communication-desc">
            {{ $t("inventory.thirdPartyPartner") }}</span
          >
        </div>
        <el-radio-group
          v-model="deliveryOption"
          class="delivery-option-crossdock-radio-group"
        >
          <div
            class="delivery-option-crossdock-radio padding-override"
            v-for="(speed, i) in deliverySpeeds"
            :key="i"
          >
            <el-radio
              :label="i"
              size="large"
              class="delivery-option-crossdock-radio-group"
            >
              <div class="font-override recepient-info-label">
                <div class="delivery-option-crossdock-radio-group">
                  <span :class="getLoader.speed">
                    {{
                      speed.transport_provider === "SENDY"
                        ? $t(`inventory.${speed.speed_pricing_type}_DELIVERY`)
                        : speed.transport_provider.replace("_", " ")
                    }}
                  </span>
                  <span
                    :class="getLoader.speed"
                    class="delivery-option-crossdock-radio-right"
                  >
                    {{ speed.currency }} {{ speed.price }}
                  </span>
                </div>
                <div class="delivery-option-crossdock-radio-group-bottom">
                  <span :class="getLoader.speed">
                    {{
                      speed.transport_provider === "SENDY"
                        ? speed.speed_pricing_type === "SENDY_SCHEDULED"
                          ? $t("inventory.selectADateOfYourChoice")
                          : formatDate(speed.speed_pricing_upper_limit_date)
                        : formatDate(speed.speed_pricing_upper_limit_date)
                    }}
                  </span>
                </div>
              </div>
            </el-radio>
          </div>
        </el-radio-group>
        <v-btn
          class="edit-info-submit-button"
          :disabled="!isDeliveryOptionValid"
          v-loading="buttonLoader"
          @click="submitDeliveryOption()"
        >
          {{ $t("inventory.done") }}
        </v-btn>
      </div>
    </div>
    <div
      v-if="popup === 'pickupOptionCrossdock'"
      class="view-products-container"
    >
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'pickupOptionCrossdock')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p
          class="error-msg withdraw-transaction-error field-required-error"
          v-if="misMatchedDatesError"
        >
          {{ misMatchedDatesError }}
        </p>
        <p class="delivery-option-crossdock-title">
          {{
            getMismatchedDates
              ? $t("inventory.pleaseSelectThePickupTimeForTheUnavailable")
              : $t("inventory.selectThePickupOption")
          }}
        </p>
        <el-radio-group
          v-model="pickUpOption"
          class="delivery-option-crossdock-radio-group"
        >
          <div
            class="delivery-option-crossdock-radio padding-override"
            v-for="(speed, i) in pickUpSpeeds"
            :key="i"
          >
            <el-radio
              :label="i"
              size="large"
              class="delivery-option-crossdock-radio-group"
            >
              <div class="font-override recepient-info-label">
                <div class="delivery-option-crossdock-radio-group">
                  <span :class="getLoader.speed">
                    {{
                      speed.transport_provider === "SENDY"
                        ? $t(`inventory.${speed.speed_pricing_type}_PICKUP`)
                        : speed.transport_provider.replace("_", " ")
                    }}
                  </span>
                  <span
                    :class="getLoader.speed"
                    class="delivery-option-crossdock-radio-right"
                  >
                    {{ speed.currency }} {{ speed.price }}
                  </span>
                </div>
                <div class="delivery-option-crossdock-radio-group-bottom">
                  <span :class="getLoader.speed">
                    {{
                      speed.transport_provider === "SENDY"
                        ? speed.speed_pricing_type === "SENDY_SCHEDULED"
                          ? $t("inventory.selectADateOfYourChoice")
                          : formatDate(speed.speed_pricing_upper_limit_date)
                        : formatDate(speed.speed_pricing_upper_limit_date)
                    }}
                  </span>
                </div>
              </div>
            </el-radio>
          </div>
        </el-radio-group>
        <div class="pick-up-unavailable-error" v-if="!pickUpSpeeds.length">
          {{ $t("inventory.weCannotPickFromThisLocation") }}
        </div>
        <v-btn
          class="edit-info-submit-button"
          :disabled="!isPickUpOptionValid"
          v-loading="buttonLoader"
          @click="submitPickUpOption()"
        >
          {{ $t("inventory.done") }}
        </v-btn>
      </div>
    </div>
    <div
      v-if="popup === 'ConsignmentReturnOption'"
      class="view-products-container"
    >
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'ConsignmentReturnOption')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p class="delivery-option-crossdock-title">
          {{ $t("inventory.selectThePickupOption") }}
        </p>
        <el-radio-group
          v-model="consignmentReturnsOption"
          class="delivery-option-crossdock-radio-group"
        >
          <div
            class="delivery-option-crossdock-radio padding-override"
            v-for="(speed, i) in getConsignmentReturnSpeed"
            :key="i"
          >
            <el-radio
              :label="i"
              size="large"
              class="delivery-option-crossdock-radio-group"
            >
              <div class="font-override recepient-info-label">
                <div class="delivery-option-crossdock-radio-group">
                  <span>
                    {{ $t(`inventory.${speed.speed_pricing_type}_DELIVERY`) }}
                  </span>
                  <span class="delivery-option-crossdock-radio-right">
                    {{ speed.currency }} {{ speed.price }}
                  </span>
                </div>
                <div class="delivery-option-crossdock-radio-group-bottom">
                  <span>
                    {{
                      speed.speed_pricing_type === "SENDY_SCHEDULED"
                        ? $t("inventory.selectADateOfYourChoice")
                        : formatDate(speed.speed_pricing_upper_limit_date)
                    }}
                  </span>
                </div>
              </div>
            </el-radio>
          </div>
        </el-radio-group>
        <v-btn
          class="edit-info-submit-button"
          :disabled="!isConsignmentReturnsOptionValid"
          v-loading="buttonLoader"
          @click="submitConsigmentReturnOption()"
        >
          {{ $t("inventory.done") }}
        </v-btn>
      </div>
    </div>
    <div
      v-if="popup === 'deliveryOptionNotice'"
      class="view-products-container"
    >
      <div class="timeline-failed-attempt-section">
        <i
          @click="overlayStatusSet(false, 'deliveryOptionNotice')"
          class="mdi mdi-close timeline-failed-attempt-close"
        ></i>
      </div>
      <div>
        <p class="delivery-option-crossdock-title">
          {{ $t("inventory.deliveryOptions") }}
        </p>
        <div class="delivery-option-notice-icon">
          <i class="mdi mdi-information-outline"></i>
        </div>
        <p class="delivery-option-notice-message">
          {{ $t("inventory.toViewDeliveryOptions") }}
        </p>
        <v-btn
          class="edit-info-submit-button"
          @click="overlayStatusSet(false, 'deliveryOptionNotice')"
        >
          {{ $t("inventory.done") }}
        </v-btn>
      </div>
    </div>
    <div
      class="tracking-reschedule-container"
      v-if="popup === 'reschedulePickupOption'"
    >
      <div class="tracking-reschedule-title-section">
        <p class="delivery-option-crossdock-title">
          {{ $t("inventory.schedulePickup") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'reschedulePickupOption')"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <datepicker
        :disabled-dates="{
          to: new Date(
            getPickUpInfoCD.pickupSpeed.speed_pricing_lower_limit_date
          ),
          from: new Date(
            getPickUpInfoCD.pickupSpeed.speed_pricing_upper_limit_date
          ),
        }"
        v-model="pickUpDate"
        :inline="true"
        :prevent-disable-date-selection="true"
      ></datepicker>
      <v-btn
        class="tracking-reschedule-submit-button"
        :disabled="!isScheduledPickUpDateValid"
        v-loading="buttonLoader"
        @click="showReschedulePickUpOption()"
      >
        {{ $t("deliveries.submit") }}
      </v-btn>
    </div>
    <div
      class="tracking-reschedule-container"
      v-if="popup === 'rescheduleDeliveryOption'"
    >
      <div class="tracking-reschedule-title-section">
        <p class="delivery-option-crossdock-title">
          {{ $t("inventory.scheduleDelivery") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'rescheduleDeliveryOption')"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <datepicker
        :disabled-dates="{
          to: new Date(activeDestination.speed.speed_pricing_lower_limit_date),
          from: new Date(
            activeDestination.speed.speed_pricing_upper_limit_date
          ),
        }"
        v-model="deliveryDate"
        :inline="true"
        :prevent-disable-date-selection="true"
      ></datepicker>
      <v-btn
        class="tracking-reschedule-submit-button"
        :disabled="!isScheduledDeliveryDateValid"
        v-loading="buttonLoader"
        @click="showRescheduleDeliveryOption()"
      >
        {{ $t("deliveries.submit") }}
      </v-btn>
    </div>
    <div
      class="tracking-reschedule-container"
      v-if="popup === 'editRescheduleDeliveryOption'"
    >
      <div class="tracking-reschedule-title-section">
        <p class="delivery-option-crossdock-title">
          {{ $t("inventory.scheduleDelivery") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'editRescheduleDeliveryOption')"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <datepicker
        :disabled-dates="{
          to: new Date(
            deliverySpeedOptions[deliveryOption].speed_pricing_lower_limit_date
          ),
          from: new Date(
            deliverySpeedOptions[deliveryOption].speed_pricing_upper_limit_date
          ),
        }"
        v-model="deliveryDate"
        :inline="true"
        :prevent-disable-date-selection="true"
      ></datepicker>
      <v-btn
        class="tracking-reschedule-submit-button"
        v-loading="buttonLoader"
        @click="submitDelivery()"
      >
        {{ $t("deliveries.submit") }}
      </v-btn>
    </div>
    <div
      class="tracking-reschedule-container"
      v-if="popup === 'rescheduleConsignmentReturn'"
    >
      <div class="tracking-reschedule-title-section">
        <p class="delivery-option-crossdock-title">
          {{ $t("inventory.scheduleConsignmentReturn") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'rescheduleConsignmentReturn')"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <datepicker
        :disabled-dates="{
          to: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0),
          from: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        }"
        v-model="consignmentReturnDate"
        :inline="true"
        :prevent-disable-date-selection="true"
      ></datepicker>
      <v-btn
        class="tracking-reschedule-submit-button"
        :disabled="!isScheduledConsignmentReturnDateValid"
        v-loading="buttonLoader"
        @click="showRescheduleConsignment()"
      >
        {{ $t("deliveries.submit") }}
      </v-btn>
    </div>
    <div
      v-if="popup === 'consignmentReturndeliveryInfo'"
      class="view-products-container"
    >
      <div class="view-products-section">
        <p class="view-products-label">
          {{ $t("deliveries.deliveryInfo") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'consignmentReturndeliveryInfo')"
          class="mdi mdi-close view-products-close"
        ></i>
      </div>
      <label for="location" class="edit-info-label">
        {{ $t("inventory.locationOfCustomer") }} {{ $t("inventory.required") }}
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
      <div
        v-if="v$.location.$error"
        class="error-msg withdraw-transaction-error"
      >
        {{ $t("inventory.locationIsRequired") }}
      </div>
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
      <div
        v-if="v$.phone.$error"
        class="error-msg withdraw-transaction-error mt-0 mb-2"
      >
        {{ $t("inventory.phoneIsRequired") }}
      </div>
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
      <label for="apartment-name" class="edit-info-label">
        {{ $t("deliveries.apartmentName") }}
      </label>
      <v-text-field
        class="businessProfile-field crossdocking-input-fields-v-text"
        id="customer-name"
        v-model="apartmentName"
        variant="outlined"
        clearable
        clear-icon="mdi-close"
      ></v-text-field>
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
      <div @click="validateFields()">
        <v-btn
          class="edit-info-submit-button"
          :disabled="!isConsignmentReturnFieldsValid"
          v-loading="buttonLoader"
          @click="submitConsignmentReturn()"
        >
          {{ $t("inventory.done") }}
        </v-btn>
      </div>
    </div>
    <div
      class="tracking-reschedule-container upload-lpo-container"
      v-if="popup === 'uploadLPO'"
    >
      <div class="tracking-reschedule-title-section">
        <p class="delivery-option-crossdock-title">
          {{ $t("inventory.uploadLPOdocument") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'uploadLPO')"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <div class="deactivate-user-section-bottom">
        <div
          v-if="v$.LPO.$error"
          class="error-msg withdraw-transaction-error mt-2 mb-3"
        >
          <i class="mdi mdi-alert mr-3"></i>
          {{ $t("inventory.pleaseUploadDocumentToProceed") }}
        </div>
        <div
          class="crossdocking-add-document-drop"
          @click="uploadLPOFile()"
          v-loading="LPOUploadStatus"
          v-if="!LPOUploadStatus"
        >
          <input
            type="file"
            name
            value
            class="form-control"
            placeholder="Upload"
            accept="image/*,application/pdf"
            id="upload-lpo-card"
            style="display: none"
            @change="uploadLPO('upload-lpo-card', 'option')"
          />
          <div class="crossdocking-add-document-drop-inner">
            <p class="upload mb-1">
              <i class="mdi mdi-upload" aria-hidden="true"></i>
              {{ $t("inventory.uploadLPOdocument") }}
            </p>
            <p class="autofill-bottom-text">
              {{ $t("inventory.PDFandimage") }}
            </p>
          </div>
        </div>
        <div class="d-flex upload-lpo-progress-bar" v-else>
          <div>
            <img
              src="https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/fulfillment_products/B-000-1111_1677076527968.png"
              alt=""
              class="upload-lpo-progress-bar-file-img"
            />
          </div>
          <div class="upload-lpo-progress-bar-container">
            <div class="d-flex">
              <div class="upload-lpo-progress-bar-file-name">
                {{ LPOFileName }}
              </div>
              <div class="ml-auto">
                <img
                  @click="resetLPO()"
                  src="https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/fulfillment_products/B-000-1111_1677076419299.png"
                  alt=""
                  class="upload-lpo-progress-bar-delete"
                />
              </div>
            </div>
            <el-progress
              :stroke-width="10"
              :percentage="uploadPercentage"
              color="#324BA8"
            />
          </div>
        </div>
        <div class="mt-5" @click="validateFields()">
          <v-btn
            v-loading="buttonLoader"
            :disabled="uploadPercentage !== 100"
            class="cross-docking-upload-doc"
            @click="formatAutofillDetails()"
          >
            {{ $t("inventory.continue") }}
          </v-btn>
        </div>
      </div>
    </div>
    <div
      class="tracking-reschedule-container"
      v-if="popup === 'rescheduleDirect'"
    >
      <div class="tracking-reschedule-title-section">
        <p class="tracking-reschedule-title-label">
          {{ $t("deliveries.pickATime") }}
        </p>
        <i
          @click="overlayStatusSet(false, 'rescheduleDirect')"
          class="mdi mdi-close tracking-reschedule-title-close"
        ></i>
      </div>
      <vue-timepicker
        class="reschedule-direct-time-picker"
        format="hh:mm:ss a"
        v-model="directTime"
      ></vue-timepicker>
      <datepicker
        :disabled-dates="{
          to: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          from: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        }"
        v-model="directDate"
        :inline="true"
        :prevent-disable-date-selection="true"
      ></datepicker>
      <v-btn
        class="tracking-reschedule-submit-button"
        v-loading="buttonLoader"
        @click="rescheduleDirect()"
      >
        {{ $t("deliveries.submit") }}
      </v-btn>
    </div>
  </v-overlay>
</template>

<script>
import Datepicker from "vuejs3-datepicker";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { ElNotification } from "element-plus";
import upload_img from "../../mixins/upload_img";
import cookieMixin from "../../mixins/cookie_mixin";
import trackingPayloadMixin from "../../mixins/tracking_payload";
import moment from "moment";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import VueTimepicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";
import introJs from "intro.js";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  props: ["overlayVal", "editInfo"],
  components: { Datepicker, VueTimepicker },
  mixins: [upload_img, trackingPayloadMixin, cookieMixin],
  data() {
    return {
      overlay: false,
      popup: "",
      popText: "",
      editStatus: false,
      amount: "780",
      currency: "KES",
      name: "Judy",
      orders: 3,
      promoCode: "",
      deliveryOption: "",
      newPrice: "",
      deliveryInfo: this.$t("deliveries.cantEditDelivery"),
      pickups: this.$t("deliveries.cantEditPickups"),
      recipientInfo: this.$t("deliveries.cantEditRecipient"),
      cantEditProducts: this.$t("deliveries.cantEditProducts"),
      deliverySpeed: "",
      newCurrency: "",
      date: new Date(),
      location: "",
      locationData: {},
      instructions: "",
      apartmentName: "",
      recepientOption: "",
      PDFUploadStatus: "",
      LPOUploadStatus: "",
      documents: [],
      PDF: "",
      LPO: "",
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
        {
          label: "deliveries.customerRequestedCancellation",
          value: "deliveries.customerRequestedCancellation",
        },
        {
          label: "deliveries.orderDetailsAreNotCorrect",
          value: "deliveries.orderDetailsAreNotCorrect",
        },
        {
          label: "deliveries.itemsAreNotAvailable",
          value: "deliveries.itemsAreNotAvailable",
        },
      ],
      paymentCollection: "",
      deliveryFeeCollection: "",
      selectPaymentCollection: false,
      selectDeliveryFee: false,
      enterDeliveryFee: false,
      deliveryFeeAmount: "",
      cancelReason: "",
      phone: "",
      customerName: "",
      buttonLoader: false,
      secPhone: "",
      secondaryPhoneStatus: false,
      documentType: "",
      documentTypes: [
        {
          title: this.$t("inventory.invoice"),
          value: "Invoice",
        },
        {
          title: this.$t("inventory.localPurchaseOrder"),
          value: "Local Purchase Order",
        },
        {
          title: this.$t("inventory.deliveryNote"),
          value: "Delivery Note",
        },
        {
          title: this.$t("inventory.Other"),
          value: "Other",
        },
      ],
      options: [
        {
          title: this.$t("inventory.viewDocument"),
          action: "viewDocument",
        },
        {
          title: this.$t("inventory.remove"),
          action: "removeDocument",
        },
      ],
      documentTitle: "",
      pickItems: "",
      pickUpStation: "",
      pickUpOption: "",
      misMatchedDatesError: "",
      deliveryDate: new Date(),
      pickUpDate: new Date(),
      consignmentReturnDate: new Date(),
      consignmentReturnsOption: "",
      uploadPercentage: 0,
      LPOFileName: "",
      destinations: [],
      directDate: new Date(),
      directTime: {
        hh: "08",
        mm: "00",
        ss: "00",
        a: "am",
      },
      currentStep: 1,
      totalSteps: 2,
    };
  },
  validations() {
    return {
      location: { required },
      recepientOption: { required },
      deliveryFeeCollection: { required },
      PDF: { required },
      documentType: { required },
      phone: { required },
      LPO: { required },
    };
  },
  watch: {
    "$store.state.overlayStatus": function (val) {
      this.overlay = val.overlay;
      this.popup = val.popup;
      this.popText = val.popText;
      this.editStatus = val.editStatus;
      if (this.getSelectedProducts[this.getEditedPriceIndex]) {
        const optionCurrency = this.getSelectedProducts[
          this.getEditedPriceIndex
        ].selectedOption
          ? this.getSelectedProducts[this.getEditedPriceIndex].selectedOption
              .product_variant_currency
          : this.getSelectedProducts[this.getEditedPriceIndex]
              .product_variants[0].product_variant_currency;
        const optionPrice = this.getSelectedProducts[this.getEditedPriceIndex]
          .selectedOption
          ? this.getSelectedProducts[this.getEditedPriceIndex].selectedOption
              .product_variant_unit_price
          : this.getSelectedProducts[this.getEditedPriceIndex]
              .product_variants[0].product_variant_unit_price;
        this.newCurrency = val.popup === "editPrice" ? optionCurrency : "";
        this.newPrice = val.popup === "editPrice" ? optionPrice : "";
      }
      this.preloadDeliveryDetails(val);
      this.preloadDeliveryOption(val);
    },
    "$store.state.orderTrackingData": function orderTrackingData(val) {
      this.preloadOrderTrackingData(val);
    },
  },
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
      "getLoader",
      "getActiveUser",
      "getExportDataType",
      "getPaymentCollectionStatus",
      "getDestinations",
      "getDestinationIndex",
      "getDocumentURL",
      "getStations",
      "getPickUpInfoCD",
      "getPickUpSpeed",
      "getEdittedDocuments",
      "getEditStatus",
      "getDeliverySpeed",
      "getMismatchedDates",
      "getGeofenceData",
      "getDeliveryInfo",
      "getConsignmentReturnSpeed",
      "getConsignmentReturn",
      "getAutoFillVariants",
      "getCancellationReasons",
      "getEditableFields",
      "getDirectOrderDetails",
    ]),
    partnerNotAssigned() {
      return (
        this.getOrderTrackingData.order.order_status === "ORDER_RECEIVED" ||
        this.getOrderTrackingData.order.order_status === "ORDER_IN_PROCESSING"
      );
    },
    showEditIconOnProducts() {
      return this.getEditableFields.products;
    },
    deliverySpeeds() {
      return this.getDeliverySpeed.length
        ? this.getDeliverySpeed[this.getDestinationIndex].proposed_speeds
        : [];
    },
    pickUpSpeeds() {
      return this.getPickUpSpeed.length
        ? this.getPickUpSpeed[0].proposed_speeds
        : [];
    },
    deliveryFee() {
      let fee = 0;
      this.getOrderTrackingData.order?.sale_of_goods_invoice?.invoice_adjustments_subtotals?.forEach(
        (row) => {
          if (row.adjustment_type === "DELIVERY_FEE") {
            fee = row.adjustment_subtotal;
          }
        }
      );
      return fee;
    },
    deliveryPricing() {
      return this.getFulfillmentFees.pricing.pricing_deliveries[
        this.getDestinationIndex
      ];
    },
    activeDestination() {
      return this.getDestinations[this.getDestinationIndex];
    },
    isDeliveryFieldsValid() {
      return this.location.length;
    },
    isConsignmentReturnFieldsValid() {
      return this.location.length && this.phone.length;
    },
    isRecipientFieldsValid() {
      return this.customerName.length && this.phone.length;
    },
    isPickUpFieldsValid() {
      return this.location.length && this.phone.length;
    },
    isPaymentCollectionValid() {
      return this.deliveryFeeCollection;
    },
    isDeliveryOptionValid() {
      return this.deliveryOption !== "";
    },
    isPickUpOptionValid() {
      return this.pickUpOption !== "";
    },
    isScheduledPickUpDateValid() {
      return this.pickUpDate !== "";
    },
    isScheduledDeliveryDateValid() {
      return this.deliveryDate !== "";
    },
    isConsignmentReturnsOptionValid() {
      return this.consignmentReturnsOption !== "";
    },
    isScheduledConsignmentReturnDateValid() {
      return this.consignmentReturnDate !== "";
    },
    productPrice() {
      let price = 0;
      if (this.getOrderTrackingData.order.sale_of_goods_invoice) {
        this.getOrderTrackingData.order.sale_of_goods_invoice.invoice_adjustments_subtotals.forEach(
          (row) => {
            if (row.adjustment_type === "SALE_OF_GOOD") {
              price = row.adjustment_subtotal;
            }
          }
        );
      } else {
        price = this.getOrderTrackingData.order.invoice_summary.total_cost;
      }
      return price;
    },
    productCurrency() {
      if (this.getOrderTrackingData.order.sale_of_goods_invoice) {
        return this.getOrderTrackingData.order.sale_of_goods_invoice.currency;
      } else {
        return this.getOrderTrackingData.order.invoice_summary.currency;
      }
    },
    paymentOnDeliveryFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.payments_on_delivery_enabled
        : false;
    },
    paymentStatuses() {
      let paymentStatus = "";
      if (
        this.getOrderTrackingData.order?.sale_of_goods_invoice
          ?.invoice_adjustments_subtotals[0].adjustment_type ===
          "DELIVERY_FEE" &&
        this.getOrderTrackingData.order?.sale_of_goods_invoice
          ?.invoice_adjustments_subtotals[1].adjustment_type === "SALE_OF_GOOD"
      ) {
        paymentStatus = "fee";
      } else if (
        this.getOrderTrackingData.order?.sale_of_goods_invoice
          ?.invoice_adjustments_subtotals[0].adjustment_type === "SALE_OF_GOOD"
      ) {
        paymentStatus = "nofee";
      } else {
        paymentStatus = "none";
      }
      return paymentStatus;
    },
    deliverySpeedOptions() {
      return this.getDeliverySpeed[0]?.proposed_speeds;
    },
    geofenceDataPayload() {
      const payload = {
        description: this.locationData.formatted_address,
        longitude: this.locationData.geometry.location.lng(),
        latitude: this.locationData.geometry.location.lat(),
      };
      return payload;
    },
    isWithinGeoFence() {
      return this.activeDestination.geofence?.length;
    },
    cantEditDeliveryRecipientInfo() {
      const orderInTransit =
        this.getOrderTrackingData.order.order_status === "ORDER_IN_TRANSIT";
      if (this.getParent === "sendy") {
        return (
          orderInTransit &&
          this.getOrderTrackingData.order.order_event_status !==
            "event.pickup.partner.assigned" &&
          this.getOrderTrackingData.order.order_event_status !==
            "event.pickup.partner.enroute.to.pickup.location"
        );
      } else {
        const orderCompleted =
          this.getOrderTrackingData.order.order_status === "ORDER_COMPLETED";
        const buyerEnroute =
          this.getOrderTrackingData.order.order_event_status !==
          "event.delivery.partner.enroute.to.buyer.location";
        return (orderInTransit && buyerEnroute) || orderCompleted;
      }
    },
    checkEditProducts() {
      return (
        this.getOrderTrackingData.order.order_status === "ORDER_RECEIVED" ||
        this.getOrderTrackingData.order.order_status === "ORDER_IN_PROCESSING"
      );
    },
    getVirtualTour() {
      return JSON.parse(this.getCookie("new_features_virtual_tour"));
    },
  },
  beforeMount() {
    if (localStorage.country) {
      const props = this.getSendyPhoneProps;
      props.defaultCountry = localStorage.country.toLowerCase();
      this.setSendyPhoneProps(props);
    }
    this.initiateS3();
  },
  methods: {
    ...mapActions([
      "requestAxiosPut",
      "requestAxiosGet",
      "requestAxiosPost",
      "requestAxiosPatch",
      "updateOrderTrackingData",
    ]),
    ...mapMutations([
      "setLoader",
      "setOrderTrackingData",
      "setPromoCode",
      "setUserAction",
      "setProductsToSubmit",
      "setSendyPhoneProps",
      "setPaymentCollectionStatus",
      "setDeliveryInfo",
      "setRecepientInfo",
      "setDestinations",
      "setPickUpOptions",
      "setPickUpInfoCD",
      "setPickUpStation",
      "setMismatchedDates",
      "setOverlayStatus",
      "setEdittedDocuments",
      "setEditStatus",
      "setDocumentURL",
      "setDeliverySpeed",
      "setFinalDocumentsToEdit",
      "setGeofenceData",
      "setConsignmentReturn",
      "setDestinationIndex",
      "setDirectOrderDetails",
    ]),
    validateFields() {
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
    },
    takeTour() {
      this.setOverlayStatus({
        overlay: false,
        popup: "tour",
      });
      introJs()
        .setOptions({
          steps: [
            {
              title: "Choose your action here",
              element: document.querySelector(
                ".dashboard-quicklinks-container"
              ),
              intro:
                'Click on any item to select <div class="dashboard-tour-counter">1/5</div>',
              position: "bottom",
            },
            {
              title: "View your account balance!",
              element: document.querySelector(".dashboard-wallet-container"),
              intro:
                'Click to access your wallet <div class="dashboard-tour-counter">2/5</div>',
            },
            {
              title: "Track Ongoing On-demand deliveries",
              element: document.querySelector(
                ".dashboard-deliveries-ondemand-section"
              ),
              intro:
                'Click to display list of the on-demand deliveries<div class="dashboard-tour-counter">4/5</div>',
            },
            {
              title: "View stats summary",
              element: document.querySelector(".dashboard-sidecard-container"),
              intro:
                'The stats have moved here. Select a category to view full details.<div class="dashboard-tour-counter">4/5</div>',
              position: "left",
            },
            {
              title: "Learn more ways to do more with Sendy",
              element: document.querySelector(".dashboard-articles-container"),
              intro:
                'Discover offers and products<div class="dashboard-tour-counter">5/5</div>',
              position: "left",
            },
          ],
          tooltipClass: "introjs-tooltip",
          showBullets: false,
          exitOnOverlayClick: false,
        })
        .start();
      let closeElement = document.querySelector(".introjs-skipbutton");
      let nextElement = document.querySelector(".introjs-nextbutton");
      closeElement.addEventListener("click", function () {
        this.disableTour();
      });
      nextElement.addEventListener("click", function () {
        let textContent = nextElement.textContent;
        if (textContent === "Done") {
          this.disableTour();
        }
      });
    },
    disableTour() {
      this.setCookie("new_features_virtual_tour", false, 365);
    },
    skipTour() {
      this.setOverlayStatus({
        overlay: false,
        popup: "tour",
      });
      this.disableTour();
    },
    formatAutofillDetails() {
      this.overlayStatusSet(false, "uploadLPO");
      this.destinations.forEach((row, i) => {
        this.getDestinations[i] = row;
      });
      ElNotification({
        title: "",
        message: this.$t("inventory.autofillCompleted"),
        type: "success",
      });
      this.resetLPO();
    },
    setGeofence() {
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/location/geofence`,
        values: this.geofenceDataPayload,
      }).then((response) => {
        if (response.status === 200) {
          this.setGeofenceData(response.data.data.geo_fences);
          this.getDestinations[this.getDestinationIndex].geofence =
            response.data.data.geo_fences;
        }
      });
    },
    submitDeliveryOption() {
      const destinations = this.getDestinations;
      const index = this.getDestinationIndex;
      const scheduledDate =
        destinations[index].speed &&
        destinations[index].speed.speed_pricing_scheduled_date
          ? new Date(destinations[index].speed.speed_pricing_scheduled_date)
          : new Date();
      const speed = this.deliverySpeeds[this.deliveryOption];
      speed.index = this.deliveryOption;
      if (destinations[index]) {
        destinations[index].speed = speed;
      } else {
        destinations.splice(index, 0, {
          speed,
        });
      }
      this.setDestinations(destinations);
      setTimeout(() => {
        this.deliveryOption = "";
      }, 500);
      if (destinations[index].speed.speed_pricing_type === "SENDY_SCHEDULED") {
        this.deliveryDate = scheduledDate ? scheduledDate : new Date();
        this.deliverySpeeds[this.deliveryOption].speed_pricing_scheduled_date =
          scheduledDate;
        this.overlayStatusSet(true, "rescheduleDeliveryOption");
        return;
      }
      this.overlayStatusSet(false, "deliveryOptionCrossdock");
      this.misMatchedDatesError = "";
      if (
        destinations[index].speed &&
        this.getPickUpInfoCD.pickupSpeed &&
        destinations[index].speed.speed_pricing_upper_limit_date >
          this.getPickUpInfoCD.pickupSpeed.speed_pricing_upper_limit_date
      ) {
        this.setMismatchedDates(false);
      } else if (
        destinations[index].speed &&
        this.getPickUpInfoCD.pickupSpeed &&
        destinations[index].speed.speed_pricing_upper_limit_date <=
          this.getPickUpInfoCD.pickupSpeed.speed_pricing_upper_limit_date
      ) {
        this.overlayStatusSet(true, "pickupOptionCrossdock");
        this.misMatchedDatesError = this.$t(
          "inventory.thePickUpDateCannotBeAheadOfTheDeliveryDate"
        );
      }
    },
    submitPickUpOption() {
      const pickUpInfoCD = this.getPickUpInfoCD;
      const pickup = pickUpInfoCD;
      const scheduledDate =
        pickup.pickupSpeed && pickup.pickupSpeed.speed_pricing_scheduled_date
          ? new Date(pickup.pickupSpeed.speed_pricing_scheduled_date)
          : new Date();
      pickup.pickupSpeed = this.pickUpSpeeds[this.pickUpOption];
      pickup.pickupSpeed.index = this.pickUpOption;
      this.setPickUpInfoCD(pickup);
      this.clearInputs();
      setTimeout(() => {
        this.pickUpOption = "";
      }, 500);
      if (pickup.pickupSpeed.speed_pricing_type === "SENDY_SCHEDULED") {
        this.pickUpDate = scheduledDate ? scheduledDate : new Date();
        this.pickUpSpeeds[this.pickUpOption].speed_pricing_scheduled_date =
          scheduledDate;
        this.overlayStatusSet(true, "reschedulePickupOption");
        return;
      }
      this.overlayStatusSet(false, "pickupOptionCrossdock");
      this.misMatchedDatesError = "";
      if (
        this.activeDestination.speed &&
        this.getPickUpInfoCD.pickupSpeed &&
        this.activeDestination.speed.speed_pricing_upper_limit_date <=
          this.getPickUpInfoCD.pickupSpeed.speed_pricing_upper_limit_date
      ) {
        this.overlayStatusSet(true, "deliveryOptionCrossdock");
        this.misMatchedDatesError = this.$t(
          "inventory.pleaseMakeSureTheDeliveryDateIsAfter",
          {
            Date: this.formatDate(
              this.getPickUpInfoCD.pickupSpeed.speed_pricing_upper_limit_date
            ),
          }
        );
      }
    },
    submitConsigmentReturnOption() {
      const speed =
        this.getConsignmentReturnSpeed[this.consignmentReturnsOption];
      const consignmentReturn = this.getConsignmentReturn;
      consignmentReturn.deliveryDate.type = speed.speed_pricing_type;
      consignmentReturn.deliveryDate.date =
        speed.speed_pricing_upper_limit_date;
      if (consignmentReturn.deliveryDate.type === "SENDY_SCHEDULED") {
        this.consignmentReturnDate = consignmentReturn.deliveryDate.date;
        speed.speed_pricing_upper_limit_date =
          consignmentReturn.deliveryDate.date;
        this.overlayStatusSet(true, "rescheduleConsignmentReturn");
        return;
      }
      this.overlayStatusSet(false, "ConsignmentReturnOption");
    },
    showRescheduleConsignment() {
      const speed =
        this.getConsignmentReturnSpeed[this.consignmentReturnsOption];
      const consignmentReturn = this.getConsignmentReturn;
      speed.speed_pricing_upper_limit_date = this.consignmentReturnDate;
      consignmentReturn.deliveryDate.date = this.consignmentReturnDate;
      this.overlayStatusSet(false, "rescheduleConsignmentReturn");
    },
    showReschedulePickUpOption() {
      const pickUpInfoCD = this.getPickUpInfoCD;
      pickUpInfoCD.pickupSpeed.speed_pricing_scheduled_date = this.pickUpDate;
      this.setPickUpInfoCD(pickUpInfoCD);
      this.overlayStatusSet(false, "reschedulePickupOption");
      this.pickUpDate = new Date();
      this.validateScheduledDates("delivery");
    },
    showRescheduleDeliveryOption() {
      this.activeDestination.speed.speed_pricing_scheduled_date =
        this.deliveryDate;
      this.overlayStatusSet(false, "rescheduleDeliveryOption");
      this.deliveryDate = new Date();
      this.validateScheduledDates("pickup");
    },
    validateScheduledDates(source) {
      const destination = this.activeDestination;
      const pickUpInfoCD = this.getPickUpInfoCD;
      if (
        destination.speed &&
        pickUpInfoCD.pickupSpeed &&
        ((destination.speed.speed_pricing_type === "SENDY_SCHEDULED" &&
          pickUpInfoCD.pickupSpeed.speed_pricing_type === "SENDY_SCHEDULED" &&
          destination.speed.speed_pricing_scheduled_date <=
            pickUpInfoCD.pickupSpeed.speed_pricing_scheduled_date) ||
          (destination.speed.speed_pricing_type !== "SENDY_SCHEDULED" &&
            pickUpInfoCD.pickupSpeed.speed_pricing_type === "SENDY_SCHEDULED" &&
            destination.speed.speed_pricing_upper_limit_date <=
              pickUpInfoCD.pickupSpeed.speed_pricing_scheduled_date) ||
          (destination.speed.speed_pricing_type === "SENDY_SCHEDULED" &&
            pickUpInfoCD.pickupSpeed.speed_pricing_type !== "SENDY_SCHEDULED" &&
            destination.speed.speed_pricing_scheduled_date <=
              pickUpInfoCD.pickupSpeed.speed_pricing_upper_limit_date))
      ) {
        this.misMatchedDatesError =
          source === "pickup"
            ? this.$t("inventory.thePickUpDateCannotBeAheadOfTheDeliveryDate")
            : this.$t("inventory.pleaseMakeSureTheDeliveryDateIsAfter", {
                Date:
                  this.getPickUpInfoCD.pickupSpeed.speed_pricing_type ===
                  "SENDY_SCHEDULED"
                    ? this.formatDate(
                        this.getPickUpInfoCD.pickupSpeed
                          .speed_pricing_scheduled_date
                      )
                    : this.formatDate(
                        this.getPickUpInfoCD.pickupSpeed
                          .speed_pricing_upper_limit_date
                      ),
              });
        this.overlayStatusSet(true, `${source}OptionCrossdock`);
      } else {
        this.misMatchedDatesError = "";
      }
    },
    removeLocation() {
      const index = this.getDestinationIndex;
      const destinations = this.getDestinations;
      if (destinations[index - 1]) {
        destinations[index - 1].expanded = 1;
      }
      destinations.splice(index, 1);
      this.setDestinations(destinations);
      this.overlayStatusSet(false, "removeDestination");
    },
    removePhoneNumber() {
      this.secondaryPhoneStatus = !this.secondaryPhoneStatus;
      this.secPhone = "";
    },
    uploadPDFFile() {
      document.querySelector("#upload-pdf-card").click();
    },
    uploadLPOFile() {
      document.querySelector("#upload-lpo-card").click();
    },
    resetLPO() {
      this.LPOUploadStatus = false;
      this.LPO = "";
      this.uploadPercentage = 0;
    },
    selectPickUpOption() {
      this.setPickUpOptions({
        type: this.pickItems,
        text:
          this.pickItems === "driver"
            ? "inventory.sendDriverToPickTheItems"
            : "inventory.IllTakeTheItems",
        info: "",
        date: "",
        FC: "",
      });
      this.overlayStatusSet(false, "pickItems");
      if (this.pickItems === "self") {
        this.overlayStatusSet(true, "stations");
      }
    },
    addPDFDocument() {
      const destinations = this.getDestinations;
      const index = this.getDestinationIndex;
      const documents =
        destinations[index] &&
        destinations[index].documents &&
        destinations[index].documents.length
          ? destinations[index].documents
          : [];
      if (destinations[index] && destinations[index].documents) {
        const existingDoc = destinations[index].documents.filter((row) => {
          return row.url === this.PDF && row.type === this.documentType;
        });
        if (!existingDoc.length) {
          documents.push({
            title: this.documentTitle,
            url: this.PDF,
            type: this.documentType,
          });
          destinations[index].documents = documents;
          this.setDestinations(destinations);
        }
      } else {
        documents.push({
          title: this.documentTitle,
          url: this.PDF,
          type: this.documentType,
        });
        if (destinations[index]) {
          destinations[index].documents = documents;
        } else {
          destinations.splice(index, 0, {
            documents,
          });
        }
        this.setDestinations(destinations);
      }
      this.overlayStatusSet(false, "deliveryDocuments");
      setTimeout(() => {
        this.documentTitle = "";
        this.PDF = "";
        this.documentType = "";
        this.v$.$reset();
      }, 500);
    },
    editPDFDocument() {
      const docObj = {
        document_type: this.documentType.toUpperCase(),
        document_url: this.PDF,
        document_description: this.documentTitle,
      };
      this.getFinalDocumentsToEdit.push(docObj);
      this.overlayStatusSet(true, "addRemoveDocument");
      setTimeout(() => {
        this.documentTitle = "";
        this.PDF = "";
        this.documentType = "";
        this.v$.$reset();
      }, 300);
    },
    uploadAnotherDocument() {
      this.setOverlayStatus({
        overlay: true,
        popup: "deliveryDocuments",
        editStatus: true,
      });
    },
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
      this.setGeofence();
    },
    submitPickStation() {
      this.setPickUpStation(this.getStations[this.pickUpStation]);
      this.overlayStatusSet(false, "stations");
    },
    submitPickUpInfo() {
      const pickupSpeed = this.getPickUpInfoCD.pickupSpeed;
      const pickUpDetails = {
        location: this.location,
        place: this.locationData,
        phone: this.phone,
        secondary_phone_number: this.secPhone,
        instructions: this.instructions,
        pickupSpeed,
      };
      this.overlayStatusSet(false, "pickUpInfoCrossDock");
      this.setPickUpInfoCD(pickUpDetails);
      this.clearInputs();
    },
    submitDeliveryInfo() {
      const index = this.getDestinationIndex;
      const destinations = this.getDestinations;
      const deliveryDetails = {
        location: this.location,
        apartmentName: this.apartmentName,
        instructions: this.instructions,
        place: this.locationData,
      };
      this.overlayStatusSet(false, "deliveryInfoCrossdock");
      this.setDeliveryInfo(deliveryDetails);
      if (destinations[index]) {
        destinations[index].delivery_info = deliveryDetails;
      } else {
        destinations.splice(index, 0, {
          delivery_info: deliveryDetails,
        });
      }
      this.setDestinations(destinations);
      this.clearInputs();
    },
    submitRecepientInfo() {
      const index = this.getDestinationIndex;
      const destinations = this.getDestinations;
      const recepientDetails = {
        customer_name: this.customerName,
        phone: this.phone,
        secondary_phone_number: this.secPhone,
        recipient_type: this.recepientOption,
      };
      this.overlayStatusSet(false, "recepientInfoCrossdock");
      this.setRecepientInfo(recepientDetails);
      if (destinations[index]) {
        destinations[index].recipient = recepientDetails;
      } else {
        destinations.splice(index, 0, {
          recipient: recepientDetails,
        });
      }
      this.setDestinations(destinations);
      this.clearInputs();
    },
    submitConsignmentReturn() {
      const deliveryDetails = {
        location: this.location,
        apartmentName: this.apartmentName,
        instructions: this.instructions,
        place: this.locationData,
        phone: this.phone,
        secondary_phone_number: this.secPhone,
      };
      this.getConsignmentReturn.deliveryDetails = deliveryDetails;
      this.setDeliveryInfo(deliveryDetails);
      this.overlayStatusSet(false, "consignmentReturndeliveryInfo");
      this.clearInputs();
    },
    clearInputs() {
      setTimeout(() => {
        this.customerName = "";
        this.phone = "";
        this.secPhone = "";
        this.location = "";
        this.apartmentName = "";
        this.instructions = "";
        this.recepientOption = "";
        this.locationData = {};
        this.secondaryPhoneStatus = false;
        this.v$.$reset();
      }, 500);
    },
    setPaymentCollection() {
      if (this.getPaymentCollectionStatus.status === "") {
        this.selectPaymentCollection = true;
        setTimeout(() => {
          this.selectPaymentCollection = false;
        }, 3000);
      } else if (
        this.getPaymentCollectionStatus.amountToBeCollected === "" &&
        this.getPaymentCollectionStatus.status
      ) {
        this.selectDeliveryFee = true;
        setTimeout(() => {
          this.selectDeliveryFee = false;
        }, 3000);
      } else if (
        this.getPaymentCollectionStatus.amountToBeCollected === "fee" &&
        this.getPaymentCollectionStatus.deliveryFee === ""
      ) {
        this.enterDeliveryFee = true;
        setTimeout(() => {
          this.enterDeliveryFee = false;
        }, 3000);
      } else {
        this.overlayStatusSet(false, "paymentCollection");
      }
      const index = this.getDestinationIndex;
      const destinations = this.getDestinations;
      if (destinations[index]) {
        destinations[index].POD = this.getPaymentCollectionStatus;
      } else {
        destinations.splice(index, 0, {
          POD: this.getPaymentCollectionStatus,
        });
      }
      setTimeout(() => {
        this.v$.$reset();
      }, 500);
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
    async submitConsignment() {
      const order = this.getOrderTrackingData.order;
      this.buttonLoader = true;
      const payload = {
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
      };
      if (!this.partnerNotAssigned) {
        delete payload.destination.delivery_location;
      }
      const fullPayload = {
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/consignments/${this.getOrderTrackingData.order.order_id}`,
        values: payload,
      };
      const response = await this.updateOrderTrackingData(fullPayload);
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
    },
    editDeliverySpeed() {
      if (
        this.deliverySpeedOptions[this.deliveryOption].speed_pricing_type ===
        "SENDY_SCHEDULED"
      ) {
        this.deliveryDate = this.getOrderTrackingData.order.scheduled_date;
        this.overlayStatusSet(true, "editRescheduleDeliveryOption");
        return;
      }
      this.deliveryDate =
        this.deliverySpeedOptions[
          this.deliveryOption
        ].speed_pricing_upper_limit_date;
      this.submitDelivery();
    },
    async submitDelivery() {
      this.buttonLoader = true;
      const payload = this.submitDeliveryPayload;
      if (!this.partnerNotAssigned) {
        delete payload.destination.delivery_location;
      }
      const fullPayload = {
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/deliveries/${this.getOrderTrackingData.order.order_id}`,
        values: payload,
      };
      const response = await this.updateOrderTrackingData(fullPayload);
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
    formatTime(time) {
      return moment(time).format("Do MMM h:mm a");
    },
    formatDate(date) {
      return moment(date).format("ddd, Do MMM");
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
    updatePrice() {
      if (this.getSelectedProducts[this.getEditedPriceIndex].selectedOption) {
        this.getSelectedProducts[
          this.getEditedPriceIndex
        ].selectedOption.product_variant_unit_price = this.newPrice;
      } else {
        this.getSelectedProducts[
          this.getEditedPriceIndex
        ].product_variants[0].product_variant_unit_price = this.newPrice;
      }
      this.overlayStatusSet(false, "editPrice");
    },
    enterPromoCode() {
      this.setPromoCode(this.promoCode);
      this.promoCode = "";
      this.overlayStatusSet(false, "promo");
    },
    preloadDeliveryOption(val) {
      const index = this.getDestinationIndex;
      const destinations = this.getDestinations;
      if (val.popup === "deliveryOptionCrossdock") {
        this.deliveryOption =
          destinations[index] && destinations[index].speed
            ? destinations[index].speed.index
            : "";
      } else if (val.popup === "pickupOptionCrossdock") {
        this.pickUpOption =
          this.getPickUpInfoCD && this.getPickUpInfoCD.pickupSpeed
            ? this.getPickUpInfoCD.pickupSpeed.index
            : "";
      }
    },
    preloadDeliveryDetails(val) {
      const index = this.getDestinationIndex;
      const destinations = this.getDestinations;
      if (val.popup === "consignmentReturndeliveryInfo") {
        this.location = this.getConsignmentReturn?.deliveryDetails?.location
          ? this.getConsignmentReturn?.deliveryDetails?.location
          : "";
        this.locationData = this.getConsignmentReturn?.deliveryDetails?.place
          ? this.getConsignmentReturn?.deliveryDetails?.place
          : "";
        this.apartmentName = this.getConsignmentReturn?.deliveryDetails
          ?.apartmentName
          ? this.getConsignmentReturn?.deliveryDetails?.apartmentName
          : "";
        this.instructions = this.getConsignmentReturn?.deliveryDetails
          ?.instructions
          ? this.getConsignmentReturn?.deliveryDetails?.instructions
          : "";
        this.phone = this.getConsignmentReturn?.deliveryDetails?.phone
          ? this.getConsignmentReturn?.deliveryDetails?.phone
          : "";
        this.secPhone = this.getConsignmentReturn?.deliveryDetails
          ?.secondary_phone_number
          ? this.getConsignmentReturn?.deliveryDetails?.secondary_phone_number
          : "";
      } else if (val.popup === "deliveryInfoCrossdock") {
        this.location =
          destinations[index] && destinations[index].delivery_info
            ? destinations[index].delivery_info.location
            : "";
        this.locationData =
          destinations[index] && destinations[index].delivery_info
            ? destinations[index].delivery_info.place
            : "";
        this.apartmentName =
          destinations[index] && destinations[index].delivery_info
            ? destinations[index].delivery_info.apartmentName
            : "";
        this.instructions =
          destinations[index] && destinations[index].delivery_info
            ? destinations[index].delivery_info.instructions
            : "";
      } else if (val.popup === "recepientInfoCrossdock") {
        this.customerName =
          destinations[index] && destinations[index].recipient
            ? destinations[index].recipient.customer_name
            : "";
        this.recepientOption =
          destinations[index] && destinations[index].recipient
            ? destinations[index].recipient.recipient_type
            : "";
        this.phone =
          destinations[index] && destinations[index].recipient
            ? destinations[index].recipient.phone
            : "";
        this.secPhone =
          destinations[index] && destinations[index].recipient
            ? destinations[index].recipient.secondary_phone_number
            : "";
        this.secondaryPhoneStatus =
          destinations[index] &&
          destinations[index].recipient &&
          destinations[index].recipient.secondary_phone_number;
        this.secPhone =
          destinations[index] && destinations[index].recipient
            ? destinations[index].recipient.secondary_phone_number
            : "";
      } else if (val.popup === "pickUpInfoCrossDock") {
        this.location = this.getPickUpInfoCD.location
          ? this.getPickUpInfoCD.location
          : "";
        this.locationData = this.getPickUpInfoCD.place
          ? this.getPickUpInfoCD.place
          : "";
        this.phone = this.getPickUpInfoCD.phone
          ? this.getPickUpInfoCD.phone
          : "";
        this.secondaryPhoneStatus =
          this.getPickUpInfoCD && this.getPickUpInfoCD.secondary_phone_number;
        this.secPhone = this.getPickUpInfoCD.secondary_phone_number
          ? this.getPickUpInfoCD.secondary_phone_number
          : "";
        this.instructions = this.getPickUpInfoCD.instructions
          ? this.getPickUpInfoCD.instructions
          : "";
      } else if (val.popup === "paymentCollection") {
        this.paymentCollection = this.getPaymentCollectionStatus.status;
        this.deliveryFeeCollection =
          this.getPaymentCollectionStatus.amountToBeCollected;
        this.deliveryFeeAmount = this.getPaymentCollectionStatus.deliveryFee;
      }
    },
    preloadOrderTrackingData(val) {
      this.customerName = val.order.destination.name;
      this.location = val.order.destination.delivery_location.description;
      this.phone = val.order.destination.phone_number;
      this.secondaryPhoneStatus =
        val.order.destination.secondary_phone_number !== null &&
        val.order.destination.secondary_phone_number !== "";
      this.secPhone = val.order.destination.secondary_phone_number;
      this.instructions = val.order.destination.delivery_instructions;
      this.date = new Date(val.order.scheduled_date);
      this.apartmentName = val.order.destination.house_location;
      this.recepientOption =
        val.order.destination.buyer_type !== null
          ? val.order.destination.buyer_type
          : "INDIVIDUAL";
      this.deliveryFeeCollection = this.paymentStatuses;
      this.deliveryFeeAmount = this.deliveryFee;
    },
    execute(option, index) {
      if (option === "viewDocument") {
        this.setDocumentURL(
          this.getOrderTrackingData.order.documents[index].document_url
        );
        this.setOverlayStatus({
          overlay: true,
          popup: "viewDocument",
        });
      } else {
        const data = this.mapEdittedDocuments;
        data.splice(index, 1);
      }
    },
    navigateToEditProducts() {
      this.setOverlayStatus({
        overlay: false,
        popup: "cancelOptions",
      });
      this.$router.push("/deliveries/edit-order");
    },
    rescheduleDirect() {
      const date = moment(this.directDate).format("YYYY-MM-DD");
      const time = moment(
        `${this.directTime.hh}:${this.directTime.mm} ${this.directTime.a}`,
        "h:mm a"
      ).format("HH:mm");

      if (
        moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").valueOf() >
        moment().valueOf()
      ) {
        this.getDirectOrderDetails.pickup.pickup_date = new Date(
          moment(`${date} ${time}`, "YYYY-MM-DD HH:mm")
        );
        this.overlayStatusSet(false, "rescheduleDirect");
      } else {
        ElNotification({
          title: "",
          message: this.$t("deliveries.scheduledDateCannotBeEarlier"),
          type: "warning",
        });
      }
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
  width: 100%;
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

.crossdock-recipient-details-text {
  margin: 1rem 0px 1rem 0px !important;
}

.payment-charges-info-icon {
  padding-right: 5px;
  color: #324ba8;
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

.recepient-info-icons {
  font-size: 20px !important;
  padding-right: 6px !important;
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

.payment-charges-communication {
  background-color: #f7f9fc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}

.payment-charges-communication-desc {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.speed-charges-communication-desc {
  font-size: 12px;
  color: #324ba8;
  font-weight: 500;
}

.recepient-info-label {
  padding-left: 10px !important;
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

.edit-info-submit-button:disabled {
  margin-top: 40px;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: #324ba8 !important;
  background: #d3ddf6 !important;
  width: -webkit-fill-available;
}

.cross-docking-upload-doc:disabled {
  text-transform: capitalize;
  letter-spacing: 0px;
  color: #324ba8 !important;
  background: #d3ddf6 !important;
  width: -webkit-fill-available;
  height: 50px !important;
}

.cross-docking-upload-doc {
  text-transform: capitalize;
  letter-spacing: 0px;
  color: white !important;
  background: #324ba8;
  width: -webkit-fill-available;
  height: 50px !important;
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
  align-items: center;
}

.export-CSV-button {
  margin-left: 70px;
  width: 260px;
}

.export-CSV-description {
  color: #606266;
}

.businessProfile-address:disabled {
  background: #e2e7ed !important;
}

.businessProfile-field:disabled {
  background: #e2e7ed !important;
}

.payment-collection-overlay-border-top {
  width: 100%;
  border: 1px solid #e2e7ed;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  padding: 20px;
}

.crossdocking-remove-order-button {
  height: 50px;
  margin: 10px 0px 0px 0px;
  background: #9b101c;
  width: -webkit-fill-available;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: white !important;
  font-size: 16px;
}

.crossdocking-dont-remove-order-button {
  box-shadow: none !important;
  color: #909399 !important;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
}

.delivery-option-crossdock-radio {
  width: 100%;
  border: 1px solid #e2e7ed;
  border-radius: 10px;
  padding: 20px;
  height: 75px;
  margin: 5px 0px;
}

.delivery-option-crossdock-radio-group,
.delivery-option-crossdock-radio-group .el-radio__label {
  width: 100%;
}

.delivery-option-crossdock-radio-right {
  float: right;
}

.delivery-option-crossdock-radio-group .el-radio__label {
  font-size: 17px !important;
  color: #303133;
  margin-top: 10px !important;
  margin-bottom: 2px !important;
}

.delivery-option-crossdock-radio-group-bottom {
  color: #909399;
  font-size: 14px;
  padding-top: 3px;
}

.delivery-option-crossdock-title {
  font-weight: 500;
  font-size: 17px;
}

.delivery-option-notice-icon {
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border-radius: 40px;
  background: #d3ddf6;
  color: #324ba8;
  margin: 20px auto;
}

.delivery-option-notice-message {
  text-align: center;
  font-size: 19px;
  margin-bottom: -10px;
}

.payment-collection-overlay-border-bottom {
  width: 100%;
  border: 1px solid #e2e7ed;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 20px;
  border-top: none;
}

.el-radio__input.is-checked + .el-radio__label {
  color: var(--el-radio-text-color) !important;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #0062db !important;
  background: #0062db !important;
}

.payment-collection-overlay-title {
  font-size: 16px;
  font-weight: 500;
}

.padding-override {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.font-override {
  font-weight: 400 !important;
}

.delivery-fee-collection-overlay-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}

.payment-breakdown-amount {
  color: #909399;
  font-size: 15px;
  margin-bottom: 5px;
}

.payment-breakdown-title {
  font-size: 15px;
}

.payment-breakdown-products-count {
  background: #e2e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
}

.payment-collection-overlay-border-middle {
  width: 100%;
  border: 1px solid #e2e7ed;
  padding: 20px;
  border-top: none;
}

.payment-collection-overlay-amount-field {
  margin-top: 25px;
  margin-left: 35px;
  margin-bottom: -30px;
}

.crossdocking-add-document-drop {
  height: max-content;
  width: 100%;
  border: 1px dashed grey;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  border-radius: 5px;
}

.crossdocking-add-document-drop-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.crossdocking-add-document-drop-inner-bottom {
  color: #324ba8 !important;
  font-size: 14px;
  cursor: pointer;
  margin-top: -10px;
}

.crossdocking-add-document-titles {
  font-size: 15px;
}

.crossdocking-pick-items-text {
  white-space: normal;
}

.crossdocking-pickup-stations {
  height: 140px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  border-bottom: 1px solid #e2e7ed;
}

.crossdocking-stations-container {
  height: 350px;
  overflow: scroll;
}

.fees-container {
  max-height: 700px;
  overflow-y: scroll;
}

.crossdocking-input-fields {
  height: 40px !important;
}

.crossdocking-input-fields-v-text {
  zoom: 80% !important;
}

.crossdocking-remove-order-button {
  height: 50px;
  margin: 10px 0px 0px 0px;
  background: #9b101c;
  width: -webkit-fill-available;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: white !important;
  font-size: 16px;
}

.crossdocking-dont-remove-order-button {
  box-shadow: none !important;
  color: #909399 !important;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
}

.delivery-option-crossdock-radio {
  width: 100%;
  border: 1px solid #e2e7ed;
  border-radius: 10px;
  padding: 20px;
  height: 75px;
  margin: 5px 0px;
}

.delivery-option-crossdock-radio-group,
.delivery-option-crossdock-radio-group .el-radio__label {
  width: 100%;
}

.delivery-option-crossdock-radio-right {
  float: right;
}

.delivery-option-crossdock-radio-group .el-radio__label {
  font-size: 17px !important;
  color: #303133;
  margin-top: 10px !important;
  margin-bottom: 2px !important;
}

.delivery-option-crossdock-radio-group-bottom {
  color: #909399;
  font-size: 14px;
  padding-top: 3px;
}

.delivery-option-crossdock-title {
  font-weight: 500;
  font-size: 17px;
}

.delivery-option-notice-icon {
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border-radius: 40px;
  background: #d3ddf6;
  color: #324ba8;
  margin: 20px auto;
}

.delivery-option-notice-message {
  text-align: center;
  font-size: 19px;
  margin-bottom: -10px;
}

.document-type-text {
  font-size: 14px;
}

.edit-delivery-override {
  border-bottom: none !important;
}

.pick-up-unavailable-error {
  text-align: center;
  color: #9b101c;
  height: 80px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  background: #fbdecf;
  font-weight: 500;
  margin-bottom: 10px;
}

.cancel-options-text > p {
  margin-bottom: 2px !important;
}

.cancel-options-desc {
  color: #324ba8;
  cursor: pointer;
}

.cancel-options-container {
  margin-top: 20px;
}

.dont-cancel-text {
  margin-bottom: 0 !important;
  border-bottom: 2px solid #324ba8;
}
.cancel-back-text {
  cursor: pointer;
}
.upload-lpo-container {
  width: 450px;
}
.upload-lpo-progress-bar {
  height: 80px;
  align-items: center;
  border: 1px solid #dcdfe6;
  padding: 10px;
  border-radius: 5px;
}
.upload-lpo-progress-bar-file-name {
  font-size: 13px;
}
.upload-lpo-progress-bar-container {
  width: 100%;
  margin-left: 25px;
}
.upload-lpo-progress-bar-delete {
  width: 13px;
  margin-bottom: 10px;
  cursor: pointer;
}
.upload-lpo-progress-bar-file-img {
  width: 20px;
}
.view-products-container-inner {
  max-height: 600px;
  overflow-y: scroll;
}
.reschedule-direct-time-picker {
  margin: auto;
}
.reschedule-direct-time-picker input {
  border-radius: 5px;
  height: 40px !important;
}
.image-tour-overlay {
  width: 390px !important;
}
.tour-container-override {
  width: 390px !important;
  border-radius: 0px 0px 5px 5px !important;
  padding: 30px !important;
}
.tour-container-override-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #303133;
}
.tour-button {
  height: 45px !important;
  font-size: 16px !important;
}
.skip-tour-text {
  text-align: center;
  font-size: 16px;
  color: #324ba8;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
}
.dashboard-tour-counter {
  position: absolute;
  bottom: -40px;
  right: 0;
  width: 60px;
  height: 20px;
  text-align: center;
}
.vue__time-picker .dropdown ul li:not([disabled]).active,
.vue__time-picker .dropdown ul li:not([disabled]).active:focus,
.vue__time-picker .dropdown ul li:not([disabled]).active:hover {
  background: #c8e5fc !important;
}
</style>
