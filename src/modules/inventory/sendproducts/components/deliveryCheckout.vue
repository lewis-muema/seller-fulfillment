<template>
  <div>
    <v-card variant="outlined" class="send-inventory-checkout-card">
      <div class="enter-quantity-container desktop-header-title d-flex p-3">
        <i
          class="mdi mdi-arrow-left"
          aria-hidden="true"
          @click="
            $router.push('/inventory/send-inventory/customer/add-quantity')
          "
        ></i>
        <v-card-title class="text-center">
          {{ $t("inventory.checkout") }}
        </v-card-title>
      </div>
      <div>
        <div class="mb-4">
          <label for="yourName" class="form-label">
            {{ $t("inventory.nameOfCustomer") }}
          </label>
          <input
            type="text"
            class="form-control"
            v-model="name"
            :placeholder="$t('inventory.enterNameOfCustomer')"
          />
        </div>
        <div class="mb-4">
          <label for="location" class="form-label">
            {{ $t("inventory.locationOfCustomer") }}
          </label>
          <GMapAutocomplete
            id="location"
            class="businessProfile-address"
            :value="location"
            :placeholder="$t('settings.searchLocation')"
            @place_changed="setLocation"
          >
          </GMapAutocomplete>
        </div>
        <div class="mb-2">
          <label for="phoneNumber" class="form-label">
            {{ $t("inventory.phoneNo") }}
          </label>
          <vue-tel-input
            v-model="phone"
            id="phoneNumber"
            v-bind="getSendyPhoneProps"
          ></vue-tel-input>
        </div>
        <div class="mb-2" v-if="addPhoneStatus">
          <label for="phoneNumber" class="form-label">
            {{ $t("inventory.phoneNo") }}
          </label>
          <vue-tel-input
            v-model="secPhone"
            id="phoneNumber"
            v-bind="getSendyPhoneProps"
          ></vue-tel-input>
        </div>
        <div
          class="add-phone-number mb-4"
          v-if="!addPhoneStatus"
          @click="addPhoneStatus = !addPhoneStatus"
        >
          <v-icon class="add-phone-number-icon">mdi mdi-plus</v-icon>
          {{ $t("inventory.addAnotherPhoneNo") }}
        </div>
        <div
          class="add-phone-number mb-4"
          v-if="addPhoneStatus"
          @click="addPhoneStatus = !addPhoneStatus"
        >
          <v-icon class="add-phone-number-icon">mdi mdi-minus</v-icon>
          {{ $t("deliveries.removePhoneNumber") }}
        </div>
        <div class="mb-10">
          <label for="price" class="form-label">
            {{ $t("inventory.deliveryInstructions") }}
          </label>
          <div>
            <textarea
              class="form-control"
              id=""
              v-model="instructions"
              rows="3"
              :placeholder="$t('inventory.enterDeliveryInstructions')"
            ></textarea>
          </div>
        </div>
        <hr class="mt-3" />
        <div class="mt-3">
          <p>{{ $t("inventory.payment") }}</p>
          <div @click="selectPaymentMethod">
            <span class="payment-method">
              <v-icon class="pr-3"> mdi-credit-card-outline </v-icon>
              {{ $t("inventory.paymentMethod") }}
            </span>
            <span>
              <v-icon class="payment-method-icon">mdi-chevron-right</v-icon>
            </span>
          </div>
        </div>
        <div class="mt-3">
          <span>{{ $t("inventory.amountToPay") }}</span>
          <span class="checkout-amount"
            >{{ getFulfillmentFees.currency }}
            {{ getFulfillmentFees.calculated_fee }}</span
          >
        </div>
        <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-3">
          <button
            class="btn btn-primary mt-2 btn-long"
            @click="createDelivery()"
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
import { mapMutations, mapGetters } from "vuex";
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      amount: 566,
      currency: "KES",
      addPhoneStatus: false,
      name: "",
      location: "",
      place: {},
      instructions: "",
      phone: "",
      secPhone: "",
      buttonLoader: false,
    };
  },
  computed: {
    ...mapGetters([
      "getSendyPhoneProps",
      "getFulfillmentFees",
      "getSelectedProducts",
    ]),
    checkoutPayload() {
      const userDetails = JSON.parse(localStorage.userDetails).data;
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
        means_of_payment: {
          means_of_payment_type: "MPESA",
          means_of_payment_id: "",
          participant_type: "SELLER",
          participant_id: userDetails.business_id,
        },
        products,
        destination: {
          name,
          phone_number: this.phone,
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
  methods: {
    ...mapMutations(["setProductStep"]),
    ...mapGetters(["getUserData"]),
    addProductStep(val) {
      this.setProductStep(val);
    },
    setLocation(val) {
      this.place = val;
      this.location = document.querySelector("#location").value;
    },
    createDelivery() {
      if (
        this.name &&
        this.phone &&
        this.location &&
        this.getSelectedProducts.length
      ) {
        const userDetails = JSON.parse(localStorage.userDetails).data;
        this.buttonLoader = true;
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${userDetails.business_id}/consignments`,
          values: this.checkoutPayload,
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            ElNotification({
              title: this.$t("inventory.consignmentCreatedSuccessfully"),
              message: "",
              type: "success",
            });
            this.$router.push("/deliveries/sendy");
          } else {
            ElNotification({
              title: this.$t("inventory.consignmentCreationFailed"),
              message: "",
              type: "success",
            });
          }
        });
      } else {
        ElNotification({
          title: this.$t("deliveries.insufficientInformation"),
          message: this.$t("deliveries.pleaseFillInAllFields"),
          type: "warning",
        });
      }
    },
    selectPaymentMethod() {
      const buPayload = {
        user_id: 1,
        entity_id: 6,
        currency: "KES",
        country_code: "KE",
        amount: "100",
        success_callback_url: "",
        fail_callback_url: "",
        txref: this.txref,
        bulk: false,
        paybill_no: "4444444",
        email: "johndoe@gmail.com",
        authToken: "",
        firstname: "John",
        lastname: "doe",
        payment_options: "",
        company_code: "FFKE",
        locale: "en",
      };

      this.$paymentInit(buPayload, "choose-payment");
    },
  },
};
</script>

<style>
.payment-method,
.payment-method-icon {
  color: #324ba8;
}
.payment-method-icon {
  float: right;
}
</style>
