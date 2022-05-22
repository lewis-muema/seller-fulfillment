<template>
  <div>
    <Stepper />
    <div>
      <v-row>
        <v-col cols="8">
          <v-card variant="outlined" class="desktop-select-products-card">
            <div class="select-products-container">
              <span>Select product</span>
              <span>
                <router-link
                  to="/inventory/add-product/"
                  class="add-new-product"
                  >add a new product</router-link
                >
              </span>
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
            <el-table
              ref="multipleTableRef"
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column
                label="Name"
                property="name"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                property="price"
                label="Price"
                show-overflow-tooltip
              />
            </el-table>
          </v-card>
        </v-col>
        <v-col cols="3"> Test </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Stepper from "./stepper.vue";
export default {
  components: { Stepper },
  data() {
    return {
      tableData: [
        {
          name: "Fossil men’s watch",
          price: "KES 2500",
        },
        {
          name: "Shear Butter",
          price: "KES 450 - KES 3000",
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
  methods: {
    ...mapMutations(["setSelectedProducts"]),
    handleSelectionChange(val) {
      this.setSelectedProducts(val);
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
}
</style>
