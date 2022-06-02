<template>
  <div>
    <v-row>
      <v-col cols="8" class="mx-auto">
        <v-card variant="outlined" class="p-details">
          <div class="d-flex desktop-header-title mb-2">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="$router.back()"
            ></i>

            <v-card-title class="text-center">Add Product </v-card-title>
          </div>
          <v-row class="">
            <v-col cols="">
              <div class="mb-2">
                <label for="productName" class="form-label"
                  >Name of the Product</label
                >
                <div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter name of the Product"
                  />
                </div>
              </div>

              <div class="mb-2" v-if="!productOptions.length">
                <label for="price" class="form-label">Price</label>
                <div>
                  <input type="text" class="form-control" placeholder="KES" />
                </div>
              </div>
              <div class="row mb-2" v-if="!productOptions.length">
                <label for="price" class="form-label"
                  >Weight or the volume of the product</label
                >
                <div class="col-8">
                  <input type="text" class="form-control" placeholder="0.0" />
                </div>
                <div class="col-4">
                  <input type="text" class="form-control" placeholder="gms" />
                </div>
              </div>
              <div class="mb-2">
                <label for="price" class="form-label"
                  >Description(optional)</label
                >
                <div>
                  <textarea
                    class="form-control"
                    id=""
                    rows="3"
                    placeholder="Enter description of the product"
                  ></textarea>
                </div>
              </div>
              <div class="desktop-product-options-container mt-3 mb-3">
                <div class="desktop-product-options-content">
                  <p class="optional-text">Product options (optional)</p>
                  <p class="add-product-sizes">
                    Add options if this product comes in different sizes or
                    colours
                  </p>
                  <v-list-item
                    lines="two"
                    v-for="(options, index) in productOptions"
                    :key="index"
                  >
                    <v-list-item-avatar>
                      <v-icon class="dashboard-links-icon mr-5"
                        >mdi-check-circle
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-header>
                      <v-list-item-title>{{ options.name }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ options.weight }}
                      </v-list-item-subtitle>
                    </v-list-item-header>
                    <v-list-item-avatar end>
                      <v-icon>mdi mdi-pencil-box </v-icon>
                    </v-list-item-avatar>
                  </v-list-item>
                  <p
                    class="add-product-options"
                    @click="showProductOptions = true"
                  >
                    Add product options
                  </p>
                  <product-options
                    :visible="showProductOptions"
                    @close="showProductOptions = false"
                    @addOptions="addProductOptions"
                  />
                </div>
              </div>
              <div class="d-grid">
                <button
                  class="btn btn-primary mt-2 btn-long"
                  @click="addProduct"
                >
                  Save Product
                </button>
              </div>
            </v-col>
            <v-col cols="6">
              <p class="ml-5">Image (optional)</p>
              <div class="img-container">
                <i class="mdi mdi-upload" aria-hidden="true"></i>
                <span class="upload">Upload</span>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import productOptions from "@/modules/inventory/products/components/productOptions";
import { ElNotification } from "element-plus";
export default {
  components: { productOptions },
  data() {
    return {
      productOptions: [],
      showProductOptions: false,
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.addProduct"));
  },
  methods: {
    addProductOptions(value) {
      this.productOptions.push(JSON.parse(JSON.stringify(value)));
    },
    addProduct() {
      ElNotification({
        title: "Product Saved successfully",
        message: "",
        duration: 0,
        type: "success",
      });
      this.$route.push({ name: "Products" });
    },
  },
};
</script>

<style>
.form-control::placeholder {
  color: #909399 !important;
}
.desktop-product-options-container {
  background: #f7f9fc;
  border: 1px solid #f7f9fc;
  border-radius: 6px;
}
.desktop-product-options-content {
  padding: 20px 20px 0px 20px !important;
}
.add-product-sizes,
.add-product-options {
  font-size: 13px;
  line-height: 1.2;
}
.desktop-product-options-content .optional-text {
  font-size: 15px;
}
.add-product-options {
  color: #324ba8;
  cursor: pointer;
}
.img-container > i,
.upload {
  color: #324ba8 !important;
  font-size: 17px;
}
label {
  color: #303133;
}
</style>
