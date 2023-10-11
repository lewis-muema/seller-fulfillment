<template>
  <div>
    <div class="desktop-select-info-card">
      <span>
        <i class="mdi mdi-information desktop-select-info-card-icon"></i>
      </span>
      <span class="desktop-select-info-card-text">{{
        $t("inventory.thisProcessAllowsYouToRequestInventory")
      }}</span>
    </div>
    <v-row v-if="!getEditValue">
      <v-col cols="6" class="mx-auto mt-4 mb-3">
        <el-steps :active="0" finish-status="success">
          <el-step :title="$t('inventory.selectProducts')"></el-step>
          <el-step :title="$t('inventory.review')"></el-step>
          <el-step :title="$t('inventory.checkout')"></el-step>
        </el-steps>
      </v-col>
    </v-row>
    <v-row :class="getEditValue ? 'mt-5' : ''">
      <v-col cols="8">
        <v-card variant="outlined" class="desktop-select-products-card">
          <div class="select-products-container">
            <div class="enter-quantity-container desktop-header-title d-flex">
              <i
                class="mdi mdi-arrow-left"
                aria-hidden="true"
                @click="$router.push(`/`)"
              ></i>
              <v-card-title class="text-center send-products-title">
                {{ $t("inventory.selectProducts") }}
              </v-card-title>
            </div>
            <router-link
              to="/inventory/add-product/"
              class="add-new-product crossdocking-add-product-button"
            >
              <v-icon>mdi mdi-plus</v-icon>
              {{ $t("inventory.addNewProduct") }}
            </router-link>
          </div>
          <div class="search-input-product-select">
            <searchAlgolia type="pickup" />
          </div>
          <hr />
          <v-table v-if="products.length > 0">
            <thead>
              <tr>
                <th
                  class="product-select-table-titles row crossdocking-product-select-titles"
                >
                  <div class="col-1"></div>
                  <div class="col-3">{{ $t("settings.name") }}</div>
                  <div
                    class="product-select-units col-4 crossdocking-product-select-header"
                  >
                    <span class="hidden-unsellable-stock">{{
                      $t("inventory.unsellableStock")
                    }}</span>
                    <span class="hidden-unsellable-stock"
                      ><i class="mdi mdi-information-outline ml-1"></i
                    ></span>
                  </div>
                  <div class="col-4 quantity-to-send-header">
                    <span>{{ $t("inventory.availableStock") }}</span>
                    <span
                      ><i class="mdi mdi-information-outline ml-1"></i
                    ></span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(product, i) in products"
                id="product-select"
                :class="`product-select-${sanitizeName(product.product_name)}`"
                :key="i"
              >
                <td
                  :class="disabledStatus(product) ? 'disabled-row' : ''"
                  v-if="product.product_variants.length === 1"
                >
                  <div
                    class="product-select-column row product-select-height-override"
                  >
                    <div class="col-4 crossdocking-product-select-titles">
                      <div class="product-select-checkbox"></div>
                      <span class="d-flex">
                        <span class="product-image-frame-container">
                          <div class="product-image-frame">
                            <img
                              :src="
                                product.product_variants[0]
                                  .product_variant_image_link
                              "
                              v-if="!getLoader.products"
                              alt=""
                              class="product-select-img"
                            />
                          </div>
                        </span>
                        <span :class="getLoader.products">
                          {{ product.product_name }}
                        </span>
                      </span>
                    </div>
                    <div class="col-4">
                      <div class="available-units-row hidden-unsellable-stock">
                        <el-input-number
                          class="crossdocking-product-counter"
                          v-model="product.damaged"
                          :min="0"
                          placeholder="0"
                          @change="
                            addCount('damaged', product.damaged, product, i)
                          "
                          :disabled="disabledStatus(product)"
                        />
                        <div class="available-units-text">
                          {{
                            $t("inventory.unitsDamaged", {
                              Count:
                                product.product_variants[0]
                                  .product_variant_stock_levels.available,
                            })
                          }}
                        </div>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="available-units-row quantity-to-send-row">
                        <el-input-number
                          class="crossdocking-product-counter"
                          v-model="product.quantity"
                          :min="0"
                          placeholder="0"
                          @change="
                            addCount('quantity', product.quantity, product, i)
                          "
                          :disabled="disabledStatus(product)"
                        />
                        <div class="available-units-text">
                          {{
                            $t("inventory.unitsAvailable", {
                              Count:
                                product.product_variants[0]
                                  .product_variant_stock_levels.available,
                            })
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <div v-else>
                  <v-expansion-panels>
                    <v-expansion-panel class="product-select-exp-panel">
                      <v-expansion-panel-title
                        class="crossdocking-product-row row product-select-height-override"
                        hide-actions
                      >
                        <div class="col-4 crossdocking-product-select-titles">
                          <span class="product-select-checkbox-expand"></span>
                          <span class="d-flex">
                            <span class="product-image-frame-container">
                              <div class="product-image-frame">
                                <img
                                  :src="
                                    product.product_variants[0]
                                      .product_variant_image_link
                                  "
                                  v-if="!getLoader.products"
                                  alt=""
                                  class="product-select-img"
                                />
                              </div>
                            </span>
                            <span class="product-select-expansion-title">
                              <div>
                                <span :class="getLoader.products">
                                  {{ product.product_name }}
                                </span>
                              </div>
                              <div class="product-select-expansion-description">
                                <span :class="getLoader.products">
                                  {{
                                    variantFilter(product.product_variants)
                                      .length
                                  }}
                                  {{ $t("inventory.producTOptions") }}
                                </span>
                              </div>
                            </span>
                          </span>
                        </div>
                        <div
                          class="col-4 crossdocking-product-select-titles"
                        ></div>
                        <div class="col-4">
                          <span
                            class="product-select-units quantity-to-send-row"
                          >
                            <span>{{ $t("inventory.view") }}</span>
                            <i class="mdi mdi-chevron-down ml-2"></i>
                          </span>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text class="product-select-panel-text">
                        <div
                          class="product-select-option row crossdocking-product-row-inner product-select-height-override"
                          :class="
                            disabledVariantStatus(option) ? 'disabled-row' : ''
                          "
                          v-for="(option, x) in variantFilter(
                            product.product_variants
                          )"
                          :key="x"
                        >
                          <div class="col-4 crossdocking-product-select-titles">
                            <div
                              class="product-select-checkbox-inner ml-0"
                            ></div>
                            <span class="product-image-frame-container">
                              <div class="product-image-frame">
                                <img
                                  :src="option.product_variant_image_link"
                                  alt=""
                                  class="product-select-img"
                                />
                              </div>
                            </span>
                            <span :class="getLoader.products">{{
                              option.product_variant_description
                            }}</span>
                          </div>
                          <div class="col-4">
                            <div
                              class="available-units-row hidden-unsellable-stock"
                            >
                              <el-input-number
                                class="crossdocking-product-counter"
                                v-model="option.damaged"
                                :min="0"
                                placeholder="0"
                                @change="
                                  addCount(
                                    'damaged',
                                    option.damaged,
                                    product,
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
                                      option.product_variant_stock_levels
                                        .available,
                                  })
                                }}
                              </div>
                            </div>
                          </div>
                          <div class="col-4">
                            <div
                              class="available-units-row quantity-to-send-row"
                            >
                              <el-input-number
                                class="crossdocking-product-counter"
                                v-model="option.quantity"
                                :min="0"
                                placeholder="0"
                                @change="
                                  addCount(
                                    'quantity',
                                    option.quantity,
                                    product,
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
                                      option.product_variant_stock_levels
                                        .available,
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
              {{ $t("inventory.youveNotAddedAnyProductYet") }}
            </p>
            <p class="deliveries-empty-subtitle">
              {{ $t("inventory.addProductsToSend") }}
            </p>
            <v-btn
              class="deliveries-btn"
              @click="$router.push('/inventory/add-product')"
              size="default"
            >
              {{ $t("inventory.addProducts") }}
            </v-btn>
          </div>
        </v-card>
        <div class="inventory-pagination">
          <v-pagination
            class="mt-3"
            v-model="page"
            :length="getPagination.page_count"
            :total-visible="getPagination.page_count < 10 ? '' : 10"
            rounded="0"
            :disabled="getLoader.products !== ''"
          ></v-pagination>
        </div>
      </v-col>
      <v-col cols="4">
        <v-card
          variant="outlined"
          class="desktop-select-products-card items-selected-card"
        >
          <div class="items-selected-container">
            <p>
              {{ `${totalProducts} ${$t("inventory.unitsAdded")}` }}
            </p>
            <button
              type="submit"
              @click="addProductStep()"
              class="btn btn-primary desktop-select-continue-button"
            >
              {{ $t("inventory.continue") }}
            </button>
          </div></v-card
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import { ElNotification } from "element-plus";
import eventsMixin from "../../../../mixins/events_mixin";
import placeholder from "../../../../mixins/placeholders";
import searchAlgolia from "../../../common/searchAlgoliaConsignmentReturn.vue";

export default {
  mixins: [eventsMixin, placeholder],
  data() {
    return {
      products: [],
      selectedProducts: [],
      searchProduct: "",
      mappedSelectedProducts: [],
      count: 0,
      page: 1,
    };
  },
  components: {
    searchAlgolia,
  },
  watch: {
    searchProduct(val) {
      this.filterProducts(val.replace(" ", ""));
    },
    page() {
      this.fetchProducts();
    },
  },
  mounted() {
    this.setComponent("common.sendBackInventory");
    this.setProductLists(this.placeholderProducts);
    this.productMapping();
    this.fetchProducts();
    this.searchProduct = "";
  },
  methods: {
    ...mapMutations([
      "setSelectedProducts",
      "setLoader",
      "setProductStep",
      "setComponent",
      "setProductLists",
      "setProductsToSubmit",
      "setMappedSelectedProducts",
      "setPagination",
    ]),
    ...mapActions(["requestAxiosGet"]),
    variantFilter(variants) {
      let variant = [];
      variants.forEach((row) => {
        variant.push(row);
      });
      return variant;
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
    disabledStatus() {
      return this.getLoader.products !== "";
    },
    disabledVariantStatus() {
      return this.getLoader.products !== "";
    },
    fetchProducts() {
      this.setLoader({
        type: "products",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${
          this.getStorageUserDetails.business_id
        }/products?max=5&offset=${this.page - 1}`,
      }).then((response) => {
        if (this.$route.path === `/inventory/add-consignment-return-products`) {
          this.setLoader({
            type: "products",
            value: "",
          });
        }
        if (response.status === 200) {
          const products = response.data.data.products;
          this.setProductLists(products);
          this.setPagination(response.data.data.pagination);
          this.page = response.data.data.pagination.current_page + 1;
          this.productMapping();
        }
      });
    },
    addProductStep() {
      if (this.getSelectedProducts.length > 0) {
        this.$router.push(`/inventory/add-consignment-return-quantities`);
      } else {
        ElNotification({
          title: "",
          message: this.$t("inventory.pleaseSelectAProduct"),
          type: "error",
        });
      }
    },
    productMapping() {
      this.products = this.getProducts;
      if (
        this.getSelectedProducts.length > 0 &&
        this.products[0].product_id !== "P-KXG-0000" &&
        this.products[0].product_name !== "name"
      ) {
        this.getSelectedProducts.forEach((row) => {
          this.products.forEach((product) => {
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
        });
        this.selectedProducts = this.getSelectedProducts;
      }
    },
    handleSelectionChange(val) {
      this.setSelectedProducts(val);
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
        event: "Remove_From_Product_Selection",
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
    sanitizeName(name) {
      return name.replace(" ", "");
    },
    filterProducts(val) {
      const products = document.querySelectorAll("#product-select");
      products.forEach((row) => {
        if (row.className.toLowerCase().includes(val.toLowerCase())) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    },
    clearItems() {
      this.filterProducts("");
    },
  },
  computed: {
    ...mapGetters([
      "getSelectedProducts",
      "getProductLists",
      "getLoader",
      "getEditValue",
      "getStorageUserDetails",
      "getProductsToSubmit",
      "getMappedSelectedProducts",
      "getSearchedProducts",
      "getBusinessDetails",
      "getPagination",
    ]),
    totalProducts() {
      let total = 0;
      this.getSelectedProducts.forEach((row) => {
        if (row.quantity) {
          total = parseInt(row.quantity) + total;
        }
        if (row.damaged) {
          total = parseInt(row.damaged) + total;
        }
      });
      return total;
    },
    getProducts() {
      return this.getProductLists;
    },
  },
};
</script>

<style>
.desktop-select-products-card {
  border-color: #e2e7ed;
  margin-left: 50px;
  background: white;
  margin-bottom: 30px;
}
.el-table {
  color: #303133 !important;
  padding: 15px;
}
.el-table .el-table__cell {
  padding: 15px 0 !important;
}
.el-checkbox__inner {
  height: 20px !important;
  width: 20px !important;
  border: 1px solid !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #324ba8 !important;
}
.search-input,
.select-products-container {
  margin: 30px;
}
.form-input-group .search-icon {
  top: 7px;
}
.add-new-product {
  float: right !important;
  text-decoration: none;
  color: #324ba8;
  margin-top: -40px;
}
.product-select-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.product-select-column {
  display: flex;
  align-items: center;
}
.product-select-checkbox-inner {
  accent-color: #324ba8;
  margin-right: 35px;
  margin-left: 40px;
  width: 18px !important;
  height: 18px;
}
.product-select-units {
  margin-left: auto;
  float: right;
}
.product-select-chevron {
  font-size: 20px;
  margin-right: 35px;
}
.crossdocking-product-row {
  margin: 0px !important;
  padding: 15px 3px !important;
  border-bottom: 1px solid #e0e0e0;
}
.crossdocking-product-row-inner {
  font-size: 14px;
}
.product-select-exp-panel .v-expansion-panel__shadow {
  box-shadow: none;
}
.product-select-option {
  display: flex;
  align-items: center;
  height: 70px;
}
.product-select-panel-text .v-expansion-panel-text__wrapper {
  padding: 0px 15px;
}
.v-expansion-panel-text__wrapper {
  border-bottom: 1px solid #e0e0e0;
}
.product-select-expansion-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}
.product-select-expansion-description {
  margin-top: 10px;
  font-size: 12px;
  color: #606266;
}
.deliveries-empty-subtitle {
  color: #606266;
  font-size: 15px;
}
.send-products-title {
  font-size: 18px !important;
}
.product-select-table-titles {
  font-weight: 500;
  color: #303133;
  padding: 0px !important;
  margin-right: 0px !important;
}
.search-input-product-select {
  height: 55px;
  margin: 30px;
}
.disabled-row {
  background: #a1a0a017;
}
.consignment-product-select {
  padding-top: 50px;
}
.crossdocking-add-product-button {
  border: 1px solid;
  padding: 5px 15px;
  border-radius: 5px;
}
.crossdocking-product-select-titles {
  display: flex;
  align-items: center;
}
.crossdocking-product-counter {
  float: right;
  width: 120px !important;
}
.crossdocking-product-select-header {
  width: auto !important;
  padding: 0px !important;
}
.crossdocking-product-counter
  .el-input
  .el-input__wrapper
  .el-input__inner::placeholder {
  color: black !important;
  font-size: 14px;
}
.v-pagination__item--is-active {
  background: #324ba8 !important;
  color: white !important;
  border-radius: 10px !important;
}
.inventory-pagination {
  zoom: 90%;
}
.product-image-frame {
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-image-frame-container {
  margin-right: 20px;
  background: #e0e0e07a;
  border-radius: 5px;
  height: 40px;
  width: 40px;
}
.quantity-to-send-header {
  text-align: right;
  padding-right: 28px !important;
}
.quantity-to-send-row {
  margin-right: 15px;
}
.desktop-select-info-card {
  margin: 30px 50px 10px 50px;
  padding: 10px 20px;
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  display: flex;
  align-items: center;
}
.desktop-select-info-card-icon {
  color: #324ba8;
  margin-right: 15px;
  font-size: 20px;
}
.desktop-select-info-card-text {
  font-size: 15px;
}
.desktop-select-continue-button {
  width: 100%;
}
.quantity-to-send-row-mid {
  margin-right: -10px;
}
.available-units-row {
  display: flex;
  flex-direction: column;
  float: right;
  margin-right: -10px;
  align-items: flex-start;
}
.available-units-text {
  margin-top: 5px;
  font-size: 11px;
  font-weight: 500;
}
.product-select-height-override {
  height: 80px !important;
}
.hidden-unsellable-stock {
  display: none !important;
}
</style>
