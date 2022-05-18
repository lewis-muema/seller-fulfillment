<template>
  <div>
    <div class="desktop-stock-tab-container">
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
    <slot></slot>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      tabs: [
        {
          label: "Overview",
        },
        {
          label: "History",
        },
      ],
    };
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
  grid-template-columns: auto auto;
  margin-bottom: 30px;
}
</style>
