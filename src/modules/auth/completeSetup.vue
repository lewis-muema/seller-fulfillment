<template>
  <div>
    <form action="">
      <v-icon>format_quote</v-icon>
      <div class="desktop-sign-up">
        <v-card-title class="text-center">
          {{ $t("auth.signupSendyFulfillment") }}
        </v-card-title>
        <v-card-text class="pt-5">
          <div class="mb-3">
            <label for="yourName" class="form-label">
              {{ $t("auth.yourName") }}</label
            >
            <div class="form-input-group">
              <i class="mdi mdi-account-circle" aria-hidden="true"></i>
              <input
                v-model="params.personalName"
                type="text"
                class="form-control"
                :placeholder="$t('auth.enterYourPersonalName')"
              />
              <div v-if="v$.params.personalName.$error" class="error-msg">
                Your name is required
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="phoneNumber" class="form-label">{{
              $t("auth.phoneNumber")
            }}</label>
            <vue-tel-input
              v-model="params.phoneNo"
              v-bind="sendyPhoneProps"
              :input-options="vueTelInputProps"
            ></vue-tel-input>
            <div v-if="v$.params.phoneNo.$error" class="error-msg">
              Phone number is required
            </div>
          </div>
          <div class="mb-3">
            <label for="industry" class="form-label">{{
              $t("auth.industryOfBusiness")
            }}</label>
            <select class="form-select" v-model="params.industryOfBusiness">
              <option selected>Select</option>
              <option value="1">Clothing</option>
              <option value="2">Cosmetics</option>
            </select>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-5">
            <button class="btn btn-primary b" type="button">Continue</button>
          </div>
        </v-card-text>
      </div>
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      params: {
        personalName: "",
        phoneNo: "",
        industryOfBusiness: "",
      },
    };
  },
  validations() {
    return {
      params: {
        personalName: { required },
        phoneNo: { required },
        industryOfBusiness: { required },
      },
    };
  },
};
</script>

<style scoped></style>
