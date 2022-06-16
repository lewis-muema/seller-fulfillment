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
    // this.initGA();
    this.initiateGA(this.googleClientId);
  },
  methods: {
    ...mapMutations(["setGoogleUserData"]),
    handleCredentialResponse(response) {
      let googleUserData = jwt_decode(response.credential);
      this.setGoogleUserData(googleUserData);
      this.$router.push("/auth/confirm-info");
    },
  },
};
</script>

<style></style>
