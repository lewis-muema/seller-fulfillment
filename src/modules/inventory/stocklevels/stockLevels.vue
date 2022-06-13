<template>
  <div class="stock-levels-container">
    <stock-tab-content />
  </div>
</template>

<script>
import stockTabContent from "@/modules/inventory/stocklevels/components/stockTabContent";
export default {
  components: { stockTabContent },
};
</script>

<style>
.stock-levels-container {
  margin: 0px 30px;
}
</style>
