<template>
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
    @focus="searchActive = true"
  ></v-text-field>
  <div
    class="search-suggestions-outer search-product-width"
    v-if="searchItems.length && searchActive && searchParam !== ''"
  >
    <div class="search-suggestions-close" @click="searchActive = false">
      {{ $t("inventory.hide") }}
    </div>
    <div class="search-suggestions-overlay">
      <div
        v-for="(item, i) in searchItems"
        :key="i"
        class="list-item-padding-override"
      >
        <div class="list-item-width-override">
          <div class="row" v-if="item.product_variants.length > 1">
            <v-expansion-panels>
              <v-expansion-panel class="product-select-exp-panel">
                <v-expansion-panel-title
                  class="search-row-override"
                  hide-actions
                >
                  <div class="col-6 crossdocking-product-select-titles">
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
                          <span class="search-row-product-name">
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
                  <div class="col-2"></div>
                  <div class="col-4">
                    <span class="product-select-units">
                      <span>{{ $t("inventory.view") }}</span>
                      <i class="mdi mdi-chevron-down ml-2"></i>
                    </span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="product-select-panel-text">
                  <div
                    class="product-select-option row crossdocking-product-row-inner"
                    :class="disabledVariantStatus(option) ? 'disabled-row' : ''"
                    v-for="(option, x) in item.product_variants"
                    :key="x"
                  >
                    <div class="col-6 crossdocking-product-select-titles">
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
                    <div class="col-2">
                      <div class="available-units-row hidden-unsellable-stock">
                        <el-input-number
                          class="crossdocking-product-counter"
                          v-model="option.damaged"
                          :min="0"
                          placeholder="0"
                          @change="
                            addCount(
                              'damaged',
                              option.damaged,
                              item,
                              i,
                              option,
                              x
                            )
                          "
                          :disabled="disabledVariantStatus(option)"
                        />
                        <div class="available-units-text">
                          {{
                            $t("inventory.unitsDamaged", {
                              Count:
                                option.product_variant_stock_levels.available,
                            })
                          }}
                        </div>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="available-units-row">
                        <el-input-number
                          class="crossdocking-product-counter"
                          v-model="option.quantity"
                          :min="0"
                          placeholder="0"
                          @change="
                            addCount(
                              'quantity',
                              option.quantity,
                              item,
                              i,
                              option,
                              x
                            )
                          "
                          :disabled="disabledVariantStatus(option)"
                        />
                        <div class="available-units-text">
                          {{
                            $t("inventory.unitsAvailable", {
                              Count:
                                option.product_variant_stock_levels.available,
                            })
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <div
            class="search-row-padding"
            :class="disabledStatus(item) ? 'disabled-row' : ''"
            v-else
          >
            <div class="row search-row-override">
              <div class="search-item-flex col-4">
                <span class="d-flex">
                  <span class="product-image-frame-container">
                    <div class="product-image-frame">
                      <img
                        :src="
                          item.product_variants[0].product_variant_image_link
                        "
                        alt=""
                        class="product-select-img"
                      />
                    </div>
                  </span>
                  <span class="product-select-expansion-title">
                    <div>
                      <span class="search-row-product-name">
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
              <div class="col-4">
                <div class="available-units-row hidden-unsellable-stock">
                  <el-input-number
                    class="crossdocking-product-counter"
                    v-model="item.damaged"
                    :min="0"
                    placeholder="0"
                    @change="addCount('damaged', item.damaged, item, i)"
                    :disabled="disabledStatus(item)"
                  />
                  <div class="available-units-text">
                    {{
                      $t("inventory.unitsDamaged", {
                        Count:
                          item.product_variants[0].product_variant_stock_levels
                            .available,
                      })
                    }}
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="available-units-row mr-0">
                  <el-input-number
                    class="crossdocking-product-counter"
                    v-model="item.quantity"
                    :min="0"
                    placeholder="0"
                    @change="addCount('quantity', item.quantity, item, i)"
                    :disabled="disabledStatus(item)"
                  />
                  <div class="available-units-text">
                    {{
                      $t("inventory.unitsAvailable", {
                        Count:
                          item.product_variants[0].product_variant_stock_levels
                            .available,
                      })
                    }}
                  </div>
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
    products: [],
    selectedProducts: [],
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
      "getBusinessDetails",
      "getLoader",
      "getSelectedProducts",
      "getProductLists",
    ]),
  },
  watch: {
    searchParam(val) {
      this.initiateAlgolia(val, "product");
    },
    searchToggle(val) {
      if (val) {
        this.searchProductMapping();
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
    disabledStatus(product) {
      const quantity = product.product_variants[0].product_variant_stock_levels
        ? product.product_variants[0].product_variant_stock_levels.available
        : 0;
      return (
        (quantity === 0 &&
          this.crossDockingFlag() &&
          this.type === "delivery") ||
        this.getLoader.products !== ""
      );
    },
    disabledVariantStatus(option) {
      const quantity = option
        ? option.product_variant_stock_levels.available
        : 0;
      return (
        (quantity === 0 &&
          this.crossDockingFlag() &&
          this.type === "delivery") ||
        this.getLoader.products !== ""
      );
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
    addCount(type, val, product, i, option, z) {
      const products = this.getSelectedProducts;
      const addedProduct = products.filter((row) => {
        if (row.product_id === product.product_id && !option) {
          row[type] = val;
        } else if (row.product_id === product.product_id && option) {
          row.product_variants.forEach((variant) => {
            if (variant.product_variant_id === option.product_variant_id) {
              if (
                row.selectedOption.product_variant_id ===
                option.product_variant_id
              ) {
                row[type] = option[type];
              }
              variant[type] = option[type];
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
      this.productMapping();
      if (!addedProduct.length) {
        product[type] = val;
        this.addProduct(product, i, option, z);
      }
      if (
        (!product?.quantity && !product?.damaged && !option) ||
        (!option?.quantity && !option?.damaged && option)
      ) {
        this.removeProduct(product, i, option, z);
      }
      this.productMapping();
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
              variant.damaged = parseInt(row.damaged);
            }
          });
        } else if (
          !row.selectedOption &&
          product.product_id === row.product_id
        ) {
          product.quantity = parseInt(row.quantity);
          product.damaged = parseInt(row.damaged);
        }
      });
    },
    addProduct(product, i, option) {
      this.selectedProducts = this.getSelectedProducts;
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
      this.selectedProducts = this.getSelectedProducts;
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
  font-size: 14px;
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
  padding: 0px 10px 0px 20px;
}
.search-columns {
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-single-column-margin {
  margin-left: 15px;
}
.search-row-override {
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
  padding-top: 5px !important;
  padding-bottom: 7px !important;
}
.search-row-padding {
  padding: 10px 10px 0px 10px;
}
.list-item-padding-override {
  padding: 0px !important;
}
</style>
