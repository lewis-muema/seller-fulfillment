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
              {{ $t("auth.firstName") }}</label
            >
            <div class="form-input-group">
              <i class="mdi mdi-account-circle" aria-hidden="true"></i>
              <input
                v-model="params.firstName"
                type="text"
                class="form-control"
                :placeholder="$t('auth.enterYourFirstName')"
              />
              <div v-if="v$.params.firstName.$error" class="error-msg">
                {{ $t("auth.nameRequired") }}
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="yourName" class="form-label">
              {{ $t("auth.lastName") }}</label
            >
            <div class="form-input-group">
              <i class="mdi mdi-account-circle" aria-hidden="true"></i>
              <input
                v-model="params.lastName"
                type="text"
                class="form-control"
                :placeholder="$t('auth.enterYourLastName')"
              />
              <div v-if="v$.params.lastName.$error" class="error-msg">
                {{ $t("auth.nameRequired") }}
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="phoneNumber" class="form-label">{{
              $t("auth.phoneNumber")
            }}</label>
            <vue-tel-input
              v-bind="getSendyPhoneProps"
              v-model="params.phoneNo"
            ></vue-tel-input>
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
              {{
                getOTPRedirectUrl === "otp/signIn"
                  ? $t("auth.updateDetails")
                  : $t("auth.signUp")
              }}
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
import { mapGetters, mapActions, mapMutations } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import industryList from "@/mixins/industry_list";
import eventsMixin from "../../mixins/events_mixin";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  mixins: [industryList, eventsMixin],
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
        firstName: { required },
        lastName: { required },
        phoneNo: { required },
        industryOfBusiness: { required },
      },
    };
  },
  async mounted() {
    if (localStorage.userDetails && localStorage.OTPRedirectUrl) {
      this.setBizDetails(JSON.parse(localStorage.userDetails));
      this.setOTPRedirectUrl(localStorage.OTPRedirectUrl);
      this.setUserData({ business: JSON.parse(localStorage.userDetails) });
      this.setLoginData(JSON.parse(localStorage.userDetails));
      if (localStorage.user) {
        this.setUserDetails(localStorage.user);
      }
    } else {
      this.$router.push(
        this.getOTPRedirectUrl === "otp/signUp"
          ? "/auth/sign-up"
          : "/auth/sign-in"
      );
    }
    if (this.getOTPRedirectUrl === "otp/signIn") {
      this.firstName = this.getUserDetails.first_name
        ? this.getUserDetails.first_name
        : "";
      this.lastName = this.getUserDetails.last_name
        ? this.getUserDetails.last_name
        : "";
      this.phoneNo = this.getUserDetails.phone_number
        ? this.getUserDetails.phone_number
        : "";
    }
    await this.industryList();
  },
  computed: {
    ...mapGetters([
      "getGoogleUserData",
      "getIndustries",
      "getUserData",
      "getOTPRedirectUrl",
      "getUserDetails",
      "getLoginData",
      "getSendyPhoneProps",
    ]),
    businessId() {
      return this.getUserData.business
        ? this.getUserData.business.business_id
        : this.getLoginData.business_id;
    },
    supportedIndustries() {
      return this.getIndustries.industries;
    },
  },
  methods: {
    ...mapActions(["businessUserDetails", "industries"]),
    ...mapMutations([
      "setUserDetails",
      "setBizDetails",
      "setOTPRedirectUrl",
      "setUserData",
      "setLoginData",
    ]),
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
          first_name: this.params.firstName,
          last_name: this.params.lastName,
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
        if (this.getOTPRedirectUrl === "otp/signUp") {
          this.sendSegmentEvents({
            event: "Signed Up",
            data: {
              userId: this.businessId,
              email: this.getUserDetails.email,
              clientType: "web",
              device: "desktop",
              industry: this.params.industryOfBusiness,
            },
          });
        }
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped></style>
