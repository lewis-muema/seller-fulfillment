<template>
  <div class="desktop-dashboard-tab">
    <p>{{ $t("dashboard.recentDeliveries") }}</p>
    <div class="desktop-dashboard-tab-container">
      <div
        class="dashboard-deliveries-tab"
        :class="
          activeTab !== tab.label &&
          (getLoader.deliveries === 'loading-text' ||
            getLoader.consignments === 'loading-text')
            ? 'inactive-tab'
            : 'active-tab'
        "
        v-for="tab in filteredTabs"
        :key="tab.label"
        :label="tab.label"
      >
        <div
          :class="[
            tab.label === 'common.hiredVehicles'
              ? 'dashboard-deliveries-ondemand-section'
              : 'dashboard-deliveries-tab-section',
            activeTab === tab.label ? 'active' : '',
          ]"
        >
          <span
            class="d-flex"
            @click="
              activeTab !== tab.label &&
              (getLoader.deliveries === 'loading-text' ||
                getLoader.consignments === 'loading-text')
                ? nothing()
                : setTab(tab)
            "
          >
            {{ $t(tab.label) }}
            <v-badge
              color="#FBDF9A"
              text-color="#7F3B02"
              :content="`${tab.content}`"
              inline
            ></v-badge>
          </span>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      currentTab: 0,
      tabs: [
        {
          label: "dashboard.toYourCustomers",
          content: "-",
        },
        {
          label: "dashboard.toSendy",
          content: "-",
        },

        {
          label: "common.hiredVehicles",
          content: "-",
        },
      ],
      deliveries: [
        {
          customerInfo: {
            name: "James Doe",
            location: "Windsor heights",
          },
          progress: {
            label: "Package is on the way",
            step: 0,
          },
          action: "Track order",
        },
      ],
    };
  },
  methods: {
    ...mapMutations(["setDashboardSelectedTab", "setLoader"]),
    setTab(tab) {
      this.setDashboardSelectedTab(tab.label);
    },
    nothing() {},
  },
  watch: {
    "$store.state.loader": {
      handler(val) {
        if (
          val.consignments === "" ||
          val.deliveries === "" ||
          val.onDemandOrders === ""
        ) {
          this.tabs[0].content = this.ongoingDeliveries
            ? this.ongoingDeliveries
            : 0;
          this.tabs[1].content = this.ongoingConsignments
            ? this.ongoingConsignments
            : 0;
          this.tabs[2].content = this.ongoingPointToPointDeliveries
            ? this.ongoingPointToPointDeliveries
            : 0;
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters([
      "getDashboardSelectedTab",
      "getStockStatistics",
      "getDeliveriesStatistics",
      "getConsignmentStatistics",
      "getLoader",
      "getDeliveries",
      "getConsignments",
      "getPointToPointStatistics",
      "getBusinessDetails",
    ]),
    directFulfillmentFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.direct_fulfilment_enabled
        : false;
    },
    filteredTabs() {
      const tabs = [];
      this.tabs.forEach((tab) => {
        if (
          (this.directFulfillmentFlag &&
            tab.label === "common.hiredVehicles") ||
          tab.label !== "common.hiredVehicles"
        ) {
          tabs.push(tab);
        }
      });
      return tabs;
    },
    activeTab() {
      return this.getDashboardSelectedTab;
    },
    ongoingDeliveries() {
      return (
        parseInt(this.getDeliveriesStatistics.ORDER_RECEIVED) +
        parseInt(this.getDeliveriesStatistics.ORDER_IN_PROCESSING) +
        parseInt(this.getDeliveriesStatistics.ORDER_IN_TRANSIT) +
        parseInt(this.getDeliveriesStatistics.ORDER_FAILED) +
        parseInt(this.getDeliveriesStatistics.ORDER_COMPLETED) +
        parseInt(this.getDeliveriesStatistics.ORDER_CANCELED)
      );
    },
    ongoingConsignments() {
      return (
        parseInt(this.getConsignmentStatistics.ORDER_RECEIVED) +
        parseInt(this.getConsignmentStatistics.ORDER_IN_PROCESSING) +
        parseInt(this.getConsignmentStatistics.ORDER_IN_TRANSIT) +
        parseInt(this.getConsignmentStatistics.ORDER_FAILED) +
        parseInt(this.getConsignmentStatistics.ORDER_COMPLETED) +
        parseInt(this.getConsignmentStatistics.ORDER_CANCELED)
      );
    },
    ongoingPointToPointDeliveries() {
      return (
        parseInt(this.getPointToPointStatistics.ORDER_RECEIVED) +
        parseInt(this.getPointToPointStatistics.ORDER_IN_PROCESSING) +
        parseInt(this.getPointToPointStatistics.ORDER_IN_TRANSIT) +
        parseInt(this.getPointToPointStatistics.ORDER_FAILED) +
        parseInt(this.getPointToPointStatistics.ORDER_COMPLETED) +
        parseInt(this.getPointToPointStatistics.ORDER_CANCELED)
      );
    },
  },
};
</script>

<style>
.el-tabs__item.is-active {
  color: #324ba8 !important;
}
.dashboard-deliveries-tab-section {
  width: max-content;
  display: flex;
  color: #909399;
  font-size: 14px;
  font-weight: 500;
  padding: 5px 10px;
}
.dashboard-deliveries-ondemand-section {
  width: max-content;
  display: flex;
  color: #909399;
  font-size: 14px;
  font-weight: 500;
  padding: 5px 10px;
}
.dashboard-deliveries-tab-section-inner {
  cursor: pointer;
}
.desktop-dashboard-tab-container {
  display: grid;
  grid-template-columns: 190px 130px 190px;
  border-bottom: 1px solid #e2e7ed;
}
.desktop-dashboard-tab {
  height: 100%;
}
.dashboard-deliveries-tab {
  display: flex;
  height: 40px;
}
.active {
  color: #324ba8 !important;
  border-bottom: 2px solid #324ba8 !important;
}
.active-tab {
  cursor: pointer !important;
}
.inactive-tab {
  cursor: not-allowed !important;
}
.inactive-tab-inner {
  pointer-events: none;
}
</style>
