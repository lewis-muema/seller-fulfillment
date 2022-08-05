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
        v-for="tab in tabs"
        :key="tab.label"
        :label="tab.label"
      >
        <div
          class="dashboard-deliveries-tab-section"
          :class="activeTab === tab.label ? 'active' : ''"
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
        if (val.consignments === "" || val.deliveries === "") {
          this.tabs[0].content = this.ongoingDeliveries
            ? this.ongoingDeliveries
            : 0;
          this.tabs[1].content = this.ongoingConsignments
            ? this.ongoingConsignments
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
    ]),
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
.dashboard-deliveries-tab-section-inner {
  cursor: pointer;
}
.desktop-dashboard-tab-container {
  display: grid;
  grid-template-columns: 190px 190px;
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
