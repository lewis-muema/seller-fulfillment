<template>
  <div>
    <div v-if="getRoute === '/inventory/products'">
      <div class="desktop-product-tab-container">
        <div
          class="desktop-product-tab"
          :class="
            activeTab !== tab.label && getLoader.products === 'loading-text'
              ? 'inactive-tab'
              : 'active-tab'
          "
          v-for="tab in productTabs"
          :key="tab.label"
          :label="tab.label"
        >
          <div
            class="desktop-product-tab-section"
            :class="activeTab === tab.label ? 'active' : ''"
          >
            <span
              @click="
                activeTab !== tab.label && getLoader.products === 'loading-text'
                  ? nothing()
                  : setTab(tab)
              "
            >
              {{ $t(tab.label) }}
              <v-badge
                color="#D3DDF6"
                text-color="#324BA8"
                :content="tab.content"
                inline
              ></v-badge>
            </span>
          </div>
        </div>
      </div>
      <div class="product-buttons-container">
        <!-- <button
          class="btn btn-primary mr-4 products-buttons-section"
          @click="$router.push('/inventory/import-products')"
        >
          <i class="mdi mdi-upload"></i>
          {{ $t("inventory.uploadProduct") }}
        </button> -->

        <button
          class="btn btn-primary upload-buttons-section"
          @click="$router.push('/inventory/add-product')"
        >
          <i class="mdi mdi-plus"></i>
          {{ $t("inventory.addProducts") }}
        </button>
      </div>
    </div>
    <div
      v-if="getRoute.includes('/inventory/stock-levels')"
      class="desktop-product-tab-container"
    >
      <div
        class="desktop-product-tab"
        :class="
          activeTab !== tab.label && getLoader.products === 'loading-text'
            ? 'inactive-tab'
            : 'active-tab'
        "
        v-for="tab in stockLevelTabs"
        :key="tab.label"
        :label="tab.label"
      >
        <div
          class="desktop-product-tab-section"
          :class="activeTab === tab.label ? 'active' : ''"
        >
          <span
            @click="
              activeTab !== tab.label && getLoader.products === 'loading-text'
                ? nothing()
                : setTab(tab)
            "
          >
            {{ $t(tab.label) }}
            <v-badge
              :color="tab.bgColor"
              :text-color="tab.color"
              :content="tab.content"
              inline
            ></v-badge>
          </span>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      productTabs: [
        {
          label: "inventory.all",
          content: "-",
        },
        {
          label: "inventory.archived",
          content: "0",
        },
      ],
      stockLevelTabs: [
        {
          label: "inventory.all",
          content: "-",
          color: "#324BA8",
          bgColor: "#D3DDF6",
        },
        {
          label: "inventory.lowStock",
          content: "-",
          color: "#7F3B02",
          bgColor: "#FBDF9A",
        },
        {
          label: "inventory.outOfStock",
          content: "-",
          color: "#9B101C",
          bgColor: "#FBDECF",
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "getInventorySelectedTab",
      "getProductLists",
      "getStockStatistics",
      "getLoader",
      "getAllProductCount",
      "getArchivedProductCount",
    ]),
    getRoute() {
      return this.$route.path;
    },
    activeTab() {
      return this.getInventorySelectedTab;
    },
    getTotalProducts() {
      return this.getProductLists.length;
    },
  },
  watch: {
    "$store.state.loader": {
      handler() {
        this.productTabs[0].content = `${this.getAllProductCount}`;
        this.productTabs[1].content = `${this.getArchivedProductCount}`;
        this.stockLevelTabs[0].content =
          Object.keys(this.getStockStatistics).length > 0
            ? (
                this.getStockStatistics.available_products +
                this.getStockStatistics.low_stock_products +
                this.getStockStatistics.out_of_stock_products
              ).toString()
            : "-";
        this.stockLevelTabs[1].content =
          Object.keys(this.getStockStatistics).length > 0
            ? this.getStockStatistics.low_stock_products.toString()
            : "-";
        this.stockLevelTabs[2].content =
          Object.keys(this.getStockStatistics).length > 0
            ? this.getStockStatistics.out_of_stock_products.toString()
            : "-";
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations(["setInventorySelectedTab"]),
    setTab(tab) {
      this.setInventorySelectedTab(tab.label);
    },
    nothing() {},
  },
};
</script>

<style>
.desktop-product-tab-container {
  display: grid;
  grid-template-columns: 100px 145px 155px;
  margin: 30px;
}
.desktop-product-tab {
  display: flex;
  height: 40px;
  border-bottom: 1px solid #e2e7ed;
}
.desktop-product-tab-section {
  width: max-content;
  color: #606266;
  font-size: 15px;
  font-weight: 500;
  padding: 5px 10px;
}
.desktop-product-tab-section-inner {
  cursor: pointer;
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
  color: #324ba8 !important;
  font-size: 14px !important;
}
.upload-buttons-section {
  background-color: #324ba8 !important;
  color: white !important;
  font-size: 14px !important;
}
.products-buttons-section > i,
.import-products-link {
  color: #324ba8 !important;
}
</style>
