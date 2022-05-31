<template>
  <div>
    <div class="mb-3">
      <span>
        <img src="" alt="img" />
        Shea Butter
      </span>
    </div>
    <v-table v-if="activities">
      <table-header :header="tableHeaders" />
      <tbody>
        <tr v-for="activity in activities" :key="activity.id">
          <td>{{ activity.date }}</td>
          <td>{{ activity.activity }}</td>
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
  data() {
    return {
      tableHeaders: ["Date", "Activity", ""],
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
</style>
