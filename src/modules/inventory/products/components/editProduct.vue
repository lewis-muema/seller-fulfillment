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

            <v-card-title class="text-center">{{
              $t("inventory.editProduct")
            }}</v-card-title>
          </div>
          <v-row>
            <v-col cols="">
              <div class="mb-2">
                <label for="productName" class="form-label">{{
                  $t("inventory.nameOfProduct")
                }}</label>
                <div>
                  <input
                    type="text"
                    class="form-control"
                    value="Shear Butter"
                    :placeholder="$t('inventory.enterNameOfProduct')"
                    disabled
                  />
                </div>
              </div>

              <div class="mb-2">
                <label for="price" class="form-label">{{
                  $t("inventory.price")
                }}</label>
                <div>
                  <input type="text" class="form-control" placeholder="KES" />
                </div>
              </div>
              <div class="row mb-2">
                <label for="price" class="form-label">{{
                  $t("inventory.weight")
                }}</label>
                <div class="col-8">
                  <input type="text" class="form-control" placeholder="0.0" />
                </div>
                <div class="col-4">
                  <select class="form-select">
                    <option selected>gms</option>
                  </select>
                </div>
              </div>
              <div class="mb-2">
                <label for="price" class="form-label">{{
                  $t("inventory.description")
                }}</label>
                <div>
                  <textarea
                    class="form-control"
                    id=""
                    rows="3"
                    :placeholder="$t('inventory.productDescription')"
                  ></textarea>
                </div>
              </div>
              <div class="desktop-product-options-container mt-3 mb-3">
                <div class="desktop-product-options-content">
                  <p class="optional-text">
                    {{ $t("inventory.productOptions") }}
                  </p>
                  <p class="add-product-sizes">
                    {{ $t("inventory.addOptions") }}
                  </p>
                  <div v-if="productVariants.length">
                    <v-list-item
                      lines="two"
                      v-for="(variant, index) in variants"
                      :key="index"
                    >
                      <v-list-item-avatar>
                        <v-icon class="dashboard-links-icon mr-5"
                          >mdi-check-circle
                        </v-icon>
                      </v-list-item-avatar>
                      <v-list-item-header>
                        <v-list-item-title>{{ name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ variant.product_variant_quantity }} ml
                        </v-list-item-subtitle>
                      </v-list-item-header>
                      <v-list-item-avatar end>
                        <v-icon>mdi mdi-pencil-box </v-icon>
                      </v-list-item-avatar>
                    </v-list-item>
                  </div>
                  <p
                    class="add-product-options"
                    @click="showProductOptions = true"
                  >
                    {{ $t("inventory.addProductOptions") }}
                  </p>
                  <product-options
                    :visible="showProductOptions"
                    @close="showProductOptions = false"
                  />
                </div>
              </div>
              <div class="d-grid">
                <button class="btn btn-primary mt-2 btn-long mb-2">
                  {{ $t("inventory.saveChanges") }}
                </button>
              </div>
            </v-col>
            <v-col cols="6">
              <p class="ml-5">{{ $t("inventory.image") }}</p>
              <div class="img-container">
                <i class="mdi mdi-upload" aria-hidden="true"></i>
                <span class="upload">{{ $t("inventory.upload") }}</span>
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
      name: "Shea Butter",
      productVariants: "",
      showProductOptions: false,
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.productDetails"));
    if (this.$route.params.pV) {
      this.productVariants = JSON.parse(this.$route.params.pV);
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
.img-container {
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
