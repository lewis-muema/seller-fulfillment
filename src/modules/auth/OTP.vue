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
            <div class="resend-code-otp-container">
              <span
                class="didnt-recieve-code"
                v-if="!(!countDownTriggered || resendStatus)"
              >
                {{ $t("auth.didntReceiveCode") }}
              </span>
              <div
                class="resend-code-otp"
                :class="
                  !countDownTriggered || resendStatus
                    ? 'disabled-resend-code-otp'
                    : 'enabled-resend-code-otp'
                "
                @click="resendCode()"
              >
                {{
                  !countDownTriggered
                    ? $t("auth.resendCode", {
                        time: `${countDown}`,
                      })
                    : $t("auth.resend")
                }}
              </div>
            </div>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <button
              class="btn btn-primary"
              type="submmit"
              @click="confirmOTP()"
              v-loading="loading"
              :class="loading ? 'disabled' : ''"
              data-test="signin-with-otp"
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
      countDown: 120,
      countDownTriggered: false,
      resendStatus: false,
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
    ...mapGetters([
      "getUserData",
      "getLoginData",
      "getOTPRedirectUrl",
      "getBizDetails",
    ]),
    userEmail() {
      return localStorage.OTPRedirectUrl === "otp/signIn"
        ? this.getLoginData.email
        : this.businessEmail;
    },
    businessId() {
      return localStorage.OTPRedirectUrl === "otp/signIn"
        ? this.getLoginData.business_id
        : this.getUserData.business.business_id;
    },
    userId() {
      return localStorage.OTPRedirectUrl === "otp/signIn"
        ? this.getLoginData.user_id
        : this.getUserData.business.user_id;
    },
    businessEmail() {
      return this.getUserData.business
        ? this.getUserData.business.email
          ? this.getUserData.business.email
          : this.getUserData.business.business_email
        : "";
    },
  },
  mounted() {
    if (localStorage.userDetails && localStorage.OTPRedirectUrl) {
      this.setBizDetails(JSON.parse(localStorage.userDetails));
      this.setOTPRedirectUrl(localStorage.OTPRedirectUrl);
      this.setUserData({ business: JSON.parse(localStorage.userDetails) });
      this.setLoginData(JSON.parse(localStorage.userDetails));
    } else {
      this.$router.push(
        this.getOTPRedirectUrl === "otp/signUp"
          ? "/auth/sign-up"
          : "/auth/sign-in"
      );
    }
    this.countDownTimer();
  },
  methods: {
    ...mapActions([
      "confirmUser",
      "attemptLogin",
      "requestAxiosGet",
      "loginUser",
    ]),
    ...mapMutations([
      "setAccessToken",
      "setRefreshToken",
      "setUserDetails",
      "setAchievements",
      "setBizDetails",
      "setOTPRedirectUrl",
      "setUserData",
      "setLoginData",
    ]),
    handleOnComplete(value) {
      this.otp = parseInt(value);
    },
    clearInput() {
      this.$refs.otpInput.clearInput();
    },
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      } else {
        this.countDownTriggered = true;
      }
    },
    async resendCode() {
      const payload = {
        email: this.userEmail,
      };
      this.resendStatus = true;
      if (this.countDown === 0) {
        try {
          const fullPayload = {
            app: process.env.FULFILMENT_SERVER,
            values: payload,
            endpoint: "seller/business/signin",
          };
          const data = await this.loginUser(fullPayload);
          this.resendStatus = false;
          if (data.status === 200) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            this.setBizDetails(data.data.data);
            localStorage.userDetails = JSON.stringify(data.data.data);
            ElNotification({
              title: "",
              message: this.$t("auth.weHaveSentYouAnotherOTP"),
              type: "success",
            });
            this.countDown = 120;
            this.countDownTriggered = false;
            this.countDownTimer();
          }
        } catch (error) {
          ElNotification({
            title: "",
            message: this.$t("auth.weCouldNotResendYouAnOTP"),
            type: "success",
          });
        }
      }
    },
    async confirmOTP() {
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
      this.loading = true;
      const payload = {
        business_id: this.businessId,
        user_id: this.userId,
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
          localStorage.setItem("tokenCreated", new Date().valueOf());
          localStorage.setItem("tokenDuration", 3);
          this.setAchievements({});
          this.redirect();
        } else {
          ElNotification({
            title: "",
            message: this.$t("auth.couldNotVerifyOTP"),
            type: "error",
          });
          this.loading = false;
        }
      } catch (error) {
        ElNotification({
          title: "",
          message: this.$t("auth.couldNotVerifyOTP"),
          type: "error",
        });
        this.loading = false;
      }
    },
    redirect() {
      if (localStorage.OTPRedirectUrl === "otp/signUp") {
        this.clearInput();
        this.loading = false;
        this.$router.push("/auth/complete-signup");
      } else {
        this.getUsersDetails();
      }
    },
    getUsersDetails() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.businessId}/user`,
      }).then((response) => {
        this.clearInput();
        this.loading = false;
        if (response.status === 200) {
          this.setUserDetails(response.data.data.user);
          localStorage.user = JSON.stringify(response.data.data.user);
          if (
            response.data.data.user.first_name &&
            response.data.data.user.last_name &&
            response.data.data.user.phone_number
          ) {
            this.$router.push("/");
          } else {
            this.$router.push("/auth/complete-signup");
          }
        }
      });
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
.resend-code-otp-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 20px;
  margin-bottom: 20px;
}
.resend-code-otp {
  color: #324ba8;
  cursor: pointer;
  background-color: transparent;
  background-repeat: no-repeat;
  border: none;
  overflow: hidden;
  outline: none;
}
.disabled-resend-code-otp {
  color: #606266 !important;
  pointer-events: none;
}
.otp-input {
  margin-bottom: 0px !important;
}
.didnt-recieve-code {
  font-weight: 100 !important;
  margin-right: 5px;
  color: #606266 !important;
}
</style>
