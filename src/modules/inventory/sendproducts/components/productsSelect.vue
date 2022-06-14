<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-card variant="outlined" class="desktop-select-products-card">
          <div class="select-products-container">
            <div class="enter-quantity-container desktop-header-title d-flex">
              <i
                class="mdi mdi-arrow-left"
                aria-hidden="true"
                @click="pickScreen()"
              ></i>
              <v-card-title class="text-center">
                {{ $t("inventory.selectProducts") }}
              </v-card-title>
            </div>
            <router-link to="/inventory/add-product/" class="add-new-product">
              <v-icon>mdi mdi-plus</v-icon>
              {{ $t("inventory.addNewProduct") }}
            </router-link>
          </div>
          <div class="search-input">
            <div class="form-input-group">
              <i class="mdi mdi-magnify search-icon"></i>
              <input
                type="text"
                class="form-control"
                placeholder="Search for product"
              />
            </div>
          </div>
          <hr />
          <v-table>
            <thead>
              <tr>
                <th>
                  <span>{{ $t("settings.name") }}</span
                  ><span class="product-select-units">
                    {{ $t("inventory.availableInventory") }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, i) in products" :key="i">
                <td v-if="!product.product_variants">
                  <div class="product-select-column">
                    <input
                      type="checkbox"
                      class="product-select-checkbox"
                      @click="
                        product.status
                          ? removeProduct(product, i)
                          : addProduct(product, i)
                      "
                      :checked="product.status"
                    />
                    <span>
                      <img
                        :src="product.product_link"
                        alt=""
                        class="product-select-img"
                      />
                      <span :class="getLoader">
                        {{ product.product_name }}
                      </span>
                    </span>
                    <span :class="getLoader" class="product-select-units"
                      >{{ product.available }} {{ $t("inventory.units") }}</span
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
                        <span>
                          <img
                            :src="product.product_link"
                            alt=""
                            class="product-select-img"
                          />
                          <span :class="getLoader">
                            {{ product.product_name }}
                          </span>
                        </span>
                        <span :class="getLoader" class="product-select-units"
                          >{{ product.available }} units</span
                        >
                      </v-expansion-panel-title>
                      <v-expansion-panel-text class="product-select-panel-text">
                        <div
                          class="product-select-option"
                          v-for="(option, x) in product.product_variants"
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
                          />
                          <img
                            :src="option.product_variant_image_link"
                            alt=""
                            class="product-select-img"
                          />
                          <span
                            >{{ option.product_variant_quantity }}
                            {{ option.product_variant_quantity_type }}</span
                          >
                          <span :class="getLoader" class="product-select-units"
                            >{{
                              option.product_variant_stock_levels.available
                            }}
                            units</span
                          >
                        </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </tr>
            </tbody>
          </v-table>
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
              @click="addProductStep(1)"
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
import { mapMutations, mapGetters } from "vuex";
import { ElNotification } from "element-plus";

export default {
  components: {},
  data() {
    return {
      products: [],
      selectedProducts: [],
    };
  },
  mounted() {
    this.setComponent(
      this.getSendProductsRoute === "ProductsToSendy"
        ? this.$t("common.sendInventoryToSendy")
        : this.$t("common.sendDeliveryToCustomer")
    );
    setTimeout(() => {
      this.setLoader();
    }, 1000);
    this.productMapping();
  },
  methods: {
    ...mapMutations([
      "setSelectedProducts",
      "setLoader",
      "setProductStep",
      "setComponent",
    ]),
    addProductStep(val) {
      if (this.getSelectedProducts.length > 0) {
        this.setProductStep(val);
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
      if (this.getSelectedProducts.length > 0) {
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
    },
    removeProduct(product, i, option, x) {
      this.selectedProducts.forEach((row, p) => {
        if (row.productIndex === i && row.optionIndex === undefined) {
          this.products[i].status = false;
          this.selectedProducts.splice(p, 1);
        } else if (
          row.productIndex === i &&
          row.optionIndex !== undefined &&
          row.optionIndex === x
        ) {
          this.products[i].product_variants[x].status = false;
          this.selectedProducts.splice(p, 1);
        }
      });
    },
    pickScreen() {
      this.$emit("pickScreen", 0);
    },
  },
  computed: {
    ...mapGetters([
      "getSelectedProducts",
      "getProductLists",
      "getSendProductsRoute",
      "getLoader",
    ]),
    itemsSelectedCount() {
      return this.getSelectedProducts.length;
    },
    getProducts() {
      return this.getProductLists.data.products;
    },
  },
};
</script>

<style>
.desktop-select-products-card {
  border-color: #e2e7ed;
  margin-left: 50px;
  background: white;
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
  width: min-content;
}
.product-select-img {
  width: 40px;
  margin-right: 20px;
}
.product-select-column {
  display: flex;
  align-items: center;
}
.product-select-checkbox {
  accent-color: #324ba8;
  margin-right: 20px;
}
.product-select-checkbox-inner {
  accent-color: #324ba8;
  margin-right: 20px;
  margin-left: 40px;
}
.product-select-units {
  margin-left: auto;
  float: right;
}
.product-select-chevron {
  font-size: 20px;
  margin-right: 15px;
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
</style>
