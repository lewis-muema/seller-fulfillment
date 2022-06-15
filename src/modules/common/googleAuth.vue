<template>
  <div>
    <div id="google-signin-btn"></div>
  </div>
</template>

<script>
import googleAuthInit from "../../mixins/google-auth";
import jwt_decode from "jwt-decode";

export default {
  mixins: [googleAuthInit],
  computed: {
    googleClientId() {
      return process.env.GOOGLE_CLIENT_ID;
    },
  },
  mounted() {
    this.initiateGA(this.googleClientId);
  },
  methods: {
    handleCredentialResponse(response) {
      let userData = jwt_decode(response.credential);
      this.$emit("userData", userData);
    },
  },
};
</script>

<style></style>
