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
            <label for="industry" class="form-label">{{
              $t("auth.industryOfBusiness")
            }}</label>
            <select class="form-select" @change="selectIndustryId($event)">
              <option selected>Select</option>
              <option
                v-for="industry in supportedIndustries"
                :key="industry.industry_id"
                :value="industry.industry_id"
              >
                {{ industry.name }}
              </option>
            </select>
            <div v-if="v$.params.industryOfBusiness.$error" class="error-msg">
              {{ $t("auth.industryOfBusinessRequired") }}
            </div>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-5">
            <button
              class="btn btn-primary b"
              type="submit"
              @click="completeSignUp"
              v-loading="loading"
              :class="loading ? 'disabled' : ''"
            >
              {{ $t("auth.signUp") }}
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
import { mapGetters, mapActions } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import industryList from "@/mixins/industry_list";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  mixins: [industryList],
  data() {
    return {
      loading: false,
      test: "",
      params: {
        personalName: "",
        phoneNo: "",
        industryOfBusiness: "",
        firstName: "",
        lastName: "",
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
  async mounted() {
    await this.industryList();
  },
  watch: {
    firstName(value) {
      this.params["firstName"] = value;
    },
    lastName(value) {
      this.params["lastName"] = value;
    },
  },
  computed: {
    ...mapGetters(["getGoogleUserData", "getIndustries", "getUserData"]),
    businessId() {
      return this.getUserData.business.business_id;
    },
    firstName() {
      return this.params["personalName"].split(" ")[0];
    },
    lastName() {
      return this.params["personalName"].split(" ")[1];
    },
    supportedIndustries() {
      return this.getIndustries.industries;
    },
  },
  methods: {
    ...mapActions(["businessUserDetails", "industries"]),
    selectIndustryId(event) {
      this.params.industryOfBusiness = event.target.value;
    },
    async completeSignUp() {
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
      this.loading = true;
      const payload = {
        business: {
          business_id: this.businessId,
          business_industry_id: this.params.industryOfBusiness,
        },
        user: {
          first_name: this.firstName,
          last_name: this.lastName,
          phone_number: this.params.phoneNo,
        },
      };
      const fullPayload = {
        app: process.env.FULFILMENT_SERVER,
        values: payload,
        endpoint: "seller/business/signup/update",
      };
      const data = await this.businessUserDetails(fullPayload);
      if (data.status === 200) {
        this.loading = false;
        this.$router.push("/onboarding");
      }
    },
  },
};
</script>

<style scoped></style>
