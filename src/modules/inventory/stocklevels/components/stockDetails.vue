<template>
  <div>
    <v-row>
      <v-col cols="8" class="mx-auto">
        <v-card variant="outlined" class="stock-details">
          <stock-details-tabs>
            <stock-overview />
          </stock-details-tabs>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import stockDetailsTabs from "@/modules/inventory/stocklevels/components/stockDetailsTabs";
import stockOverview from "@/modules/inventory/stocklevels/components/stockOverview";
export default {
  mounted() {
    this.$store.commit("setComponent", this.$t("common.stockDetails"));
  },
  components: { stockDetailsTabs, stockOverview },
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
