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
          <div
            class="desktop-product-tab-section"
            @click="setTab(tab)"
            :class="activeTab === tab.label ? 'active' : ''"
          >
            {{ tab.label }}
            <v-badge
              color="#D3DDF6"
              text-color="#324BA8"
              :content="tab.content"
              inline
            ></v-badge>
          </div>
        </div>
      </div>
      <div class="product-buttons-container">
        <button
          class="btn btn-primary mr-4 products-buttons-section"
          @click="$router.push('/inventory/import-products')"
        >
          <i class="mdi mdi-upload"></i>
          {{ $t("inventory.uploadProduct") }}
        </button>

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
      v-if="getRoute === '/inventory/stock-levels'"
      class="desktop-product-tab-container"
    >
      <div
        class="desktop-product-tab"
        v-for="tab in stockLevelTabs"
        :key="tab.label"
        :label="tab.label"
      >
        <div
          class="desktop-product-tab-section"
          @click="setTab(tab)"
          :class="activeTab === tab.label ? 'active' : ''"
        >
          {{ tab.label }}
          <v-badge
            :color="tab.bgColor"
            :text-color="tab.color"
            :content="tab.content"
            inline
          ></v-badge>
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
          label: this.$t("inventory.all"),
          content: "-",
        },
        {
          label: this.$t("inventory.archived"),
          content: "-",
        },
      ],
      stockLevelTabs: [
        {
          label: this.$t("inventory.all"),
          content: "-",
          color: "#324BA8",
          bgColor: "#D3DDF6",
        },
        {
          label: this.$t("inventory.lowStock"),
          content: "-",
          color: "#7F3B02",
          bgColor: "#FBDF9A",
        },
        {
          label: this.$t("inventory.outOfStock"),
          content: "-",
          color: "#9B101C",
          bgColor: "#FBDECF",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getInventorySelectedTab", "getProductLists"]),
    getRoute() {
      return this.$route.path;
    },
    activeTab() {
      return this.getInventorySelectedTab;
    },
    getTotalProducts() {
      return this.getProductLists.length;
    },
    getTotalArchived() {
      return this.getProductLists.length;
    },
  },
  watch: {
    "$store.state.loader": function loader(val) {
      this.productTabs[0].content =
        val === "" ? `${this.getTotalProducts}` : "-";
      this.productTabs[1].content =
        val === "" ? `${this.getTotalArchived}` : "-";
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
  grid-template-columns: 10% 12% 12%;
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
  padding: 5px 10px;
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
