<template>
  <div>
    <v-card variant="outlined" class="send-inventory-checkout-card">
      <div class="enter-quantity-container desktop-header-title d-flex p-3">
        <i
          class="mdi mdi-arrow-left"
          aria-hidden="true"
          @click="$router.back()"
        ></i>
        <v-card-title class="text-center">{{
          $t("inventory.checkout")
        }}</v-card-title>
      </div>
      <div>
        <form>
          <div class="mb-2">
            <label for="yourName" class="form-label">{{
              $t("inventory.nameOfCustomer")
            }}</label>
            <input
              type="text"
              class="form-control"
              :placeholder="$t('inventory.enterNameOfCustomer')"
            />
          </div>
          <div class="mb-2">
            <label for="yourName" class="form-label">{{
              $t("inventory.locationOfCustomer")
            }}</label>
            <input
              type="text"
              class="form-control"
              :placeholder="$t('inventory.searchDeliveryLocation')"
            />
          </div>
          <div class="mb-2">
            <label for="phoneNumber" class="form-label">{{
              $t("inventory.phoneNo")
            }}</label>
            <vue-tel-input v-bind="sendyPhoneProps"></vue-tel-input>
          </div>
          <span class="add-phone-number mb-3"
            ><v-icon class="add-phone-number-icon">mdi mdi-plus</v-icon>
            {{ $t("inventory.addAnotherPhoneNo") }}</span
          >
          <div class="mb-2">
            <label for="price" class="form-label">{{
              $t("inventory.deliveryInstructions")
            }}</label>
            <div>
              <textarea
                class="form-control"
                id=""
                rows="2"
                :placeholder="$t('inventory.enterDeliveryInstructions')"
              ></textarea>
            </div>
          </div>
          <div>
            <p>{{ $t("inventory.payment") }}</p>
            <span class="payment-method">
              <v-icon>mdi-credit-card-outline</v-icon
              >{{ $t("inventory.paymentMethod") }}</span
            >
            <span>
              <v-icon class="payment-method-icon">mdi-chevron-right</v-icon>
            </span>
          </div>
          <div>
            <span>{{ $t("inventory.amountToPay") }}</span>
            <span class="checkout-amount">KES 566</span>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-3">
            <router-link to="/" class="btn btn-primary">{{
              $t("inventory.submitOrder")
            }}</router-link>
          </div>
        </form>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {};
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
