<template>
  <div>
    <div id="g_id_onload" :data-client_id="googleClientId"></div>
    <div
      class="g_id_signin"
      data-size="large"
      data-text="signup_with"
      data-type="standard"
      data-width="100"
    ></div>
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
    this.initGA();
  },
};
</script>

<style></style>
