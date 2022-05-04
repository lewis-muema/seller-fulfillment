<template>
  <div>
    <v-container>
      <span class="">
        <h5>Welcome Irene</h5>
        <p>Here's what's happening to your account today.</p>
      </span>
      <v-row>
        <v-col cols="12" md="12">
          <v-card variant="outlined" class="desktop-dashboard-upper-card">
            <v-row>
              <v-col cols="12" md="3" v-for="(order, i) in orders" :key="i">
                <div class="d-flex">
                  <div class="d-flex flex-d">
                    <v-icon class="desktop-dashboard-icon">{{
                      order.icon
                    }}</v-icon>
                    <span class="desktop-dashboard-orders">
                      <div class="count">{{ order.count }}</div>
                      <div class="orders">{{ order.orderStatus }}</div>
                    </span>
                  </div>
                  <v-divider vertical></v-divider>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="9">
          <v-card
            variant="outlined"
            class="desktop-dashboard-upper-card pa-5"
            height="500"
          >
            <dashboard-tabs />
          </v-card>
        </v-col>
        <v-col cols="3">
          <div style="color: #303133">Quick Links</div>
          <v-card
            class="mt-3 desktop-quick-links-card"
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
export default {
  components: { dashboardTabs },
  data() {
    return {
      tab: null,
      orders: [
        {
          icon: "mdi-truck",
          count: "3",
          orderStatus: "Ongoing orders",
        },
        {
          icon: "mdi-check-all",
          count: "6",
          orderStatus: "Completed orders",
        },
        {
          icon: "mdi-archive",
          count: "4",
          orderStatus: "Items out of Stock",
        },
        {
          icon: "mdi-credit-card-outline",
          count: "560",
          orderStatus: "Amount due",
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
};
</script>

<style>
.desktop-dashboard-upper-card {
  border-color: #e2e7ed;
  height: 110px;
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
  color: #5287ee;
  margin: 0px 10px 0px 0px;
}
.desktop-dashboard-orders > .count {
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
}
.desktop-dashboard-orders > .orders {
  font-size: 13px;
  font-weight: normal;
  color: #606266;
}
.flex-d {
  padding: 20px 30px;
  margin-top: 5px;
}
.v-divider {
  height: 60px !important;
}
</style>
