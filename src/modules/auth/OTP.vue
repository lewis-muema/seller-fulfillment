<template>
  <div>
    <form action="">
      <div>
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
            <span class="otp-email">{{ email }}</span>
          </p>
          <p>{{ $t("auth.enterCode") }}</p>
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
            <router-link to="/onboarding" class="btn btn-primary">{{
              $t("auth.confirmCode")
            }}</router-link>
          </div>
          <span class=""
            ><p class="mt-4 text-center text-grey">
              {{ $t("auth.resendCode") }}
            </p></span
          >
        </v-card-text>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "jamesmoves@gmail.com",
    };
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
  width: 18px;
  height: 18px;
  color: #5f6368;
  font-size: 30px;
}
.otp-card p {
  font-size: 16px;
}
.otp-card span {
  font-weight: 500;
}
</style>
