<template>
  <div>
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
              v-model="name"
              placeholder="Enter name of the Product"
              :disabled="action === 'editProduct'"
            />
          </div>
        </div>
        <div class="mb-2">
          <label for="productName" class="form-label">Price</label>
          <div>
            <input
              type="text"
              class="form-control"
              v-model="price"
              placeholder="Price of the product"
            />
          </div>
        </div>
        <div class="mb-2">
          <label for="productName" class="form-label"
            >Weight or the capacity of the product</label
          >
          <div class="edit-product-weight">
            <div class="edit-product-weight-left">
              <input
                type="text"
                class="form-control"
                v-model="weight"
                placeholder="Enter weight"
              />
            </div>
            <div class="edit-product-weight-right">
              <v-select
                class="edit-product-weight-field"
                :items="dimensions"
                v-model="dimension"
                outlined
              ></v-select>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <label for="price" class="form-label">Description(optional)</label>
          <div>
            <textarea
              class="form-control"
              id=""
              rows="3"
              v-model="description"
              placeholder="Enter description of the product"
            ></textarea>
          </div>
        </div>
        <div class="desktop-product-options-container mt-3 mb-3">
          <div class="desktop-product-options-content">
            <p class="optional-text">Product options (optional)</p>
            <p class="add-product-sizes">
              Add options if this product comes in different sizes or colours
            </p>
            <div v-if="productVariants.length">
              <v-list-item
                lines="two"
                v-for="(variant, index) in variants"
                :key="index"
                class="desktop-product-option-card"
              >
                <v-list-item-avatar>
                  <img
                    :src="variant.image"
                    class="desktop-product-options-img"
                    alt=""
                  />
                </v-list-item-avatar>
                <v-list-item-header>
                  <v-list-item-title>
                    {{ variant.weight }}
                    {{ variant.dimension }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ variant.currency }} {{ variant.price }}
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
                Add product options
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
          <button class="btn btn-primary mt-2 btn-long" @click="addProduct()">
            Save Changes
          </button>
        </div>
      </v-col>
      <v-col cols="6">
        <p class="ml-5">Image (optional)</p>
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
            Upload
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

export default {
  components: {
    productOptions,
  },
  props: ["action"],
  mixins: [upload_img],
  data() {
    return {
      productVariants: [],
      showProductOptions: false,
      dimensions: ["gms", "mls", "cm"],
      dimension: "gms",
      image: "",
      activeOption: {},
      name: "",
      price: "",
      weight: "",
      description: "",
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.productDetails"));
    this.initiateS3();
    if (this.$route.params.pV) {
      this.productVariants = JSON.parse(this.$route.params.pV);
    }
    if (this.action === "editProduct") {
      this.name = "Shea Butter";
      this.price = "200";
    }
  },
  computed: {
    variants() {
      const res = JSON.parse(JSON.stringify(this.productVariants));
      return res;
    },
  },
  methods: {
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
    addProduct() {
      ElNotification({
        title: "Product Saved successfully",
        message: "",
        duration: 0,
        type: "success",
      });
      this.$router.push({ name: "Products" });
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
