<template>
  <div>
    <form action="" @submit.prevent>
      <div class="desktop-sign-up">
        <v-card-title class="text-center sign-up-title">
          {{ $t("auth.signupSendyFulfillment") }}
        </v-card-title>
        <v-card-text class="pt-3">
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
              <div v-if="v$.params.businessName.$error" class="error-msg">
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
                v-model="params.businessEmail"
                type="email"
                class="form-control"
                :placeholder="$t('auth.enterBusinessEmailAddress')"
              />
              <div v-if="v$.params.businessEmail.$error" class="error-msg">
                {{ $t("auth.businessEmailRequired") }}
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="businessEmail" class="form-label">{{
              $t("auth.countryOfOperation")
            }}</label>
            <el-select v-model="params.countryOfOperation">
              <el-option
                v-for="item in getCountries"
                :key="item.value"
                :label="item.name"
                :value="item.name"
              >
                <span class="country-image-container">
                  <img
                    :src="imgPreUrl + item.name + '.png'"
                    class="country-image"
                  />
                </span>
                <span class="country-container">{{ item.name }}</span>
              </el-option>
            </el-select>

            <div v-if="v$.params.countryOfOperation.$error" class="error-msg">
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
            <!-- <div class="text-center text-grey">or</div> -->
            <!-- <google-auth  /> -->
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
// import googleAuth from "@/modules/common/googleAuth";
import { mapActions, mapMutations, mapGetters } from "vuex";
import { ElNotification } from "element-plus";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import eventsMixin from "../../mixins/events_mixin";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  mixins: [eventsMixin],
  data() {
    return {
      loading: false,
      imgPreUrl: "https://images.sendyit.com/fulfilment/seller/",
      params: {
        businessName: "",
        businessEmail: "",
        countryOfOperation: "",
      },
    };
  },
  validations() {
    return {
      params: {
        businessName: { required },
        businessEmail: { required },
        countryOfOperation: { required },
      },
    };
  },
  mounted() {
    localStorage.clear();
    this.countries();
  },
  watch: {},
  computed: {
    ...mapGetters(["getErrors", "getGoogleUserData", "getCountries"]),
  },
  methods: {
    ...mapActions(["signupUser", "listCountries"]),
    ...mapMutations(["setOTPRedirectUrl", "setBizDetails"]),
    retrieveGoogleData(value) {
      console.log(value);
    },
    async submitForm() {
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
      this.loading = true;
      const payload = {
        business: {
          business_name: this.params.businessName,
          business_email: this.params.businessEmail,
          country: this.params.countryOfOperation,
        },
      };

      const fullPayload = {
        app: process.env.FULFILMENT_SERVER,
        values: payload,
        endpoint: "seller/business/signup",
      };
      try {
        const data = await this.signupUser(fullPayload);
        if (data.status === 200) {
          this.setBizDetails(data.data.data.business);
          localStorage.userDetails = JSON.stringify(data.data.data.business);
          localStorage.OTPRedirectUrl = "otp/signUp";
          this.loading = false;
          this.setOTPRedirectUrl("otp/signUp");
          this.$router.push("/auth/otp");
          this.sendSegmentEvents({
            event: "Sign up",
            data: {
              userId: data.data.data.business.business_id,
              email: this.params.businessEmail,
              clientType: "web",
              device: "desktop",
              region: this.params.countryOfOperation,
            },
          });
        }
        this.loading = false;
      } catch (err) {
        ElNotification({
          title: this.getErrors.message.replaceAll(".", " "),
          message: "",
          type: "error",
        });
        this.loading = false;
      }
    },
    async countries() {
      try {
        const fullPayload = {
          app: process.env.FULFILMENT_SERVER,
          endpoint: "seller/business/signup/countries",
        };
        const response = await this.listCountries(fullPayload);
        if (response.message === "country.list.success") {
          return response;
        }
      } catch (error) {
        console.log(error);
      }
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
.terms-link-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.terms-link-text > a {
  color: #324ba8 !important;
  text-decoration: none;
  align-items: center;
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
.desktop-sign-up {
  padding: 0px 40px;
  margin: 20px 0px;
}
</style>
