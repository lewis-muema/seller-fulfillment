<template>
  <div>
    <form action="">
      <div class="desktop-sign-up" v-if="continueSignup">
        <v-card-title class="text-center">
          Sign up for Sendy Fulfilment
        </v-card-title>
        <v-card-text class="pt-5">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Business name</label
            >
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter name of business"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Business email address</label
            >
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter business email address"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Country of Operation</label
            >
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <button
              class="btn btn-primary b"
              type="button"
              @click="continueSignUp"
            >
              Continue
            </button>
            <div class="text-center text-grey">or</div>
            <button class="btn btn-primary default-btn" type="button">
              Sign up with Google
            </button>
          </div>
          <p class="desktop-login-link">
            Already have an account?
            <router-link to="/auth/sign-in"> Login</router-link>
          </p>
        </v-card-text>
      </div>
      <div class="complete-sign-up" v-else>
        <v-card-title class="text-center"> Complete Sign up </v-card-title>
        <v-card-text>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Your name</label>
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter your personal name"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Phone number</label
            >
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter phone number"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Industry of your business</label
            >
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <router-link to="/auth/otp" class="btn btn-primary"
              >SignUp</router-link
            >
          </div>
          <p class="desktop-login-link">
            By signing up you agree to the
            <router-link to="/auth/sign-in"> terms and conditions</router-link>
          </p>
        </v-card-text>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      continueSignup: true,
    };
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
.default-btn {
  background-color: #ffffff !important;
  color: black !important;
  border-color: #e2e7ed !important;
}
.form-control::placeholder {
  color: #dcdfe6;
}
.desktop-login-link {
  padding: 50px 0px 0px 50px;
}
.btn {
  line-height: 1.9 !important;
}
</style>
