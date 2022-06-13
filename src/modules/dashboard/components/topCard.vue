<template>
  <div>
    <span class="">
      <h5>{{ $t("dashboard.welcome", { name: name }) }} 🎉</h5>
      <p>{{ $t("dashboard.whatsHappening") }}</p>
    </span>
    <v-row class="desktop-dashboard-upper-content">
      <v-col cols="11">
        <v-card variant="outlined" class="desktop-dashboard-upper-card">
          <v-row>
            <v-col cols="12" md="3" v-for="(order, i) in orders" :key="i">
              <v-list class="dashboard-cards" lines="two">
                <v-list-item>
                  <v-icon
                    :icon="order.icon"
                    :color="order.color"
                    class="mr-3 desktop-dashboard-icon"
                  ></v-icon>
                  <v-list-item-header>
                    <v-list-item-title class="count">
                      <span :class="$store.getters.getLoader">
                        {{ order.count }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <span :class="$store.getters.getLoader">
                        {{ order.orderStatus }}
                      </span>
                    </v-list-item-subtitle>
                  </v-list-item-header>
                  <v-divider
                    :class="
                      order.orderStatus === 'Items out of Stock'
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
export default {
  data() {
    return {
      name: "Irene",
      orders: [
        {
          icon: "mdi mdi-truck",
          count: "3",
          orderStatus: "Ongoing orders",
          color: "#5287EE",
        },
        {
          icon: "mdi-check-all",
          count: "6",
          orderStatus: "Completed orders",
          color: "#84CC8C",
        },
        {
          icon: "mdi-home-city",
          count: "32",
          orderStatus: "Available Stock",
          color: "#324BA8",
        },
        {
          icon: "mdi-archive",
          count: "4",
          orderStatus: "Items out of Stock",
          color: "#CC6100",
        },
      ],
    };
  },
};
</script>

<style>
.desktop-dashboard-upper-card {
  border-color: #e2e7ed;
  height: auto;
  padding-left: 25px;
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
}
.dashboard-cards {
  box-shadow: none !important;
}
</style>
