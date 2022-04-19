<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <v-card>
      <v-layout>
        <sidebar />
        <v-main style="height: 100vh">
          <headers />
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
  data() {
    return {};
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
</style>
