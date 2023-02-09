<template>
  <div>
    <div class="send-inventory-checkout-container">
      <v-row>
        <v-col cols="6" class="mx-auto mt-4 mb-3">
          <el-steps :active="2" finish-status="success">
            <el-step :title="$t('inventory.selectProducts')"></el-step>
            <el-step :title="$t('inventory.review')"></el-step>
            <el-step :title="$t('inventory.checkout')"></el-step>
          </el-steps>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-card variant="outlined" class="send-inventory-checkout-card">
            <div
              class="enter-quantity-container desktop-header-title checkout-back-button-override d-flex pt-3 pb-3"
            >
              <i
                class="mdi mdi-arrow-left"
                aria-hidden="true"
                @click="
                  $router.push('/inventory/add-consignment-return-quantities')
                "
              ></i>
              <v-card-title class="text-center send-products-title">
                {{ $t("inventory.checkout") }}
              </v-card-title>
            </div>
            <div class="mt-2 mb-5">
              <div class="row mt-4">
                <div class="col-1">
                  <i
                    class="mdi mdi-account-outline cross-docking-checkout-icons"
                  ></i>
                </div>
                <div class="col-11">
                  <div
                    class="cross-docking-checkout-text pb-3"
                    v-if="Object.keys(getDeliveryInfo).length === 0"
                    @click="
                      setOverlayStatus({
                        overlay: true,
                        popup: 'consignmentReturndeliveryInfo',
                      })
                    "
                  >
                    <span>{{ $t("inventory.addDeliveryInfo") }}</span>
                    <span class="cross-docking-checkout-chevrons"
                      ><i class="mdi mdi-chevron-right"></i
                    ></span>
                  </div>
                  <div
                    class="cross-docking-checkout-text-grey cross-docking-checkout-text-override"
                    v-else
                  >
                    <div>
                      <p>{{ $t("deliveries.deliveryInfo") }}</p>
                      <div class="delivery-details-text">
                        <p>{{ getDeliveryInfo.location }}</p>
                        <p>{{ getDeliveryInfo.apartmentName }}</p>
                        <p>{{ getDeliveryInfo.instructions }}</p>
                      </div>
                    </div>
                    <span
                      class="cross-docking-checkout-chevrons"
                      @click="
                        setOverlayStatus({
                          overlay: true,
                          popup: 'consignmentReturndeliveryInfo',
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
              >
                <div class="col-1">
                  <i
                    class="mdi mdi-clock-outline cross-docking-checkout-icons"
                  ></i>
                </div>
                <div
                  class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
                >
                  <div class="checkout-delivery-date-container">
                    <div class="d-flex mb-2">
                      <div>
                        {{ $t("inventory.deliveryDate") }}
                      </div>
                      <div
                        class="cross-docking-checkout-chevrons"
                        @click="
                          setOverlayStatus({
                            overlay: true,
                            popup: 'ConsignmentReturnOption',
                          })
                        "
                      >
                        <span class="cross-docking-checkout-chevrons-text">{{
                          $t("inventory.change")
                        }}</span>
                        <i class="mdi mdi-chevron-right"></i>
                      </div>
                    </div>
                    <div class="mb-2">
                      <div>
                        {{
                          $t(
                            `inventory.${getConsignmentReturn?.deliveryDate?.type}_DELIVERY`
                          )
                        }}
                      </div>
                      <div>
                        {{
                          formatDate(getConsignmentReturn?.deliveryDate?.date)
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 mb-2">
              <span>{{ $t("inventory.deliveryFee") }}</span>
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
          </v-card>
        </v-col>
        <v-col cols="4">
          <products-summary />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import { ElNotification } from "element-plus";
import moment from "moment";
import eventsMixin from "../../../mixins/events_mixin";
import productsSummary from "./components/productsSummary.vue";

export default {
  mixins: [eventsMixin],
  components: { productsSummary },
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
      FCdropoffStatus: false,
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
      "getPickUpOptions",
      "getPickUpInfoCD",
      "getBusinessDetails",
      "getDeliveryInfo",
      "getConsignmentReturn",
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
      const payload = {
        card_id: "",
        products,
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
      };
      return payload;
    },
  },
  beforeMount() {
    if (localStorage.country) {
      const props = this.getSendyPhoneProps;
      props.defaultCountry = localStorage.country.toLowerCase();
      this.setSendyPhoneProps(props);
    }
    this.setComponent("common.sendBackInventory");
    this.setPickUpOptions({
      type: "driver",
      text: "inventory.sendDriverToPickTheItems",
      info: "",
      date: "",
      FC: "",
    });
    this.setPickUpInfoCD({});
  },
  methods: {
    ...mapMutations([
      "setProductStep",
      "setCheckoutDetails",
      "setSendyPhoneProps",
      "setSelectedProducts",
      "setOverlayStatus",
      "setPickUpInfoCD",
      "setPickUpOptions",
      "setComponent",
      "setConsignmentReturn",
    ]),
    ...mapActions(["requestAxiosPost"]),
    formatDate(date) {
      return moment(date).format("dddd, Do MMMM");
    },
    addProductStep(val) {
      this.setProductStep(val);
    },
    setLocation(val) {
      this.place = val;
      this.location = document.querySelector("#location").value;
    },
    createConsignment() {
      if (
        this.getPickUpInfoCD.location &&
        this.getPickUpInfoCD.phone &&
        this.getSelectedProducts.length
      ) {
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
            this.setPickUpInfoCD({});
            this.setSelectedProducts([]);
            this.sendSegmentEvents({
              event: "Send_Products_To_Sendy",
              data: {
                userId: this.getStorageUserDetails.business_id,
                SKU: this.getSelectedProducts,
                pickUpRegion: this.getPickUpInfoCD.place,
                clientType: "web",
                device: "desktop",
              },
            });
            window.gtag("event", "purchase", {
              transaction_id: response.data.data.order_id,
              items: [
                {
                  item_id: response.data.data.order_id,
                },
              ],
            });
            this.resetInputs();
            if (this.onboardingStatus) {
              this.$router.push("/");
            } else {
              this.$router.push(
                `/deliveries/tracking/${response.data.data.order_id}`
              );
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
.checkout-back-button-override {
  margin-left: -5px;
}
.checkout-delivery-date-container {
  width: -webkit-fill-available;
}
</style>
