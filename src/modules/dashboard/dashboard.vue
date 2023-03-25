<template>
  <div class="dashbard-container">
    <div>
      <!--      <div>A DOM element on your page</div>-->
      <!--      <h2 classes="step-1">Blog Post Title</h2>-->
      <v-tour name="myTour" :steps="steps"></v-tour>
    </div>
    <div v-if="onboardingStatus">
      <onboarding />
    </div>
    <div v-else>
      <wallet-banner class="dashboard-payment-banner" />
      <makePayment />
      <span class="">
        <h5 class="dashboard-welcome-message">
          {{
            $t("dashboard.welcome", {
              name: `${getUserDetails.first_name}`,
            })
          }}
          &#127881;
        </h5>
        <p>{{ $t("dashboard.whatsHappening") }}</p>
      </span>
      <v-row>
        <v-col cols="8" class="">
          <quick-links />
          <dashboard-tabs-content />
        </v-col>
        <v-col cols="3">
          <wallet-balance class="v-step-1" />
          <side-card />
          <articles />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import quickLinks from "@/modules/dashboard/components/quickLinks";
import onboarding from "./components/onboarding.vue";
import dashboardTabsContent from "@/modules/dashboard/components/dashboardTabsContent";
import makePayment from "../payments/statements/components/makePayment.vue";
import sideCard from "@/modules/dashboard/components/sideCard";
import articles from "@/modules/dashboard/components/articles";
import walletBalance from "@/modules/dashboard/components/walletBalance";
import walletBanner from "../payments/wallet/components/walletBanner.vue";
import moment from "moment";

export default {
  components: {
    sideCard,
    articles,
    walletBalance,
    quickLinks,
    dashboardTabsContent,
    makePayment,
    onboarding,
    walletBanner,
  },
  data() {
    return {
      tab: null,
      steps: [
        {
          header: {
            title: "Welcome to the new homescreen",
          },
          target: '[data-tour-step="1"]',
          content: `Let’s checkout what we have changed.`,
        },
        {
          target: ".v-step-1",
          content: `This link will take you to`,
        },
        {
          target: '[data-tour-step="3"]',
          content: `This is a header element. It's big.`,
          params: {
            // tour popup position.
            placement: "bottom",
          },
        },
      ],
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
    this.allBillingCycle();
    this.$tours["myTour"].start();
    // this.introJs().start();
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
      "setBillingCycles",
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
      })
        .then((response) => {
          this.setLoader({
            type: "pendingPayment",
            value: "",
          });
          if (response.status === 200) {
            this.setActivePayment(response.data.data);
          } else {
            this.setActivePayment({});
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    allBillingCycle() {
      this.setLoader({
        type: "billingCycle",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles`,
      }).then((response) => {
        if (response.status === 200) {
          this.setLoader({
            type: "billingCycle",
            value: "",
          });
          this.setBillingCycles(response.data.data.billing_cycles);
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
.dashboard-payment-banner {
  max-width: 92% !important;
  margin: 0px !important;
  margin-bottom: 30px !important;
}
.v-step[data-v-da2d894c] {
  background: none !important;
  color: #000000 !important;
  width: 340px !important;
}
</style>
