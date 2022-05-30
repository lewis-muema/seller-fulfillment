<template>
  <div>
    <v-container class="ml-5">
      <span class="">
        <h5>Welcome Irene</h5>
        <p>Here's what's happening to your account today.</p>
      </span>
      <v-row class="desktop-dashboard-upper-content">
        <v-col cols="11">
          <v-card variant="outlined" class="desktop-dashboard-upper-card">
            <v-row>
              <v-col cols="12" md="3" v-for="(order, i) in orders" :key="i">
                <v-list lines="two">
                  <v-list-item>
                    <v-icon
                      :icon="order.icon"
                      :color="order.color"
                      class="mr-3 desktop-dashboard-icon"
                    ></v-icon>
                    <v-list-item-header>
                      <v-list-item-title class="count">{{
                        order.count
                      }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        order.orderStatus
                      }}</v-list-item-subtitle>
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
      <v-row>
        <v-col cols="8" class="">
          <v-card
            variant="outlined"
            class="desktop-dashboard-upper-card pa-5"
            height="500"
          >
            <dashboard-tabs v-if="dashboardTabs === 'To your Customers'">
              <deliveries :deliveries="deliveries" />
            </dashboard-tabs>
            <dashboard-tabs v-else> To Sendy </dashboard-tabs>
          </v-card>
        </v-col>
        <v-col cols="3">
          <div style="color: #303133">Quick Links</div>
          <v-card
            class="mt-3 desktop-quick-links-card q"
            variant="outlined"
            v-for="(link, i) in quickLinks"
            :key="i"
          >
            <span class="d-flex quick-links">
              <v-icon class="desktop-quick-links-icon">{{ link.icon }}</v-icon>
              <router-link to="/" class="router">{{ link.name }}</router-link>
            </span>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import dashboardTabs from "@/modules/dashboard/components/dashboardTabs";
import deliveries from "@/modules/dashboard/components/deliveries";
import { mapGetters } from "vuex";
export default {
  components: { dashboardTabs, deliveries },
  data() {
    return {
      tab: null,
      deliveries: [
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "Package is on the way",
          step: 100,
          color: "#324ba8",
          action: "Track Order",
        },
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "Package is on the way",
          color: "#324ba8",
          step: 70,
          action: "Track Order",
        },
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "We will attempt delivery Tomorrow",
          color: "red",
          step: 100,
          action: "Track Order",
        },
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "We are processing your order",
          color: "#324ba8",
          step: 20,
          action: "Track Order",
        },
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "Package has been delivered",
          color: "#324ba8",
          step: 100,
          action: "Track Order",
        },
      ],
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
      quickLinks: [
        {
          icon: "mdi-truck",
          name: "Deliver to a customer",
          path: "/deliveries/customer",
        },
        {
          icon: "mdi-home-city",
          name: "Send inventory to Sendy",
          path: "/deliveries/sendy",
        },
        {
          icon: "mdi-plus-thick",
          name: "Add Products",
          path: "/deliveries/customer",
        },
      ],
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.dashboard"));
  },
  computed: {
    ...mapGetters(["getDashboardSelectedTab"]),
    dashboardTabs() {
      return this.getDashboardSelectedTab;
    },
  },
};
</script>

<style>
.desktop-dashboard-upper-card {
  border-color: #e2e7ed;
  height: auto;
}
.desktop-quick-links-card {
  border-color: #e2e7ed;
  height: 48px;
}
.desktop-quick-links-icon {
  height: 16px;
  width: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #324ba8;
  margin: 0px 10px 0px 0px;
}
.quick-links {
  margin: 12px 30px;
}
.quick-links .router {
  margin-top: -2px;
  text-decoration: none;
  color: #324ba8;
  font-size: 13px;
  font-weight: 500;
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
</style>
