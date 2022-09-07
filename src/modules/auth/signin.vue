<template>
  <div>
    <form action="" @submit.prevent>
      <div class="sign-in-card">
        <v-card-title class="text-center">
          {{ $t("auth.welcomeBack") }}</v-card-title
        >
        <p class="text-grey ml-5">{{ $t("auth.loginToContinue") }}</p>
        <div class="auth-error-container" v-if="isSendyEmail">
          <i class="mdi mdi-alert-circle-outline auth-error-warning-icon"></i>
          <div>
            <p class="auth-error-title">
              {{ $t("auth.emailNotRegisteredUnderSendy") }}
              <router-link to="/auth/sign-up" class="login-url">
                {{ $t("auth.signUp") }}</router-link
              >
            </p>
          </div>
        </div>
        <div v-if="emailLogin">
          <v-card-text>
            <div class="mb-5 mt-3">
              <label for="emailAddress" class="form-label">{{
                $t("auth.yourEmailAddress")
              }}</label>
              <div class="form-input-group">
                <i class="mdi mdi-email-outline"></i>
                <input
                  v-model="params.emailAddress"
                  type="email"
                  class="form-control"
                  :placeholder="$t('auth.enterBusinessEmailAddress')"
                />
                <div v-if="v$.params.emailAddress.$error" class="error-msg">
                  {{ $t("auth.businessEmailRequired") }}
                </div>
              </div>
            </div>
            <div class="d-grid gap-2 col-12 mx-auto pt-3">
              <button
                type="submit"
                class="btn btn-primary"
                @click="emailLLogin"
                v-loading="loading"
                :class="loading ? 'disabled' : ''"
                style="height: 46px"
              >
                {{ $t("auth.continueWithEmailAddress") }}
              </button>
              <div class="text-center text-grey">or</div>
              <!-- <button
                class="btn btn-primary default-btn"
                type="button"
                @click="phoneNumberLogin"
                style="height: 46px"
              >
                <i class="mdi mdi-phone"></i>
                {{ $t("auth.loginWithPhoneNumber") }}
              </button> -->

              <!-- <google-auth /> -->
            </div>
          </v-card-text>
        </div>
        <div class="" v-else>
          <v-card-text>
            <div class="mb-5 mt-3">
              <label for="phoneNumber" class="form-label">{{
                $t("auth.phoneNumber")
              }}</label>
              <vue-tel-input
                v-model="phone"
                v-bind="getSendyPhoneProps"
                :input-options="getVueTelInputProps"
              ></vue-tel-input>
            </div>
            <div class="d-grid gap-2 col-12 mx-auto pt-3">
              <router-link to="/auth/otp" class="btn btn-primary">{{
                $t("auth.continueWithPhoneNo")
              }}</router-link>
              <div class="text-center text-grey">{{ $t("auth.or") }}</div>
              <button
                class="btn btn-primary default-btn"
                type="submit"
                @click="emailAddressLogin"
              >
                <i class="mdi mdi-email-outline"></i>
                {{ $t("auth.loginWithEmailAddress") }}
              </button>
              <!-- <google-auth /> -->
            </div>
          </v-card-text>
        </div>
        <p class="text-center mt-3 signup-link-text">
          {{ $t("auth.dontHaveAnAccount") }}
          <router-link to="/auth/sign-up"> {{ $t("auth.signUp") }}</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ElNotification } from "element-plus";
import eventsMixin from "../../mixins/events_mixin";
// import googleAuth from "@/modules/common/googleAuth";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  mixins: [eventsMixin],
  data() {
    return {
      loading: false,
      emailLogin: true,
      params: {
        emailAddress: "",
      },
    };
  },
  validations() {
    return {
      params: {
        emailAddress: { required },
      },
    };
  },
  computed: {
    ...mapGetters(["getSendyPhoneProps", "getVueTelInputProps", "getErrors"]),
    isSendyEmail() {
      return this.getErrors.message === "useridentifier.notfound";
    },
  },
  mounted() {
    localStorage.clear();
  },
  methods: {
    ...mapActions(["loginUser"]),
    ...mapMutations(["setOTPRedirectUrl", "setBizDetails"]),
    phoneNumberLogin() {
      this.emailLogin = false;
    },
    async emailLLogin() {
      this.emailLogin = true;
      this.v$.$validate();
      if (this.v$.$errors.length > 0) {
        return;
      }
      this.loading = true;
      const payload = {
        email: this.params.emailAddress,
      };

      const fullPayload = {
        app: process.env.FULFILMENT_SERVER,
        values: payload,
        endpoint: "seller/business/signin",
      };
      try {
        const data = await this.loginUser(fullPayload);
        if (data.status === 200) {
          this.setBizDetails(data.data.data);
          localStorage.userDetails = JSON.stringify(data.data.data);
          localStorage.OTPRedirectUrl = "otp/signIn";
          this.loading = false;
          this.setOTPRedirectUrl("otp/signIn");
          this.$router.push("/auth/otp");
          this.sendSegmentEvents({
            event: "Sign_in",
            data: {
              userId: data.data.data.business.business_id,
              email: this.params.emailAddress,
              clientType: "web",
              device: "desktop",
            },
          });
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        if (!this.isSendyEmail) {
          ElNotification({
            title: this.getErrors.message.replaceAll(".", " "),
            message: "",
            type: "error",
          });
        }
      }
    },
  },
};
</script>

<style>
.default-btn .mdi-phone {
  color: #909399 !important;
  padding-right: 5px;
}
.signup-link-text {
  margin-bottom: 80px;
}
.signup-link-text > a {
  color: #324ba8;
}
.sign-in-card {
  padding: 0px 40px;
}
</style>
