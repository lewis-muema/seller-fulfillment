<template>
  <div>
    <v-card variant="outlined" class="desktop-add-product-card">
      <div class="d-flex desktop-header-title pl-5">
        <router-link to="auth/sign-up">
          <i class="mdi mdi-arrow-left" aria-hidden="true"></i
        ></router-link>

        <v-card-title class="text-center"> Add Product </v-card-title>
      </div>
      <v-row class="desktop-add-product-card-content">
        <v-col cols="6">
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

          <div class="mb-2">
            <label for="price" class="form-label">Price</label>
            <div>
              <input type="text" class="form-control" placeholder="KES" />
            </div>
          </div>
          <div class="row mb-2">
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
            <label for="price" class="form-label">Description(optional)</label>
            <div>
              <textarea
                class="form-control"
                id=""
                rows="3"
                placeholder="Enter description of the product"
              ></textarea>
            </div>
          </div>
          <div class="desktop-product-options-container">
            <div class="desktop-product-options-content">
              <p class="optional-text">Product options (optional)</p>
              <p class="add-product-sizes">
                Add options if this product comes in different sizes or colours
              </p>
              <p class="add-product-options" @click="addProductOptions">
                Add product options
              </p>
            </div>
          </div>
          <button class="btn btn-primary mt-2">Save Product</button>
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
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit("setComponent", this.$t("common.addProduct"));
  },
};
</script>

<style>
.desktop-add-product-card {
  width: 80%;
  margin: auto !important;
  border-color: #e2e7ed;
  margin-top: 50px !important;
  height: 80vh;
}
.desktop-add-product-card-content {
  padding: 20px 50px !important;
}
.form-control::placeholder {
  color: #909399 !important;
}
.desktop-product-options-container {
  background: #f7f9fc;
  border: 1px solid #f7f9fc;
  border-radius: 6px;
}
.desktop-product-options-content {
  padding: 20px 20px 0px 0px !important;
}
.add-product-sizes,
.add-product-options {
  font-size: 13px;
}
.desktop-product-options-content .optional-text {
  font-size: 15px;
}
.add-product-options {
  color: #324ba8;
  cursor: pointer;
}
.img-container {
  border-style: dashed;
  border-color: #909399;
  margin: auto !important;
  max-width: 500px !important;
  height: 23vh;
  margin: 0px 50px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-container > i,
.upload {
  color: #324ba8 !important;
  font-size: 17px;
}
</style>
