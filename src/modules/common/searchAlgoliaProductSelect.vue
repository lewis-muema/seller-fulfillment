<template>
  <v-menu
    transition="slide-y-transition"
    anchor="bottom center"
    v-model="searchToggle"
    class="search-algolia"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        color="#324BA8"
        v-bind="props"
        prepend-inner-icon="mdi-magnify"
        clearable
        :label="$t('deliveries.searchProducts')"
        variant="outlined"
        v-model="searchParam"
        @click:clear="clearItems()"
        :placeholder="$t('deliveries.searchProducts')"
      ></v-text-field>
    </template>
    <v-list class="header-list-popup">
      <v-list-item v-for="(item, i) in searchItems" :key="i">
        <v-list-item-title class="list-item-width-override">
          <div class="row" v-if="item.product_variants.length > 1">
            <v-expansion-panels>
              <v-expansion-panel class="product-select-exp-panel">
                <v-expansion-panel-title class="search-row" hide-actions>
                  <div class="col-8 crossdocking-product-select-titles">
                    <span class="d-flex">
                      <span class="product-image-frame-container">
                        <div class="product-image-frame">
                          <img
                            :src="
                              item.product_variants[0]
                                .product_variant_image_link
                            "
                            alt=""
                            class="product-select-img"
                          />
                        </div>
                      </span>
                      <span class="product-select-expansion-title">
                        <div>
                          <span>
                            {{ item.product_name }}
                          </span>
                        </div>
                        <div class="product-select-expansion-description">
                          <span>
                            {{ item.product_variants.length }}
                            {{ $t("inventory.producTOptions") }}
                          </span>
                        </div>
                      </span>
                    </span>
                  </div>
                  <div class="col-2 search-columns">
                    <span
                      >{{
                        item.product_variants[0].product_variant_stock_levels
                          ? item.product_variants[0]
                              .product_variant_stock_levels.available
                          : "-"
                      }}
                      {{ $t("inventory.units") }}</span
                    >
                  </div>
                  <div class="col-2">
                    <span class="product-select-units">
                      <span>{{ $t("inventory.view") }}</span>
                      <i class="mdi mdi-chevron-down ml-2"></i>
                    </span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="product-select-panel-text">
                  <div
                    class="product-select-option row crossdocking-product-row-inner"
                    :class="disabledStatus() ? 'disabled-row' : ''"
                    v-for="(option, x) in item.product_variants"
                    :key="x"
                  >
                    <div class="col-7 crossdocking-product-select-titles">
                      <div class="product-select-checkbox-inner ml-0"></div>
                      <span class="product-image-frame-container">
                        <div class="product-image-frame">
                          <img
                            :src="option.product_variant_image_link"
                            alt=""
                            class="product-select-img"
                          />
                        </div>
                      </span>
                      <span>{{ option.product_variant_description }}</span>
                    </div>
                    <div class="col-2 search-columns">
                      <span class="product-select-units"
                        >{{
                          option.product_variant_stock_levels
                            ? option.product_variant_stock_levels.available
                            : "-"
                        }}
                        {{ $t("inventory.units") }}</span
                      >
                    </div>
                    <div class="col-3">
                      <el-input-number
                        class="crossdocking-product-counter"
                        v-model="option.quantity"
                        :min="0"
                        placeholder="0"
                        @change="addCount(option.quantity, item, i, option, x)"
                        :disabled="disabledStatus()"
                      />
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <div class="row search-row" v-else>
            <div class="search-item-flex col-8">
              <span class="d-flex">
                <span class="product-image-frame-container">
                  <div class="product-image-frame">
                    <img
                      :src="item.product_variants[0].product_variant_image_link"
                      alt=""
                      class="product-select-img"
                    />
                  </div>
                </span>
                <span class="product-select-expansion-title">
                  <div>
                    <span>
                      {{ item.product_name }}
                    </span>
                  </div>
                  <div class="product-select-expansion-description mt-0">
                    <span>
                      {{ item.product_variants.length }}
                      {{ $t("inventory.producTOptions") }}
                    </span>
                  </div>
                </span>
              </span>
            </div>
            <div class="col-2 search-columns">
              <span
                >{{
                  item.product_variants[0].product_variant_stock_levels
                    ? item.product_variants[0].product_variant_stock_levels
                        .available
                    : "-"
                }}
                {{ $t("inventory.units") }}</span
              >
            </div>
            <div class="col-2 search-columns">
              <el-input-number
                class="crossdocking-product-counter"
                v-model="item.quantity"
                :min="0"
                placeholder="0"
                @change="addCount(item.quantity, item, i)"
                :disabled="disabledStatus()"
              />
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
import { mapGetters, mapMutations } from "vuex";

export default {
  props: ["type"],
  mixins: [algoliaSearch, eventsMixin],
  data: () => ({
    deliveries: [],
    searchObject: {},
    searchItems: [],
    products: [],
    selectedProducts: [],
    range: "",
    searchParam: "",
    searchToggle: false,
  }),
  computed: {
    ...mapGetters([
      "getStorageUserDetails",
      "getProductLists",
      "getSearchedProducts",
      "getBusinessDetails",
      "getLoader",
      "getSelectedProducts",
      "getProductLists",
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
    ...mapMutations([
      "setProductLists",
      "setSearchedProducts",
      "setSelectedProducts",
    ]),
    algoliaResults(object) {
      this.searchToggle = true;
      this.searchObject = object;
      this.searchItems = object.hits;
      this.searchToggle = object.hits.length > 0;
      this.searchProductMapping();
      if (document.querySelector(".v-overlay__content")) {
        const overlayStyle = document.querySelector(
          ".v-overlay__content"
        ).style;
        setTimeout(() => {
          overlayStyle.marginLeft = `${
            (parseInt(overlayStyle.left) - 305) * -1
          }px`;
          overlayStyle.marginTop = `${
            (parseInt(overlayStyle.top) - 230) * -1
          }px`;
        }, 10);
      }
      this.sendSegmentEvents({
        event: "Search_Consignment",
        data: {
          userId: this.getStorageUserDetails.business_id,
          searchWord: this.searchParam,
          clientType: "web",
          device: "desktop",
        },
      });
    },
    disabledStatus() {
      return this.crossDockingFlag() || this.getLoader.products !== "";
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
    crossDockingFlag() {
      return this.getBusinessDetails.settings
        ? !this.getBusinessDetails.settings.cross_docking_enabled
        : true;
    },
    addCount(val, product, i, option, z) {
      const products = this.getSelectedProducts;
      const addedProduct = products.filter((row) => {
        if (row.product_id === product.product_id && !option) {
          row.quantity = val;
        } else if (row.product_id === product.product_id && option) {
          row.product_variants.forEach((variant) => {
            if (variant.product_variant_id === option.product_variant_id) {
              if (
                row.selectedOption.product_variant_id ===
                option.product_variant_id
              ) {
                row.quantity = option.quantity;
              }
              variant.quantity = option.quantity;
            }
          });
        }
        return (
          row.product_id === product.product_id &&
          (option
            ? row.selectedOption?.product_variant_id ===
              option.product_variant_id
            : true)
        );
      });
      if (!addedProduct.length) {
        product.quantity = val;
        this.addProduct(product, i, option, z);
      }
      this.productMapping();
      if (val === 0) {
        this.removeProduct(product, i, option, z);
      }
    },
    productMapping() {
      this.products = this.getProductLists;
      if (
        this.getSelectedProducts.length > 0 &&
        this.products[0].product_id !== "P-KXG-0000" &&
        this.products[0].product_name !== "name"
      ) {
        this.getSelectedProducts.forEach((row) => {
          this.mappingSelectedProducts(this.products, row);
        });
        this.selectedProducts = this.getSelectedProducts;
      }
    },
    searchProductMapping() {
      if (this.getSelectedProducts.length > 0) {
        this.getSelectedProducts.forEach((row) => {
          this.mappingSelectedProducts(this.searchItems, row);
        });
        this.selectedProducts = this.getSelectedProducts;
      }
    },
    mappingSelectedProducts(products, row) {
      products.forEach((product) => {
        if (row.selectedOption && product.product_id === row.product_id) {
          product.product_variants.forEach((variant) => {
            if (
              variant.product_variant_id ===
              row.selectedOption.product_variant_id
            ) {
              variant.quantity = parseInt(row.quantity);
            }
          });
        } else if (
          !row.selectedOption &&
          product.product_id === row.product_id
        ) {
          product.quantity = parseInt(row.quantity);
        }
      });
    },
    addProduct(product, i, option) {
      let newProduct = {};
      Object.keys(product).forEach((row) => {
        newProduct[row] = product[row];
      });
      if (option) {
        newProduct.selectedOption = option;
      }
      this.selectedProducts.push(newProduct);
      this.setSelectedProducts(this.selectedProducts);
      this.sendSegmentEvents({
        event: "Product_Selection",
        data: {
          userId: this.getStorageUserDetails.business_id,
          SKU: product.product_id,
          variant: option?.product_variant_id,
          product_collection: product.product_collection?.collection_id,
          clientType: "web",
          device: "desktop",
        },
      });
    },
    removeProduct(product, i, option) {
      this.selectedProducts.forEach((row, p) => {
        if (
          product.product_id === row.product_id &&
          ((row.selectedOption &&
            row.selectedOption.product_variant_id ===
              option.product_variant_id) ||
            !row.selectedOption)
        ) {
          this.selectedProducts.splice(p, 1);
        }
      });
      this.sendSegmentEvents({
        event: "Product_Selection",
        data: {
          userId: this.getStorageUserDetails.business_id,
          SKU: product.product_id,
          variant: option?.product_variant_id,
          product_collection: product.product_collection?.collection_id,
          clientType: "web",
          device: "desktop",
        },
      });
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
.search-algolia .v-overlay__content {
  position: sticky !important;
  min-width: 50% !important;
}
.list-item-width-override {
  width: 100%;
  padding-left: 5px;
}
.search-columns {
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-single-column-margin {
  margin-left: 15px;
}
.search-row {
  border-bottom: 1px solid #e0e0e0;
  padding: 0px 0px 10px 0px !important;
}
</style>
