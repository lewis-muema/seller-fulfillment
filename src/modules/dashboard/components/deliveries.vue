<template>
  <div class="deliveries-container">
    <div class="deliveries-container-inner" v-if="deliveries.length">
      <v-table class="">
        <thead>
          <tr>
            <th class="text-left table-headers">
              {{
                getSelectedTab === "To your Customers"
                  ? "Customer info"
                  : "Products"
              }}
            </th>
            <th class="text-left table-headers">
              {{ $t("dashboard.progress") }}
            </th>
            <th class="text-left table-headers">
              {{ $t("dashboard.action") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(delivery, index) in deliveries" :key="index">
            <td>
              <v-list-item lines="two">
                <v-list-item-header>
                  <v-list-item-title>
                    <span :class="getLoader">
                      {{
                        getSelectedTab === "To your Customers"
                          ? delivery.customerName
                          : delivery.productName
                      }}
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle
                    class="dashboard-customer-delivery-location"
                  >
                    <span :class="getLoader"
                      >{{
                        getSelectedTab === "To your Customers"
                          ? delivery.customerDeliveryLocation
                          : "other items"
                      }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-header>
              </v-list-item>
            </td>
            <td>
              <v-list-item lines="two">
                <v-list-item-header>
                  <v-list-item-title>
                    <span :class="getLoader">
                      {{ delivery.progress }}
                    </span>
                  </v-list-item-title>
                  <v-progress-linear
                    :model-value="delivery.step"
                    :color="delivery.color"
                    rounded
                    height="7"
                  ></v-progress-linear>
                </v-list-item-header>
              </v-list-item>
            </td>
            <td>
              <router-link
                to="/deliveries/tracking"
                class="dashboard-track-order"
              >
                <span :class="getLoader">
                  {{ delivery.action }}
                </span>
              </router-link>
            </td>
          </tr>
        </tbody>
      </v-table>
      <div class="show-more-deliveries-link">
        <router-link to="/" class="show-more-deliveries-link"
          >{{ $t("dashboard.showMoreDeliveries")
          }}<v-icon>mdi mdi-arrow-right</v-icon></router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["deliveries", "selectedTab"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getDashboardSelectedTab", "getLoader"]),
    getSelectedTab() {
      return this.selectedTab;
    },
  },
};
</script>

<style>
.dashboard-track-order {
  color: #324ba8;
  font-weight: 500;
  text-decoration: none;
}
.dashboard-customer-delivery-location {
  font-weight: 100 !important;
  color: #909399;
}
.show-more-deliveries-link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}
.show-more-deliveries-link a {
  color: #324ba8;
  background: rgba(211, 221, 246, 0.5);
  padding: 5px 10px;
  border-radius: 15px;
  text-decoration: none;
}
.send-inventory-to-sendy-container {
  display: flex;
  flex-direction: column;
  justify-content: center !important;
  align-items: center;
}
.send-inventory-to-sendy-link a {
  color: #324ba8;
  text-decoration: none;
}
.deliveries-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80%;
}
.deliveries-container-inner {
  width: 100%;
}
</style>
