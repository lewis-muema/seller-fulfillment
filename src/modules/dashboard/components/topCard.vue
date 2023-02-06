<template>
  <div>
    <v-row class="desktop-dashboard-upper-content">
      <v-col cols="11">
        <v-card variant="outlined" class="desktop-dashboard-upper-card">
          <div class="row">
            <div class="col" v-for="(order, i) in orders" :key="i">
              <v-list class="dashboard-cards" lines="two">
                <v-list-item @click="$router.push(order.link)">
                  <v-icon
                    :icon="order.icon"
                    :color="order.color"
                    class="mr-3 desktop-dashboard-icon"
                  ></v-icon>
                  <v-list-item-header>
                    <v-list-item-title class="count">
                      <span :class="getLoader.statistics">
                        {{ order.count }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-subtitle class="desktop-dashboard-subtitle">
                      <span :class="getLoader.statistics">
                        {{ $t(order.orderStatus) }} >
                      </span>
                    </v-list-item-subtitle>
                  </v-list-item-header>
                  <v-divider
                    :class="
                      order.orderStatus === 'dashboard.itemsOutOfStock'
                        ? 'v-divider-last-item'
                        : 'v-divider-height'
                    "
                    vertical
                  ></v-divider>
                </v-list-item>
              </v-list>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
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
          orderStatus: "dashboard.failedOrders",
          link: `/deliveries/customer/Failed`,
          color: "#9b101c",
        },
        {
          icon: "mdi-arrow-down",
          count: 0,
          orderStatus: "dashboard.lowStockItems",
          link: "",
          color: "#ee7d00",
        },
        {
          icon: "mdi-archive",
          count: 0,
          orderStatus: "dashboard.itemsOutOfStock",
          link: "/inventory/stock-levels/noStock",
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
.dashboard-cards {
  box-shadow: none !important;
}
.desktop-dashboard-subtitle {
  overflow: visible !important;
  text-overflow: inherit !important;
}
</style>
