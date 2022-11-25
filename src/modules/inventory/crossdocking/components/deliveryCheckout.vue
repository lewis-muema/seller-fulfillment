<template>
  <div>
    <v-card variant="outlined" class="send-inventory-checkout-card">
      <div class="enter-quantity-container desktop-header-title d-flex p-3">
        <i
          class="mdi mdi-arrow-left"
          aria-hidden="true"
          @click="this.$router.go(-1)"
        ></i>
        <v-card-title class="text-center send-products-title">
          {{ $t("inventory.checkout") }}
        </v-card-title>
      </div>
      <div class="payment-collection-title">
        {{ $t("deliveries.deliveryInfo") }}
      </div>
      <div>
        <div class="mb-4 row cross-docking-checkout-row">
          <div class="col-1">
            <i class="mdi mdi-shape cross-docking-checkout-icons"></i>
          </div>
          <div class="col-11 cross-docking-checkout-text">
            <span>{{ $t("inventory.selectProductsToSend") }}</span>
            <span class="cross-docking-checkout-chevrons"
              ><i class="mdi mdi-chevron-right"></i
            ></span>
          </div>
        </div>
        <div class="mb-4 row cross-docking-checkout-row">
          <div class="col-1">
            <i
              class="mdi mdi-map-marker-outline cross-docking-checkout-icons"
            ></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-text"
            @click="addDeliveryInfo()"
            v-if="Object.keys(getDeliveryInfo).length === 0"
          >
            <span>{{ $t("inventory.addDeliveryInfo") }}</span>
            <span class="cross-docking-checkout-chevrons"
              ><i class="mdi mdi-chevron-right"></i
            ></span>
          </div>
          <div
            class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
            v-else
          >
            <div class="delivery-details-text">
              <p>Delivery Info</p>
              <p>{{ getDeliveryInfo.location }}</p>
              <p>{{ getDeliveryInfo.apartmentName }}</p>
              <p>{{ getDeliveryInfo.instructions }}</p>
            </div>
            <span class="cross-docking-checkout-chevrons">
              <span class="cross-docking-checkout-chevrons-text">{{
                $t("inventory.change")
              }}</span>
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
        </div>
        <div class="mb-4 row cross-docking-checkout-row">
          <div class="col-1">
            <i class="mdi mdi-account-outline cross-docking-checkout-icons"></i>
          </div>
          <div class="col-11 cross-docking-checkout-text">
            <span>{{ $t("inventory.addRecipientInfo") }}</span>
            <span class="cross-docking-checkout-chevrons"
              ><i class="mdi mdi-chevron-right"></i
            ></span>
          </div>
        </div>
        <div
          class="mb-4 row cross-docking-checkout-row cross-docking-checkout-text-override"
        >
          <div class="col-1">
            <i class="mdi mdi-clock-outline cross-docking-checkout-icons"></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
          >
            <div>
              <p class="mb-2">{{ $t("inventory.deliveryTime") }}</p>
              <p>Wed, 25th July</p>
            </div>
            <span class="cross-docking-checkout-chevrons">
              <span class="cross-docking-checkout-chevrons-text">{{
                $t("inventory.change")
              }}</span>
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
        </div>
        <div
          class="mb-4 row cross-docking-checkout-row cross-docking-checkout-text-override"
        >
          <div class="col-1">
            <i class="mdi mdi-cog-outline cross-docking-checkout-icons"></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
          >
            <div>
              <p class="mb-2">{{ $t("inventory.preferences") }}</p>
              <p class="cross-docking-checkout-text-subtitle">
                {{ $t("inventory.setPreferencesForPayment") }}
              </p>
            </div>
            <span class="cross-docking-checkout-chevrons">
              <span
                class="cross-docking-checkout-chevrons-text"
                @click="preference = !preference"
                >{{ $t("inventory.view") }}</span
              >
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
        </div>
        <div v-if="preference">
          <div class="row">
            <div class="col-1"></div>
            <div class="mb-10 col-11" v-if="paymentOnDeliveryFlag">
              <p
                class="select-payment-collection-error"
                v-if="selectPaymentCollection"
              >
                <i class="mdi mdi-alert mr-3"></i>
                <span class="select-payment-collection-error-text">{{
                  $t("inventory.pleaseSelectTheOptionThatApplies")
                }}</span>
              </p>
              <p class="cross-docking-checkout-text-subtitle">
                {{ $t("inventory.doYouWantPaymentForThisDelivery") }}
              </p>
              <div>
                <div
                  class="payment-collection-select"
                  @click="
                    setOverlayStatus({
                      overlay: true,
                      popup: 'paymentCollection',
                    })
                  "
                >
                  <p
                    class="mr-auto payment-collection-select-text weight-override"
                    v-if="
                      getPaymentCollectionStatus.status === '' ||
                      (getPaymentCollectionStatus.status === true &&
                        getPaymentCollectionStatus.amountToBeCollected === '')
                    "
                  >
                    {{ $t("inventory.select") }}
                  </p>
                  <p
                    class="mr-auto payment-collection-select-text weight-override"
                    v-else-if="getPaymentCollectionStatus.status === false"
                  >
                    {{ $t("inventory.noDontCollectPayment") }}
                  </p>
                  <p
                    class="mr-auto payment-collection-select-text"
                    v-else-if="
                      getPaymentCollectionStatus.status === true &&
                      getPaymentCollectionStatus.amountToBeCollected === 'nofee'
                    "
                  >
                    <span class="weight-override">
                      {{
                        $t("inventory.collect", {
                          Amount: `${getFulfillmentFees.currency} ${getFulfillmentFees.total_product_value}`,
                        })
                      }}
                    </span>
                    <br />
                    <span>({{ $t("inventory.priceOfProducts") }})</span>
                  </p>
                  <p
                    class="mr-auto payment-collection-select-text"
                    v-else-if="
                      getPaymentCollectionStatus.status === true &&
                      getPaymentCollectionStatus.amountToBeCollected === 'fee'
                    "
                  >
                    <span class="weight-override">
                      {{
                        $t("inventory.collect", {
                          Amount: `${getFulfillmentFees.currency} ${
                            parseInt(getFulfillmentFees.total_product_value) +
                            parseInt(
                              getPaymentCollectionStatus.deliveryFee
                                ? getPaymentCollectionStatus.deliveryFee
                                : 0
                            )
                          }`,
                        })
                      }}
                    </span>
                    <br />
                    <span
                      >({{ $t("inventory.priceOfProducts&DeliveryFee") }})</span
                    >
                  </p>
                  <v-icon
                    class="payment-method-icon payment-collection-select-text"
                    >mdi-chevron-right</v-icon
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cross-docking-checkout-add-location">
          <i class="mdi mdi-plus cross-docking-checkout-add-location-plus"></i>
          {{ $t("inventory.addAnotherDeliveryLocation") }}
        </div>
      </div>
      <hr class="mt-3" />
      <div class="mt-3">
        <p class="payment-collection-label">
          {{ $t("inventory.paymentOfFulfillmentFees") }}
        </p>
        <p class="payment-collection-fees-text" v-if="cycleDate">
          {{
            $t("inventory.weWillChargeYourWallet", {
              Date: cycleDate,
            })
          }}
        </p>
      </div>
      <div v-if="paymentEnabled">
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
          <span class="ml-3">{{ formatPaymentMethod(method) }}</span>
          <span
            class="payment-default-right payment-default-trigger"
            @click="selectPaymentMethod"
          >
            <v-icon class="payment-method-icon">mdi-chevron-right</v-icon></span
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
            <v-icon class="payment-method-icon">mdi-chevron-right</v-icon></span
          >
        </div>
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
    </v-card>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import { ElNotification } from "element-plus";
import eventsMixin from "../../../../mixins/events_mixin";
import moment from "moment";

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
      selectPaymentCollection: false,
      preference: false,
      items: {
        location: "testt",
        apartmentName: "Floor 2",
        instructions: "Instructions",
      },
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
      "getPaymentCollectionStatus",
      "getActivePayment",
      "getBillingCycles",
      "getDeliveryInfo",
    ]),
    onboardingStatus() {
      if (Object.values(this.getAchievements).includes(false)) {
        return true;
      }
      return false;
    },
    paymentOnDeliveryFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.payments_on_delivery_enabled
        : false;
    },
    cycleDate() {
      const date =
        this.getBillingCycles.length && this.getBillingCycles[0].active > 0
          ? this.getBillingCycles[0].billing_cycle_end_date
          : "";
      return moment(date).format("dddd, Do MMM");
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
    paymentEnabled() {
      if (
        this.getBusinessDetails.settings &&
        this.getBusinessDetails.settings.payments_enabled
      ) {
        return true;
      }
      return false;
    },
    meansOfPayment() {
      let paymentMethod = "";
      switch (this.defaultPaymentMethod[0].pay_method_name) {
        case "M-PESA":
          paymentMethod = this.defaultPaymentMethod[0].pay_method_name
            .toUpperCase()
            .replace("-", "");
          break;
        case "Card":
          paymentMethod =
            this.defaultPaymentMethod[0].pay_method_name.toUpperCase();
          break;
        case "Virtual Accounts":
          paymentMethod = (
            this.defaultPaymentMethod[0].pay_method_name.substring(0, 7) +
            "_" +
            this.defaultPaymentMethod[0].pay_method_name.substring(
              8,
              this.defaultPaymentMethod[0].pay_method_name.length
            )
          ).toUpperCase();
          break;
        default:
          paymentMethod = "";
          break;
      }
      return paymentMethod;
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
        means_of_payment: {
          means_of_payment_type: this.getBusinessDetails.settings
            .payments_enabled
            ? this.meansOfPayment
            : "CARD",
          means_of_payment_identifier: this.getBusinessDetails.settings
            .payments_enabled
            ? this.defaultPaymentMethod[0].pay_method_details
            : "",
          participant_type: "SELLER",
          participant_id: this.getBusinessDetails.settings.payments_enabled
            ? this.defaultPaymentMethod[0].user_id
            : "",
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
      if (
        this.getPaymentCollectionStatus.status &&
        this.getPaymentCollectionStatus.amountToBeCollected &&
        this.paymentOnDeliveryFlag
      ) {
        payload.sale_of_goods_policy = {
          costs_to_collect: [
            {
              cost_type: "SALE_OF_GOOD",
            },
          ],
        };
        if (this.getPaymentCollectionStatus.amountToBeCollected === "fee") {
          payload.sale_of_goods_policy.costs_to_collect.push({
            cost_type: "DELIVERY_FEE",
            cost_amount: this.getPaymentCollectionStatus.deliveryFee
              ? this.getPaymentCollectionStatus.deliveryFee
              : 0,
            currency: this.getFulfillmentFees.currency,
          });
        }
      }
      return payload;
    },
  },
  beforeMount() {
    if (localStorage.country) {
      const props = this.getSendyPhoneProps;
      props.defaultCountry = localStorage.country.toLowerCase();
      this.setSendyPhoneProps(props);
    }
  },
  mounted() {
    this.getDefaultPaymentMethod();
    this.activeBillingCycle();
    this.setPaymentCollectionStatus({
      status: "",
      amountToBeCollected: "",
      deliveryFee: "",
    });
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
      "setSendyPhoneProps",
      "setSelectedProducts",
      "setOverlayStatus",
      "setPaymentCollectionStatus",
      "setActivePayment",
      "setBillingCycles",
    ]),
    ...mapActions(["requestAxiosPost", "requestAxiosGet"]),
    addProductStep(val) {
      this.setProductStep(val);
    },
    addDeliveryInfo() {
      this.setOverlayStatus({
        overlay: true,
        popup: "deliveryInfoCrossdock",
      });
    },
    setLocation(val) {
      this.place = val;
      this.location = document.querySelector("#location").value;
    },
    formatPaymentMethod(method) {
      if (method.pay_method_id === 20) {
        return "Pay by Bank";
      }
      return method.pay_method_details
        ? method.pay_method_details
        : method.pay_method_name;
    },
    getDefaultPaymentMethod() {
      this.requestAxiosPost({
        app: process.env.AUTH,
        endpoint: "payment-gateway/payment_methods",
        values: {
          country_code: this.getBusinessDetails.country_code,
          entity_id: "6",
          user_id: this.getBusinessDetails.business_id,
          pay_direction: "PAY_IN",
        },
      }).then((response) => {
        if (response.data) {
          this.setPaymentMethods(response.data.saved_payment_methods);
        }
      });
    },
    activeBillingCycle() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles`,
      }).then((response) => {
        if (response.status === 200) {
          this.setBillingCycles(response.data.data.billing_cycles);
        }
      });
    },
    createDelivery() {
      if (
        this.name &&
        this.phone &&
        this.location &&
        this.getSelectedProducts.length &&
        (this.paymentOnDeliveryFlag
          ? (this.getPaymentCollectionStatus.status === true &&
              this.getPaymentCollectionStatus.amountToBeCollected !== "") ||
            this.getPaymentCollectionStatus.status === false
          : true) &&
        (this.defaultPaymentMethod.length > 0 ||
          !this.getBusinessDetails.settings.payments_enabled)
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
            this.setSelectedProducts([]);
            this.sendSegmentEvents({
              event: "Request_Delivery_to_Buyer",
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
              this.$router.push(
                `/deliveries/tracking/${response.data.data.order_id}`
              );
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
        if (
          this.name &&
          this.phone &&
          this.location &&
          this.getSelectedProducts.length &&
          (this.getPaymentCollectionStatus.status === "" ||
            this.getPaymentCollectionStatus.amountToBeCollected === "") &&
          (this.defaultPaymentMethod.length > 0 ||
            !this.getBusinessDetails.settings.payments_enabled)
        ) {
          this.selectPaymentCollection = true;
          setTimeout(() => {
            this.selectPaymentCollection = false;
          }, 3000);
        } else {
          ElNotification({
            title: this.$t("deliveries.insufficientInformation"),
            message: this.$t("deliveries.pleaseFillInAllFieldsDefaultPayment"),
            type: "warning",
          });
        }
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
      this.setPaymentCollectionStatus({
        status: "",
        amountToBeCollected: "",
        deliveryFee: "",
      });
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
  color: #324ba8;
  font-weight: 600;
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
.payment-collection-label {
  font-size: 15px;
  font-weight: 500;
}
.payment-collection-title {
  color: #606266;
  margin-bottom: 10px;
  font-size: 20px;
}
.payment-collection-select {
  display: flex;
  width: 100%;
  cursor: pointer;
  border-bottom: 1px solid #dcdfe6;
  padding-top: 15px;
}
.payment-collection-select-text {
  color: #606266;
  font-size: 14px;
}
.weight-override {
  font-weight: 500;
}
.payment-collection-fees-text {
  font-size: 15px;
}
.select-payment-collection-error-text {
  font-size: 14px;
}
.select-payment-collection-error {
  color: #b72f25;
  display: flex;
  align-items: center;
  font-weight: 500;
}
.cross-docking-checkout-icons {
  font-size: 25px;
  color: #909399;
}
.cross-docking-checkout-row {
  display: flex;
  align-items: center;
}
.cross-docking-checkout-chevrons {
  font-size: 20px;
  margin-left: auto;
  display: flex;
  align-items: center;
}
.cross-docking-checkout-text {
  cursor: pointer;
  color: #324ba8;
  font-size: 17px;
  font-weight: 500;
  border-bottom: 1px solid #dcdfe6;
  height: 60px;
  display: flex;
  align-items: center;
}
.cross-docking-checkout-text-grey {
  cursor: pointer;
  color: #606266;
  font-size: 17px;
  font-weight: 500;
  border-bottom: 1px solid #dcdfe6;
  height: 60px;
  display: flex;
  align-items: center;
}
.cross-docking-checkout-chevrons-text {
  font-size: 14px;
}
.cross-docking-checkout-text-override {
  height: max-content !important;
  align-items: flex-start !important;
}
.delivery-details-text > p {
  line-height: 10px !important;
  font-weight: 400 !important;
}
.cross-docking-checkout-text-subtitle {
  font-size: 15px;
  font-weight: 100;
}
.cross-docking-checkout-add-location {
  background: #f7f9fc;
  padding: 20px 25px;
  cursor: pointer;
}
.cross-docking-checkout-add-location-plus {
  color: #909399;
  font-size: 20px;
  margin-right: 20px;
}
</style>
