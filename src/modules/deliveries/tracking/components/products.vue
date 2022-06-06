<template>
  <div class="products-container">
    <p class="products-title">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.products") }}
      </span>
      <span class="products-edit" :class="$store.getters.getLoader">
        <i class="mdi mdi-pencil"></i>
        {{ $t("deliveries.edit") }}
      </span>
    </p>
    <p class="products-data">
      <span :class="$store.getters.getLoader">
        {{ $store.getters.getProducts.name }}
      </span>
    </p>
    <p class="products-view">
      <span :class="$store.getters.getLoader" @click="viewProducts = true">
        {{ $t("deliveries.viewProducts") }}
      </span>
    </p>
    <v-overlay v-model="viewProducts" class="align-center justify-center">
      <div class="view-products-container">
        <div class="view-products-section">
          <p class="view-products-label">
            {{ $t("deliveries.products") }}
          </p>
          <i
            @click="viewProducts = false"
            class="mdi mdi-close view-products-close"
          ></i>
        </div>
        <div
          v-for="(product, i) in $store.getters.getData.data.products"
          :key="i"
        >
          <div class="view-products-row-top">
            <v-badge
              color="#324BA8"
              text-color="white"
              max="10"
              :content="`${product.product_unit_count}`"
            >
              <img
                :src="product.product_image_link"
                class="view-products-img"
                alt=""
              />
            </v-badge>
            <div class="view-products-row-top-left">
              <div class="view-products-row-top-name">
                {{ product.product_name }}
              </div>
              <div class="view-products-row-top-variant">
                {{ product.product_variant_description }}
              </div>
            </div>
            <p class="view-products-row-top-right">
              {{ product.product_unit_currency }}
              {{ product.product_unit_price }}
            </p>
          </div>
        </div>
      </div>
    </v-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      viewProducts: false,
    };
  },
};
</script>

<style>
.products-container {
  border: 1px solid #e2e7ed;
  margin-left: 70px;
  padding: 35px;
  border-radius: 10px;
  width: 70%;
  margin-bottom: 25px;
  line-height: 25px;
  font-size: 14px;
}
.products-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}
.products-edit {
  float: right;
  font-size: 14px;
  cursor: pointer;
  font-weight: 300;
  color: #324ba8;
}
.products-view {
  font-size: 12px;
  cursor: pointer;
  font-weight: 300;
  color: #324ba8;
}
.products-data {
  color: #303133;
  margin-bottom: 10px;
}
.view-products-container {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 450px;
  border-radius: 5px;
  font-family: "DM Sans";
}
.view-products-section {
  margin-bottom: 20px;
  display: flex;
}
.view-products-label {
  font-size: 16px;
  width: 60%;
  font-weight: 500;
}
.view-products-close {
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;
}
.view-products-row-top {
  display: flex;
  padding-bottom: 15px;
  border-bottom: 0.6px solid #c0c4cc78;
  margin-bottom: 15px;
}
.view-products-row-top-name {
  margin-bottom: 0px;
}
.view-products-row-top-variant {
  color: #606266;
}
.view-products-row-top-left {
  margin-left: 20px;
}
.view-products-row-top-right {
  font-weight: 500;
  font-size: 16px;
  margin-left: auto;
}
.view-products-row-bottom {
  color: #606266;
  margin-bottom: 20px;
}
.view-products-img {
  width: 40px;
}
</style>
