<template>
  <v-menu
    transition="slide-y-transition"
    anchor="bottom center"
    v-model="searchToggle"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        color="#324BA8"
        v-bind="props"
        prepend-inner-icon="mdi-magnify"
        clearable
        :label="
          type === 'product'
            ? $t('deliveries.searchProducts')
            : $t('deliveries.searchDelivery')
        "
        variant="outlined"
        v-model="searchParam"
        @click:clear="clearItems()"
        :placeholder="
          type === 'product'
            ? $t('deliveries.searchProducts')
            : $t('deliveries.searchDelivery')
        "
      ></v-text-field>
    </template>
    <v-list class="header-list-popup" v-if="type === 'product'">
      <v-list-item v-for="(item, i) in searchItems" :key="i">
        <v-list-item-title
          @click="$router.push(`/inventory/view-product/${item.product_id}`)"
        >
          <div class="search-item-flex">
            <div class="search-items-image-container">
              <img
                class="search-items-image"
                :src="item.product_variants[0].product_variant_image_link"
                alt="product-image"
              />
            </div>
            <div>
              <div class="search-item-row">
                <div class="search-item-name">{{ item.product_name }}</div>
                <div class="search-item-description">
                  {{ item.product_description }}
                </div>
              </div>
            </div>
          </div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list class="header-list-popup" v-else>
      <v-list-item v-for="(item, i) in searchItems" :key="i">
        <v-list-item-title
          @click="$router.push(`/deliveries/tracking/${item.order_id}`)"
        >
          <div class="search-item-flex">
            <div>
              <div class="search-item-row">
                <div>
                  <span class="search-item-description">
                    {{ $t("deliveries.orderNumber") }}:
                  </span>
                  <span class="search-item-name">
                    {{ item.order_id }}
                  </span>
                </div>
                <div>
                  <span class="search-item-description">
                    {{ $t("deliveries.name") }}:
                  </span>
                  <span class="search-item-name">
                    {{ item.destination.name }}
                  </span>
                </div>
                <div>
                  <span class="search-item-description">
                    {{ $t("deliveries.phone") }}:
                  </span>
                  <span class="search-item-name">
                    {{ item.destination.phone_number }}
                  </span>
                </div>
                <div>
                  <span class="search-item-description">
                    {{ $t("deliveries.location") }}:
                  </span>
                  <span class="search-item-name">
                    {{ item.destination.delivery_location.description }}
                  </span>
                </div>
                <div>
                  <span class="search-item-description">
                    {{ $t("deliveries.orderStatus") }}:
                  </span>
                  <span class="search-item-name">
                    {{ item.order_status.replaceAll("_", " ") }}
                  </span>
                </div>
                <div>
                  <span class="search-item-description">
                    {{ $t("deliveries.products") }}:
                  </span>
                  <span class="search-item-name">
                    {{ formatProducts(item.products) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import algoliaSearch from "../../mixins/algolia_search";

export default {
  props: ["type"],
  mixins: [algoliaSearch],
  data: () => ({
    deliveries: [],
    searchObject: {},
    searchItems: [],
    range: "",
    searchParam: "",
    searchToggle: false,
  }),
  watch: {
    searchParam(val) {
      this.initiateAlgolia(val, this.type);
    },
  },
  methods: {
    algoliaResults(object) {
      this.searchToggle = true;
      this.searchObject = object;
      this.searchItems = object.hits;
    },
    clearItems() {
      this.searchToggle = false;
      this.searchObject = {};
      this.searchItems = [];
    },
    formatProducts(products) {
      let productsList = "";
      products.forEach((product) => {
        productsList = `${productsList}${productsList === "" ? "" : ","} ${
          product.product_variant_description
        }`;
      });
      return productsList;
    },
  },
};
</script>

<style>
.search-item-flex {
  display: flex;
}
.search-items-image-container {
  height: 60px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e2e2e2;
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
}
.search-items-image {
  height: 100%;
}
.search-item-description {
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #818487;
  font-size: 12px;
}
.search-item-name {
  font-size: 14px;
}
</style>
