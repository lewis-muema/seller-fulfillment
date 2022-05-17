<template>
  <div>
    <v-card variant="outlined" class="desktop-product-card">
      <div class="d-flex desktop-header-title product-details-header">
        <router-link to="auth/sign-up">
          <i class="mdi mdi-arrow-left" aria-hidden="true"></i
        ></router-link>

        <v-card-title class="text-center">Product Details </v-card-title>
        <div class="dropdown actions-dropdown">
          <button
            class="btn dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Actions
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" href="#">Edit</a></li>
            <li><a class="dropdown-item" href="#">Archive</a></li>
          </ul>
        </div>
      </div>
      <div cols="6" class="product-details-container">
        <div class="product-details-content mb-3">
          <p class="product-header">Name of the Product</p>
          <p>Shea butter</p>
        </div>
        <div class="product-details-content mb-3">
          <p class="product-header">Price</p>
          <p>KES 400</p>
        </div>
        <div class="product-details-content mb-3">
          <p class="product-header">Weight or capacity of the product</p>
          <p>300 ml</p>
        </div>
        <div class="product-details-content mb-3">
          <p class="product-header">Description</p>
          <p>Half Shear Butter</p>
        </div>
        <div class="product-details-content mb-3">
          <p class="product-header">Product Options (optional)</p>
          <p>No product option at the moment</p>
        </div>
        <div>
          <p class="add-product-options" @click="showProductOptions = true">
            Add product options
          </p>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit("setComponent", this.$t("common.productDetails"));
  },
};
</script>

<style>
.product-details-content > p {
  margin: 0;
  line-height: 2;
}
.product-details-container {
  margin-left: 70px;
}
.product-details-header {
  padding: 30px 0px 0px 30px;
}
.actions-dropdown {
  position: absolute !important;
  right: 0 !important;
  margin-right: 80px !important;
}
.product-header {
  color: #606266;
  font-size: 13px;
}
</style>
