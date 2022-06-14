<template>
  <div>
    <div id="google-signin-btn"></div>
  </div>
</template>

<script>
import googleAuthInit from "../../mixins/google-auth";

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
      console.log(response);
    },
  },
};
</script>

<style></style>
