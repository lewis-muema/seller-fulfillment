<template>
  <div>
    <div class="desktop-stock-tab-container">
      <div
        class="desktop-stock-tab"
        v-for="tab in tabs"
        :key="tab.label"
        :label="tab.label"
      >
        <div
          class="desktop-product-tab-section"
          :class="activeTab === tab.label ? 'active' : ''"
          @click="setTab(tab)"
        >
          {{ tab.label }}
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
      tabs: [
        {
          label: "Overview",
        },
        // {
        //   label: "History",
        // },
      ],
    };
  },
  computed: {
    ...mapGetters(["getStockSelectedTab"]),
    activeTab() {
      return this.getStockSelectedTab;
    },
  },
  methods: {
    ...mapMutations(["setStockSelectedTab"]),
    setTab(tab) {
      this.setStockSelectedTab(tab.label);
    },
  },
};
</script>

<style>
.desktop-stock-tab-container {
  display: grid;
  grid-template-columns: 20% 20%;
  margin-bottom: 30px;
  border-bottom: 1px solid #e2e7ed;
}
.desktop-stock-tab {
  display: flex;
  height: 40px;
}
</style>
