<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div v-if="loaded">
    <v-card>
      <v-layout>
        <sidebar class="sidebar" v-if="!external" />
        <v-main>
          <headers v-if="!external" />
          <router-view />
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import sidebar from "../../modules/common/sidebar.vue";
import headers from "../../modules/common/headers.vue";

export default {
  title: "Seller Fulfilment",
  name: "fulfillment",
  components: {
    sidebar,
    headers,
  },
  computed: {
    external() {
      console.log(this.$route.path);
      if (this.$store.getters.getExternal.includes(this.$route.path)) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.loaded = true;
    }, 100);
  },
  methods: {},
};
</script>

<style>
.side-panel-left {
  height: 100%;
}
.nav-open {
  width: 200px !important;
}
.nav-closed {
  width: 80px !important;
}
.sidebar {
  height: 100vh;
}
</style>
