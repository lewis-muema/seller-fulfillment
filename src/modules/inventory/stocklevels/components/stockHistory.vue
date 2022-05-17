<template>
  <div>
    <v-table>
      <table-header :headers="tableHeaders" />
      <t-body>
        <tr v-for="activity in activities" :key="activity.id">
          <td>{{ activity.date }}</td>
          <td>{{ activity.user }}</td>
          <td>{{ activity.activity }}</td>
          <td>View</td>
        </tr>
      </t-body>
    </v-table>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
export default {
  components: { tableHeader },
  data() {
    return {
      tableHeaders: ["Date", "User", "Activity"],
      activities: [
        {
          date: "23/2/2022 12:00 pm",
          user: "James Doe",
          activity: "3 items sent to James doe ",
        },
        {
          date: "23/2/2022 12:00 pm",
          user: "_",
          activity: "13 items received at the Sendy fulfillment centre ",
        },
      ],
    };
  },
};
</script>

<style></style>
