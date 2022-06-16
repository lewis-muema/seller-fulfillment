<template>
  <div>
    <form action="" @submit.prevent>
      <div class="desktop-sign-up">
        <v-card-title class="text-center">
          {{ $t("auth.signupSendyFulfillment") }}
        </v-card-title>
        <v-card-text class="pt-5">
          <div class="mb-3">
            <label for="businessName" class="form-label">{{
              $t("auth.businessName")
            }}</label>
            <div class="form-input-group">
              <i class="mdi mdi-store-outline"></i>
              <input
                v-model="signUpInputs.businessName"
                type="text"
                class="form-control"
                placeholder="Enter name of business"
              />
              <div v-if="v$.signUpInputs.businessName.$error" class="error-msg">
                {{ $t("auth.businessNameRequired") }}
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="businessEmail" class="form-label">{{
              $t("auth.businessEmailAddress")
            }}</label>
            <div class="form-input-group">
              <i class="mdi mdi-email-outline"></i>
              <input
                v-model="signUpInputs.businessEmail"
                type="email"
                class="form-control"
                :placeholder="$t('auth.enterBusinessEmailAddress')"
              />
              <div
                v-if="v$.signUpInputs.businessEmail.$error"
                class="error-msg"
              >
                {{ $t("auth.businessEmailRequired") }}
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="businessEmail" class="form-label">{{
              $t("auth.countryOfOperation")
            }}</label>
            <el-select v-model="signUpInputs.countryOfOperation">
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

            <div
              v-if="v$.signUpInputs.countryOfOperation.$error"
              class="error-msg"
            >
              {{ $t("auth.countryRequired") }}
            </div>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <button
              class="btn btn-primary b"
              type="submit"
              @click="submitForm"
              v-loading="loading"
              :class="loading ? 'disabled' : ''"
            >
              {{ $t("auth.continue") }}
            </button>
            <div class="text-center text-grey">or</div>
            <google-auth @googleUserData="googleUserData" />
          </div>
          <p class="desktop-login-link login-link-text">
            {{ $t("auth.haveAnAccount") }}
            <router-link to="/auth/sign-in">
              {{ $t("auth.login") }}</router-link
            >
          </p>
        </v-card-text>
      </div>
    </form>
  </div>
</template>

<script>
import googleAuth from "@/modules/common/googleAuth";
import { mapActions, mapMutations, mapGetters } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  components: {
    googleAuth,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      loading: false,
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
      signUpInputs: {
        businessName: "",
        businessEmail: "",
        countryOfOperation: "",
      },
    };
  },
  validations() {
    return {
      signUpInputs: {
        businessName: { required },
        businessEmail: { required },
        countryOfOperation: { required },
      },
    };
  },
  mounted() {},
  watch: {
    businessEmail(value) {
      this.signUpInputs["businessEmail"] = value;
    },
  },
  computed: {
    ...mapGetters(["getGoogleUserData"]),
    businessEmail() {
      return this.getGoogleUserData.email;
    },
  },
  methods: {
    ...mapActions(["signupUser"]),
    ...mapMutations(["setGoogleUserData"]),
    googleUserData(value) {
      this.setGoogleUserData(value);
    },
    async submitForm() {
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
      this.loading = true;
      const payload = {
        business: {
          business_name: this.signUpInputs.businessName,
          business_email: this.signUpInputs.businessEmail,
          country: this.signUpInputs.countryOfOperation,
        },
      };

      const fullPayload = {
        app: process.env.SELLER_FULFILLMENT_SERVER,
        values: payload,
        endpoint: "seller/business/signup",
      };
      const data = await this.signupUser(fullPayload);
      if (data.status === 200) {
        this.loading = false;
        this.$router.push("/auth/otp");
      }
      this.loading = false;
    },
  },
};
</script>

<style>
form {
  padding: 0px 50px;
}
.login-link-text > a {
  color: #324ba8 !important;
}
.terms-link-text > a {
  color: #324ba8 !important;
  text-decoration: none;
}
.v-card-text {
  opacity: unset;
}
.btn-primary {
  color: white !important;
  background-color: #324ba8 !important;
  border-color: #324ba8 !important;
}
.form-label {
  font-weight: 500 !important;
  font-size: 14px !important;
}
.language-dropdown {
  text-align: end;
  padding-top: 30px;
  margin-right: 30px;
}
.desktop-login-link {
  padding: 50px 0px 0px 50px;
}
.form-input-group input {
  text-indent: 28px;
}

.form-control::placeholder {
  color: #dcdfe6 !important;
}
.vti__input::placeholder {
  color: #dcdfe6;
}
.vue-tel-input {
  border: 1px solid #ced4da !important;
  font-size: 1rem;
}
.desktop-header-title .mdi-arrow-left {
  width: 30px;
  height: 100%;
  color: #5f6368;
  font-size: 30px;
  cursor: pointer;
}
.btn {
  line-height: 1.9 !important;
}
.form-input-group {
  position: relative;
}
.default-btn {
  background-color: #ffffff !important;
  color: black !important;
  border-color: #e2e7ed !important;
}
.form-control::placeholder {
  color: #dcdfe6;
}
.form-input-group .mdi {
  position: absolute;
  top: 9px;
  left: 13px;
  width: 16px;
  height: 13.33px;
  font-size: 19px;
  color: #909399;
}
.country-flag {
  margin-left: 10px;
}
.country-name {
  font-size: 14px;
}
.el-input__inner::first-letter {
  font-size: 20px;
}
img.emojione {
  font-size: 20px;
}
h1 {
  font-size: 20px;
}
.country-image {
  height: 20px;
  width: 20px;
}
.el-select {
  display: block !important;
}
.country-image-container {
  float: left;
  font-size: 23px;
  padding-right: 10px;
}
.country-container {
  font-size: 13px;
}
.error-msg {
  color: #9b101c;
}
.el-loading-mask {
  background-color: #324ba8 !important;
  opacity: 0.6;
}
</style>
