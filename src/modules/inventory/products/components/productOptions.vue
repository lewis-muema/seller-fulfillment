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
                    v-model="productOption.product_variant_description"
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
                <div class="">
                  <v-text-field
                    class="businessProfile-field add-product-variant-price"
                    id="update-price"
                    v-model="productOption.product_variant_unit_price"
                    label="100"
                    variant="outlined"
                    :prefix="productOption.product_variant_currency"
                    clearable
                    clear-icon="mdi-close"
                  ></v-text-field>
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
                    placeholder="0"
                    v-model="productOption.product_variant_quantity"
                  />
                </div>
                <div class="col-5">
                  <v-select
                    class="edit-product-weight-field"
                    :items="dimensions"
                    v-model="productOption.product_variant_quantity_type"
                    item-text
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
                    {{ $t("inventory.addProductOption") }}
                  </button>
                </div>
                <p
                  @click="saveAndAddProductOption()"
                  class="text-center mb-5 add-another-option"
                >
                  {{ $t("inventory.saveAnother") }}
                </p>
              </div>
              <div v-else>
                <div class="d-grid">
                  <button
                    class="btn btn-primary mb-3"
                    @click="saveProductOption()"
                  >
                    {{ $t("inventory.saveProduct") }}
                  </button>
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div
                class="product-option-img"
                @click="pickImg()"
                v-loading="productUploadStatus"
              >
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
import { mapGetters, mapMutations } from "vuex";
import upload_img from "../../../../mixins/upload_img";
export default {
  props: ["visible", "option"],
  mixins: [upload_img],
  data() {
    return {
      productOption: {
        business_id: "",
        product_id: "",
        product_variant_archived: false,
        product_variant_currency: "KES",
        product_variant_description: "",
        product_variant_expiry_date: null,
        product_variant_id: "",
        product_variant_image_link: "",
        product_variant_quantity: "",
        product_variant_quantity_type: "GRAM",
        product_variant_stock_levels: {},
        product_variant_unit_price: "",
      },
      dimensions: [
        {
          title: "kilogram",
          value: "KILOGRAM",
        },
        {
          title: "gram",
          value: "GRAM",
        },
        {
          title: "litre",
          value: "LITRE",
        },
        {
          title: "millilitre",
          value: "MILLILITRE",
        },
      ],
      currencies: [],
      image: "",
      action: "add",
      productUploadStatus: false,
    };
  },
  watch: {
    option(val) {
      if (Object.keys(val).length > 0) {
        this.productOption = val;
        this.image = val.product_variant_image_link;
        this.action = "save";
      } else {
        this.action = "add";
      }
    },
    show(val) {
      if (!val) {
        this.resetInputs();
      }
      this.setAddProductStatus(val);
    },
    "$store.state.supportedCountries": function supportedCountries() {
      this.currencies = this.currencyFilter;
    },
  },
  computed: {
    ...mapGetters([
      "getProduct",
      "getStorageUserDetails",
      "getSupportedCountries",
      "getBusinessDetails",
    ]),
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
    currencyFilter() {
      const currencies = [];
      this.getSupportedCountries.forEach((country) => {
        currencies.push({
          title: country.currency.currency_symbol,
          value: country.currency.currency_id,
        });
      });
      return currencies;
    },
    validateInputs() {
      if (
        this.productOption.product_variant_description &&
        this.productOption.product_variant_image_link &&
        this.productOption.product_variant_currency &&
        this.productOption.product_variant_unit_price &&
        this.productOption.product_variant_quantity &&
        this.productOption.product_variant_quantity_type
      ) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.productOption.product_id = this.getProduct.product_id;
    this.productOption.business_id = this.getStorageUserDetails.business_id;
    this.productOption.product_variant_currency =
      this.getBusinessDetails.currency;
  },
  methods: {
    ...mapMutations(["setAddProductStatus"]),
    addProductOption() {
      this.productOption.product_variant_image_link = this.image;
      if (this.validateInputs) {
        this.$emit("addOptions", this.productOption);
        this.$emit("close");
        this.resetInputs();
      } else {
        this.infoNotification();
      }
    },
    saveAndAddProductOption() {
      this.productOption.product_variant_image_link = this.image;
      if (this.validateInputs) {
        this.$emit("addOptions", this.productOption);
        this.resetInputs();
        document.querySelector("#upload-img-card").value = "";
      } else {
        this.infoNotification();
      }
    },
    saveProductOption() {
      this.productOption.product_variant_image_link = this.image;
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
        business_id: this.getStorageUserDetails.business_id,
        product_id: this.getProduct.product_id,
        product_variant_archived: false,
        product_variant_currency: "KES",
        product_variant_description: "",
        product_variant_expiry_date: null,
        product_variant_id: "",
        product_variant_image_link: "",
        product_variant_quantity: "",
        product_variant_quantity_type: "GRAM",
        product_variant_stock_levels: {},
        product_variant_unit_price: "",
      };
    },
    pickImg() {
      document.querySelector("#upload-img-card").click();
    },
    infoNotification() {
      ElNotification({
        title: this.$t("deliveries.insufficientInformation"),
        message: this.$t("deliveries.pleaseFillInAllFields"),
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
  cursor: pointer;
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
.add-product-variant-price {
  height: 70px;
}
.product-option-img .el-loading-mask {
  padding-top: 35%;
}
</style>
