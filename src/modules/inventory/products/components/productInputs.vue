<template>
  <div>
    <v-row>
      <v-col cols="">
        <div class="">
          <label for="productName" class="form-label">
            {{ $t("inventory.nameOfProduct") }}</label
          >
          <div>
            <input
              type="text"
              class="form-control"
              v-model="name"
              :placeholder="$t('inventory.whiteCoats')"
              :disabled="action === 'editProduct'"
            />
          </div>
          <div class="add-product-helper-text">
            {{ $t("inventory.enterTheNameOnThePackage") }}
          </div>
        </div>
        <div class="">
          <label for="upc" class="form-label">{{
            $t("inventory.upcCode")
          }}</label>
          <div class="">
            <v-text-field
              class="businessProfile-field"
              v-model="productVariants[0].universal_product_code"
              variant="outlined"
              clearable
              clear-icon="mdi-close"
            ></v-text-field>
          </div>
        </div>
        <div class="">
          <label for="price" class="form-label">{{
            $t("inventory.sellingPrice")
          }}</label>
          <div class="">
            <v-text-field
              class="businessProfile-field"
              id="update-price"
              v-model="productVariants[0].product_variant_unit_price"
              :label="productVariants[0].product_variant_currency"
              variant="outlined"
              :prefix="productVariants[0].product_variant_currency"
              clearable
              clear-icon="mdi-close"
            ></v-text-field>
          </div>
        </div>
        <div class="row">
          <label for="weight" class="form-label">
            {{ $t("inventory.weight") }}
          </label>
          <div class="col-8">
            <input
              type="number"
              class="form-control"
              placeholder="0.0"
              v-model="productVariants[0].product_variant_quantity"
            />
          </div>
          <div class="col-4">
            <v-select
              class="edit-product-weight-field"
              :items="dimensions"
              v-model="productVariants[0].product_variant_quantity_type"
              outlined
            ></v-select>
          </div>
          <div class="add-product-helper-text">
            {{ $t("inventory.thisHelpsUsToKnow") }}
          </div>
        </div>
        <div class="">
          <label for="desc" class="form-label">
            {{ $t("inventory.description") }}</label
          >
          <div>
            <textarea
              class="form-control"
              id="desc"
              rows="3"
              v-model="productDescription"
            ></textarea>
          </div>
          <div class="add-product-helper-text">
            {{ $t("inventory.aShortDescriptionToHelp") }}
          </div>
        </div>
        <div class="">
          <p>{{ $t("inventory.preference") }}</p>
          <p>
            {{ $t("inventory.setProductPreference") }}
          </p>
          <div v-if="!view">
            <span class="add-product-preference" @click="view = true">
              <span class="">
                {{ $t("inventory.viewMore") }}
              </span>
              <i class="mdi mdi-chevron-down add-product-preference-icon"></i>
            </span>
          </div>
          <div v-else>
            <span class="add-product-preference" @click="view = false">
              <span class="">
                {{ $t("inventory.viewLess") }}
              </span>
              <i class="mdi mdi-chevron-up add-product-preference-icon"></i>
            </span>
          </div>
          <div v-if="view">
            <p class="preference-titles-desc">
              {{ $t("inventory.productAttributes") }}
            </p>
            <div class="add-product-preference-checkbox">
              <v-checkbox
                v-model="prodPref.isPhotosensitive"
                :label="$t(`inventory.PHOTO_SENSITIVE`)"
              ></v-checkbox>
            </div>
            <div class="add-product-preference-checkbox">
              <v-checkbox
                v-model="prodPref.isFragile"
                :label="$t(`inventory.FRAGILE`)"
              ></v-checkbox>
            </div>
            <div class="add-product-preference-checkbox">
              <v-checkbox
                v-model="prodPref.isTemperaturesensitive"
                :label="$t(`inventory.TEMPERATURE_SENSITIVE`)"
              ></v-checkbox>
            </div>
            <div v-if="prodPref.isTemperaturesensitive">
              <p>{{ $t("inventory.temperature") }}</p>
              <div class="slider-demo-block">
                <span class="d-flex">
                  <el-slider v-model="tempRange" range show-stops :step="10" />
                  <span class="ml-3">°C</span>
                </span>
              </div>
            </div>

            <div>
              <p class="preference-titles-desc">
                {{ $t("inventory.stockLevels") }}
              </p>
              <div class="">
                <label for="threshold" class="form-label"
                  >{{ $t("inventory.getNotified") }}
                </label>
                <div class="">
                  <v-text-field
                    v-model="productVariants[0].low_stock_threshold"
                    placeholder="0"
                    suffix="units"
                    variant="outlined"
                    clearable
                    clear-icon="mdi-close"
                  ></v-text-field>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="desktop-product-options-container mt-3 mb-3">
          <div class="desktop-product-options-content">
            <p class="optional-text">{{ $t("inventory.productOptions") }}</p>
            <p class="add-product-sizes">
              {{ $t("inventory.addOptions") }}
            </p>
            <div v-if="filteredVariants.length">
              <v-list-item
                lines="two"
                v-for="(variant, index) in filteredVariants"
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
                    {{ variant.product_variant_description }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ variant.product_variant_currency }}
                    {{ variant.product_variant_unit_price }}
                  </v-list-item-subtitle>
                </v-list-item-header>
                <v-list-item-avatar end>
                  <div
                    class="desktop-product-options-icon"
                    @click="editProductOption(index + 1)"
                  >
                    <v-icon>mdi mdi-pencil </v-icon>
                  </div>
                </v-list-item-avatar>
                <v-list-item-avatar
                  end
                  v-if="$route.path === '/inventory/add-product'"
                >
                  <div
                    class="desktop-product-options-icon"
                    @click="deleteProductOption(index + 1)"
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
                v-if="filteredVariants.length === 0"
                class="add-product-options-img"
                src="https://images.sendyit.com/fulfilment/seller/shirts.png"
                alt=""
              />
            </div>
            <product-options
              :option="activeOption"
              :visible="showProductOptions"
              @close="showProductOptions = false"
              @open="showProductOptions = true"
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
        <p class="ml-12">{{ $t("inventory.img") }}</p>
        <div
          class="img-container"
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
            id="upload-img"
            style="display: none"
            @change="uploadImg('upload-img', 'edit')"
          />
          <img
            class="upload-img"
            v-if="productVariants[0].product_variant_image_link"
            :src="productVariants[0].product_variant_image_link"
            alt=""
          />
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
      productVariants: [
        {
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
          universal_product_code: "",
          low_stock_threshold: "",
          product_variant_properties: [],
        },
      ],
      tempRange: [0, 100],
      showProductOptions: false,
      image: "",
      name: "",
      price: "",
      view: false,
      prodPref: {
        isPhotosensitive: false,
        isFragile: false,
        isTemperaturesensitive: false,
      },
      quantity: "",
      productUploadStatus: false,
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
      activeOption: {},
      productDescription: "",
      buttonLoader: false,
    };
  },
  mounted() {
    this.setComponent("common.productDetails");
    this.initiateS3();
    this.productVariants[0].product_id = this.getProduct.product_id;
    this.productVariants[0].business_id =
      this.getStorageUserDetails.business_id;
    if (this.action === "editProduct") {
      this.name = this.getProduct.product_name;
      this.productDescription = this.getProduct.product_description;
      if (this.variants.length) {
        this.image = this.variants[0].product_variant_image_link;
        this.productVariants = this.variants;
      }
      this.showProductOptions = this.getAddProductStatus;
      this.sendSegmentEvents({
        event: "Edit_Product",
        data: {
          userId: this.getStorageUserDetails.business_id,
          SKU: this.getProduct.product_id,
          clientType: "web",
          device: "desktop",
        },
      });
    }
    this.productVariants[0].product_variant_currency =
      this.getBusinessDetails.currency;
  },
  watch: {
    image() {
      this.productVariants[0].product_variant_image_link = this.image;
    },
    name() {
      this.productVariants[0].product_variant_description = this.name;
    },
    "$store.state.businessDetails": function (value) {
      this.productVariants[0].product_variant_currency = value.currency;
    },
    productVariants: {
      handler(val) {
        val[0].product_variant_properties.length
          ? val[0].product_variant_properties.forEach((sensitivity) => {
              if (sensitivity.product_property_type === "PHOTO_SENSITIVE") {
                this.prodPref.isPhotosensitive = true;
              }
              if (sensitivity.product_property_type === "FRAGILE") {
                this.prodPref.isFragile = true;
              }
              if (
                sensitivity.product_property_type === "TEMPERATURE_SENSITIVE"
              ) {
                this.prodPref.isTemperaturesensitive = true;
              }
            })
          : [];
      },
      deep: true,
    },
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
      "getSupportedCountries",
      "getBusinessDetails",
    ]),
    onboardingStatus() {
      if (Object.values(this.getAchievements).includes(false)) {
        return true;
      }
      return false;
    },
    filteredVariants() {
      const variants = [];
      this.productVariants.forEach((variant, i) => {
        if (i > 0) {
          variants.push(variant);
        }
      });
      return variants;
    },
    productPayload() {
      const products = [];
      this.productVariants.forEach((variant) => {
        const {
          business_id,
          product_id,
          product_variant_archived,
          product_variant_currency,
          product_variant_description,
          product_variant_expiry_date,
          product_variant_id,
          product_variant_image_link,
          product_variant_quantity,
          product_variant_quantity_type,
          product_variant_stock_levels,
          product_variant_unit_price,
          universal_product_code,
          low_stock_threshold,
        } = variant;
        const productProperties = {
          business_id,
          product_id,
          product_variant_archived,
          product_variant_currency,
          product_variant_description,
          product_variant_expiry_date,
          product_variant_id,
          product_variant_image_link,
          product_variant_quantity,
          product_variant_quantity_type,
          product_variant_stock_levels,
          product_variant_unit_price,
          universal_product_code,
          low_stock_threshold,
          product_variant_properties: this.sensitivityRange,
        };
        products.push(productProperties);
      });
      return products;
    },
    sensitivityRange() {
      const data = [];
      const productPreference = [
        {
          product_property_type: "PHOTO_SENSITIVE",
          sensitivity_lower_limit: 0,
          sensitivity_upper_limit: 0,
          sensitivity_unit_of_measure: null,
        },
        {
          product_property_type: "FRAGILE",
          sensitivity_lower_limit: 0,
          sensitivity_upper_limit: 0,
          sensitivity_unit_of_measure: null,
        },
        {
          product_property_type: "TEMPERATURE_SENSITIVE",
          sensitivity_lower_limit: 0,
          sensitivity_upper_limit: 0,
          sensitivity_unit_of_measure: "CELSIUS",
        },
      ];
      if (this.prodPref.isPhotosensitive) {
        data.push(productPreference[0]);
      }
      if (this.prodPref.isFragile) {
        data.push(productPreference[1]);
      }
      if (this.prodPref.isTemperaturesensitive) {
        productPreference[2].sensitivity_lower_limit = this.tempRange[0];
        productPreference[2].sensitivity_upper_limit = this.tempRange[1];
        data.push(productPreference[2]);
      }
      return data;
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
      "setSupportedCountries",
    ]),
    ...mapActions(["requestAxiosPut", "requestAxiosPost", "requestAxiosGet"]),
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
      if (
        this.name &&
        this.productVariants[0].product_variant_currency &&
        (this.productVariants[0].product_variant_unit_price ||
          this.productVariants.length > 1) &&
        (this.productVariants[0].product_variant_quantity ||
          this.productVariants.length > 1) &&
        this.productVariants[0].product_variant_quantity_type &&
        this.productVariants[0].product_variant_image_link
      ) {
        const product = {
          product_name: this.name,
          product_description: this.productDescription,
          product_variants: this.productPayload,
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
              event: "Save_Product_Details_Edits",
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
      if (
        this.name &&
        this.productVariants[0].product_variant_currency &&
        (this.productVariants[0].product_variant_unit_price ||
          this.productVariants.length > 1) &&
        (this.productVariants[0].product_variant_quantity ||
          this.productVariants.length > 1) &&
        this.productVariants[0].product_variant_quantity_type &&
        this.productVariants[0].product_variant_image_link
      ) {
        const product = {
          product_name: this.name,
          product_description: this.productDescription,
          product_variants: this.productPayload,
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
              event: "Add_New_Product",
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
              this.$router.push(
                `/inventory/view-product/${response.data.data.productId}`
              );
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
  padding: 25px;
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
  max-width: 100%;
  max-height: 100%;
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
.add-product-helper-text {
  font-size: 12px;
  margin-top: 10px !important;
  margin-bottom: 30px !important;
  color: #606266;
}
.v-field--active .v-label.v-field-label {
  display: none !important;
}
.img-container .el-loading-mask {
  padding-top: 35%;
}
.add-product-preference {
  cursor: pointer;
  color: #324ba8;
}
.add-product-preference-checkbox {
  height: 45px !important;
}
.preference-titles-desc {
  color: #909399;
  font-size: 14px;
  margin: 12px 0px 0px;
}
.v-selection-control--dirty .v-icon {
  color: #324ba8 !important;
}
.el-slider {
  --el-slider-main-bg-color: #324ba8 !important;
}
</style>
