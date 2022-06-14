<template>
  <div>
    <v-card variant="outlined" class="send-inventory-checkout-card">
      <div class="enter-quantity-container desktop-header-title d-flex p-3">
        <i
          class="mdi mdi-arrow-left"
          aria-hidden="true"
          @click="addProductStep(1)"
        ></i>
        <v-card-title class="text-center">
          {{ $t("inventory.checkout") }}
        </v-card-title>
      </div>
      <div>
        <form>
          <div class="mb-3">
            <label for="yourName" class="form-label">
              {{ $t("inventory.pickupLocation") }}
            </label>
            <input
              type="text"
              class="form-control"
              placeholder="Enter your pickup location"
            />
          </div>
          <div class="mb-3">
            <label for="price" class="form-label">
              {{ $t("inventory.pickupInstructions") }}
            </label>
            <div>
              <textarea
                class="form-control"
                id=""
                rows="3"
                placeholder="Enter instructions for the driver picking your products"
              ></textarea>
            </div>
          </div>
          <div class="mb-3">
            <label for="phoneNumber" class="form-label">
              {{ $t("inventory.phoneNo") }}
            </label>
            <vue-tel-input v-bind="sendyPhoneProps"></vue-tel-input>
          </div>
          <span class="add-phone-number"
            ><v-icon class="add-phone-number-icon">mdi mdi-plus</v-icon>
            {{ $t("inventory.addAnotherPhoneNo") }}
          </span>

          <div class="mt-3">
            <span>{{ $t("inventory.pickupFee") }}</span>
            <span class="checkout-amount">{{ currency }} {{ amount }}</span>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-5">
            <router-link to="/" class="btn btn-primary"
              >{{ $t("inventory.submitOrder") }}
            </router-link>
          </div>
        </form>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      amount: 0,
      currency: "KES",
    };
  },
  methods: {
    ...mapMutations(["setProductStep"]),
    addProductStep(val) {
      this.setProductStep(val);
    },
  },
};
</script>

<style>
.send-inventory-checkout-card {
  border-color: #e2e7ed;
  margin-left: 15%;
  background: white;
}
.add-phone-number-icon {
  font-size: 12px;
}
.add-phone-number,
.add-phone-number-icon {
  color: #324ba8;
}
.checkout-amount {
  float: right;
}
</style>
