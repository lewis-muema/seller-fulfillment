<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div v-if="loaded">
    <v-card>
      <v-layout>
        <sidebar class="sidebar" v-if="!external" />
        <v-main>
          <headers v-if="!external" />
          <accessDeniedScreen v-if="accessDenied" />
          <router-view class="router-view-container" v-else />
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import sidebar from "../../modules/common/sidebar.vue";
import headers from "../../modules/common/headers.vue";
import accessDeniedScreen from "../../modules/common/accessDenied.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  title: "Seller Fulfilment",
  name: "fulfillment",
  components: {
    sidebar,
    headers,
    accessDeniedScreen,
  },
  watch: {
    $route() {
      this.checkAccess();
    },
    "$store.state.userDetails": function userDetails() {
      this.checkAccess();
    },
  },
  computed: {
    ...mapGetters([
      "getExternal",
      "getUserDetails",
      "getUserAccessPermissions",
      "getBusinessDetails",
    ]),
    external() {
      if (this.getExternal.includes(this.$route.path)) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      loaded: false,
      accessDenied: "",
    };
  },
  mounted() {
    setTimeout(() => {
      this.loaded = true;
    }, 100);
  },
  methods: {
    ...mapMutations(["setAccessDenied"]),
    checkAccess() {
      let noAccess = [];
      Object.keys(this.getUserAccessPermissions).forEach((permission) => {
        const accessDenied = this.getUserDetails.user_access_permissions.find(
          (row) => row.permission_id === permission
        );
        if (accessDenied === undefined || !accessDenied.permission_granted) {
          noAccess = noAccess.concat(
            this.getUserAccessPermissions[permission].route
          );
        }
      });
      if (!this.getBusinessDetails?.settings?.consignment_returns_enabled) {
        noAccess = noAccess.concat([
          "/inventory/add-consignment-return-products",
          "/inventory/add-consignment-return-quantities",
          "/inventory/create-consignment-return",
        ]);
      }
      if (
        this.getBusinessDetails?.settings &&
        !this.getBusinessDetails?.settings?.direct_fulfilment_enabled
      ) {
        noAccess = noAccess.concat([
          "/deliveries/direct-deliveries/",
          "/deliveries/track-direct-deliveries/",
          "/direct/create-delivery",
        ]);
      }
      if (!this.getBusinessDetails?.settings?.metabase_analytics_enabled) {
        noAccess = noAccess.concat(["/analytics"]);
      }
      this.setAccessDenied(noAccess);
      this.accessDenied = noAccess.find((row) =>
        this.$route.path.includes(row)
      );
    },
  },
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
.router-view-container {
  height: calc(100vh - 60px);
  overflow-y: scroll;
}
</style>
