<template>
  <div>
    <v-card variant="outlined" class="desktop-dashboard-upper-card mt-3">
      <div class="mt-3">
        {{ $t("inventory.todaysStats") }}
      </div>
      <v-row class="desktop-dashboard-upper-content">
        <v-col cols="11">
          <div class="">
            <div class="" v-for="(order, i) in orders" :key="i">
              <v-list class="stats-list-item" lines="two">
                <v-list-item @click="$router.push(order.link)">
                  <v-list-item-header>
                    <v-list-item-title class="">
                      <span
                        :class="getLoader.statistics"
                        class="dashboard-side-card-status"
                      >
                        {{ $t(order.orderStatus) }}
                      </span>
                      <span
                        :class="getLoader.statistics"
                        class="float-right stats-list-count dashboard-side-card-count"
                      >
                        {{ order.count }}
                      </span>
                    </v-list-item-title>
                  </v-list-item-header>
                </v-list-item>
              </v-list>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      name: "Irene",
      orders: [
        {
          icon: "mdi mdi-truck",
          count: 0,
          orderStatus: "dashboard.completedPickups",
          link: `/deliveries/sendy/Completed`,
          color: "#5287EE",
        },
        {
          icon: "mdi-check-all",
          count: 0,
          orderStatus: "dashboard.completedOrders",
          link: `/deliveries/customer/Completed`,
          color: "#84CC8C",
        },
        {
          icon: "mdi-message-alert",
          count: 0,
          orderStatus: "dashboard.failedAttempts",
          link: `/deliveries/customer/Failed`,
          color: "#9b101c",
        },
        {
          icon: "mdi-arrow-down",
          count: 0,
          orderStatus: "dashboard.lowStockItems",
          link: "/inventory/products/lowStock",
          color: "#ee7d00",
        },
        {
          icon: "mdi-archive",
          count: 0,
          orderStatus: "dashboard.itemsOutOfStock",
          link: "/inventory/products/noStock",
          color: "#CC6100",
        },
      ],
      ongoing: "",
    };
  },
  watch: {
    "$store.state.loader": {
      handler(val) {
        if (val !== "") {
          this.orders[0].count = this.completedPickups;
          this.orders[1].count = this.completedOrders;
          this.orders[2].count = this.failedOrders;
          this.orders[3].count = this.lowStock;
          this.orders[4].count = this.outOfStock;
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getUserDetails",
      "getStockStatistics",
      "getDeliveriesStatisticsToday",
      "getConsignmentStatisticsToday",
      "getDashboardSelectedTab",
      "getConsignmentStatistics",
      "getDeliveriesStatistics",
    ]),
    completedPickups() {
      return this.getConsignmentStatistics.ORDER_COMPLETED;
    },
    completedOrders() {
      return this.getDeliveriesStatistics.ORDER_COMPLETED;
    },
    failedOrders() {
      return this.getDeliveriesStatistics.ORDER_FAILED;
    },
    outOfStock() {
      return this.getStockStatistics.out_of_stock_products;
    },
    lowStock() {
      return "_";
    },
  },
  mounted() {},
};
</script>

<style>
.desktop-dashboard-upper-card {
  border-color: #e2e7ed;
  height: auto;
  padding-left: 25px;
  background: white;
}
.desktop-dashboard-icon {
  background: #f1f2f4;
  height: 40px;
  width: 40px;
  display: inline-flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  margin: 0px 10px 0px 0px;
}
.count {
  font-size: 24px !important;
  font-weight: 700;
  line-height: 28px;
}
.v-divider-height {
  height: 40px !important;
  border-color: #c0c4cc !important;
}
.v-divider-last-item {
  height: 40px !important;
  color: transparent !important;
  border: none;
}
.desktop-dashboard-subtitle {
  overflow: visible !important;
  text-overflow: inherit !important;
}
.dashboard-cards .v-list-item {
  padding: 12px 0px !important;
}
.stats-list-item {
  border-bottom: 1px solid #dcdfe6;
  box-shadow: none !important;
  padding: 0px;
}
.stats-list-count {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  text-align: center;
  padding: 0px 15px;
}
.stats-list-item .v-list-item {
  padding: 0px 5px !important;
  min-height: 55px;
}
</style>
