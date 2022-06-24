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
            {{ $t("auth.verifyEmailaddress") }}
          </v-card-title>
        </div>
        <v-card-text class="otp-card">
          <p>
            {{ $t("auth.enterCodeSentToEmail") }}
            <span class="otp-email">{{ userEmail }}</span>
          </p>
          <p class="mt-12">{{ $t("auth.enterCode") }}</p>
          <div>
            <div style="display: flex; flex-direction: row">
              <v-otp-input
                :class="v$.otp.$error ? 'otp-error-msg' : ''"
                ref="otpInput"
                input-classes="otp-input"
                :num-inputs="4"
                :should-auto-focus="true"
                :is-input-num="true"
                @on-complete="handleOnComplete"
                separator=""
              />
            </div>
            <div v-if="v$.otp.$error" class="error-msg">
              {{ $t("auth.OTPRequired") }}
            </div>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <button
              class="btn btn-primary"
              type="submmit"
              @click="confirmOTP()"
              v-loading="loading"
              :class="loading ? 'disabled' : ''"
            >
              {{ $t("auth.confirmCode") }}
            </button>
          </div>
        </v-card-text>
      </div>
    </form>
  </div>
</template>

<script>
import VOtpInput from "vue3-otp-input";
import { mapActions, mapGetters, mapMutations } from "vuex";
import useVuelidate from "@vuelidate/core";
import { ElNotification } from "element-plus";
import { required } from "@vuelidate/validators";
export default {
  components: { VOtpInput },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      loading: false,
      correctOTP: false,
      otp: "",
    };
  },
  validations() {
    return {
      otp: { required },
    };
  },
  computed: {
    ...mapGetters(["getUserData", "getLoginData", "getOTPRedirectUrl"]),
    userEmail() {
      return this.getOTPRedirectUrl === "otp/signIn"
        ? this.getLoginData.email
        : this.businessEmail;
    },
    businessId() {
      return this.getOTPRedirectUrl === "otp/signIn"
        ? this.getLoginData.business_id
        : this.getUserData.business.business_id;
    },
    businessEmail() {
      return this.getUserData.business
        ? this.getUserData.business.business_email
        : "";
    },
  },
  mounted() {
    if (!this.getOTPRedirectUrl) {
      this.$router.go(-1);
    }
  },
  methods: {
    ...mapActions(["confirmUser", "attemptLogin"]),
    ...mapMutations(["setAccessToken", "setRefreshToken"]),
    handleOnComplete(value) {
      this.otp = parseInt(value);
    },
    clearInput() {
      this.$refs.otpInput.clearInput();
    },
    async confirmOTP() {
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
      this.loading = true;
      const payload = {
        business_id: this.businessId,
        code: this.otp,
      };
      const fullPayload = {
        app: process.env.FULFILMENT_SERVER,
        values: payload,
        endpoint:
          this.getOTPRedirectUrl === "otp/signIn"
            ? "seller/business/signin/confirm"
            : "seller/business/signup/confirm",
      };
      try {
        const data =
          this.getOTPRedirectUrl === "otp/signIn"
            ? await this.attemptLogin(fullPayload)
            : await this.confirmUser(fullPayload);

        if (data.data.message === "login.fail") {
          ElNotification({
            title: "",
            message: this.$t("auth.invalidToken"),
            type: "error",
          });
        }
        if (data.data.data !== null) {
          this.correctOTP = true;
          const accessToken = data.data.access_token;
          const refreshToken = data.data.refresh_token;
          this.setAccessToken(accessToken);
          this.setRefreshToken(refreshToken);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          this.clearInput();
          this.loading = false;
          this.getOTPRedirectUrl === "otp/signIn"
            ? this.$router.push("/")
            : this.$router.push("/auth/complete-signup");
        } else {
          ElNotification({
            title: "",
            message: this.$t("auth.failedToCreateAccount"),
            type: "error",
          });
        }
        this.loading = false;
      } catch (error) {
        ElNotification({
          title: "",
          message: this.$t("auth.failedToCreateAccount"),
          type: "error",
        });
      }
    },
  },
};
</script>

<style>
.form-control {
  margin-right: 12px;
}
.otp-card {
  margin-bottom: 80px;
}
.desktop-otp-inputs > .form-control {
  padding: 0.75rem 0.75rem !important;
}
.desktop-header-title .mdi-arrow-left {
  width: 30px;
  height: 100%;
  color: #5f6368;
  font-size: 30px;
}
.otp-card p {
  font-size: 16px;
}
.otp-card span {
  font-weight: 500;
}
.otp-input {
  width: 70px;
  height: 70px;
  padding: 5px;
  margin-left: 0px;
  margin-right: 25px;
  margin-bottom: 50px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.otp-error-msg {
  border-color: #9b101c;
}
</style>
