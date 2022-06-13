<template>
  <div class="dashbard-container">
    <top-card />
    <v-row>
      <v-col cols="8" class="">
        <dashboard-tabs-content />
      </v-col>
      <v-col cols="3">
        <quick-links />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
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
    this.setComponent(this.$t("common.dashboard"));
    setTimeout(() => {
      this.setLoader("");
    }, 1000);
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader"]),
  },
};
</script>

<style>
.dashbard-container {
  margin-left: 30px;
  margin-top: 30px;
}
</style>
