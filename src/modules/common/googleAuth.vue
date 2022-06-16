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
      let googleUserData = jwt_decode(response.credential);
      this.$emit("googleUserData", googleUserData);
    },
  },
};
</script>

<style></style>
