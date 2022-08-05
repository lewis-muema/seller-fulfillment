<template>
  <div>
    <logs @range="rangeChanged" @user="userChanged" />
  </div>
</template>

<script>
import logs from "./components/logs.vue";
import { mapMutations, mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  components: { logs },
  data() {
    return {
      params: "",
      range: "",
      user: "",
    };
  },
  mounted() {
    this.setComponent("common.activityLog");
    this.filteredUserLogs();
  },
  computed: {
    ...mapGetters([
      "getStorageUserDetails",
      "getUserChanged",
      "getRangeChanged",
    ]),
    filterParams() {
      let params = "";
      switch (true) {
        case this.getUserChanged && this.getRangeChanged:
          params = {
            user_id: this.user,
            lower_limit_date: this.range
              ? moment(this.range[0]).format("YYYY-MM-DD")
              : "",
            upper_limit_date: this.range
              ? moment(this.range[1]).format("YYYY-MM-DD")
              : "",
          };
          break;
        case this.getRangeChanged:
          params = {
            lower_limit_date: this.range
              ? moment(this.range[0]).format("YYYY-MM-DD")
              : "",
            upper_limit_date: this.range
              ? moment(this.range[1]).format("YYYY-MM-DD")
              : "",
          };
          break;
        case this.getUserChanged:
          params = { user_id: this.user };
          break;
        default:
          params = "";
          break;
      }
      for (const key of Object.keys(params)) {
        if (params[key] === "") {
          delete params[key];
        }
      }
      return params;
    },
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setUserChanged",
      "setRangeChanged",
    ]),
    ...mapActions(["activityLogs"]),
    rangeChanged(val) {
      this.setRangeChanged(true);
      if (val) {
        this.range = val;
      } else {
        this.range = "";
      }
      this.filteredUserLogs();
    },
    userChanged(val) {
      this.setUserChanged(true);
      if (val) {
        this.user = val;
      }
      this.filteredUserLogs();
    },
    async filteredUserLogs() {
      this.setLoader({
        type: "logs",
        value: "loading-text",
      });
      try {
        const fullPayload = {
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/useractionlogs`,
          params: this.filterParams,
        };
        const response = await this.activityLogs(fullPayload);
        if (this.$route.path === "/settings/activity-log") {
          this.setLoader({
            type: "logs",
            value: "",
          });
        }
        if (response.message === "list.user.action.logs.success") {
          return response;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
