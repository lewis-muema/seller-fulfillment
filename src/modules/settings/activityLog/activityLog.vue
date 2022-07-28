<template>
  <div>
    Params - {{ params }}
    {{ user }}
    {{ getUserChanged }}
    Range - {{ getRangeChanged }}
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
  },
  computed: {
    ...mapGetters([
      "getStorageUserDetails",
      "getUserChanged",
      "getRangeChanged",
    ]),
    limitParams() {
      return this.getUserChanged === true && this.getRangeChanged === true
        ? `&lower_limit_date=${moment(this.range[0]).format(
            "YYYY-MM-DD"
          )}&upper_limit_date=${moment(this.range[1]).format("YYYY-MM-DD")}`
        : `?lower_limit_date=${moment(this.range[0]).format(
            "YYYY-MM-DD"
          )}&upper_limit_date=${moment(this.range[1]).format("YYYY-MM-DD")}`;
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
    ...mapActions(["filterActivityLogs"]),
    async rangeChanged(val) {
      this.setRangeChanged(true);
      console.log(val);
      if (val) {
        this.range = val;
        this.params = this.limitParams;
      } else {
        this.params = "";
      }
      this.filteredUserLogs();
    },
    userChanged(val) {
      this.setUserChanged(true);
      this.user = val;
      this.filteredUserLogs();
    },
    async filteredUserLogs() {
      try {
        const fullPayload = {
          app: process.env.FULFILMENT_SERVER,
          endpoint:
            this.getUserChanged === true
              ? `seller/${this.getStorageUserDetails.business_id}/useractionlogs/?user_id=${this.user}`
              : this.getRangeChanged === true
              ? `seller/${this.getStorageUserDetails.business_id}/useractionlogs/${this.params}`
              : this.getUserChanged === true && this.getRangeChanged === true
              ? `seller/${this.getStorageUserDetails.business_id}/useractionlogs/?user_id=${this.user}${this.params}`
              : "",
        };
        console.log(fullPayload);
        this.setLoader("loading-text");
        const response = await this.filterActivityLogs(fullPayload);
        console.log("response", response);
        this.setLogsFiltered(true);
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
