<template>
  <v-text-field
    class="consignment-input-search"
    color="#324BA8"
    prepend-inner-icon="mdi-magnify"
    clearable
    :label="
      type === 'product'
        ? $t('deliveries.searchProducts')
        : type === 'delivery'
        ? $t('deliveries.searchUsingNameOrPhoneNumber')
        : $t('deliveries.searchUsingDestination')
    "
    variant="outlined"
    v-model="searchParam"
    @click:clear="clearItems()"
    :placeholder="
      type === 'product'
        ? $t('deliveries.searchProducts')
        : $t('deliveries.searchUsingNameOrPhoneNumber')
    "
    @focus="searchActive = true"
  ></v-text-field>
  <div
    class="search-suggestions-outer"
    v-if="searchItems.length && searchActive && searchParam !== ''"
  >
    <div class="search-suggestions-close" @click="searchActive = false">
      {{ $t("inventory.hide") }}
    </div>
    <div class="search-suggestions-overlay" v-if="type === 'product'">
      <div class="search-product" v-for="(item, i) in searchItems" :key="i">
        <div class="search-item-flex" @click="productTrigger(item)">
          <div class="search-items-image-container">
            <img
              class="search-items-image"
              :src="item.product_variants[0].product_variant_image_link"
              alt="product-image"
            />
          </div>
          <div>
            <div class="search-item-row">
              <div class="search-product-name">{{ item.product_name }}</div>
              <div class="search-product-description">
                {{ item.product_description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="search-suggestions-overlay" v-if="type === 'OnDemand'">
      <div class="search-product" v-for="(item, i) in searchItems" :key="i">
        <div
          @click="
            $router.push(`/deliveries/track-direct-deliveries/${item.order_id}`)
          "
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
                    {{ $t("deliveries.pickupLocation") }}:
                  </span>
                  <span class="search-item-name">
                    {{ item.instructions[0].delivery_location.description }}
                  </span>
                </div>
                <div>
                  <span class="search-item-description">
                    {{ $t("deliveries.deliveryLocation") }}:
                  </span>
                  <span class="search-item-name">
                    {{ item.instructions[1].delivery_location.description }}
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
                    {{ item.instructions[0].actions[0].package_description }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="search-suggestions-overlay" v-else>
      <div class="search-product" v-for="(item, i) in searchItems" :key="i">
        <div @click="$router.push(`/deliveries/tracking/${item.order_id}`)">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import algoliaSearch from "../../mixins/algolia_search";
import eventsMixin from "../../mixins/events_mixin";
import { mapGetters, mapMutations } from "vuex";

export default {
  props: ["type"],
  mixins: [algoliaSearch, eventsMixin],
  data: () => ({
    deliveries: [],
    searchObject: {},
    searchItems: [],
    range: "",
    searchParam: "",
    searchToggle: false,
    searchActive: false,
  }),
  computed: {
    ...mapGetters([
      "getStorageUserDetails",
      "getProductLists",
      "getSearchedProducts",
    ]),
  },
  watch: {
    searchParam(val) {
      this.initiateAlgolia(val, this.type);
    },
    searchToggle(val) {
      if (val) {
        this.searchToggle =
          this.searchItems.length > 0 && this.searchParam !== "";
      }
    },
  },
  methods: {
    ...mapMutations(["setProductLists", "setSearchedProducts"]),
    algoliaResults(object) {
      this.searchToggle = true;
      this.searchObject = object;
      this.searchItems = object.hits;
      this.searchToggle = object.hits.length > 0;
      if (document.querySelector(".v-overlay__content")) {
        const overlayStyle = document.querySelector(
          ".v-overlay__content"
        ).style;
        setTimeout(() => {
          overlayStyle.marginLeft = `${
            (parseInt(overlayStyle.left) - 305) * -1
          }px`;
          overlayStyle.marginTop = `${
            (parseInt(overlayStyle.top) -
              (this.type === "product" ? 230 : 260)) *
            -1
          }px`;
        }, 10);
      }
      if (this.type === "delivery") {
        this.sendSegmentEvents({
          event: "Search_Consignment",
          data: {
            userId: this.getStorageUserDetails.business_id,
            searchWord: this.searchParam,
            clientType: "web",
            device: "desktop",
          },
        });
      }
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
    productTrigger(item) {
      this.$router.push(`/inventory/view-product/${item.product_id}`);
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
  font-size: 16px;
}
.search-algolia .v-overlay__content {
  position: sticky !important;
}
.search-suggestions-outer {
  position: absolute;
  background: white;
  z-index: 1000;
  border: 1px solid #e0e0e0;
}
.search-suggestions-overlay {
  max-height: 400px;
  overflow-y: scroll;
  padding: 25px;
}
.search-product-name {
  font-size: 18px;
}
.search-product-description {
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #818487;
  font-size: 14px;
}
.search-product {
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}
.search-product:hover {
  background-color: whitesmoke;
}
.search-suggestions-close {
  float: right;
  font-size: 15px;
  cursor: pointer;
  color: white;
  background: #324aa8;
  padding: 5px 10px;
  border-radius: 5px;
  position: absolute;
  right: 0px;
  top: -35px;
}
</style>
