<template>
  <div>
    <v-card variant="outlined" class="send-inventory-checkout-card">
      <div class="enter-quantity-container desktop-header-title d-flex p-3">
        <i
          class="mdi mdi-arrow-left"
          aria-hidden="true"
          @click="addProductStep(1)"
        ></i>
        <v-card-title class="text-center">Checkout</v-card-title>
      </div>
      <div>
        <form>
          <div class="mb-2">
            <label for="yourName" class="form-label"
              >Name of the Customer</label
            >
            <input
              type="text"
              class="form-control"
              placeholder="Enter name of customer"
            />
          </div>
          <div class="mb-2">
            <label for="yourName" class="form-label"
              >Location of the customer</label
            >
            <input
              type="text"
              class="form-control"
              placeholder="Search delivery location"
            />
          </div>
          <div class="mb-2">
            <label for="phoneNumber" class="form-label">Phone number</label>
            <vue-tel-input v-bind="sendyPhoneProps"></vue-tel-input>
          </div>
          <span class="add-phone-number mb-3"
            ><v-icon class="add-phone-number-icon">mdi mdi-plus</v-icon>Add
            another phone number</span
          >
          <div class="mb-2">
            <label for="price" class="form-label"
              >Delivery instructions(optional)</label
            >
            <div>
              <textarea
                class="form-control"
                id=""
                rows="2"
                placeholder="Enter instructions for the delivery partner"
              ></textarea>
            </div>
          </div>
          <div>
            <p>Payment</p>
            <span class="payment-method">
              <v-icon>mdi-credit-card-outline</v-icon>Select Payment
              method</span
            >
            <span>
              <v-icon class="payment-method-icon">mdi-chevron-right</v-icon>
            </span>
          </div>
          <div>
            <span>Amount to Pay </span>
            <span class="checkout-amount">KES 566</span>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-3">
            <router-link to="/" class="btn btn-primary"
              >Submit Order</router-link
            >
          </div>
        </form>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations(["setProductStep"]),
    addProductStep(val) {
      this.setProductStep(val);
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
