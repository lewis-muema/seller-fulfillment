<template>
  <div class="dashbard-container">
    <div v-if="onboardingStatus">
      <onboarding />
    </div>
    <div v-else>
      <span class="">
        <h5>
          {{
            $t("dashboard.welcome", {
              name: `${getUserDetails.first_name}`,
            })
          }}
          🎉
        </h5>
        <p>{{ $t("dashboard.whatsHappening") }}</p>
      </span>
      <makePayment v-if="activeCycle" />
      <top-card />
      <v-row>
        <v-col cols="8" class="">
          <dashboard-tabs-content />
        </v-col>
        <v-col cols="3">
          <quick-links />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { datadogRum } from "@datadog/browser-rum";
import { mapMutations, mapActions, mapGetters } from "vuex";
import quickLinks from "@/modules/dashboard/components/quickLinks";
import onboarding from "./components/onboarding.vue";
import dashboardTabsContent from "@/modules/dashboard/components/dashboardTabsContent";
import makePayment from "../payments/statements/components/makePayment.vue";
import topCard from "@/modules/dashboard/components/topCard";
import moment from "moment";

export default {
  components: {
    topCard,
    quickLinks,
    dashboardTabsContent,
    makePayment,
    onboarding,
  },
  data() {
    return {
      tab: null,
    };
  },
  computed: {
    ...mapGetters([
      "getStorageUserDetails",
      "getUserDetails",
      "getActivePayment",
      "getAchievements",
      "getConsignmentStatistics",
    ]),
    activeCycle() {
      const cycle = this.getActivePayment ? this.getActivePayment : {};
      return Object.keys(cycle).length > 0;
    },
    onboardingStatus() {
      if (Object.values(this.getAchievements).includes(false)) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.setComponent("common.dashboard");
    this.getActiveCycle();
    this.getDeliveryStatsToday();
    this.getPickUpStatsToday();
    this.getDeliveryStats();
    this.getPickUpStats();
    this.getStockStats();
    datadogRum.setUser({
      id: this.getStorageUserDetails.business_id,
      name: this.getStorageUserDetails.business_name,
      email: this.getStorageUserDetails.email,
    });
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setActivePayment",
      "setStockStatistics",
      "setDeliveriesStatistics",
      "setConsignmentStatistics",
      "setDeliveriesStatisticsToday",
      "setConsignmentStatisticsToday",
    ]),
    ...mapActions(["requestAxiosGet"]),
    getActiveCycle() {
      this.setLoader({
        type: "pendingPayment",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/paymentrequired`,
      }).then((response) => {
        this.setLoader({
          type: "pendingPayment",
          value: "",
        });
        if (response.status === 200) {
          this.setActivePayment(response.data.data);
        } else {
          this.setActivePayment({});
        }
      });
    },
    getDeliveryStats() {
      this.setLoader({
        type: "statistics",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/deliveries/statistics`,
      }).then((response) => {
        this.setLoader({
          type: "statistics",
          value: "",
        });
        if (response.status === 200) {
          this.setDeliveriesStatistics(
            response.data.data.grouped_by_status_count
          );
        }
      });
    },
    getDeliveryStatsToday() {
      this.setLoader({
        type: "statistics",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${
          this.getStorageUserDetails.business_id
        }/deliveries/statistics?lower_limit_date=${moment().format(
          "YYYY-MM-DD"
        )}&upper_limit_date=${moment().format("YYYY-MM-DD")}`,
      }).then((response) => {
        this.setLoader({
          type: "statistics",
          value: "",
        });
        if (response.status === 200) {
          this.setDeliveriesStatisticsToday(
            response.data.data.grouped_by_status_count
          );
        }
      });
    },
    getPickUpStats() {
      this.setLoader({
        type: "statistics",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/consignments/statistics`,
      }).then((response) => {
        this.setLoader({
          type: "statistics",
          value: "",
        });
        if (response.status === 200) {
          this.setConsignmentStatistics(
            response.data.data.grouped_by_status_count
          );
        }
      });
    },
    getPickUpStatsToday() {
      this.setLoader({
        type: "statistics",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${
          this.getStorageUserDetails.business_id
        }/consignments/statistics?lower_limit_date=${moment().format(
          "YYYY-MM-DD"
        )}&upper_limit_date=${moment().format("YYYY-MM-DD")}`,
      }).then((response) => {
        this.setLoader({
          type: "statistics",
          value: "",
        });
        if (response.status === 200) {
          this.setConsignmentStatisticsToday(
            response.data.data.grouped_by_status_count
          );
        }
      });
    },
    getStockStats() {
      this.setLoader({
        type: "statistics",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products/statistics`,
      }).then((response) => {
        this.setLoader({
          type: "statistics",
          value: "",
        });
        if (response.status === 200) {
          this.setStockStatistics(
            response.data.data.grouped_by_stock_level_count
          );
        }
      });
    },
  },
};
</script>

<style>
.dashbard-container {
  margin-left: 30px;
  margin-top: 30px;
}
</style>
