<template>
  <div>
    <v-row>
      <v-col cols="">
        <div class="mb-2">
          <label for="productName" class="form-label">
            {{ $t("inventory.nameOfProduct") }}</label
          >
          <div>
            <input
              type="text"
              class="form-control"
              v-model="name"
              :placeholder="$t('inventory.enterNameOfProduct')"
              :disabled="action === 'editProduct'"
            />
          </div>
        </div>
        <div class="mb-2">
          <label for="desc" class="form-label">
            {{ $t("inventory.description") }}</label
          >
          <div>
            <textarea
              class="form-control"
              id="desc"
              rows="3"
              v-model="productDescription"
              :placeholder="$t('inventory.productDescription')"
            ></textarea>
          </div>
        </div>
        <div class="desktop-product-options-container mt-3 mb-3">
          <div class="desktop-product-options-content">
            <p class="optional-text">{{ $t("inventory.productOptions") }}</p>
            <p class="add-product-sizes">
              {{ $t("inventory.addOptions") }}
            </p>
            <div v-if="productVariants.length">
              <v-list-item
                lines="two"
                v-for="(variant, index) in productVariants"
                :key="index"
                class="desktop-product-option-card"
              >
                <v-list-item-avatar>
                  <img
                    :src="variant.product_variant_image_link"
                    class="desktop-product-options-img"
                    alt=""
                  />
                </v-list-item-avatar>
                <v-list-item-header>
                  <v-list-item-title>
                    {{ variant.product_variant_quantity }}
                    {{ variant.product_variant_quantity_type }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ variant.product_variant_currency }}
                    {{ variant.product_variant_unit_price }}
                  </v-list-item-subtitle>
                </v-list-item-header>
                <v-list-item-avatar end>
                  <div
                    class="desktop-product-options-icon"
                    @click="editProductOption(index)"
                  >
                    <v-icon>mdi mdi-pencil </v-icon>
                  </div>
                </v-list-item-avatar>
                <v-list-item-avatar end>
                  <div
                    class="desktop-product-options-icon"
                    @click="deleteProductOption(index)"
                  >
                    <v-icon>mdi mdi-delete-outline </v-icon>
                  </div>
                </v-list-item-avatar>
              </v-list-item>
            </div>
            <div class="add-product-options">
              <p class="add-product-options" @click="showAddOption()">
                {{ $t("inventory.addProductOptions") }}
              </p>
              <img
                v-if="productVariants.length === 0"
                class="add-product-options-img"
                src="https://images.sendyit.com/fulfilment/seller/shirts.png"
                alt=""
              />
            </div>
            <product-options
              :option="activeOption"
              :visible="showProductOptions"
              @close="showProductOptions = false"
              @addOptions="addProductOptions"
              @saveOptions="saveProductOptions"
            />
          </div>
        </div>
        <div class="d-grid">
          <button
            class="btn btn-primary mt-2 btn-long"
            v-if="action === 'editProduct'"
            @click="saveProduct()"
            v-loading="buttonLoader"
          >
            {{ $t("inventory.saveChanges") }}
          </button>
          <button
            class="btn btn-primary mt-2 btn-long"
            v-else
            @click="addProduct()"
            v-loading="buttonLoader"
          >
            {{ $t("inventory.saveChanges") }}
          </button>
        </div>
      </v-col>
      <v-col cols="6">
        <p class="ml-5">{{ $t("inventory.image") }}</p>
        <div class="img-container" @click="pickImg()">
          <input
            type="file"
            name
            value
            class="form-control"
            placeholder="Upload"
            accept="image/*"
            id="upload-img"
            style="display: none"
            @change="uploadImg('upload-img', 'edit')"
          />
          <img class="upload-img" v-if="image" :src="image" alt="" />
          <span v-else class="upload">
            <i class="mdi mdi-upload" aria-hidden="true"></i>
            {{ $t("inventory.upload") }}
          </span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import productOptions from "@/modules/inventory/products/components/productOptions";
import upload_img from "../../../../mixins/upload_img";
import { ElNotification } from "element-plus";
import { mapMutations, mapGetters, mapActions } from "vuex";
import eventsMixin from "../../../../mixins/events_mixin";

export default {
  components: {
    productOptions,
  },
  props: ["action"],
  mixins: [upload_img, eventsMixin],
  data() {
    return {
      productVariants: [],
      showProductOptions: false,
      image: "",
      name: "",
      activeOption: {},
      productDescription: "",
      buttonLoader: false,
    };
  },
  mounted() {
    this.setComponent(this.$t("common.productDetails"));
    this.initiateS3();
    if (this.action === "editProduct") {
      this.name = this.getProduct.product_name;
      this.productDescription = this.getProduct.product_description;
      if (this.variants.length) {
        this.image = this.variants[0].product_variant_image_link;
        this.productVariants = this.variants;
      }
      this.showProductOptions = this.getAddProductStatus;
      this.sendSegmentEvents({
        event: "Edit Product",
        data: {
          userId: this.getStorageUserDetails.business_id,
          SKU: this.getProduct.product_id,
          clientType: "web",
          device: "desktop",
        },
      });
    }
  },
  unmounted() {
    this.setAddProductStatus(false);
  },
  computed: {
    ...mapGetters([
      "getProduct",
      "getLoader",
      "getAddProductStatus",
      "getStorageUserDetails",
      "getAchievements",
    ]),
    onboardingStatus() {
      if (Object.values(this.getAchievements).includes(false)) {
        return true;
      }
      return false;
    },
    variants() {
      const res = [];
      this.getProduct.product_variants.forEach((row) => {
        if (!row.product_variant_archived) {
          res.push(row);
        }
      });
      return res;
    },
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setAddProductStatus",
    ]),
    ...mapActions(["requestAxiosPut", "requestAxiosPost"]),
    pickImg() {
      document.querySelector("#upload-img").click();
    },
    addProductOptions(value) {
      this.activeOption = {};
      this.productVariants.push(JSON.parse(JSON.stringify(value)));
    },
    saveProductOptions(value) {
      this.activeOption = {};
      this.productVariants[value.index] = value;
    },
    editProductOption(index) {
      this.activeOption = this.productVariants[index];
      this.activeOption.index = index;
      this.showProductOptions = true;
    },
    deleteProductOption(index) {
      this.productVariants.splice(index, 1);
    },
    showAddOption() {
      this.activeOption = {};
      this.showProductOptions = true;
    },
    saveProduct() {
      if (this.name && this.productDescription && this.productVariants.length) {
        const product = {
          product_name: this.name,
          product_description: this.productDescription,
          product_variants: this.productVariants,
        };
        this.buttonLoader = true;
        this.requestAxiosPut({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/products/${this.getProduct.product_id}`,
          values: product,
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            ElNotification({
              title: this.$t("inventory.productSavedSuccessfully"),
              message: "",
              type: "success",
            });
            this.sendSegmentEvents({
              event: "Save Product Details Edits",
              data: {
                userId: this.getStorageUserDetails.business_id,
                SKU: this.getProduct.product_id,
                clientType: "web",
                device: "desktop",
              },
            });
            this.$router.push(
              `/inventory/view-product/${this.getProduct.product_id}`
            );
          } else {
            ElNotification({
              title: this.$t("inventory.productSavingFailed"),
              message: "",
              type: "error",
            });
          }
        });
      } else {
        ElNotification({
          title: this.$t("deliveries.insufficientInformation"),
          message: this.$t("deliveries.pleaseFillInAllFields"),
          type: "warning",
        });
      }
    },
    addProduct() {
      if (this.name && this.productDescription && this.productVariants.length) {
        const product = {
          product_name: this.name,
          product_description: this.productDescription,
          product_variants: this.productVariants,
        };
        this.buttonLoader = true;
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/products`,
          values: product,
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            ElNotification({
              title: this.$t("inventory.productSavedSuccessfully"),
              message: "",
              type: "success",
            });
            this.sendSegmentEvents({
              event: "Add New Product",
              data: {
                userId: this.getStorageUserDetails.business_id,
                variation: this.productVariants,
                clientType: "web",
                device: "desktop",
              },
            });
            if (this.onboardingStatus) {
              this.$router.push("/");
            } else {
              this.$router.push(`/inventory/products`);
            }
          } else {
            ElNotification({
              title: this.$t("inventory.productSavingFailed"),
              message: "",
              type: "error",
            });
          }
        });
      } else {
        ElNotification({
          title: this.$t("deliveries.insufficientInformation"),
          message: this.$t("deliveries.pleaseFillInAllFields"),
          type: "warning",
        });
      }
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
.edit-product-weight-left {
  width: 65%;
}
.edit-product-weight-right {
  width: 35%;
  margin-left: auto;
}
.edit-product-weight {
  display: flex;
}
.edit-product-weight-field {
  width: 90%;
  margin-left: auto;
  height: 40px;
}
.edit-product-weight-field .v-input__control {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  --v-input-padding-top: 10px;
}
.edit-product-weight-field .v-input__control .v-field .v-field__field {
  min-height: 35px;
  padding: 5px;
}
.add-product-options {
  display: flex;
}
.add-product-options-img {
  width: 100px;
  margin-left: auto;
  margin-right: 20px;
}
.upload-img {
  width: 150px;
}
.desktop-product-options-img {
  width: 70px;
  padding: 5px;
  border: 1px solid #ced4da;
  margin-right: 15px;
  border-radius: 5px;
}
.desktop-product-options-icon {
  border-radius: 20px;
  background: #e2e7ed;
  padding: 10px;
  margin-left: 25px;
  cursor: pointer;
}
.desktop-product-option-card {
  padding: 20px 0px;
  border-top: 1px solid #c0c4cc;
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
