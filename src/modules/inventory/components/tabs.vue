<template>
  <div>
    <div class="desktop-product-tab-container">
      <div
        class="desktop-product-tab"
        v-for="tab in tabs"
        :key="tab.label"
        :label="tab.label"
      >
        <div class="desktop-product-tab-section" @click="setTab(tab)">
          {{ tab.label }}
        </div>
      </div>
    </div>
    <div class="product-buttons-container">
      <button class="btn btn-primary mr-4 products-buttons-section">
        <i class="mdi mdi-upload"></i>
        <router-link to="/" class="import-products-link"
          >Import Product</router-link
        >
      </button>

      <button class="btn btn-primary">
        <i class="mdi mdi-plus"></i>
        <router-link to="/inventory/add-product" class="add-products-link"
          >Add Products</router-link
        >
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        {
          label: "All",
        },
        {
          label: "Archived",
        },
      ],
    };
  },
};
</script>

<style>
.desktop-product-tab-container {
  display: grid;
  grid-template-columns: 10% 10%;
  margin: 30px;
}
.desktop-product-tab {
  display: flex;
  height: 40px;
  border-bottom: 1px solid #e2e7ed;
}
.desktop-product-tab-section {
  width: max-content;
  cursor: pointer;
  color: #606266;
  font-size: 15px;
  font-weight: 500;
}
button {
  align-items: center;
  padding: 2px 10px !important;
}
.import-products-link,
.add-products-link {
  color: white !important;
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 20px !important;
}
.product-buttons-container {
  float: right !important;
  margin-top: -70px;
}
.products-buttons-section {
  background-color: #ffffff !important;
}
.products-buttons-section > i,
.import-products-link {
  color: #324ba8 !important;
}
</style>
