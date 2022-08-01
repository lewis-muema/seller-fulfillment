<template>
  <div>
    Params - {{ filterEndpoints }}
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
  // watch: {
  //   "$store.state.rangeChanged": function changeRange(val) {
  //     if (val === true) {
  //       this.setRangeChanged(true);
  //     }
  //   },
  //   "$store.state.userChanged": function changeUser(val) {
  //     if (val === true) {
  //       this.setUserChanged(true);
  //     }
  //   },
  // },
  computed: {
    ...mapGetters([
      "getStorageUserDetails",
      "getUserChanged",
      "getRangeChanged",
    ]),
    limitParams() {
      return this.getUserChanged && this.getRangeChanged
        ? `&lower_limit_date=${moment(this.range[0]).format(
            "YYYY-MM-DD"
          )}&upper_limit_date=${moment(this.range[1]).format("YYYY-MM-DD")}`
        : `?lower_limit_date=${moment(this.range[0]).format(
            "YYYY-MM-DD"
          )}&upper_limit_date=${moment(this.range[1]).format("YYYY-MM-DD")}`;
    },
    filterEndpoints() {
      let endpoint = "";
      switch (true) {
        case this.getUserChanged && this.getRangeChanged:
          endpoint = `seller/${this.getStorageUserDetails.business_id}/useractionlogs/?user_id=${this.user}${this.params}`;
          break;
        case this.getRangeChanged:
          endpoint = `seller/${this.getStorageUserDetails.business_id}/useractionlogs/${this.params}`;
          break;
        case this.getUserChanged:
          endpoint = `seller/${this.getStorageUserDetails.business_id}/useractionlogs/?user_id=${this.user}`;
          break;
        default:
          break;
      }
      return endpoint;
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
          endpoint: this.filterEndpoints,
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
