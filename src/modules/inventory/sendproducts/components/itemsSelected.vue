<template>
  <div>
    <v-card
      variant="outlined"
      class="desktop-select-products-card items-selected-card"
    >
      <div class="items-selected-container">
        <p>
          {{
            getRoute === "/inventory/send-inventory/step/products-select"
              ? `${itemsSelectedCount}
          items Selected`
              : `${itemsAddedCount} items Added`
          }}
        </p>
        <router-link :to="{ name: 'Add Quantity' }">
          <button type="submit" class="btn btn-primary">
            Continue with
            {{
              getRoute === "/inventory/send-inventory/step/products-select"
                ? `${itemsSelectedCount}
          (items Selected )`
                : `${itemsAddedCount}  (items Added )`
            }}
          </button>
        </router-link>
      </div></v-card
    >
  </div>
</template>

<script>
export default {
  props: ["itemsSelectedCount", "itemsAddedCount"],
  computed: {
    getRoute() {
      return this.$route.path;
    },
  },
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
