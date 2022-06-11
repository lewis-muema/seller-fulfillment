<template>
  <div>
    <v-card
      variant="outlined"
      class="desktop-select-products-card items-selected-card"
    >
      <div class="items-selected-container">
        <p>
          {{
            getRoute === "ProductsToSendy" || getRoute === "ProductsToCustomer"
              ? `${itemsSelectedCount}
          items Selected`
              : `${itemsAddedCount} items Added`
          }}
        </p>
        <router-link
          :to="{ name: 'Add Quantity' }"
          v-if="
            getRoute === 'ProductsToSendy' || getRoute === 'ProductsToCustomer'
          "
        >
          <button type="submit" class="btn btn-primary">
            {{ $t("inventory.continueWith") }}{{ itemsSelectedCount }}
            {{ $t("inventory.itemsSelected") }}
          </button>
        </router-link>
        <router-link :to="{ name: 'Checkout' }" v-else>
          <button type="submit" class="btn btn-primary">
            {{ $t("inventory.continueWith") }}{{ itemsAddedCount
            }}{{ $t("inventory.itemsAdded") }}
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
      return this.$route.name;
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
