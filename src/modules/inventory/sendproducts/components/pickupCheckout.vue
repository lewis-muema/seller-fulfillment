<template>
  <div>
    <v-card variant="outlined" class="send-inventory-checkout-card">
      <div class="enter-quantity-container desktop-header-title d-flex p-3">
        <i
          class="mdi mdi-arrow-left"
          aria-hidden="true"
          @click="$router.push('/inventory/send-inventory/sendy/add-quantity')"
        ></i>
        <v-card-title class="text-center">
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
            class="btn btn-primary mt-2 btn-long"
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

export default {
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
  computed: {
    ...mapGetters(["getSendyPhoneProps", "getSelectedProducts"]),
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
        card_id: "",
        products,
        destination: {
          name: userDetails.business_name,
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
</style>
