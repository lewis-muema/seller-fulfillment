<template>
  <div>
    <form action="">
      <v-icon>format_quote</v-icon>
      <div class="desktop-sign-up" v-if="continueSignup">
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
                type="text"
                class="form-control"
                placeholder="Enter name of business"
              />
            </div>
          </div>
          <div class="mb-3">
            <label for="businessEmail" class="form-label">{{
              $t("auth.businessEmailAddress")
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
          <div>
            <label for="businessEmail" class="form-label">{{
              $t("auth.countryOfOperation")
            }}</label>
            <select class="form-select mb-3">
              <option selected v-for="country in countries" :key="country">
                <h1 class="country-flag">
                  <b>{{ country.emoji }}</b>
                </h1>
                &nbsp;
                <span class="country-name">{{ country.name }}</span>
              </option>
            </select>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <button
              class="btn btn-primary b"
              type="button"
              @click="continueSignUp"
            >
              {{ $t("auth.continue") }}
            </button>
            <div class="text-center text-grey">or</div>
            <button class="btn btn-primary default-btn" type="button">
              <i class="mdi mdi-google"></i>
              {{ $t("auth.signupWithGoogle") }}
            </button>
          </div>
          <p class="desktop-login-link login-link-text">
            {{ $t("auth.haveAnAccount") }}
            <router-link to="/auth/sign-in">
              {{ $t("auth.login") }}</router-link
            >
          </p>
        </v-card-text>
      </div>
      <div class="complete-sign-up" v-else>
        <div class="d-flex desktop-header-title">
          <i
            class="mdi mdi-arrow-left"
            aria-hidden="true"
            @click="$router.back()"
          ></i>

          <v-card-title class="text-center">
            {{ $t("auth.completeSignUp") }}
          </v-card-title>
        </div>
        <v-card-text>
          <div class="mb-3">
            <label for="yourName" class="form-label">
              {{ $t("auth.yourName") }}</label
            >
            <div class="form-input-group">
              <i class="mdi mdi-account-circle" aria-hidden="true"></i>
              <input
                type="text"
                class="form-control"
                :placeholder="$t('auth.enterYourPersonalName')"
              />
            </div>
          </div>
          <div class="mb-3">
            <label for="phoneNumber" class="form-label">{{
              $t("auth.phoneNumber")
            }}</label>
            <vue-tel-input
              v-model="phone"
              v-bind="getSendyPhoneProps"
              :input-options="getVueTelInputProps"
            ></vue-tel-input>
          </div>
          <div class="mb-3">
            <label for="industry" class="form-label">{{
              $t("auth.industryOfBusiness")
            }}</label>
            <select class="form-select" aria-label="Default select example">
              <option selected>Select</option>
              <option value="1">Clothing</option>
              <option value="2">Cosmetics</option>
            </select>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <router-link to="/auth/otp" class="btn btn-primary">{{
              $t("auth.signUp")
            }}</router-link>
          </div>
          <p class="desktop-login-link terms-link-text">
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      countries: [
        {
          name: "Kenya",
          code: "KE",
          emoji: "🇰🇪",
          unicode: "U+1F1F0 U+1F1EA",
          image:
            "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KE.svg",
        },

        {
          name: "Uganda",
          code: "UG",
          emoji: "🇺🇬",
          unicode: "U+1F1FA U+1F1EC",
          image:
            "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UG.svg",
        },
        {
          name: "United Nations",
          code: "UN",
          emoji: "🇺🇳",
          unicode: "U+1F1FA U+1F1F3",
          image:
            "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UN.svg",
        },
        {
          name: "United States",
          code: "US",
          emoji: "🇺🇸",
          unicode: "U+1F1FA U+1F1F8",
          image:
            "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/US.svg",
        },
        {
          name: "Uzbekistan",
          code: "UZ",
          emoji: "🇺🇿",
          unicode: "U+1F1FA U+1F1FF",
          image:
            "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UZ.svg",
        },
        {
          name: "South Africa",
          code: "ZA",
          emoji: "🇿🇦",
          unicode: "U+1F1FF U+1F1E6",
          image:
            "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ZA.svg",
        },
      ],
      region: "",
      continueSignup: true,
    };
  },
  computed: {
    ...mapGetters(["getSendyPhoneProps", "getVueTelInputProps"]),
  },
  methods: {
    continueSignUp() {
      this.continueSignup = false;
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
</style>
