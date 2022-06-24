<template>
  <div class="customers-tab-container">
    <div class="customers-orders-tab">
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'All' ? 'active-orders-tab' : ''"
        @click="passActiveTab('All', '')"
      >
        All
      </div>
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'Pending' ? 'active-orders-tab' : ''"
        @click="passActiveTab('Pending', 'ORDER_IN_PROCESSING')"
      >
        {{ $t("deliveries.pending") }}
        <v-badge
          color="#FBDF9A"
          text-color="#7F3B02"
          :content="pending"
          inline
        ></v-badge>
      </div>
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'inTransit' ? 'active-orders-tab' : ''"
        @click="passActiveTab('inTransit', 'ORDER_IN_TRANSIT')"
      >
        {{ $t("deliveries.inTransit") }}
        <v-badge
          color="#B8F5A8"
          text-color="#7F3B02"
          :content="transit"
          inline
        ></v-badge>
      </div>
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'Failed' ? 'active-orders-tab' : ''"
        @click="passActiveTab('Failed', 'ORDER_FAILED')"
      >
        {{ $t("deliveries.failed") }}
        <v-badge
          color="#9B101C"
          text-color="white"
          :content="failed"
          inline
        ></v-badge>
      </div>
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'Completed' ? 'active-orders-tab' : ''"
        @click="passActiveTab('Completed', 'ORDER_COMPLETED')"
      >
        {{ $t("deliveries.completed") }}
        <v-badge
          color="#324BA8"
          text-color="white"
          :content="completed"
          inline
        ></v-badge>
      </div>
    </div>
    <div>
      <v-btn
        class="customers-deliver-btn"
        color="#324BA8"
        text-color="white"
        size="default"
        @click="$router.push('/inventory/send-inventory/sendy/select-products')"
        >{{ $t("deliveries.inventoryToSendy") }}</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data: () => ({
    tab: "All",
    pending: "-",
    transit: "-",
    failed: "-",
    completed: "-",
  }),
  watch: {
    "$store.state.loader": function loader() {
      this.pending = (
        parseInt(this.getConsignmentStatistics.ORDER_RECEIVED) +
        parseInt(this.getConsignmentStatistics.ORDER_IN_PROCESSING)
      ).toString();
      this.transit = this.getConsignmentStatistics.ORDER_IN_TRANSIT.toString();
      this.failed = this.getConsignmentStatistics.ORDER_FAILED.toString();
      this.completed = this.getConsignmentStatistics.ORDER_COMPLETED.toString();
    },
  },
  mounted() {
    this.setTab("All");
  },
  computed: {
    activeTab() {
      return this.getTab;
    },
    ...mapGetters(["getTab", "getConsignmentStatistics"]),
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab", "setTabStatus"]),
    passActiveTab(tab, val) {
      this.setTab(tab);
      this.setTabStatus(val);
    },
  },
};
</script>

<style>
.customers-orders-tab {
  display: flex;
  height: 40px;
  margin-top: auto;
}
.active-orders-tab {
  color: #324ba8 !important;
  border-bottom: 2px solid #324ba8 !important;
}
.customers-tab-container {
  display: grid;
  grid-template-columns: auto auto;
  margin: 0px 30px;
}
.customers-deliver-btn {
  float: right;
  margin: 8px 25px;
  text-transform: inherit;
  font-size: 14px;
  letter-spacing: 0px;
}
.customers-orders-tab-section {
  width: max-content;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 2px solid #c0c4cc8a;
}
</style>