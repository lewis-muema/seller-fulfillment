<template>
  <div>
    <form action="" @submit.prevent>
      <div class="desktop-sign-up">
        <div class="desktop-header-title d-flex">
          <i
            class="mdi mdi-arrow-left"
            aria-hidden="true"
            @click="$router.back()"
          ></i>
          <v-card-title class="text-center">
            {{ $t("auth.confirmInfo") }}
          </v-card-title>
        </div>
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
                {{ $t("auth.nameRequired") }}
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="phoneNumber" class="form-label">{{
              $t("auth.phoneNumber")
            }}</label>
            <vue-tel-input v-model="params.phoneNo"></vue-tel-input>
            <div v-if="v$.params.phoneNo.$error" class="error-msg">
              {{ $t("auth.phoneRequired") }}
            </div>
          </div>
          <div class="mb-3">
            <label for="emailAddress" class="form-label">
              {{ $t("auth.emailAddress") }}</label
            >
            <div class="form-input-group">
              <i class="mdi mdi-email-outline" aria-hidden="true"></i>
              <input
                v-model="params.emailAddress"
                type="text"
                class="form-control"
              />
              <div v-if="v$.params.emailAddress.$error" class="error-msg">
                {{ $t("auth.emailRequired") }}
              </div>
            </div>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-5">
            <button
              class="btn btn-primary b"
              type="submit"
              @click="completee"
              v-loading="loading"
              :class="loading ? 'disabled' : ''"
            >
              {{ $t("auth.continue") }}
            </button>
          </div>
          <p class="terms-link-text">
            {{ $t("auth.bySigningUp") }}
            <router-link to="/auth/sign-in">
              {{ $t("auth.termsAndConditions") }}</router-link
            >
          </p>
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
        emailAddress: "",
      },
    };
  },
  validations() {
    return {
      params: {
        personalName: { required },
        phoneNo: { required },
        emailAddress: { required },
      },
    };
  },
  methods: {
    completee() {
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
      this.$router.push("/auth/complete-google-signup");
    },
  },
};
</script>

<style scoped></style>
