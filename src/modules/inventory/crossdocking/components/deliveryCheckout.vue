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
      <div v-for="index in indeces" :key="index">
        <div class="mb-4 row cross-docking-checkout-row">
          <div class="col-1">
            <i class="mdi mdi-shape cross-docking-checkout-icons"></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-product-underline"
            @click="addProducts(index - 1)"
          >
            <div
              class="cross-docking-checkout-text-grey-no-underline cross-docking-checkout-products-label"
              v-if="
                getDestinations[index - 1] &&
                getDestinations[index - 1].products
              "
            >
              <div class="cross-docking-checkout-products-label-upper">
                <span>{{ $t("deliveries.products") }}</span>
                <span class="cross-docking-checkout-chevrons"
                  ><span class="cross-docking-checkout-chevrons-text">{{
                    $t("inventory.change")
                  }}</span
                  ><i class="mdi mdi-chevron-right"></i
                ></span>
              </div>
              <div class="mb-3 cross-docking-checkout-product-label-lower">
                {{
                  getDestinations[index - 1].products.length > 1
                    ? $t("inventory.otherProducts", {
                        Name: getDestinations[index - 1].products[0]
                          .product_name,
                        Count: getDestinations[index - 1].products.length - 1,
                      })
                    : getDestinations[index - 1].products[0].product_name
                }}
              </div>
            </div>
            <div class="cross-docking-checkout-text-no-underline" v-else>
              <span>{{ $t("inventory.selectProductsToSend") }}</span>
              <span class="cross-docking-checkout-chevrons"
                ><i class="mdi mdi-chevron-right"></i
              ></span>
            </div>
          </div>
        </div>
        <div
          v-if="
            showErrors &&
            !(getDestinations[index - 1] && getDestinations[index - 1].products)
          "
          class="row error-msg withdraw-transaction-error mb-3 field-required-error"
        >
          <div class="col-1"></div>
          <div class="col-11">{{ $t("inventory.thisFieldIsRequired") }}</div>
        </div>
        <div
          :class="
            !(
              getDestinations[index - 1] &&
              getDestinations[index - 1].delivery_info
            )
              ? 'mb-4 row cross-docking-checkout-row'
              : 'mb-4 row cross-docking-checkout-roww'
          "
        >
          <div class="col-1">
            <i
              class="mdi mdi-map-marker-outline cross-docking-checkout-icons"
            ></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-text"
            @click="addDeliveryInfo(index)"
            v-if="
              !(
                getDestinations[index - 1] &&
                getDestinations[index - 1].delivery_info
              )
            "
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
            <div>
              <p>{{ $t("deliveries.deliveryInfo") }}</p>
              <div class="delivery-details-text">
                <p>{{ getDestinations[index - 1].delivery_info.location }}</p>
                <p>
                  {{ getDestinations[index - 1].delivery_info.apartmentName }}
                </p>
                <p>
                  {{ getDestinations[index - 1].delivery_info.instructions }}
                </p>
              </div>
            </div>
            <span
              class="cross-docking-checkout-chevrons"
              @click="addDeliveryInfo(index)"
            >
              <span class="cross-docking-checkout-chevrons-text">{{
                $t("inventory.change")
              }}</span>
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
        </div>
        <div
          v-if="
            showErrors &&
            !(
              getDestinations[index - 1] &&
              getDestinations[index - 1].delivery_info
            )
          "
          class="row error-msg withdraw-transaction-error mb-3 field-required-error"
        >
          <div class="col-1"></div>
          <div class="col-11">{{ $t("inventory.thisFieldIsRequired") }}</div>
        </div>
        <div
          :class="
            !(
              getDestinations[index - 1] && getDestinations[index - 1].recipient
            )
              ? 'mb-4 row cross-docking-checkout-row'
              : 'mb-4 row cross-docking-checkout-roww'
          "
        >
          <div class="col-1">
            <i class="mdi mdi-account-outline cross-docking-checkout-icons"></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-text"
            @click="addRecepientInfo(index)"
            v-if="
              !(
                getDestinations[index - 1] &&
                getDestinations[index - 1].recipient
              )
            "
          >
            <span>{{ $t("inventory.addRecipientInfo") }}</span>
            <span class="cross-docking-checkout-chevrons"
              ><i class="mdi mdi-chevron-right"></i
            ></span>
          </div>
          <div
            class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
            v-else
          >
            <div>
              <p>{{ $t("inventory.recipientInfo") }}</p>
              <div class="delivery-details-text">
                <p>{{ getDestinations[index - 1].recipient.customer_name }}</p>
                <p>{{ getDestinations[index - 1].recipient.phone }}</p>
              </div>
            </div>
            <span
              class="cross-docking-checkout-chevrons"
              @click="addRecepientInfo(index)"
            >
              <span class="cross-docking-checkout-chevrons-text">{{
                $t("inventory.change")
              }}</span>
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
        </div>
        <div
          v-if="
            showErrors &&
            !(
              getDestinations[index - 1] && getDestinations[index - 1].recipient
            )
          "
          class="row error-msg withdraw-transaction-error mb-3 field-required-error"
        >
          <div class="col-1"></div>
          <div class="col-11">{{ $t("inventory.thisFieldIsRequired") }}</div>
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
              <p>{{ $t("inventory.nextDay") }}</p>
            </div>
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
                @click="preferences[index - 1] = !preferences[index - 1]"
                >{{ $t("inventory.view") }}</span
              >
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
        </div>
        <div v-if="preferences[index - 1]">
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
                  @click="addPaymentCollection(index)"
                >
                  <p
                    class="mr-auto payment-collection-select-text weight-override crossdocking-text-blue"
                    v-if="
                      (getDestinations[index - 1] &&
                        getDestinations[index - 1].POD &&
                        getDestinations[index - 1].POD.amountToBeCollected ===
                          '') ||
                      !getDestinations[index - 1].POD
                    "
                  >
                    {{ $t("inventory.select") }}
                  </p>
                  <p
                    class="mr-auto payment-collection-select-text weight-override"
                    v-else-if="
                      getDestinations[index - 1] &&
                      getDestinations[index - 1].POD &&
                      getDestinations[index - 1].POD.amountToBeCollected ===
                        'none'
                    "
                  >
                    {{ $t("inventory.noDontCollectPayment") }}
                  </p>
                  <p
                    class="mr-auto payment-collection-select-text"
                    v-else-if="
                      getDestinations[index - 1] &&
                      getDestinations[index - 1].POD &&
                      getDestinations[index - 1].POD.amountToBeCollected ===
                        'nofee'
                    "
                  >
                    <span class="weight-override">
                      {{
                        $t("inventory.collect", {
                          Amount: `${
                            getFulfillmentFees.pricing.pricing_deliveries[
                              index - 1
                            ].currency
                          } ${
                            getFulfillmentFees.pricing.pricing_deliveries[
                              index - 1
                            ].total_product_value
                          }`,
                        })
                      }}
                    </span>
                    <br />
                    <span>{{ $t("inventory.priceOfProducts") }}</span>
                  </p>
                  <p
                    class="mr-auto payment-collection-select-text"
                    v-else-if="
                      getDestinations[index - 1] &&
                      getDestinations[index - 1].POD &&
                      getDestinations[index - 1].POD.amountToBeCollected ===
                        'fee'
                    "
                  >
                    <span class="weight-override">
                      {{
                        $t("inventory.collect", {
                          Amount: `${
                            getFulfillmentFees.pricing.pricing_deliveries[
                              index - 1
                            ].currency
                          } ${
                            parseInt(
                              getFulfillmentFees.pricing.pricing_deliveries[
                                index - 1
                              ].total_product_value
                            ) +
                            parseInt(
                              getDestinations[index - 1].POD.deliveryFee
                                ? getDestinations[index - 1].POD.deliveryFee
                                : 0
                            )
                          }`,
                        })
                      }}
                    </span>
                    <br />
                    <span>{{
                      $t("inventory.priceOfProducts&DeliveryFee")
                    }}</span>
                  </p>
                  <v-icon
                    class="payment-method-icon payment-collection-select-text"
                    >mdi-chevron-right</v-icon
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-1"></div>
            <div class="mb-10 col-11">
              <p class="cross-docking-checkout-text-subtitle">
                {{
                  $t("inventory.doYouHaveDocumentsThatAccompanyYourDelivery")
                }}
              </p>
              <div>
                <div
                  v-if="
                    getDestinations[index - 1] &&
                    getDestinations[index - 1].documents
                  "
                >
                  <div
                    v-for="(docs, x) in getDestinations[index - 1].documents"
                    :key="x"
                    class="crossdocking-documents-list"
                  >
                    <div class="crossdocking-documents-list-inner">
                      <i class="mdi mdi-text-box-outline"></i>
                      <span class="ml-3">{{
                        docs.title ? docs.title : docs.type
                      }}</span>
                      <v-menu v-model="menus[x]">
                        <template v-slot:activator="{ props }">
                          <i
                            class="mdi mdi-dots-vertical payment-method-icon"
                            v-bind="props"
                          ></i>
                        </template>
                        <v-list>
                          <v-list-item v-for="(option, i) in options" :key="i">
                            <v-list-item-title
                              @click="execute(option.action, index, x)"
                              >{{ option.title }}</v-list-item-title
                            >
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                </div>
                <div
                  class="payment-collection-select"
                  @click="addDeliveryDocuments(index)"
                >
                  <p
                    class="mr-auto payment-collection-select-text weight-override crossdocking-text-blue"
                  >
                    {{ $t("inventory.addDocument") }}
                  </p>
                  <v-icon
                    class="payment-method-icon payment-collection-select-text"
                    >mdi-chevron-right</v-icon
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-1"></div>
            <div class="mb-10 col-11 cross-docking-checkout-product-underline">
              <p class="cross-docking-checkout-text-subtitle">
                {{ $t("inventory.doYouHaveAReferenceNumber") }}
              </p>
              <div>
                <v-text-field
                  :label="$t('inventory.enterReferenceNumber')"
                  variant="outlined"
                  v-model="referenceNumbers[index - 1]"
                  @input="addReferenceNumber(index - 1, $event)"
                  clearable
                  clear-icon="mdi-close"
                  density="compact"
                ></v-text-field>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="cross-docking-checkout-add-location"
        @click="addLocation()"
        v-if="multidestination"
      >
        <i class="mdi mdi-plus cross-docking-checkout-add-location-plus"></i>
        {{ $t("inventory.addAnotherDeliveryLocation") }}
      </div>
      <div class="mt-5 mb-5" v-if="pickUpRequired">
        <p class="payment-collection-title mb-3">
          {{ $t("inventory.pickUpInfo") }}
        </p>
        <div class="row">
          <div class="col-1">
            <i class="mdi mdi-store-outline cross-docking-checkout-icons"></i>
          </div>
          <div class="col-11">
            <div>
              <span class="cross-docking-pickup-title">
                {{ $t("inventory.howDoYouWantTheUnavailableItemsToBePicked") }}
              </span>
            </div>
            <div
              class="cross-docking-checkout-text-grey"
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'pickItems',
                })
              "
            >
              <span>{{
                getPickUpOptions.type
                  ? $t(getPickUpOptions.text)
                  : $t("inventory.select")
              }}</span>
              <span class="cross-docking-checkout-chevrons"
                ><i class="mdi mdi-chevron-right"></i
              ></span>
            </div>
          </div>
        </div>
        <div class="row mt-4" v-if="getPickUpOptions.type === 'driver'">
          <div class="col-1">
            <i class="mdi mdi-account-outline cross-docking-checkout-icons"></i>
          </div>
          <div class="col-11">
            <div
              class="cross-docking-checkout-text pb-3"
              v-if="Object.keys(getPickUpInfoCD).length === 0"
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'pickUpInfoCrossDock',
                })
              "
            >
              <span>{{ $t("inventory.addPickUpInfo") }}</span>
              <span class="cross-docking-checkout-chevrons"
                ><i class="mdi mdi-chevron-right"></i
              ></span>
            </div>
            <div
              class="cross-docking-checkout-text-grey cross-docking-checkout-text-override"
              v-else
            >
              <div>
                <p>{{ $t("inventory.pickUpInfo") }}</p>
                <div class="delivery-details-text">
                  <p>{{ getPickUpInfoCD.location }}</p>
                  <p>{{ getPickUpInfoCD.phone }}</p>
                  <p>{{ getPickUpInfoCD.instructions }}</p>
                </div>
              </div>
              <span
                class="cross-docking-checkout-chevrons"
                @click="
                  setOverlayStatus({
                    overlay: true,
                    popup: 'pickUpInfoCrossDock',
                  })
                "
              >
                <span class="cross-docking-checkout-chevrons-text">{{
                  $t("inventory.change")
                }}</span>
                <i class="mdi mdi-chevron-right"></i>
              </span>
            </div>
          </div>
        </div>
        <div
          class="mb-4 mt-4 row cross-docking-checkout-row cross-docking-checkout-text-override"
          v-if="getPickUpOptions.type === 'driver'"
        >
          <div class="col-1">
            <i class="mdi mdi-clock-outline cross-docking-checkout-icons"></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
          >
            <div>
              <p class="mb-2">{{ $t("inventory.pickUpDate") }}</p>
              <p>{{ $t("inventory.nextDay") }}</p>
            </div>
          </div>
        </div>
        <div
          class="mb-4 mt-4 row cross-docking-checkout-row cross-docking-checkout-text-override"
          v-if="getPickUpOptions.type === 'self'"
        >
          <div class="col-1">
            <i class="mdi mdi-warehouse cross-docking-checkout-icons"></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
          >
            <div>
              <p class="mb-2">
                {{ $t("inventory.selectTheSendyPickUpStationToTakeTheItems") }}
              </p>
              <p>
                {{
                  getPickUpStation.name
                    ? getPickUpStation.name
                    : $t("inventory.select")
                }}
              </p>
            </div>
            <span
              class="cross-docking-checkout-chevrons"
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'stations',
                })
              "
            >
              <span class="cross-docking-checkout-chevrons-text">{{
                $t("inventory.change")
              }}</span>
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
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
          :disabled="buttonLoader"
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
import placeholder from "../../../../mixins/placeholders";

import moment from "moment";

export default {
  mixins: [eventsMixin, placeholder],
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
      preferences: [false],
      menus: [],
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
      referenceNumbers: [],
      showErrors: false,
      multidestination: false,
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
    "$store.state.destinations": {
      handler() {
        this.getPricing();
      },
      deep: true,
    },
    "$store.state.pickUpInfoCD": {
      handler() {
        this.getPricing();
      },
      deep: true,
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
      "getDestinations",
      "getDestinationIndex",
      "getDeliveryInfo",
      "getRecepientInfo",
      "getPickUpOptions",
      "getPickUpInfoCD",
      "getPickUpStation",
    ]),
    indeces() {
      return this.getDestinations.length;
    },
    pickUpRequired() {
      let status = false;
      this.getDestinations.forEach((row) => {
        if (row.products) {
          row.products.forEach((product) => {
            if (product.selectedOption) {
              status =
                product.selectedOption.quantity >
                product.selectedOption.product_variant_stock_levels.available;
            } else {
              status =
                product.quantity >
                product.product_variants[0].product_variant_stock_levels
                  .available;
            }
          });
        }
      });
      return status;
    },
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
      const payload = {
        means_of_payment: this.defaultPaymentMethod[0]
          ? this.meansOfPaymentPayload
          : {},
        pickups: Object.keys(this.getPickUpInfoCD).length
          ? this.pickUpPayload
          : [],
        deliveries: this.deliveriesPayload,
      };
      return payload;
    },
    meansOfPaymentPayload() {
      return {
        means_of_payment_type: this.getBusinessDetails.settings.payments_enabled
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
      };
    },
    pickUpPayload() {
      return [
        {
          seller_order_reference_id: "",
          promotion_session_id: "",
          destination: {
            name: this.getBusinessDetails.business_name,
            phone_number: this.getPickUpInfoCD.phone,
            secondary_phone_number: this.getPickUpInfoCD.secondary_phone_number,
            delivery_location: {
              description: this.getPickUpInfoCD.location,
              longitude: this.getPickUpInfoCD.place.geometry.location.lng(),
              latitude: this.getPickUpInfoCD.place.geometry.location.lat(),
            },
            house_location: "",
            delivery_instructions: this.getPickUpInfoCD.instructions,
          },
          destination_policy: "DROP_AT_HUB",
        },
      ];
    },
    deliveriesPayload() {
      const deliveries = [];
      this.getDestinations.forEach((destination) => {
        const products = [];
        const documents = [];
        const destinationProducts = destination.products
          ? destination.products
          : [];
        destinationProducts.forEach((row) => {
          products.push({
            product_id: row.product_id,
            product_variant_id: row.selectedOption
              ? row.selectedOption.product_variant_id
              : row.product_variants[0].product_variant_id,
            quantity: row.quantity,
            currency: row.selectedOption
              ? row.selectedOption.product_variant_currency
              : row.product_variants[0].product_variant_currency,
            unit_price: row.selectedOption
              ? row.selectedOption.product_variant_unit_price
              : row.product_variants[0].product_variant_unit_price,
          });
        });
        const destinationDocuments = destination.documents
          ? destination.documents
          : [];
        destinationDocuments.forEach((row) => {
          documents.push({
            document_type: row.type.toUpperCase(),
            document_url: row.url,
            document_description: row.title,
          });
        });
        const delivery = {
          seller_order_reference_id: destination.reference_number,
          promotion_session_id: null,
          products,
          destination:
            destination.recipient && destination.delivery_info
              ? {
                  name: destination.recipient.customer_name,
                  phone_number: destination.recipient.phone,
                  secondary_phone_number:
                    destination.recipient.secondary_phone_number,
                  delivery_location: {
                    description: destination.delivery_info.location,
                    longitude:
                      destination.delivery_info.place.geometry.location.lng(),
                    latitude:
                      destination.delivery_info.place.geometry.location.lat(),
                  },
                  house_location: destination.delivery_info.apartmentName,
                  delivery_instructions: destination.delivery_info.instructions,
                }
              : {},
          destination_policy: "DELIVER_TO_BUYER",
          documents,
        };
        if (
          destination.POD &&
          (destination.POD.amountToBeCollected === "fee" ||
            destination.POD.amountToBeCollected === "nofee") &&
          this.paymentOnDeliveryFlag
        ) {
          delivery.sale_of_goods_policy = {
            costs_to_collect: [
              {
                cost_type: "SALE_OF_GOOD",
              },
            ],
          };
          if (destination.POD.amountToBeCollected === "fee") {
            delivery.sale_of_goods_policy.costs_to_collect.push({
              cost_type: "DELIVERY_FEE",
              cost_amount: destination.POD.deliveryFee
                ? destination.POD.deliveryFee
                : 0,
              currency: this.getBusinessDetails.currency,
            });
          }
        }
        deliveries.push(delivery);
      });
      return deliveries;
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
    this.getPricing();
    this.getDestinations.forEach((row, i) => {
      this.referenceNumbers[i] = row.reference_number;
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
      "setDestinations",
      "setDestinationIndex",
      "setDocumentURL",
      "setSelectedProducts",
      "setFulfillmentFees",
      "setLoader",
      "setPickUpInfoCD",
      "setPickUpOptions",
    ]),
    ...mapActions(["requestAxiosPost", "requestAxiosGet"]),
    addProducts(index) {
      this.setDestinationIndex(index);
      if (this.getDestinations[index].products) {
        this.setSelectedProducts(this.getDestinations[index].products);
      } else {
        this.setSelectedProducts([]);
      }
      this.$router.push("/inventory/add-delivery-products");
    },
    changeIndex(index) {
      this.setDestinationIndex(index - 1);
    },
    addReferenceNumber(index, event) {
      const destinations = this.getDestinations;
      if (destinations[index]) {
        destinations[index].reference_number = event.target.value;
      } else {
        destinations.splice(index, 0, {
          reference_number: event.target.value,
        });
      }
    },
    addLocation() {
      const destinations = this.getDestinations;
      this.preferences.push(false);
      destinations.push({});
      this.setDestinations(destinations);
    },
    execute(action, index, x) {
      this.menus[x] = false;
      if (action === "viewDocument") {
        this.setDocumentURL(this.getDestinations[index - 1].documents[x].url);
        this.setOverlayStatus({
          overlay: true,
          popup: "viewDocument",
        });
      } else {
        const documents = this.getDestinations[index - 1].documents;
        const destinations = this.getDestinations;
        documents.splice(x, 1);
        destinations[index - 1].documents = documents;
        this.setDestinations(destinations);
      }
    },
    addProductStep(val) {
      this.setProductStep(val);
    },
    addDeliveryInfo(index) {
      this.changeIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "deliveryInfoCrossdock",
      });
    },
    addRecepientInfo(index) {
      this.changeIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "recepientInfoCrossdock",
      });
    },
    addPaymentCollection(index) {
      this.changeIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "paymentCollection",
      });
    },
    addDeliveryDocuments(index) {
      this.changeIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "deliveryDocuments",
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
    getPricing() {
      const destinations = this.getDestinations;
      if (destinations.length && destinations[0].products) {
        this.setLoader({
          type: "calculateFee",
          value: "loading-text",
        });
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/crossdocked-delivery/calculate-fee`,
          values: this.checkoutPayload,
        }).then((response) => {
          this.setLoader({
            type: "calculateFee",
            value: "",
          });
          if (response.status === 200) {
            this.setFulfillmentFees(response.data.data);
          }
        });
      }
    },
    createDelivery() {
      let fieldsPresent = [];
      let submitStatus = false;
      this.getDestinations.forEach((row) => {
        if (
          row.products &&
          row.products.length &&
          row.delivery_info &&
          row.recipient &&
          row.POD &&
          (!this.pickUpRequired ||
            (this.pickUpRequired &&
              this.getPickUpInfoCD.location &&
              this.getPickUpInfoCD.phone))
        ) {
          fieldsPresent.push(true);
        } else {
          fieldsPresent.push(false);
        }
      });
      submitStatus = fieldsPresent.includes(false) ? false : true;
      if (submitStatus) {
        this.buttonLoader = true;
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/crossdocked-delivery`,
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
            this.setDestinations([{}]);
            this.setPickUpInfoCD({});
            this.setPickUpOptions({
              type: "",
              text: "",
              info: "",
              date: "",
              FC: "",
            });
            this.setFulfillmentFees(this.placeHolderFees);
            this.sendSegmentEvents({
              event: "Request_Delivery_to_Buyer",
              data: {
                userId: this.getStorageUserDetails.business_id,
                deliveries: this.checkoutPayload.deliveries,
                device: "desktop",
              },
            });
            this.resetInput();
            if (this.onboardingStatus) {
              this.$router.push("/");
            } else {
              this.$router.push(
                `/deliveries/tracking/${response.data.data.deliveries[0].order_id}`
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
        this.showErrors = true;
        this.getDestinations.forEach((row, i) => {
          const index = `${i + 1}${this.numberSuffix(i + 1)}`;
          if (!(row.products && row.products.length)) {
            this.showErrorNotification(
              this.$t("inventory.addProductsError", { index }),
              200
            );
          }
          if (!row.delivery_info) {
            this.showErrorNotification(
              this.$t("inventory.addDeliveryInfoError", { index }),
              300
            );
          }
          if (!row.recipient) {
            this.showErrorNotification(
              this.$t("inventory.addRecipientInfoError", { index }),
              400
            );
          }
          if (!row.POD) {
            this.showErrorNotification(
              this.$t("inventory.addPODError", { index }),
              500
            );
          }
        });
        if (
          this.pickUpRequired &&
          !(this.getPickUpInfoCD.location && this.getPickUpInfoCD.phone)
        ) {
          this.showErrorNotification(
            this.$t("inventory.addPickUpInfoError"),
            100
          );
        }
      }
    },
    numberSuffix(n) {
      return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
    },
    showErrorNotification(message, timeout) {
      setTimeout(() => {
        ElNotification({
          title: this.$t("deliveries.insufficientInformation"),
          message,
          type: "warning",
          duration: 15000,
        });
      }, timeout);
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
  align-items: center;
}
.cross-docking-checkout-roww {
  display: flex;
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
.cross-docking-checkout-text-no-underline {
  cursor: pointer;
  color: #324ba8;
  font-size: 17px;
  font-weight: 500;
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
.cross-docking-checkout-text-grey-no-underline {
  cursor: pointer;
  color: #606266;
  font-size: 17px;
  font-weight: 500;
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
.cross-docking-checkout-products-label {
  flex-direction: column;
  align-items: flex-start !important;
  height: max-content;
}
.cross-docking-checkout-products-label-upper {
  display: flex;
  width: 100%;
  margin-top: 30px;
}
.cross-docking-checkout-product-underline {
  border-bottom: 1px solid #dcdfe6;
}
.cross-docking-checkout-product-label-lower {
  text-transform: capitalize;
}
.crossdocking-text-blue {
  color: #324ba8;
}
.crossdocking-documents-list {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  color: #606266;
  font-weight: 100;
  font-size: 19px;
  margin-bottom: 10px;
}
.crossdocking-documents-list-inner {
  width: 100%;
}
.cross-docking-pickup-title {
  font-size: 17px;
  color: #303133;
}
.field-required-error {
  margin-top: -15px !important;
}
</style>
