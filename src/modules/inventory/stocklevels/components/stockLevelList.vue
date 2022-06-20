<template>
  <div>
    <v-card class="desktop-product-details" variant="outlined">
      <div class="products-search">
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
      </div>
      <v-table class="" v-if="products.length > 0">
        <table-header :header="tableHeaders" />
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>
              <v-list-item lines="two">
                <v-list-item-avatar class="product-image-container">
                  <img
                    :src="product.product_link"
                    alt="img"
                    class="product-img"
                  />
                </v-list-item-avatar>
                <v-list-item-header>
                  <v-list-item-title>
                    <span :class="getLoader">
                      {{ product.product_name }}
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span :class="getLoader">
                      {{
                        product.product_variants
                          ? `${product.product_variants.length} product options`
                          : ""
                      }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-header>
              </v-list-item>
            </td>
            <td>
              <span :class="getLoader">
                {{ product.available }}
              </span>
            </td>
            <td>
              <span :class="getLoader">
                {{ product.committed }}
              </span>
            </td>
            <td>
              <span :class="getLoader">
                {{ product.incoming }}
              </span>
            </td>
            <td>
              <router-link
                :to="{
                  name: 'View Product',
                  params: {
                    product: JSON.stringify(product),
                  },
                }"
                class="view-product-link"
                >{{ $t("inventory.view") }}</router-link
              >
            </td>
          </tr>
        </tbody>
      </v-table>
      <div class="deliveries-empty" v-else>
        <div>
          <img
            src="https://images.sendyit.com/fulfilment/seller/track.png"
            alt=""
            class="deliveries-empty-img"
          />
        </div>
        <p class="deliveries-empty-title">
          {{ $t("inventory.noInventoryToTrackYet") }}
        </p>
        <v-btn
          class="deliveries-btn"
          @click="$router.push('/inventory/send-inventory')"
          size="default"
        >
          {{ $t("inventory.sendInventoryToSendy") }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
import { mapMutations, mapGetters } from "vuex";
import algoliaSearch from "../../../../mixins/algolia_search";

export default {
  props: ["products"],
  mixins: [algoliaSearch],
  data() {
    return {
      searchObject: {},
      searchItems: [],
      searchParam: "",
      searchToggle: false,
      headers: [
        {
          title: this.$t("inventory.product"),
          description: "",
        },
        {
          title: this.$t("inventory.available"),
          description: this.$t("inventory.availableProducts"),
        },
        {
          title: this.$t("inventory.committed"),
          description: this.$t("inventory.CommittedProducts"),
        },
        {
          title: this.$t("inventory.incoming"),
          description: this.$t("inventory.IncomingProducts"),
        },
        {
          title: this.$t("inventory.actions"),
          description: "",
        },
      ],
    };
  },
  watch: {
    searchParam(val) {
      this.initiateAlgolia(val);
    },
  },
  components: {
    tableHeader,
  },
  mounted() {
    this.setComponent(this.$t("common.stocks"));
    setTimeout(() => {
      this.setLoader("");
    }, 1000);
  },
  computed: {
    ...mapGetters(["getLoader"]),
    tableHeaders() {
      return this.headers;
    },
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
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

<style scoped></style>
