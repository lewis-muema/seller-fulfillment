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

            <v-card-title class="text-center">Edit Product </v-card-title>
          </div>
          <v-row>
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
                  <v-list-item lines="two">
                    <v-list-item-avatar>
                      <v-icon class="dashboard-links-icon mr-5"
                        >mdi-check-circle
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-header>
                      <v-list-item-title>Shear Butter</v-list-item-title>
                      <v-list-item-subtitle> 250ml </v-list-item-subtitle>
                    </v-list-item-header>
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
                  />
                </div>
              </div>
              <div class="d-grid">
                <button class="btn btn-primary mt-2 btn-long">
                  Save Changes
                </button>
              </div>
            </v-col>
            <v-col cols="6">
              <p class="ml-5">Image (optional)</p>
              <div class="edit-product-img-container">
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
export default {
  components: {
    productOptions,
  },
  data() {
    return {
      productVariants: "",
      showProductOptions: false,
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.productDetails"));
    if (this.$route.params.pV) {
      this.productVariants = JSON.parse(this.$route.params.pV);
      console.log("from edit", this.productVariants);
    }
  },
  computed: {
    variants() {
      const res = JSON.parse(JSON.stringify(this.productVariants));
      return res;
    },
  },
};
</script>

<style>
.edit-product-img-container {
  height: 200px;
  width: 200px;
  margin: 25px;
  border: 1px dashed grey;
  margin: 0px 50px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
