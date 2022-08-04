<template>
  <div>
    <!-- Params - {{ filterParams }}
    RangeChanged - {{ getRangeChanged }}
    userChanged - {{ getUserChanged }} -->
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
            lower_limit_date: moment(this.range[0]).format("YYYY-MM-DD"),
            upper_limit_date: moment(this.range[1]).format("YYYY-MM-DD"),
          };
          break;
        case this.getRangeChanged:
          params = {
            lower_limit_date: moment(this.range[0]).format("YYYY-MM-DD"),
            upper_limit_date: moment(this.range[1]).format("YYYY-MM-DD"),
          };
          break;
        case this.getUserChanged:
          params = { user_id: this.user };
          break;
        default:
          params = "";
          break;
      }
      return params;
    },
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setLogsFiltered",
      "setUserChanged",
      "setRangeChanged",
    ]),
    ...mapActions(["activityLogs"]),
    rangeChanged(val) {
      this.setRangeChanged(true);
      if (val) {
        this.range = val;
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
      try {
        const fullPayload = {
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/useractionlogs`,
          params: this.filterParams,
        };
        this.setLoader("loading-text");
        const response = await this.activityLogs(fullPayload);
        this.setLoader("");
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
