<template>
  <div>
    <v-card
      variant="outlined"
      class="desktop-dashboard-upper-card pa-5"
      height="600"
    >
      <dashboard-tabs>
        <deliveries :selectedTab="dashboardTabs" />
      </dashboard-tabs>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dashboardTabs from "@/modules/dashboard/components/dashboardTabs";
import deliveries from "@/modules/dashboard/components/deliveries";
export default {
  components: { dashboardTabs, deliveries },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getDashboardSelectedTab"]),
    dashboardTabs() {
      return this.getDashboardSelectedTab;
    },
  },
};
</script>

<style scoped></style>
