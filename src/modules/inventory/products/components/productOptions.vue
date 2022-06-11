<template>
  <div class="text-center">
    <v-dialog v-model="show">
      <v-card class="popup-card">
        <v-card-title>{{ $t("inventory.addProductOption") }}</v-card-title>
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

              <div class="mb-2">
                <label for="price" class="form-label">{{
                  $t("inventory.price")
                }}</label>
                <div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="KES"
                    v-model="productOption.price"
                  />
                </div>
              </div>
              <div class="row mb-5">
                <label for="price" class="form-label">{{
                  $t("inventory.weight")
                }}</label>
                <div class="col-8">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="0.0"
                    v-model="productOption.weight"
                  />
                </div>
                <div class="col-4">
                  <input type="text" class="form-control" placeholder="gms" />
                </div>
              </div>
              <div class="d-grid">
                <button
                  class="btn btn-primary mb-3"
                  @click="addProductOption()"
                >
                  {{ $t("inventory.addProductOption") }}
                </button>
              </div>
              <p class="text-center mb-5 add-another-option">
                {{ $t("inventory.saveAnother") }}
              </p>
            </v-col>
            <v-col cols="6">
              <div class="product-option-img">
                <i class="mdi mdi-upload" aria-hidden="true"></i>
                <span class="upload">{{ $t("inventory.upload") }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      productOption: {
        name: "",
        price: "",
        weight: "",
      },
    };
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
  },
  methods: {
    addProductOption() {
      console.log("in child", this.productOption);
      this.$emit("addOptions", this.productOption);
      this.$emit("close");
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
</style>
