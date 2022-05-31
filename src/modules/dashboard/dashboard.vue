<template>
  <div>
    <v-container class="ml-5">
      <top-card />
      <v-row>
        <v-col cols="8" class="">
          <dashboard-tabs-content />
        </v-col>
        <v-col cols="3">
          <quick-links />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import quickLinks from "@/modules/dashboard/components/quickLinks";
import dashboardTabsContent from "@/modules/dashboard/components/dashboardTabsContent";
import topCard from "@/modules/dashboard/components/topCard";
export default {
  components: { topCard, quickLinks, dashboardTabsContent },
  data() {
    return {
      tab: null,
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.dashboard"));
  },
};
</script>

<style></style>
