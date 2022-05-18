<template>
  <div>
    <v-row>
      <v-col cols="8" class="mx-auto">
        <v-card variant="outlined" class="stock-details">
          <stock-details-tabs v-if="stockSelectedTab === 'Overview'">
            <stock-overview />
          </stock-details-tabs>
          <stock-details-tabs v-if="stockSelectedTab === 'History'">
            <stock-history />
          </stock-details-tabs>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import stockDetailsTabs from "@/modules/inventory/stocklevels/components/stockDetailsTabs";
import stockOverview from "@/modules/inventory/stocklevels/components/stockOverview";
import stockHistory from "@/modules/inventory/stocklevels/components/stockHistory";
import { mapGetters } from "vuex";
export default {
  components: { stockDetailsTabs, stockOverview, stockHistory },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.stockDetails"));
  },
  computed: {
    ...mapGetters(["getStockSelectedTab"]),
    stockSelectedTab() {
      return this.getStockSelectedTab;
    },
  },
};
</script>

<style scoped>
.stock-details {
  padding: 30px;
  border-color: #e2e7ed;
  margin-top: 50px !important;
  height: auto;
}
</style>
