<template>
  <div class="customers-tab-container">
    <div class="customers-orders-tab">
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'All' ? 'active-orders-tab' : ''"
      >
        <span
          :class="
            activeTab !== 'All' && getLoader === 'loading-text'
              ? 'inactive-tab'
              : 'customers-orders-tab-section-inner'
          "
          @click="
            activeTab !== 'All' && getLoader === 'loading-text'
              ? nothing()
              : passActiveTab('All')
          "
        >
          {{ $t("inventory.all") }}
        </span>
      </div>
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'Pending' ? 'active-orders-tab' : ''"
      >
        <span
          :class="
            activeTab !== 'Pending' && getLoader === 'loading-text'
              ? 'inactive-tab'
              : 'customers-orders-tab-section-inner'
          "
          @click="
            activeTab !== 'Pending' && getLoader === 'loading-text'
              ? nothing()
              : passActiveTab('Pending')
          "
        >
          {{ $t("deliveries.pending") }}
          <v-badge
            color="#FBDF9A"
            text-color="#7F3B02"
            :content="pending"
            inline
          ></v-badge>
        </span>
      </div>
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'inTransit' ? 'active-orders-tab' : ''"
      >
        <span
          :class="
            activeTab !== 'inTransit' && getLoader === 'loading-text'
              ? 'inactive-tab'
              : 'customers-orders-tab-section-inner'
          "
          @click="
            activeTab !== 'inTransit' && getLoader === 'loading-text'
              ? nothing()
              : passActiveTab('inTransit')
          "
        >
          {{ $t("deliveries.inTransit") }}
          <v-badge
            color="#B8F5A8"
            text-color="#7F3B02"
            :content="transit"
            inline
          ></v-badge>
        </span>
      </div>
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'Failed' ? 'active-orders-tab' : ''"
      >
        <span
          :class="
            activeTab !== 'Failed' && getLoader === 'loading-text'
              ? 'inactive-tab'
              : 'customers-orders-tab-section-inner'
          "
          @click="
            activeTab !== 'Failed' && getLoader === 'loading-text'
              ? nothing()
              : passActiveTab('Failed')
          "
        >
          {{ $t("deliveries.failed") }}
          <v-badge
            color="#9B101C"
            text-color="white"
            :content="failed"
            inline
          ></v-badge>
        </span>
      </div>
      <div
        class="customers-orders-tab-section"
        :class="activeTab === 'Completed' ? 'active-orders-tab' : ''"
      >
        <span
          :class="
            activeTab !== 'Completed' && getLoader === 'loading-text'
              ? 'inactive-tab'
              : 'customers-orders-tab-section-inner'
          "
          @click="
            activeTab !== 'Completed' && getLoader === 'loading-text'
              ? nothing()
              : passActiveTab('Completed')
          "
        >
          {{ $t("deliveries.completed") }}
          <v-badge
            color="#324BA8"
            text-color="white"
            :content="completed"
            inline
          ></v-badge>
        </span>
      </div>
    </div>
    <div>
      <v-btn
        class="customers-deliver-btn"
        color="#324BA8"
        text-color="white"
        size="default"
        @click="
          $router.push('/inventory/send-inventory/customer/select-products')
        "
        >{{ $t("deliveries.deliverToACustomer") }}</v-btn
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
      this.pending =
        parseInt(this.getDeliveriesStatistics.ORDER_RECEIVED) +
        parseInt(this.getDeliveriesStatistics.ORDER_IN_PROCESSING)
          ? (
              parseInt(this.getDeliveriesStatistics.ORDER_RECEIVED) +
              parseInt(this.getDeliveriesStatistics.ORDER_IN_PROCESSING)
            ).toString()
          : "0";
      this.transit = this.getDeliveriesStatistics.ORDER_IN_TRANSIT
        ? this.getDeliveriesStatistics.ORDER_IN_TRANSIT.toString()
        : "0";
      this.failed = this.getDeliveriesStatistics.ORDER_FAILED
        ? this.getDeliveriesStatistics.ORDER_FAILED.toString()
        : "0";
      this.completed = this.getDeliveriesStatistics.ORDER_COMPLETED
        ? this.getDeliveriesStatistics.ORDER_COMPLETED.toString()
        : "0";
    },
    "$store.state.tab": function tab(val) {
      this.passActiveTab(val);
    },
  },
  computed: {
    activeTab() {
      return this.getTab;
    },
    ...mapGetters([
      "getTab",
      "getDeliveriesStatistics",
      "getLoader",
      "getTabStatuses",
    ]),
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab", "setTabStatus"]),
    passActiveTab(tab) {
      this.setTab(tab);
      this.setTabStatus(this.getTabStatuses[tab]);
    },
    nothing() {},
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
  margin-top: 45px !important;
}
.customers-deliver-btn {
  float: right;
  margin-right: 25px;
  text-transform: inherit;
  font-size: 14px;
  letter-spacing: 0px;
  margin-top: 10px;
  margin-bottom: 0px;
}
.customers-orders-tab-section {
  width: max-content;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 2px solid #c0c4cc8a;
}
</style>
