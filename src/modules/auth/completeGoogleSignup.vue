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
            {{ $t("auth.completeSignUp") }}
          </v-card-title>
        </div>
        <v-card-text class="pt-5">
          <div class="mb-3">
            <label for="businessName" class="form-label">{{
              $t("auth.businessName")
            }}</label>
            <div class="form-input-group">
              <i class="mdi mdi-store-outline"></i>
              <input
                v-model="params.businessName"
                type="text"
                class="form-control"
                placeholder="Enter name of business"
              />
              <!-- <div v-if="v$.params.businessName.$error" class="error-msg">
                {{ $t("auth.businessNameRequired") }}
              </div> -->
            </div>
          </div>
          <div class="mb-3">
            <label for="industry" class="form-label">{{
              $t("auth.industryOfBusiness")
            }}</label>
            <select class="form-select" @change="selectIndustryId($event)">
              <option
                v-for="industry in supportedIndustries"
                :key="industry.industry_id"
                :value="industry.industry_id"
              >
                {{ industry.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="country" class="form-label">{{
              $t("auth.countryOfOperation")
            }}</label>
            <el-select v-model="params.countryOfOperation">
              <el-option
                v-for="item in countries"
                :key="item.value"
                :label="item.country"
                :value="item.country"
              >
                <span class="country-image-container">
                  <img :src="item.image" class="country-image" />
                </span>
                <span class="country-container">{{ item.country }}</span>
              </el-option>
            </el-select>

            <!-- <div v-if="v$.params.countryOfOperation.$error" class="error-msg">
              {{ $t("auth.countryRequired") }}
            </div> -->
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <button
              class="btn btn-primary b"
              type="submit"
              @click="submitForm"
              v-loading="loading"
              :class="loading ? 'disabled' : ''"
            >
              {{ $t("auth.signUp") }}
            </button>
            <div class="text-center text-grey">or</div>
            <google-auth />
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
      countries: [
        {
          country: "KENYA",
          image:
            "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KE.svg",
        },
        {
          country: "UGANDA",
          image:
            "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UG.svg",
        },
      ],
      params: {
        businessName: "",
        countryOfOperation: "",
      },
      validations() {
        return {
          params: {
            businessName: { required },
            countryOfOperation: { required },
          },
        };
      },
    };
  },
};
</script>

<style scoped></style>
