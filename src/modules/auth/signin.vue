<template>
  <div>
    <form action="">
      <div class="complete-sign-up">
        <v-card-title class="text-center"> Welcome Back </v-card-title>
        <v-card-text style="height: 510px">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Your email address</label
            >
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter your email address"
            />
          </div>
          <div class="d-grid gap-2 col-12 mx-auto pt-3">
            <router-link to="/auth/otp" class="btn btn-primary"
              >Continue with email address</router-link
            >
            <div class="text-center text-grey">or</div>
            <button
              class="btn btn-primary signup-with-google-btn"
              type="button"
            >
              Login with Phone number
            </button>
            <button
              class="btn btn-primary signup-with-google-btn"
              type="button"
            >
              Login with Google
            </button>
          </div>
          <p class="mt-5 text-center">
            Don't have an account?
            <router-link to="/auth/sign-up"> Signup</router-link>
          </p>
        </v-card-text>
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
