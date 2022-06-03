<template>
  <div>
    <div class="mb-3">
      <span>
        <img src="" alt="img" />
        {{ product.product_name }}
      </span>
      <select
        v-if="product.product_variants"
        class="form-select product-options-select"
        aria-label="Default select example"
      >
        <option selected>All Product options</option>
        <option value="1">
          <v-list-item lines="two">
            <v-list-item-header>
              <v-list-item-title>250ml </v-list-item-title>
              <v-list-item-subtitle>KES 750</v-list-item-subtitle>
            </v-list-item-header>
          </v-list-item>
        </option>
        <option value="1">
          <v-list-item lines="two">
            <v-list-item-header>
              <v-list-item-title>250ml </v-list-item-title>
              <v-list-item-subtitle>KES 750</v-list-item-subtitle>
            </v-list-item-header>
          </v-list-item>
        </option>
      </select>
    </div>
    <v-table v-if="activityHistory">
      <table-header
        :header="product.product_variants ? tableHeaders2 : tableHeaders"
      />
      <tbody>
        <tr v-for="(activity, index) in activityHistory" :key="index">
          <td>
            {{
              product.product_variants ? "23/2/2022 12:00 pm" : activity.date
            }}
          </td>
          <td v-if="product.product_variants">
            {{ activity.product_variant_quantity }} ml
          </td>
          <td>
            {{
              product.product_variants
                ? "3 items sent to James doe"
                : activity.activity
            }}
          </td>
          <td>
            <router-link to="/" class="view-product-link">View</router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
    <div v-else class="no-activity-container">
      <v-icon class="history-back-icon">mdi mdi-history</v-icon>
      <p>No activity at the moment</p>
    </div>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
export default {
  components: { tableHeader },
  props: ["product"],
  data() {
    return {
      tableHeaders: ["Date", "Activity", ""],
      tableHeaders2: ["Date", "Product options", "Activity", ""],
      activities: [
        {
          date: "23/2/2022 12:00 pm",
          activity: "3 items sent to James doe ",
        },
        {
          date: "23/2/2022 12:00 pm",
          activity: "13 items received at the Sendy fulfillment centre ",
        },
      ],
    };
  },
  computed: {
    activityHistory() {
      const res = this.product.product_variants;
      return res ? this.product.product_variants : this.activities;
    },
  },
};
</script>

<style>
.history-back-icon {
  color: #324ba8;
}
.no-activity-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.product-options-select {
  width: 30% !important;
}
</style>
