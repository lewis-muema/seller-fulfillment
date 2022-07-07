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
        <v-card-title class="text-center send-products-title">
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
            class="form-control checkout-input"
            v-model="name"
            :placeholder="$t('inventory.enterNameOfCustomer')"
          />
        </div>
        <div class="">
          <label for="location" class="form-label">
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
        </div>
        <div class="mb-2 checkout-phone">
          <label for="phoneNumber" class="form-label">
            {{ $t("inventory.phoneNo") }}
          </label>
          <vue-tel-input
            v-model="phone"
            class="checkout-input"
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
            class="checkout-input"
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
        </div>
        <div v-if="getBusinessDetails.country_code !== 'CI'">
          <div
            class="payment-method-default"
            v-for="(method, i) in defaultPaymentMethod"
            :key="i"
          >
            <img
              class="mr-2"
              :src="`https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons/${method.pay_method_name.toLowerCase()}.svg`"
              alt=""
            />
            <span>{{
              method.pay_method_details
                ? method.pay_method_details
                : method.pay_method_name
            }}</span>
            <span
              class="payment-default-right payment-default-trigger"
              @click="selectPaymentMethod"
              >{{ $t("inventory.change") }}
              <v-icon class="payment-method-icon"
                >mdi-chevron-right</v-icon
              ></span
            >
          </div>
          <div
            class="payment-method-default"
            v-if="defaultPaymentMethod.length === 0"
          >
            <span class="payment-default-left">{{
              $t("payments.noDefaultPaymentMethodSelected")
            }}</span>
            <span
              class="payment-default-right payment-default-trigger"
              @click="selectPaymentMethod"
              >{{ $t("inventory.change") }}
              <v-icon class="payment-method-icon"
                >mdi-chevron-right</v-icon
              ></span
            >
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
            class="btn btn-primary mt-2 btn-long submit-order-btn"
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
import { mapMutations, mapGetters, mapActions } from "vuex";
import { ElNotification } from "element-plus";
import eventsMixin from "../../../../mixins/events_mixin";

export default {
  mixins: [eventsMixin],
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
  watch: {
    $route(from, to) {
      if (to.path.includes("checkout")) {
        this.setCheckoutDetails({
          name: this.name,
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
      "getFulfillmentFees",
      "getSelectedProducts",
      "getBusinessDetails",
      "getUserDetails",
      "getPaymnetMethods",
      "getStorageUserDetails",
      "getAchievements",
      "getCheckoutDetails",
      "getMapOptions",
    ]),
    onboardingStatus() {
      if (Object.values(this.getAchievements).includes(false)) {
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
      const excludeCI = this.getBusinessDetails.country_code !== "CI";
      const payload = {
        means_of_payment: {
          means_of_payment_type: excludeCI
            ? this.defaultPaymentMethod[0].pay_method_name.replace("-", "")
            : "CARD",
          means_of_payment_id: excludeCI
            ? this.defaultPaymentMethod[0].pay_method_details
            : "",
          participant_type: "SELLER",
          participant_id: excludeCI ? this.defaultPaymentMethod[0].user_id : "",
        },
        products,
        destination: {
          name: this.name,
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
        promotion_session_id: this.getFulfillmentFees.promotion_session_id
          ? this.getFulfillmentFees.promotion_session_id
          : null,
      };
      return payload;
    },
  },
  mounted() {
    this.getDefaultPaymentMethod();
    this.name = this.getCheckoutDetails.name;
    this.location = this.getCheckoutDetails.location;
    this.place = this.getCheckoutDetails.place;
    this.instructions = this.getCheckoutDetails.instructions;
    this.phone = this.getCheckoutDetails.phone;
    this.secPhone = this.getCheckoutDetails.secPhone;
    this.addPhoneStatus = this.getCheckoutDetails.addPhoneStatus;
  },
  methods: {
    ...mapMutations([
      "setProductStep",
      "setPaymentMethods",
      "setCheckoutDetails",
    ]),
    ...mapActions(["requestAxiosPost"]),
    addProductStep(val) {
      this.setProductStep(val);
    },
    setLocation(val) {
      this.place = val;
      this.location = document.querySelector("#location").value;
    },
    getDefaultPaymentMethod() {
      this.requestAxiosPost({
        app: process.env.AUTH,
        endpoint: "payment-gateway/payment_methods",
        values: {
          country_code: this.getBusinessDetails.country_code,
          entity_id: "6",
          user_id: this.getBusinessDetails.business_id,
        },
      }).then((response) => {
        this.setPaymentMethods(response.data.saved_payment_methods);
      });
    },
    createDelivery() {
      if (
        this.name &&
        this.phone &&
        this.location &&
        this.getSelectedProducts.length &&
        (this.defaultPaymentMethod.length > 0 ||
          this.getBusinessDetails.country_code === "CI")
      ) {
        this.buttonLoader = true;
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/deliveries`,
          values: this.checkoutPayload,
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            ElNotification({
              title: this.$t("inventory.deliveryCreatedSuccessfully"),
              message: "",
              type: "success",
            });
            this.sendSegmentEvents({
              event: "Request Delivery to Buyer",
              data: {
                userId: this.getStorageUserDetails.business_id,
                SKU: this.getSelectedProducts,
                deliveryLocation: this.location,
                deliveryRegion: this.place,
                deliveryFee: `${this.getFulfillmentFees.currency} ${this.getFulfillmentFees.calculated_fee}`,
                clientType: "web",
                device: "desktop",
              },
            });
            this.resetInput();
            if (this.onboardingStatus) {
              this.$router.push("/");
            } else {
              this.$router.push("/deliveries/customer");
            }
          } else {
            ElNotification({
              title: this.$t("inventory.deliveryCreationFailed"),
              message: "",
              type: "error",
            });
          }
        });
      } else {
        ElNotification({
          title: this.$t("deliveries.insufficientInformation"),
          message: this.$t("deliveries.pleaseFillInAllFieldsDefaultPayment"),
          type: "warning",
        });
      }
    },
    resetInput() {
      this.name = "";
      this.location = "";
      this.place = "";
      this.instructions = "";
      this.phone = "";
      this.secPhone = "";
      this.addPhoneStatus = "";
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
.payment-method,
.payment-method-icon {
  color: #303133;
}
.payment-method-icon {
  float: right;
}
.payment-method-default {
  height: 60px;
  border-radius: 5px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  color: #303133;
}
.payment-default-right {
  margin-left: auto;
  font-size: 14px;
}
.payment-default-left {
  font-size: 14px;
}
.payment-default-trigger {
  cursor: pointer;
}
.checkout-phone {
  margin-top: -10px;
}
.checkout-input {
  height: 50px;
}
</style>
