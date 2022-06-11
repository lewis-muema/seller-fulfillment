<template>
  <div>
    <v-card class="add-products-outer-card-container" variant="outlined">
      <div class="add-products-container">
        <p class="text-center">
          {{ $t("inventory.manageProducts") }}
        </p>
        <div class="add-products-card-container">
          <v-card class="mr-3" variant="outlined">
            <v-list-item two-line>
              <v-list-item-avatar>
                <v-icon class="dashboard-links-icon mr-5"
                  >mdi mdi-upload</v-icon
                >
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
            <v-list-item two-line>
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
    </v-card>
  </div>
</template>

<script>
export default {};
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
</style>
