<template>
  <div>
    <v-card variant="outlined" class="send-inventory-checkout-card">
      <div class="enter-quantity-container desktop-header-title d-flex p-3">
        <i
          class="mdi mdi-arrow-left"
          aria-hidden="true"
          @click="$router.push('/inventory/send-inventory/sendy/add-quantity')"
        ></i>
        <v-card-title class="text-center send-products-title">
          {{ $t("inventory.checkout") }}
        </v-card-title>
      </div>
      <div>
        <div class="">
          <label for="location" class="form-label">
            {{ $t("inventory.pickupLocation") }}
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
        </div>
        <div class="mb-4">
          <label for="price" class="form-label">
            {{ $t("inventory.pickupInstructions") }}
          </label>
          <div>
            <textarea
              class="form-control"
              id=""
              v-model="instructions"
              rows="3"
              :placeholder="
                $t(
                  'deliveries.enterInstructionsForTheDriverPickingYourProducts'
                )
              "
            ></textarea>
          </div>
        </div>
        <div class="mb-3">
          <label for="phoneNumber" class="form-label">
            {{ $t("inventory.phoneNo") }}
          </label>
          <vue-tel-input
            v-model="phone"
            id="phoneNumber"
            v-bind="getSendyPhoneProps"
          ></vue-tel-input>
        </div>
        <div class="mb-3" v-if="addPhoneStatus">
          <label for="phoneNumber" class="form-label">
            {{ $t("inventory.phoneNo") }}
          </label>
          <vue-tel-input
            v-model="secPhone"
            id="phoneNumber"
            v-bind="getSendyPhoneProps"
          ></vue-tel-input>
        </div>
        <span
          class="add-phone-number"
          v-if="!addPhoneStatus"
          @click="addPhoneStatus = !addPhoneStatus"
          ><v-icon class="add-phone-number-icon">mdi mdi-plus</v-icon>
          {{ $t("inventory.addAnotherPhoneNo") }}
        </span>
        <span
          class="add-phone-number"
          v-if="addPhoneStatus"
          @click="addPhoneStatus = !addPhoneStatus"
          ><v-icon class="add-phone-number-icon">mdi mdi-minus</v-icon>
          {{ $t("deliveries.removePhoneNumber") }}
        </span>

        <div class="mt-6 mb-2">
          <span>{{ $t("inventory.pickupFee") }}</span>
          <span class="checkout-amount">{{ currency }} {{ amount }}</span>
        </div>
        <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-5">
          <button
            class="btn btn-primary mt-2 btn-long submit-order-btn"
            @click="createConsignment()"
            v-loading="buttonLoader"
          >
            {{ $t("inventory.submitOrder") }}
          </button>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import { ElNotification } from "element-plus";
import eventsMixin from "../../../../mixins/events_mixin";

export default {
  mixins: [eventsMixin],
  data() {
    return {
      amount: 0,
      currency: "KES",
      addPhoneStatus: false,
      location: "",
      place: {},
      instructions: "",
      phone: "",
      secPhone: "",
      buttonLoader: false,
    };
  },
  watch: {
    $route(from, to) {
      if (to.path.includes("checkout")) {
        this.setCheckoutDetails({
          location: this.location,
          place: this.place,
          instructions: this.instructions,
          phone: this.phone,
          secPhone: this.secPhone,
          addPhoneStatus: this.addPhoneStatus,
        });
      }
    },
  },
  computed: {
    ...mapGetters([
      "getSendyPhoneProps",
      "getSelectedProducts",
      "getStorageUserDetails",
      "getAchievements",
      "getCheckoutDetails",
      "getFulfillmentFees",
      "getMapOptions",
      "getUserDetails",
    ]),
    onboardingStatus() {
      if (Object.values(this.getAchievements).includes(false)) {
        return true;
      }
      return false;
    },
    checkoutPayload() {
      const products = [];
      this.getSelectedProducts.forEach((row) => {
        products.push({
          product_id: row.product_id,
          product_variant_id: row.selectedOption.product_variant_id,
          quantity: row.quantity,
          currency: row.selectedOption.product_variant_currency,
          unit_price: row.selectedOption.product_variant_unit_price,
        });
      });
      const payload = {
        card_id: "",
        products,
        destination: {
          name: this.getStorageUserDetails.business_name,
          phone_number: this.phone,
          secondary_phone_number: this.secPhone,
          delivery_location: {
            description: this.location,
            longitude: this.place.geometry.location.lng(),
            latitude: this.place.geometry.location.lat(),
          },
          house_location: "",
          delivery_instructions: this.instructions,
        },
      };
      return payload;
    },
  },
  mounted() {
    this.location = this.getCheckoutDetails.location;
    this.place = this.getCheckoutDetails.place;
    this.instructions = this.getCheckoutDetails.instructions;
    this.phone = this.getCheckoutDetails.phone
      ? this.getCheckoutDetails.phone
      : this.getUserDetails.phone_number;
    this.secPhone = this.getCheckoutDetails.secPhone;
    this.addPhoneStatus = this.getCheckoutDetails.addPhoneStatus;
  },
  methods: {
    ...mapMutations(["setProductStep", "setCheckoutDetails"]),
    ...mapActions(["requestAxiosPost"]),
    addProductStep(val) {
      this.setProductStep(val);
    },
    setLocation(val) {
      this.place = val;
      this.location = document.querySelector("#location").value;
    },
    createConsignment() {
      if (this.phone && this.location && this.getSelectedProducts.length) {
        this.buttonLoader = true;
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/consignments`,
          values: this.checkoutPayload,
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            ElNotification({
              title: this.$t("inventory.consignmentCreatedSuccessfully"),
              message: "",
              type: "success",
            });
            this.sendSegmentEvents({
              event: "Send Products to Sendy",
              data: {
                userId: this.getStorageUserDetails.business_id,
                SKU: this.getSelectedProducts,
                pickUpRegion: this.place,
                pickUpFee: `${this.getFulfillmentFees.currency} ${this.getFulfillmentFees.calculated_fee}`,
                clientType: "web",
                device: "desktop",
              },
            });
            this.resetInputs();
            if (this.onboardingStatus) {
              this.$router.push("/");
            } else {
              this.$router.push("/deliveries/sendy");
            }
          } else {
            ElNotification({
              title: this.$t("inventory.consignmentCreationFailed"),
              message: "",
              type: "error",
            });
          }
        });
      } else {
        ElNotification({
          title: this.$t("deliveries.insufficientInformation"),
          message: this.$t("deliveries.fillInAllFields"),
          type: "warning",
        });
      }
    },
    resetInputs() {
      this.location = "";
      this.place = "";
      this.instructions = "";
      this.phone = "";
      this.secPhone = "";
      this.addPhoneStatus = "";
    },
  },
};
</script>

<style>
.send-inventory-checkout-card {
  border-color: #e2e7ed;
  margin-left: 15%;
  background: white;
  padding: 0px 40px;
}
.add-phone-number-icon {
  font-size: 12px;
}
.add-phone-number,
.add-phone-number-icon {
  color: #324ba8;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.checkout-amount {
  float: right;
}
.submit-order-btn {
  height: 55px;
}
</style>
