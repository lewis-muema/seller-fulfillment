<template>
  <div class="dashbard-container">
    <div v-if="onboardingStatus">
      <onboarding />
    </div>
    <div v-else>
      <top-card />
      <makePayment v-if="activeCycle" />
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
import { mapMutations, mapActions, mapGetters } from "vuex";
import quickLinks from "@/modules/dashboard/components/quickLinks";
import onboarding from "./components/onboarding.vue";
import dashboardTabsContent from "@/modules/dashboard/components/dashboardTabsContent";
import makePayment from "../payments/statements/components/makePayment.vue";
import topCard from "@/modules/dashboard/components/topCard";
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
      "getActivePayment",
      "getAchievements",
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
    this.getDeliveryStats();
    this.getPickUpStats();
    this.getStockStats();
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setActivePayment",
      "setStockStatistics",
      "setDeliveriesStatistics",
      "setConsignmentStatistics",
    ]),
    ...mapActions(["requestAxiosGet"]),
    getActiveCycle() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/paymentrequired`,
      }).then((response) => {
        if (response.status === 200) {
          this.setActivePayment(response.data.data);
        }
      });
    },
    getDeliveryStats() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/deliveries/statistics`,
      }).then((response) => {
        if (response.status === 200) {
          this.setDeliveriesStatistics(
            response.data.data.grouped_by_status_count
          );
        }
      });
    },
    getPickUpStats() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/consignments/statistics`,
      }).then((response) => {
        if (response.status === 200) {
          this.setConsignmentStatistics(
            response.data.data.grouped_by_status_count
          );
        }
      });
    },
    getStockStats() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products/statistics`,
      }).then((response) => {
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
