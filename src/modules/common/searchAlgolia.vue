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
        :label="$t('deliveries.searchDelivery')"
        variant="outlined"
        v-model="searchParam"
        @click:clear="clearItems()"
        :placeholder="$t('deliveries.searchDelivery')"
      ></v-text-field>
    </template>
    <v-list class="header-list-popup">
      <v-list-item v-for="(item, i) in searchItems" :key="i">
        <v-list-item-title>
          <div class="search-item-flex">
            <div class="search-items-image-container">
              <img
                class="search-items-image"
                :src="item.image"
                alt="product-image"
              />
            </div>
            <div>
              <div class="search-item-row">
                <div class="search-item-name">{{ item.brand }}</div>
                <div class="search-item-description">
                  {{ item.description }}
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
      this.initiateAlgolia(val);
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
