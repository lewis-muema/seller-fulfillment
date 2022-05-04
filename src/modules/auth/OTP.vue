<template>
  <div>
    <form action="">
      <div class="">
        <v-card-title class="text-center"> Verify Email address</v-card-title>
        <v-card-text class="otp-card">
          <p>Enter the code sent to your email jamesmoves@gmail.com</p>
          <p>Enter code</p>
          <div
            class="d-flex justify-content-center align-items-center container"
          >
            <div class="">
              <div class="d-flex flex-row desktop-otp-inputs">
                <input type="text" class="form-control" autofocus="" /><input
                  type="text"
                  class="form-control"
                /><input type="text" class="form-control" /><input
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <router-link to="/onboarding" class="btn btn-primary"
              >Confirm Code</router-link
            >
          </div>
          <span class=""
            ><p class="mt-4 text-center text-grey">
              Resend code in 120 seconds
            </p></span
          >
        </v-card-text>
      </div>
    </form>
  </div>
</template>

<script>
export default {};
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
</style>
