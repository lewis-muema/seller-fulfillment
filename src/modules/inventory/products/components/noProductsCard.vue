<template>
  <div>
    <div
      class="add-products-container"
      v-if="getInventorySelectedTab === 'inventory.all'"
    >
      <p class="text-center">
        {{ $t("inventory.manageProducts") }}
      </p>
      <div class="add-products-card-container">
        <v-card class="mr-3" variant="outlined" v-if="upload">
          <v-list-item
            two-line
            @click="$router.push('/inventory/import-products')"
          >
            <v-list-item-avatar>
              <v-icon class="dashboard-links-icon mr-5">mdi mdi-upload</v-icon>
            </v-list-item-avatar>
            <v-list-item-header>
              <v-list-item-title>
                {{ $t("inventory.uploadProduct") }}</v-list-item-title
              >
              <v-list-item-subtitle>{{
                $t("inventory.template")
              }}</v-list-item-subtitle>
            </v-list-item-header>
          </v-list-item>
        </v-card>
        <v-card variant="outlined">
          <v-list-item two-line @click="$router.push('/inventory/add-product')">
            <v-list-item-avatar>
              <v-icon class="dashboard-links-icon mr-5">mdi mdi-plus</v-icon>
            </v-list-item-avatar>
            <v-list-item-header>
              <v-list-item-title>{{
                $t("inventory.addProductsManually")
              }}</v-list-item-title>
              <v-list-item-subtitle>{{
                $t("inventory.addProductsOnebyOne")
              }}</v-list-item-subtitle>
            </v-list-item-header>
          </v-list-item>
        </v-card>
      </div>
    </div>
    <div v-if="getInventorySelectedTab === 'inventory.archived'">
      <div class="no-products-card-container">
        <i class="mdi mdi-store no-products-icon"></i>
        <div class="no-products-description">
          {{ $t("inventory.thereAreNoArchivedProductsAtTheMoment") }}
        </div>
      </div>
    </div>
    <div v-if="noStockCard" class="no-stock-card">
      <div>
        <img
          src="https://images.sendyit.com/fulfilment/seller/track.png"
          alt=""
          class="deliveries-empty-img"
        />
      </div>
      <p class="deliveries-empty-title">
        {{
          getInventorySelectedTab === "inventory.lowStock"
            ? $t("inventory.thereAreNoLowStockItems")
            : $t("inventory.thereAreNoOutOfStockItems")
        }}
      </p>
      <v-btn
        class="deliveries-btn"
        @click="$router.push('/inventory/add-pickup-products')"
        size="default"
      >
        {{ $t("inventory.sendInventoryToSendy") }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      upload: false,
    };
  },
  computed: {
    ...mapGetters(["getAllProductCount", "getInventorySelectedTab"]),
    noStockCard() {
      return (
        this.getInventorySelectedTab === "inventory.lowStock" ||
        this.getInventorySelectedTab === "inventory.outOfStock"
      );
    },
  },
};
</script>

<style>
.add-products-container {
  margin-top: 10%;
}
.add-products-outer-card-container {
  height: 80vh !important;
  border-color: #e2e7ed;
}
.add-products-card-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-products-card-container .v-card {
  height: 80px;
  width: 400px;
  border-color: #e2e7ed;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.no-products-card-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70vh;
}
.no-products-icon {
  font-size: 50px;
  color: #324ba8;
}
.no-products-description {
  width: 275px;
  text-align: center;
  font-size: 18px;
}
.no-stock-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
