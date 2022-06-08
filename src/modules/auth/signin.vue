<template>
  <div>
    <form action="">
      <div class="">
        <v-card-title class="text-center"> Welcome Back </v-card-title>
        <p class="text-grey ml-5">Login to continue</p>
        <div v-if="emailLogin">
          <v-card-text style="height: 510px">
            <div class="mb-5 mt-3">
              <label for="emailAddress" class="form-label"
                >Your email address</label
              >
              <div class="form-input-group">
                <i class="mdi mdi-email-outline"></i>
                <input
                  type="email"
                  class="form-control"
                  placeholder="Enter business email address"
                />
              </div>
            </div>
            <div class="d-grid gap-2 col-12 mx-auto pt-3">
              <router-link to="/auth/otp" class="btn btn-primary"
                >Continue with email address</router-link
              >
              <div class="text-center text-grey">or</div>
              <button
                class="btn btn-primary default-btn"
                type="button"
                @click="phoneNumberLogin"
              >
                <i class="mdi mdi-phone"></i>
                Login with Phone number
              </button>
              <button class="btn btn-primary default-btn" type="button">
                Login with Google
              </button>
            </div>
            <p class="mt-5 text-center">
              Don't have an account?
              <router-link to="/auth/sign-up"> Signup</router-link>
            </p>
          </v-card-text>
        </div>
        <div class="" v-else>
          <v-card-text style="height: 510px">
            <div class="mb-5 mt-3">
              <label for="phoneNumber" class="form-label">Phone Number</label>
              <vue-tel-input
                v-model="phone"
                v-bind="sendyPhoneProps"
                :input-options="vueTelInputProps"
              ></vue-tel-input>
            </div>
            <div class="d-grid gap-2 col-12 mx-auto pt-3">
              <router-link to="/auth/otp" class="btn btn-primary"
                >Continue with phone number</router-link
              >
              <div class="text-center text-grey">or</div>
              <button
                class="btn btn-primary default-btn"
                type="button"
                @click="emailAddressLogin"
              >
                <i class="mdi mdi-email-outline"></i>
                Login with Email address
              </button>
              <button class="btn btn-primary default-btn" type="button">
                <i class="mdi mdi-google"></i>
                Login with Google
              </button>
            </div>
            <p class="mt-5 text-center">
              Don't have an account?
              <router-link to="/auth/sign-up"> Signup</router-link>
            </p>
          </v-card-text>
        </div>
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
</style>
