<template>
  <div>
    <span class="send-products-header-text text-center"
      >What do you want to do?</span
    >
    <div class="send-products-container">
      <div @click="deliverToCustomer" class="send-products-content">
        <v-card class="send-products-card" variant="outlined">
          <div class="text-center">
            <v-icon class="dashboard-links-icon send-products-icon"
              >mdi mdi-truck</v-icon
            >
            <p class="mt-4">Deliver to Customer</p>
          </div>
        </v-card>
      </div>
      <div @click="deliverToSendy" class="send-products-content">
        <v-card variant="outlined">
          <div class="text-center">
            <v-icon class="dashboard-links-icon send-products-icon"
              >mdi mdi-warehouse</v-icon
            >
            <p class="mt-4">Send inventory to Sendy</p>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit("setComponent", this.$t("common.sendInventory"));
  },
  methods: {
    deliverToCustomer() {
      this.$router.push({ name: "ProductsToCustomer" });
    },
    deliverToSendy() {
      this.$router.push({ name: "ProductsToSendy" });
    },
  },
};
</script>

<style>
.send-products-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
}
.send-products-container .v-card {
  height: 200px;
  width: 300px;
  border-color: #e2e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
}
.send-products-content {
  cursor: pointer;
}
.send-products-icon {
  border-radius: 50% !important;
  height: 48px !important;
  width: 48px !important;
  background-color: #f0f3f7 !important;
}
.send-products-card {
  margin-right: 30px !important;
}
.send-products-header-text {
  font-size: 19px;
  font-weight: 500;
  color: #303133;
  display: flex;
  justify-content: center;
  margin: 80px 0;
}
/* .send-products-container a {
  text-decoration: none !important;
  color: #303133 !important;
} */
</style>
