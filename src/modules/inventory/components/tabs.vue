<template>
  <div>
    <div v-if="getRoute === '/inventory/products'">
      <div class="desktop-product-tab-container">
        <div
          class="desktop-product-tab"
          v-for="tab in productTabs"
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
          <router-link
            to="/inventory/import-products"
            class="import-products-link"
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
    </div>
    <div
      v-if="getRoute === '/inventory/stock-levels'"
      class="desktop-product-tab-container"
    >
      <div
        class="desktop-product-tab"
        v-for="tab in stockLevelTabs"
        :key="tab.label"
        :label="tab.label"
      >
        <div class="desktop-product-tab-section" @click="setTab(tab)">
          {{ tab.label }}
        </div>
        <v-badge
          v-if="tab.label != 'All'"
          :color="tab.label === 'Low Stock' ? '#FBDF9A' : '#FBDECF'"
          :text-color="tab.label === 'Low Stock' ? '#7F3B02' : '#9B101C'"
          content="23"
          inline
        ></v-badge>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      productTabs: [
        {
          label: "All",
        },
        {
          label: "Archived",
        },
      ],
      stockLevelTabs: [
        {
          label: "All",
        },
        {
          label: "Low Stock",
          content: "23",
        },
        {
          label: "Out of Stock",
          content: "23",
        },
      ],
    };
  },
  computed: {
    getRoute() {
      return this.$route.path;
    },
  },
  methods: {
    ...mapMutations(["setInventorySelectedTab"]),
    setTab(tab) {
      this.setInventorySelectedTab(tab.label);
    },
  },
};
</script>

<style>
.desktop-product-tab-container {
  display: grid;
  grid-template-columns: 8% 12% 12%;
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
