<template>
  <div>
    <v-table class="">
      <thead>
        <tr>
          <th class="text-left">Customer Info</th>
          <th class="text-left">Progress</th>
          <th class="text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="delivery in deliveries" :key="delivery.id">
          <td>
            <v-list-item lines="two">
              <v-list-item-header>
                <v-list-item-title>{{
                  delivery.customerName
                }}</v-list-item-title>
                <v-list-item-subtitle
                  class="dashboard-customer-delivery-location"
                  >{{ delivery.customerDeliveryLocation }}</v-list-item-subtitle
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
    <router-link to="/" class="show-more-deliveries-link"
      >Show more deliveries</router-link
    >
    <!-- <el-table :data="deliveries" style="width: 100%">
      <el-table-column prop="customerName" label="Date" width="180" />
      <el-table-column prop="customerName" label="Name" width="180" />
      <el-table-column prop="customerName" label="Address" />
    </el-table> -->
  </div>
</template>

<script>
export default {
  props: ["deliveries"],
  data() {
    return {};
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
  align-items: center !important;
  color: #324ba8;
}
</style>
