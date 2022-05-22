<template>
  <div>
    <v-card
      variant="outlined"
      class="desktop-select-products-card items-selected-card"
    >
      <div class="items-selected-container">
        <p>{{ itemsSelectedCount }} items Selected</p>
        <button type="submit" class="btn btn-primary">
          Continue with {{ itemsSelectedCount }} (items Selected )
        </button>
      </div></v-card
    >
  </div>
</template>

<script>
export default {
  props: ["itemsSelectedCount"],
};
</script>

<style>
.items-selected-container {
  margin: 30px 20px 30px;
}

.items-selected-card {
  margin-right: 50px;
  margin-left: 0 !important;
}
</style>
