<template>
  <div class="delivery-info-container">
    <p class="delivery-info-title">
      <span :class="$store.getters.getLoader">
        {{
          parent === "sendy"
            ? $t("deliveries.pickupInfo")
            : $t("deliveries.deliveryInfo")
        }}
      </span>
      <span
        class="delivery-info-edit"
        @click="editInfo = true"
        :class="$store.getters.getLoader"
      >
        <i class="mdi mdi-pencil"></i>
        {{ $t("deliveries.edit") }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{
          parent === "sendy"
            ? $t("deliveries.pickUpLocation")
            : $t("deliveries.nameOfCustomer")
        }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{
          parent === "sendy"
            ? $store.getters.getPickupInfo.location
            : $store.getters.getDeliveryInfo.name
        }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{
          parent === "sendy"
            ? $t("deliveries.pickUpInstructions")
            : $t("deliveries.deliveryLocation")
        }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{
          parent === "sendy"
            ? $store.getters.getPickupInfo.instructions
            : $store.getters.getDeliveryInfo.location
        }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.phoneNumber") }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{
          parent === "sendy"
            ? $store.getters.getPickupInfo.phoneNumber
            : $store.getters.getDeliveryInfo.phoneNumber
        }}
      </span>
    </p>
    <p v-if="parent === 'customer'" class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.instructions") }}
      </span>
    </p>
    <p v-if="parent === 'customer'" class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{ $store.getters.getDeliveryInfo.instructions }}
      </span>
    </p>
    <p v-if="parent === 'customer'" class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.paymentMethod") }}
      </span>
    </p>
    <p v-if="parent === 'customer'" class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{ $store.getters.getDeliveryInfo.payment }}
      </span>
    </p>
    <v-overlay v-model="editInfo" class="align-center justify-center">
      <div class="view-products-container">
        <div class="view-products-section">
          <p class="view-products-label">
            {{ $t("deliveries.editPickUpInfo") }}
          </p>
          <i
            @click="editInfo = false"
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
    </v-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parent: "",
      editInfo: false,
      phone: "",
    };
  },
  mounted() {
    setTimeout(() => {
      this.$store.commit("setLoader", "");
    }, 3000);
    if (this.$router.options.history.state.back === "/deliveries/sendy") {
      this.parent = "sendy";
    } else {
      this.parent = "customer";
    }
  },
  methods: {
    setPlace(path) {
      console.log(path);
    },
  },
};
</script>

<style>
.delivery-info-container {
  border: 1px solid #e2e7ed;
  margin-left: 70px;
  padding: 35px;
  border-radius: 10px;
  width: 70%;
  margin-bottom: 25px;
  line-height: 25px;
  font-size: 14px;
}
.delivery-info-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}
.delivery-info-label {
  color: #606266;
  margin-bottom: 0px;
}
.delivery-info-data {
  color: #303133;
  margin-bottom: 10px;
}
.delivery-info-edit {
  float: right;
  font-size: 14px;
  cursor: pointer;
  font-weight: 300;
  color: #324ba8;
}
.edit-info-label {
  font-size: 14px;
}
.edit-info-instructions {
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  margin-top: 2px;
  padding: 10px;
  margin-bottom: 30px;
}
.edit-info-add-phone {
  color: #606266;
  font-size: 14px;
  margin: 10px 0px;
  cursor: pointer;
}
.edit-info-submit-button {
  margin-top: 40px;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: white !important;
  background: #324ba8;
  width: -webkit-fill-available;
}
</style>
