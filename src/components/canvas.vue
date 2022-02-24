<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <Desktop v-if="!$store.getters.getMobile" />
    <Mobile v-else />
  </div>
</template>

<script>
import Desktop from "./components/desktop.vue";
import Mobile from "./components/mobile.vue";
import moment from "moment";

export default {
  components: { Desktop, Mobile },
  mounted() {
    this.isMobile();
    this.languageListener();
  },
  methods: {
    isMobile() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPod/i)
      ) {
        this.$store.commit("setMobile", true);
      } else {
        this.$store.commit("setMobile", false);
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
