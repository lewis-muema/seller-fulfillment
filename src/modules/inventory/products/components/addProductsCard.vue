<template>
  <div>
    <div>
      <p class="text-center">
        You’ll manage products here! To get started, add products
      </p>
      <div class="add-products-card-container">
        <v-card class="mr-3" variant="outlined">
          <v-list-item
            two-line
            @click="$router.push('/inventory/import-products')"
          >
            <v-list-item-avatar>
              <v-icon class="dashboard-links-icon mr-5">mdi mdi-upload</v-icon>
            </v-list-item-avatar>
            <v-list-item-header>
              <v-list-item-title>Upload Products</v-list-item-title>
              <v-list-item-subtitle
                >We'll provide a template</v-list-item-subtitle
              >
            </v-list-item-header>
          </v-list-item>
        </v-card>
        <v-card variant="outlined">
          <v-list-item two-line @click="$router.push('/inventory/add-product')">
            <v-list-item-avatar>
              <v-icon class="dashboard-links-icon mr-5">mdi mdi-plus</v-icon>
            </v-list-item-avatar>
            <v-list-item-header>
              <v-list-item-title>Add products manually</v-list-item-title>
              <v-list-item-subtitle
                >Add products one by one</v-list-item-subtitle
              >
            </v-list-item-header>
          </v-list-item>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.add-products-card-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
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
