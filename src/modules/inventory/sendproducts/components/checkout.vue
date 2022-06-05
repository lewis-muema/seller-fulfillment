<template>
  <div class="send-inventory-checkout-container">
    <v-row>
      <v-col cols="7">
        <v-card variant="outlined" class="send-inventory-checkout-card">
          <div class="enter-quantity-container desktop-header-title d-flex p-3">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="$router.back()"
            ></i>
            <v-card-title class="text-center">Checkout</v-card-title>
          </div>
          <div>
            <form>
              <div class="mb-3">
                <label for="yourName" class="form-label">Pickup Location</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter your pickup location"
                />
              </div>
              <div class="mb-3">
                <label for="price" class="form-label"
                  >Pick up instrictions(optional)</label
                >
                <div>
                  <textarea
                    class="form-control"
                    id=""
                    rows="3"
                    placeholder="Enter instructions for the driver picking your products"
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label for="phoneNumber" class="form-label"
                    >Phone number</label
                  >
                  <vue-tel-input v-bind="sendyPhoneProps"></vue-tel-input>
                </div>
                <span class="add-phone-number"
                  ><v-icon class="add-phone-number-icon">mdi mdi-plus</v-icon
                  >Add another phone number</span
                >
              </div>
              <div>
                <span>Pickup Fee</span>
                <span class="checkout-kes">KES 0</span>
              </div>
              <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-5">
                <router-link to="/" class="btn btn-primary"
                  >Submit Order</router-link
                >
              </div>
            </form>
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <products-summary />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import productsSummary from "./productsSummary";
export default {
  components: { productsSummary },
  data() {
    return {
      sendyPhoneProps: {
        mode: "international",
        defaultCountry: "ke",
        preferredCountries: ["ke", "ug", "tz"],
      },
    };
  },
};
</script>

<style>
.send-inventory-checkout-card {
  border-color: #e2e7ed;
  margin-left: 15%;
}
.send-inventory-checkout-container {
  padding: 0px 50px;
}
.add-phone-number-icon {
  font-size: 12px;
}
.add-phone-number,
.add-phone-number-icon {
  color: #324ba8;
}
.checkout-kes {
  float: right;
}
</style>
