<template>
  <div class="text-center">
    <v-dialog v-model="show">
      <v-card class="popup-card">
        <v-card-title>
          {{ $t("inventory.addProductOption") }}
          <span class="add-products-options-close" @click="$emit('close')"
            ><i class="mdi mdi-close"></i
          ></span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div class="mb-2">
                <label for="productName" class="form-label">{{
                  $t("inventory.nameOfOption")
                }}</label>
                <div>
                  <input
                    v-model="productOption.name"
                    type="text"
                    class="form-control"
                    :placeholder="$t('inventory.eg')"
                  />
                </div>
              </div>

              <div class="row mb-2">
                <label for="price" class="form-label">{{
                  $t("inventory.price")
                }}</label>
                <div class="col-7">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="100"
                    v-model="productOption.price"
                  />
                </div>
                <div class="col-5">
                  <v-select
                    class="edit-product-weight-field"
                    :items="currencies"
                    v-model="productOption.currency"
                    outlined
                  ></v-select>
                </div>
              </div>
              <div class="row mb-5">
                <label for="price" class="form-label">
                  {{ $t("inventory.weight") }}
                </label>
                <div class="col-7">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="0.0"
                    v-model="productOption.weight"
                  />
                </div>
                <div class="col-5">
                  <v-select
                    class="edit-product-weight-field"
                    :items="dimensions"
                    v-model="productOption.dimension"
                    outlined
                  ></v-select>
                </div>
              </div>
              <div v-if="action === 'add'">
                <div class="d-grid">
                  <button
                    class="btn btn-primary mb-3"
                    @click="addProductOption()"
                  >
                    Add Product Option
                  </button>
                </div>
                <p
                  @click="saveAndAddProductOption()"
                  class="text-center mb-5 add-another-option"
                >
                  {{ $t("inventory.addProductOption") }}
                </p>
              </div>
              <div v-else>
                <div class="d-grid">
                  <button
                    class="btn btn-primary mb-3"
                    @click="saveProductOption()"
                  >
                    {{ $t("inventory.saveAnother") }}
                  </button>
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="product-option-img" @click="pickImg()">
                <input
                  type="file"
                  name
                  value
                  class="form-control"
                  placeholder="Upload"
                  accept="image/*"
                  id="upload-img-card"
                  style="display: none"
                  @change="uploadImg('upload-img-card', 'option')"
                />
                <img class="upload-img" v-if="image" :src="image" alt="" />
                <span v-else class="upload">
                  <i class="mdi mdi-upload" aria-hidden="true"></i>
                  {{ $t("inventory.upload") }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ElNotification } from "element-plus";
import upload_img from "../../../../mixins/upload_img";
export default {
  props: ["visible", "option"],
  mixins: [upload_img],
  data() {
    return {
      productOption: {
        name: "",
        currency: "KES",
        price: "",
        weight: "",
        dimension: "gms",
      },
      dimensions: ["gms", "mls", "cm"],
      currencies: ["KES", "CI", "UGX"],
      image: "",
      action: "add",
    };
  },
  watch: {
    option(val) {
      if (Object.keys(val).length > 0) {
        this.productOption = val;
        this.image = val.image;
        this.action = "save";
      } else {
        this.action = "add";
      }
    },
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
    validateInputs() {
      if (
        this.productOption.name &&
        this.productOption.image &&
        this.productOption.currency &&
        this.productOption.price &&
        this.productOption.weight &&
        this.productOption.dimension
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    addProductOption() {
      this.productOption.image = this.image;
      if (this.validateInputs) {
        this.$emit("addOptions", this.productOption);
        this.$emit("close");
        this.resetInputs();
      } else {
        this.infoNotification();
      }
    },
    saveAndAddProductOption() {
      this.productOption.image = this.image;
      if (this.validateInputs) {
        this.$emit("addOptions", this.productOption);
        this.resetInputs();
      } else {
        this.infoNotification();
      }
    },
    saveProductOption() {
      this.productOption.image = this.image;
      if (this.validateInputs) {
        this.$emit("close");
        this.$emit("saveOptions", this.productOption);
        this.resetInputs();
      } else {
        this.infoNotification();
      }
    },
    resetInputs() {
      this.image = "";
      this.productOption = {
        name: "",
        price: "",
        currency: "KES",
        weight: "",
        dimension: "gms",
      };
    },
    pickImg() {
      document.querySelector("#upload-img-card").click();
    },
    infoNotification() {
      ElNotification({
        title: "Insufficient Information",
        message:
          "Please fill in all fields and make sure product image is uploaded",
        type: "warning",
      });
    },
  },
};
</script>

<style>
.popup-card {
  width: 700px;
  margin-top: -50px;
}
.add-another-option {
  color: #324ba8;
  cursor: pointer;
  font-size: 14px;
}
.product-option-img {
  height: 200px;
  width: 200px;
  margin: 25px;
  border: 1px dashed grey;
  margin: 0px 50px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-option-img > i,
.upload {
  color: #324ba8 !important;
  font-size: 17px;
}
.edit-product-weight-field
  .v-input__control
  .v-field
  .v-field__field
  .v-select__selections {
  padding: 0px;
  padding-top: 10px;
}
.edit-product-weight-field
  .v-input__control
  .v-field
  .v-field__field
  .v-field__input {
  padding: 0px;
}
.add-products-options-close {
  margin-left: auto;
  cursor: pointer;
}
</style>
