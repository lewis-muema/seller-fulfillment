<template>
  <div>
    <div id="google-signin-btn"></div>
  </div>
</template>

<script>
import googleAuthInit from "../../mixins/google-auth";
import jwt_decode from "jwt-decode";
import { mapMutations } from "vuex";

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
    ...mapMutations(["setGoogleUserData", "setsignUpwithGoogle"]),
    handleCredentialResponse(response) {
      let googleUserData = jwt_decode(response.credential);
      this.setsignUpwithGoogle(true);
      this.setGoogleUserData(googleUserData);
    },
  },
};
</script>

<style></style>
