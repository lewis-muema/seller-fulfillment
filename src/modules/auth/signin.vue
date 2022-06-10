<template>
  <div>
    <form action="">
      <div class="">
        <v-card-title class="text-center">
          {{ $t("auth.welcomeBack") }}</v-card-title
        >
        <p class="text-grey ml-5">{{ $t("auth.loginToContinue") }}</p>
        <div v-if="emailLogin">
          <v-card-text>
            <div class="mb-5 mt-3">
              <label for="emailAddress" class="form-label">{{
                $t("auth.yourEmailAddress")
              }}</label>
              <div class="form-input-group">
                <i class="mdi mdi-email-outline"></i>
                <input
                  type="email"
                  class="form-control"
                  :placeholder="$t('auth.enterBusinessEmailAddress')"
                />
              </div>
            </div>
            <div class="d-grid gap-2 col-12 mx-auto pt-3">
              <router-link to="/auth/otp" class="btn btn-primary">{{
                $t("auth.continueWithEmailAddress")
              }}</router-link>
              <div class="text-center text-grey">or</div>
              <button
                class="btn btn-primary default-btn"
                type="button"
                @click="phoneNumberLogin"
                style="height: 46px"
              >
                <i class="mdi mdi-phone"></i>
                {{ $t("auth.loginWithPhoneNumber") }}
              </button>
              <button
                class="btn btn-primary default-btn mt-3"
                type="button"
                style="height: 46px"
              >
                {{ $t("auth.loginWithGoogle") }}
              </button>
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
                v-bind="sendyPhoneProps"
                :input-options="vueTelInputProps"
              ></vue-tel-input>
            </div>
            <div class="d-grid gap-2 col-12 mx-auto pt-3">
              <router-link to="/auth/otp" class="btn btn-primary">{{
                $t("auth.continueWithPhoneNo")
              }}</router-link>
              <div class="text-center text-grey">{{ $t("auth.or") }}</div>
              <button
                class="btn btn-primary default-btn"
                type="button"
                @click="emailAddressLogin"
                style="height: 46px"
              >
                <i class="mdi mdi-email-outline"></i>
                {{ $t("auth.loginWithEmailAddress") }}
              </button>
              <button
                class="btn btn-primary default-btn mt-3"
                type="button"
                style="height: 46px"
              >
                <i class="mdi mdi-google"></i>
                {{ $t("auth.loginWithGoogle") }}
              </button>
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
export default {
  data() {
    return {
      emailLogin: true,
    };
  },
  methods: {
    phoneNumberLogin() {
      this.emailLogin = false;
    },
    emailAddressLogin() {
      this.emailLogin = true;
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
</style>
