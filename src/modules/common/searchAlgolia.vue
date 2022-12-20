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
            : $t('deliveries.searchUsingNameOrPhoneNumber')
        "
        variant="outlined"
        v-model="searchParam"
        @click:clear="clearItems()"
        :placeholder="
          type === 'product'
            ? $t('deliveries.searchProducts')
            : $t('deliveries.searchUsingNameOrPhoneNumber')
        "
      ></v-text-field>
    </template>
    <v-list class="header-list-popup" v-if="type === 'product'">
      <v-list-item v-for="(item, i) in searchItems" :key="i">
        <v-list-item-title @click="productTrigger(item)">
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
import eventsMixin from "../../mixins/events_mixin";
import { ElNotification } from "element-plus";
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
      if (
        [
          "/inventory/send-inventory/",
          "/inventory/add-delivery-products",
        ].includes(this.$route.path)
      ) {
        const productsList = this.getProductLists;
        const searchedList = this.getSearchedProducts;
        const existingProduct = productsList.filter((row) => {
          return row.product_id === item.product_id;
        });
        const existingList = searchedList.filter((row) => {
          return row.product_id === item.product_id;
        });
        if (!existingProduct.length && !existingList.length) {
          searchedList.push(item);
          productsList.push(item);
          this.clearItems();
          ElNotification({
            title: this.$t("common.productAddedToList"),
            message: "",
            type: "success",
          });
        } else {
          ElNotification({
            title: this.$t("common.productAlreadyInTheList"),
            message: "",
            type: "warning",
          });
        }
        this.setSearchedProducts(searchedList);
        this.setProductLists(productsList);
      } else {
        this.$router.push(`/inventory/view-product/${item.product_id}`);
      }
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
