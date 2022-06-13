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
                @click="$router.back()"
              ></i>
              <v-card-title class="text-center">
                {{ $t("inventory.selectProducts") }}</v-card-title
              >
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
                :placeholder="$t('inventory.searchProduct')"
              />
            </div>
          </div>
          <hr />
          <el-table
            ref="multipleTable"
            :data="products"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>

            <el-table-column
              label="Name"
              property="product_name"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column property="available" label="Available inventory" />
          </el-table>
        </v-card>
      </v-col>
      <v-col cols="4">
        <items-selected :itemsSelectedCount="itemsSelectedCount" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import itemsSelected from "./itemsSelected";
export default {
  components: { itemsSelected },
  data() {
    return {
      tableData: [
        {
          name: "Fossil men’s watch",
          price: "KES 2500",
          quantity: 0,
        },
        {
          name: "Shear Butter",
          price: "KES 450 - KES 3000",
          quantity: 0,
          productOptions: [
            {
              name: "250ml",
              price: "KES 800",
            },
            {
              name: "750ml",
              price: "KES 1500",
            },
            {
              name: "1000ml",
              price: "KES 3000",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.$store.commit(
      "setComponent",
      this.$route.name === "ProductsToSendy"
        ? this.$t("common.sendInventoryToSendy")
        : this.$t("common.sendDeliveryToCustomer")
    );
  },
  methods: {
    ...mapMutations(["setSelectedProducts"]),
    handleSelectionChange(val) {
      this.setSelectedProducts(val);
    },
  },
  computed: {
    ...mapGetters(["getSelectedProducts", "getProductLists"]),
    itemsSelectedCount() {
      return this.getSelectedProducts.length;
    },
    products() {
      return this.getProductLists.data.products;
    },
  },
};
</script>

<style>
.desktop-select-products-card {
  border-color: #e2e7ed;
  margin-left: 50px;
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
</style>
