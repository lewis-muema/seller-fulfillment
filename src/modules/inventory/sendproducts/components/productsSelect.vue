<template>
  <div
    :class="getEditValue === 'consignment' ? 'consignment-product-select' : ''"
  >
    <v-row>
      <v-col cols="8">
        <v-card variant="outlined" class="desktop-select-products-card">
          <div class="select-products-container">
            <div class="enter-quantity-container desktop-header-title d-flex">
              <i
                class="mdi mdi-arrow-left"
                aria-hidden="true"
                @click="
                  getEditValue === 'inventory'
                    ? $router.push('/inventory/send-inventory')
                    : $router.go(-1)
                "
              ></i>
              <v-card-title class="text-center send-products-title">
                {{ $t("inventory.selectProducts") }}
              </v-card-title>
            </div>
            <router-link
              to="/inventory/add-product/"
              class="add-new-product"
              v-if="getEditValue !== 'consignment'"
            >
              <v-icon>mdi mdi-plus</v-icon>
              {{ $t("inventory.addNewProduct") }}
            </router-link>
          </div>
          <div class="search-input-product-select">
            <searchAlgolia type="product" />
          </div>
          <hr />
          <v-table v-if="products.length > 0">
            <thead>
              <tr>
                <th class="product-select-table-titles">
                  <span>{{ $t("settings.name") }}</span
                  ><span class="product-select-units">
                    {{ $t("inventory.availableInventory") }}
                  </span>
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
                  <div class="product-select-column">
                    <input
                      type="checkbox"
                      class="product-select-checkbox"
                      @click="
                        product.status
                          ? removeProduct(
                              product,
                              i,
                              product.product_variants[0],
                              0
                            )
                          : addProduct(
                              product,
                              i,
                              product.product_variants[0],
                              0
                            )
                      "
                      :checked="product.status"
                      :disabled="disabledStatus(product)"
                    />
                    <span>
                      <img
                        :src="
                          product.product_variants[0].product_variant_image_link
                        "
                        v-if="!getLoader.products"
                        alt=""
                        class="product-select-img"
                      />
                      <span :class="getLoader.products">
                        {{ product.product_name }}
                      </span>
                    </span>
                    <span
                      :class="getLoader.products"
                      class="product-select-units"
                      >{{
                        product.product_variants[0].product_variant_stock_levels
                          ? product.product_variants[0]
                              .product_variant_stock_levels.available
                          : "-"
                      }}
                      {{ $t("inventory.units") }}</span
                    >
                  </div>
                </td>
                <div v-else>
                  <v-expansion-panels>
                    <v-expansion-panel class="product-select-exp-panel">
                      <v-expansion-panel-title
                        class="product-select-exp-title"
                        hide-actions
                      >
                        <span>
                          <i
                            class="mdi mdi-chevron-down product-select-chevron"
                          ></i>
                        </span>
                        <span class="d-flex">
                          <img
                            :src="
                              product.product_variants[0]
                                .product_variant_image_link
                            "
                            v-if="!getLoader.products"
                            alt=""
                            class="product-select-img"
                          />
                          <span class="product-select-expansion-title">
                            <div>
                              <span :class="getLoader.products">
                                {{ product.product_name }}
                              </span>
                            </div>
                            <div class="product-select-expansion-description">
                              <span :class="getLoader.products">
                                {{
                                  variantFilter(product.product_variants).length
                                }}
                                {{ $t("inventory.producTOptions") }}
                              </span>
                            </div>
                          </span>
                        </span>
                        <span
                          :class="getLoader.products"
                          class="product-select-units"
                          >{{
                            product.product_variants[0]
                              .product_variant_stock_levels
                              ? product.product_variants[0]
                                  .product_variant_stock_levels.available
                              : "-"
                          }}
                          {{ $t("inventory.units") }}</span
                        >
                      </v-expansion-panel-title>
                      <v-expansion-panel-text class="product-select-panel-text">
                        <div
                          class="product-select-option"
                          :class="
                            disabledVariantStatus(option) ? 'disabled-row' : ''
                          "
                          v-for="(option, x) in variantFilter(
                            product.product_variants
                          )"
                          :key="x"
                        >
                          <input
                            type="checkbox"
                            class="product-select-checkbox-inner"
                            @click="
                              option.status
                                ? removeProduct(product, i, option, x)
                                : addProduct(product, i, option, x)
                            "
                            :checked="option.status"
                            :disabled="disabledVariantStatus(option)"
                          />
                          <img
                            :src="option.product_variant_image_link"
                            alt=""
                            class="product-select-img"
                          />
                          <span :class="getLoader.products">{{
                            option.product_variant_description
                          }}</span>
                          <span
                            :class="getLoader.products"
                            class="product-select-units"
                            >{{
                              option.product_variant_stock_levels
                                ? option.product_variant_stock_levels.available
                                : "-"
                            }}
                            {{ $t("inventory.units") }}</span
                          >
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
      </v-col>
      <v-col cols="4">
        <v-card
          variant="outlined"
          class="desktop-select-products-card items-selected-card"
        >
          <div class="items-selected-container">
            <p>
              {{ `${itemsSelectedCount} ${$t("inventory.itemsSelected")}` }}
            </p>
            <button
              type="submit"
              @click="addProductStep()"
              class="btn btn-primary"
            >
              {{ $t("inventory.continueWith") }} {{ itemsSelectedCount }}
              {{ $t("inventory.itemsAdded") }}
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
import searchAlgolia from "../../../common/searchAlgolia.vue";

export default {
  mixins: [eventsMixin, placeholder],
  data() {
    return {
      products: [],
      selectedProducts: [],
      searchProduct: "",
      mappedSelectedProducts: [],
    };
  },
  components: {
    searchAlgolia,
  },
  watch: {
    searchProduct(val) {
      this.filterProducts(val.replace(" ", ""));
    },
  },
  mounted() {
    this.setComponent(
      this.$route.params.path === "sendy"
        ? "common.sendInventoryToSendy"
        : "common.sendDeliveryToCustomer"
    );
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
    ]),
    ...mapActions(["requestAxiosGet"]),
    variantFilter(variants) {
      let variant = [];
      variants.forEach((row) => {
        variant.push(row);
      });
      return variant;
    },
    disabledStatus(product) {
      const quantity = product.product_variants[0].product_variant_stock_levels
        ? product.product_variants[0].product_variant_stock_levels.available
        : 0;
      return (
        this.$route.params.path === "customer" &&
        quantity === 0 &&
        process.env.DOCKER_ENV === "production"
      );
    },
    disabledVariantStatus(option) {
      const quantity = option
        ? option.product_variant_stock_levels.available
        : 0;
      return (
        this.$route.params.path === "customer" &&
        quantity === 0 &&
        process.env.DOCKER_ENV === "production"
      );
    },
    fetchProducts() {
      this.setLoader({
        type: "products",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products?max=10`,
      }).then((response) => {
        if (
          this.$route.path ===
          `/inventory/send-inventory/${this.$route.params.path}/select-products`
        ) {
          this.setLoader({
            type: "products",
            value: "",
          });
        }

        if (response.status === 200) {
          const products = response.data.data.products;
          products.push(...this.getSearchedProducts);
          this.setProductLists(products);
          this.productMapping();
        }
      });
    },
    addProductStep() {
      if (this.getSelectedProducts.length > 0) {
        if (this.getEditValue === "consignment") {
          this.mapProductsOnOrder();
          this.setProductsToSubmit([
            ...this.getProductsToSubmit,
            ...this.getMappedSelectedProducts,
          ]);
          this.setMappedSelectedProducts([]);
        }
        this.$router.push(
          this.getEditValue === "consignment"
            ? "/deliveries/edit-order"
            : `/inventory/send-inventory/${this.$route.params.path}/add-quantity`
        );
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
      this.products.forEach((row) => {
        row.status = false;
        if (row.product_variants) {
          row.product_variants.forEach((option) => {
            option.status = false;
          });
        }
      });
      if (
        this.getSelectedProducts.length > 0 &&
        this.products[0].product_id !== "P-KXG-0000" &&
        this.products[0].product_name !== "name"
      ) {
        this.getSelectedProducts.forEach((row) => {
          this.products[row.productIndex].status = true;
          if (row.selectedOption) {
            this.products[row.productIndex].product_variants[
              row.optionIndex
            ].status = true;
          }
        });
        this.selectedProducts = this.getSelectedProducts;
      }
    },
    mapProductsOnOrder() {
      if (this.getEditValue === "consignment") {
        if (this.selectedProducts.length) {
          this.selectedProducts.forEach((product) => {
            const existingProductIndex = this.getProductsToSubmit.findIndex(
              (x) =>
                x.product_variant_id ===
                product.selectedOption.product_variant_id
            );
            if (existingProductIndex === -1) {
              const mappedSelectedProduct = {
                product_id: product.product_id,
                product_variant_id: product.selectedOption.product_variant_id,
                product_variant_image_link:
                  product.selectedOption.product_variant_image_link,
                product_name: product.product_name,
                product_variant_description:
                  product.selectedOption.product_variant_description,
                product_variant_quantity:
                  product.selectedOption.product_variant_quantity,
                product_variant_quantity_type:
                  product.selectedOption.product_variant_quantity_type,
                quantity: 0,
                unit_price: product.selectedOption.product_variant_unit_price,
                currency: product.selectedOption.product_variant_currency,
                status: true,
              };
              this.mappedSelectedProducts.push(mappedSelectedProduct);
              this.setMappedSelectedProducts(this.mappedSelectedProducts);
              this.selectedProducts = [];
            }
          });
        }
      }
    },
    handleSelectionChange(val) {
      this.setSelectedProducts(val);
    },
    addProduct(product, i, option, x) {
      let newProduct = {};
      Object.keys(product).forEach((row) => {
        newProduct[row] = product[row];
      });
      product.status = true;
      if (option) {
        newProduct.optionIndex = x;
        newProduct.selectedOption = option;
        option.status = true;
      }
      newProduct.productIndex = i;
      this.selectedProducts.push(newProduct);
      this.setSelectedProducts(this.selectedProducts);
      if (this.$route.params.path === "customer") {
        this.sendSegmentEvents({
          event: "Product_Selection",
          data: {
            userId: this.getStorageUserDetails.business_id,
            SKU: this.products[i].product_id,
            variant: this.products[i].product_variants[x].product_variant_id,
            product_collection: this.products[i].product_collection
              ? this.products[i].product_collection.collection_id
              : "",
            clientType: "web",
            device: "desktop",
          },
        });
      }
    },
    removeProduct(product, i, option, x) {
      this.selectedProducts.forEach((row, p) => {
        if (row.productIndex === i && row.product_variants.length === 1) {
          this.products[i].status = false;
          this.selectedProducts.splice(p, 1);
        } else if (
          row.productIndex === i &&
          row.product_variants.length > 1 &&
          row.optionIndex === x
        ) {
          this.products[i].product_variants[x].status = false;
          this.selectedProducts.splice(p, 1);
        }
      });
      if (this.$route.params.path === "customer") {
        this.sendSegmentEvents({
          event: "Remove_from_Product_Selection",
          data: {
            userId: this.getStorageUserDetails.business_id,
            SKU: this.products[i].product_id,
            variant: this.products[i].product_variants[x].product_variant_id,
            product_collection: this.products[i].product_collection
              ? this.products[i].product_collection.collection_id
              : "",
            clientType: "web",
            device: "desktop",
          },
        });
      }
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
    ]),
    itemsSelectedCount() {
      return this.getSelectedProducts.length;
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
.product-select-checkbox {
  height: 70px;
  width: 18px !important;
}
.product-select-column {
  display: flex;
  align-items: center;
}
.product-select-checkbox {
  accent-color: #324ba8;
  margin-right: 35px;
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
.product-select-exp-title {
  padding: 15px !important;
  border-bottom: 1px solid #e0e0e0;
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
.product-select-expansion-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
</style>
