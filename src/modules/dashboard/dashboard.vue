<template>
  <div class="dashbard-container">
    <div v-if="onboardingStatus">
      <onboarding />
    </div>
    <div v-else>
      <wallet-banner class="dashboard-payment-banner first-element" />
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
          <quick-links class="v-step-1" />
          <dashboard-tabs-content />
        </v-col>
        <v-col cols="3">
          <wallet-balance class="v-step-2" />
          <side-card class="v-step-4" />
          <articles class="v-step-5" />
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
import introJs from "intro.js";
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
    introJs()
      .setOptions({
        steps: [
          {
            title: "Welcome to the new homescreen",
            intro: "Let’s checkout what we have changed",
          },
          {
            title: "Choose your action here",
            element: document.querySelector(".v-step-1"),
            intro: "Click on any item to select",
            position: "bottom",
          },
          {
            title: "View your account balance!",
            element: document.querySelector(".v-step-2"),
            intro: "Click to access your wallet",
          },
          {
            title: "Track Ongoing On-demand deliveries",
            element: document.querySelector(
              ".dashboard-deliveries-tab-section"
            ),
            intro: "Click to display list of the on-demand deliveries",
          },
          {
            title: "View stats summary",
            element: document.querySelector(".v-step-4"),
            intro:
              "The stats have moved here. Select a category to view full details.",
            position: "left",
          },
          {
            title: "Learn more ways to do more with Sendy",
            element: document.querySelector(".v-step-5"),
            intro: "Discover offers and products",
            position: "left",
          },
        ],
        tooltipClass: "introjs-tooltip",
        showBullets: false,
      })
      .start();
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
.introjs-tooltip {
  background-color: #ffffff !important;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
  min-width: 350px !important;
}
.introjs-tooltip .introjs-tooltip-title {
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 19px;
  line-height: 24px;
  color: #303133;
  padding-top: 20px;
}
.introjs-tooltip .introjs-tooltiptext {
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #909399 !important;
}
.introjs-tooltip .introjs-nextbutton {
  background: #324ba8;
  border-radius: 6px;
  text-shadow: none;
  color: white;
  border: none;
  float: left;
  box-sizing: unset !important;
}
.introjs-tooltip .introjs-tooltipbuttons {
  border-top: none;
}
.introjs-tooltip .introjs-prevbutton {
  display: none;
}
.introjs-tooltip .introjs-skipbutton {
  border-radius: 50%;
  font-size: 20px;
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}
</style>
