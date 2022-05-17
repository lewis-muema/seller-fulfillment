<template>
  <div>
    <div class="desktop-stock-tab-container">
      <div
        class="desktop-product-tab"
        v-for="tab in tabs"
        :key="tab.label"
        :label="tab.label"
      >
        <div
          class="desktop-product-tab-section"
          :class="{ active: activeTab === 'Overview' }"
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
};
</script>

<style>
.desktop-stock-tab-container {
  display: grid;
  grid-template-columns: auto auto;
  margin: 30px;
}
</style>
