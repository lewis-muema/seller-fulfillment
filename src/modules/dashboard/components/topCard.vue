<template>
  <div>
    <v-row class="desktop-dashboard-upper-content">
      <v-col cols="11">
        <v-card variant="outlined" class="desktop-dashboard-upper-card">
          <v-row>
            <v-col cols="12" md="3" v-for="(order, i) in orders" :key="i">
              <v-list class="dashboard-cards" lines="two">
                <v-list-item @click="$router.push(order.link)">
                  <v-icon
                    :icon="order.icon"
                    :color="order.color"
                    class="mr-3 desktop-dashboard-icon"
                  ></v-icon>
                  <v-list-item-header>
                    <v-list-item-title class="count">
                      <span :class="getLoader">
                        {{ order.count }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-subtitle class="desktop-dashboard-subtitle">
                      <span :class="getLoader">
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
            </v-col>
          </v-row>
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
          count: "0",
          orderStatus: "dashboard.completedPickups",
          link: `/deliveries/sendy/Completed/${new Date().valueOf()}`,
          color: "#5287EE",
        },
        {
          icon: "mdi-check-all",
          count: "6",
          orderStatus: "dashboard.completedOrders",
          link: `/deliveries/customer/Completed/${new Date().valueOf()}`,
          color: "#84CC8C",
        },
        {
          icon: "mdi-home-city",
          count: "32",
          orderStatus: "dashboard.availableStock",
          link: "/inventory/stock-levels",
          color: "#324BA8",
        },
        {
          icon: "mdi-archive",
          count: "4",
          orderStatus: "dashboard.itemsOutOfStock",
          link: "/inventory/stock-levels/noStock",
          color: "#CC6100",
        },
      ],
      ongoing: "",
    };
  },
  watch: {
    "$store.state.loader": function loader(val) {
      if (val === "") {
        this.orders[0].count = this.ongoingOrders;
        this.orders[1].count = this.completedOrders;
        this.orders[2].count = this.availableStock;
        this.orders[3].count = this.outOfStock;
      }
    },
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getUserDetails",
      "getStockStatistics",
      "getDeliveriesStatisticsToday",
      "getConsignmentStatisticsToday",
    ]),
    ongoingOrders() {
      return this.getConsignmentStatisticsToday.ORDER_COMPLETED;
    },
    completedOrders() {
      return this.getDeliveriesStatisticsToday.ORDER_COMPLETED;
    },
    availableStock() {
      return this.getStockStatistics.available_products;
    },
    outOfStock() {
      return this.getStockStatistics.out_of_stock_products;
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
