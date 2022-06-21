<template>
  <div class="desktop-dashboard-tab">
    <p>{{ $t("dashboard.ongoingDeliveries") }}</p>
    <div class="desktop-dashboard-tab-container">
      <div
        class="dashboard-deliveries-tab"
        v-for="tab in tabs"
        :key="tab.label"
        :label="tab.label"
      >
        <div
          class="dashboard-deliveries-tab-section"
          @click="setTab(tab)"
          :class="activeTab === tab.label ? 'active' : ''"
        >
          {{ tab.label }}
          <v-badge
            color="#FBDF9A"
            text-color="#7F3B02"
            :content="`${tab.content}`"
            inline
          ></v-badge>
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
          label: "To your Customers",
          content: "-",
        },
        {
          label: "To Sendy",
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
  },
  computed: {
    ...mapGetters(["getDashboardSelectedTab"]),
    activeTab() {
      return this.getDashboardSelectedTab;
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
  cursor: pointer;
  color: #909399;
  font-size: 14px;
  font-weight: 500;
  padding: 5px 10px;
}
.desktop-dashboard-tab-container {
  display: grid;
  grid-template-columns: 20% 20%;
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
</style>
