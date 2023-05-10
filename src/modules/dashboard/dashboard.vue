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
          <quick-links class="dashboard-quicklinks-container" />
          <dashboard-tabs-content />
        </v-col>
        <v-col cols="3">
          <wallet-balance class="dashboard-wallet-container" />
          <side-card class="dashboard-sidecard-container" />
          <articles class="dashboard-articles-container" />
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
import cookieMixin from "@/mixins/cookie_mixin";

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
  mixins: [cookieMixin],
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
        return false;
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
    this.getPointToPointStats();
    this.getPickUpStats();
    this.getStockStats();
    this.allBillingCycle();
    if (JSON.parse(this.getCookie("new_features_virtual_tour"))) {
      this.setOverlayStatus({
        overlay: true,
        popup: "tour",
      });
    }
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
      "setPointToPointStatistics",
      "setConsignmentStatisticsToday",
      "setBillingCycles",
      "setOverlayStatus",
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
    getPointToPointStats() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/point-to-point/statistics`,
      }).then((response) => {
        if (response.status === 200) {
          this.setPointToPointStatistics(
            response.data.data.grouped_by_status_count
          );
        }
      });
    },
  },
};
</script>

<style>
.dashbard-container {
  padding-left: 30px;
  padding-top: 30px;
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
.introjs-tooltip .introjs-tooltip-title > p {
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 19px;
  line-height: 24px;
  color: #303133;
  padding-top: 20px;
}
.introjs-tooltip .introjs-tooltip-title > img {
  width: 320px;
}
.introjs-tooltip .introjs-tooltiptext {
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #909399 !important;
  position: relative;
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
  color: white;
  background-color: #c0c4cc;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 10px !important;
  font-weight: 400;
}
</style>
