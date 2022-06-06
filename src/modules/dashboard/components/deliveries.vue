<template>
  <div>
    <div v-if="deliveries.length">
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
            <th class="text-left table-headers">Progress</th>
            <th class="text-left table-headers">Action</th>
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
          >Show more deliveries<v-icon>mdi mdi-arrow-right</v-icon></router-link
        >
      </div>
    </div>

    <div v-else class="send-inventory-to-sendy-container">
      <v-icon class="dashboard-links-icon send-products-icon"
        >mdi mdi-truck</v-icon
      >
      <p>Send inventory to sendy and track the progress here</p>
      <div class="send-inventory-to-sendy-link">
        <router-link to="/"
          >Send inventory to Sendy
          <v-icon>mdi mdi-arrow-right</v-icon></router-link
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
  margin-top: 20%;
}
.send-inventory-to-sendy-link a {
  color: #324ba8;
  text-decoration: none;
}
</style>
