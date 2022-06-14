<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <Desktop v-if="!getMobile" />
    <Mobile v-else />
    <overlays />
  </div>
</template>

<script>
import Desktop from "./components/desktop.vue";
import Mobile from "./components/mobile.vue";
import overlays from "../modules/common/overlays.vue";
import moment from "moment";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: { Desktop, Mobile, overlays },
  watch: {
    "$route.path": function () {
      this.setLoader("loading-text");
    },
  },
  computed: {
    ...mapGetters(["getMobile"]),
  },
  mounted() {
    this.isMobile();
    this.languageListener();
  },
  methods: {
    ...mapMutations(["setLoader", "setMobile"]),
    isMobile() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPod/i)
      ) {
        this.setMobile(true);
      } else {
        this.setMobile(false);
      }
    },
    languageListener() {
      window.addEventListener("language-changed", (event) => {
        this.$i18n.locale = event.detail;
        localStorage.setItem("sellerTimeLocale", event.detail);
        moment.locale(event.detail);
      });
    },
  },
};
</script>

<style></style>
