<template>
  <div>
    <iframe
      :src="iframeUrl"
      frameborder="0"
      width="100%"
      height="900px"
      allowtransparency
    ></iframe>
  </div>
</template>

<script>
import * as jose from "jose";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      iframeUrl: "",
    };
  },
  mounted() {
    this.setComponent("common.analytics");
    this.initalizeDashboard();
  },
  computed: {
    ...mapGetters(["getStorageUserDetails"]),
  },
  methods: {
    ...mapMutations(["setComponent"]),
    async initalizeDashboard() {
      let METABASE_SITE_URL = "https://metabase.sendyit.com";
      const secret = new TextEncoder().encode(process.env.METABASE_KEY);
      let payload = {
        resource: { dashboard: 545 },
        params: {
          business_no: this.getStorageUserDetails.business_id,
        },
        exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
      };
      const alg = "HS256";
      const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer("urn:example:issuer")
        .setAudience("urn:example:audience")
        .setExpirationTime("1h")
        .sign(secret);
      this.iframeUrl =
        METABASE_SITE_URL +
        "/embed/dashboard/" +
        token +
        "#bordered=false&titled=false";
    },
  },
};
</script>

<style></style>
