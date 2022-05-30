<template>
  <div>
    <v-table class="">
      <thead>
        <tr>
          <th class="text-left">
            {{
              getSelectedTab === "To your Customers"
                ? "Customer info"
                : "Products"
            }}
          </th>
          <th class="text-left">Progress</th>
          <th class="text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(delivery, index) in deliveries" :key="index">
          <td>
            <v-list-item lines="two">
              <v-list-item-header>
                <v-list-item-title>{{
                  getSelectedTab === "To your Customers"
                    ? delivery.customerName
                    : delivery.productName
                }}</v-list-item-title>
                <v-list-item-subtitle
                  class="dashboard-customer-delivery-location"
                  >{{
                    getSelectedTab === "To your Customers"
                      ? delivery.customerDeliveryLocation
                      : "other items"
                  }}</v-list-item-subtitle
                >
              </v-list-item-header>
            </v-list-item>
          </td>
          <td>
            <v-list-item lines="two">
              <v-list-item-header>
                <v-list-item-title>{{ delivery.progress }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-progress-linear
                    :model-value="delivery.step"
                    :color="delivery.color"
                    rounded
                    height="7"
                  ></v-progress-linear>
                </v-list-item-subtitle>
              </v-list-item-header>
            </v-list-item>
          </td>
          <td>
            <router-link
              to="/inventory/product-details"
              class="dashboard-track-order"
              >{{ delivery.action }}</router-link
            >
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="show-more-deliveries-link">
      <router-link to="/" class="show-more-deliveries-link"
        >Show more deliveries</router-link
      >
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
    ...mapGetters(["getDashboardSelectedTab"]),
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
}
.show-more-deliveries-link a {
  color: #324ba8;
}
</style>
