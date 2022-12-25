<template>
  <div>
    <v-card variant="outlined" class="product-summary-card">
      <div class="p-3">
        <span class="product-summary-title">{{ $t("inventory.summary") }}</span>
        <span
          class="product-summary-edit"
          @click="$router.push('/inventory/send-inventory/sendy/add-quantity')"
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
            <span>
              <v-badge
                color="#324BA8"
                text-color="white"
                :content="`${summary.quantity}`"
              >
                <img
                  v-if="summary.selectedOption"
                  :src="summary.selectedOption.product_variant_image_link"
                  alt=""
                  class="summary-select-img"
                />
                <img
                  v-else
                  :src="summary.product_link"
                  alt=""
                  class="summary-select-img"
                />
              </v-badge>
            </span>
          </v-list-item-avatar>
          <v-list-item-header>
            <v-list-item-title class="desktop-dashboard-link-title">{{
              summary.product_name
            }}</v-list-item-title>
            <v-list-item-subtitle v-if="summary.selectedOption"
              >{{ summary.selectedOption.product_variant_quantity }}
              {{
                summary.selectedOption.product_variant_quantity_type
              }}</v-list-item-subtitle
            >
            <p v-if="summary.selectedOption" class="product-summary-amount">
              {{ summary.selectedOption.product_variant_currency }}
              {{ summary.selectedOption.product_variant_unit_price }}
            </p>
            <p v-else class="product-summary-amount">
              {{ summary.product_currency }} {{ summary.product_price }}
            </p>
          </v-list-item-header>
        </v-list-item>
      </v-list>
      <div v-if="$route.params.path === 'customer'">
        <totalAmount :products="getAllProducts" />
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import totalAmount from "./totalAmount.vue";

export default {
  components: { totalAmount },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getSelectedProducts"]),
    getAllProducts() {
      let products = [];
      this.getSelectedProducts.forEach((row) => {
        if (row.quantity) {
          products.push(row);
        }
      });
      return products;
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
</style>
