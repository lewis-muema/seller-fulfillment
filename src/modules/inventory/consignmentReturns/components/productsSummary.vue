<template>
  <div>
    <v-card variant="outlined" class="product-summary-card">
      <div class="p-3">
        <span class="product-summary-title">{{ $t("inventory.summary") }}</span>
        <span
          class="product-summary-edit"
          @click="$router.push('/inventory/add-consignment-return-products')"
          ><v-icon class="pr-3"> mdi mdi-pencil</v-icon>
          {{ $t("inventory.edit") }}
        </span>
      </div>
      <v-list
        class="product-summary-list-item"
        v-for="(summary, index) in getAllProducts"
        :key="index"
      >
        <v-list-item>
          <v-list-item-avatar>
            <span>
              <i
                @click="removeProductOption(index)"
                class="mdi mdi-close product-summary-list-item-close"
              ></i>
            </span>
            <span class="product-image-frame-container mr-1">
              <v-badge
                color="#324BA8"
                text-color="white"
                :content="`${totalSingleProduct(summary)}`"
              >
                <div class="product-image-frame">
                  <img
                    v-if="summary.selectedOption"
                    :src="summary.selectedOption.product_variant_image_link"
                    alt=""
                    class="product-select-img"
                  />
                  <img
                    v-else
                    :src="
                      summary.product_variants[0].product_variant_image_link
                    "
                    alt=""
                    class="product-select-img"
                  />
                </div>
              </v-badge>
            </span>
          </v-list-item-avatar>
          <v-list-item-header>
            <v-list-item-title class="product-summary-list-title">{{
              summary.product_name
            }}</v-list-item-title>
            <v-list-item-subtitle>
              <span v-if="summary.quantity">
                {{
                  $t("inventory.unitsAvailable", {
                    Count: summary.quantity,
                  })
                }}
              </span>
              <span
                class="mr-2 ml-2"
                v-if="summary.damaged && summary.quantity"
              >
                |
              </span>
              <span v-if="summary.damaged">
                {{
                  $t("inventory.unitsDamaged", {
                    Count: summary.damaged,
                  })
                }}</span
              >
            </v-list-item-subtitle>
          </v-list-item-header>
        </v-list-item>
      </v-list>
      <div class="product-summary-list-units">
        {{ totalProducts }} {{ $t("inventory.units") }}
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getSelectedProducts"]),
    getAllProducts() {
      let products = [];
      this.getSelectedProducts.forEach((row) => {
        if (row.quantity || row.damaged) {
          products.push(row);
        }
      });
      return products;
    },
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
  },
  methods: {
    ...mapMutations(["setSelectedProducts", "setProductStep"]),
    removeProductOption(index) {
      const products = this.getSelectedProducts;
      products.splice(index, 1);
      this.setSelectedProducts(products);
    },
    addProductStep(val) {
      this.setProductStep(val);
    },
    totalSingleProduct(product) {
      const quantity = product.quantity ? product.quantity : 0;
      const damaged = product.damaged ? product.damaged : 0;
      return quantity + damaged;
    },
  },
};
</script>

<style>
.product-summary-card {
  border-color: #e2e7ed;
}
.product-summary-amount {
  font-size: 12px;
}
hr {
  margin: 0 !important;
}
.product-summary-edit {
  float: right;
  color: #324ba8;
  cursor: pointer;
}
.product-summary-edit .mdi {
  font-size: 14px;
}
.product-summary-title {
  font-size: 19px;
}
.product-summary-list-item {
  box-shadow: none;
}
.product-summary-list-item-close {
  cursor: pointer;
  margin-right: 10px;
}
.summary-select-img {
  width: 40px;
}
.product-summary-list-item .v-list-item .v-list-item-avatar {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.product-summary-list-title {
  color: #303133;
  font-size: 16px !important;
  margin-bottom: 2px;
}
.product-summary-list-units {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #e2e7ed;
}
</style>
