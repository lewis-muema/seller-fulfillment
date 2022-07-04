<template>
  <div class="products-container">
    <p class="products-title">
      <span :class="getLoader">
        {{ $t("deliveries.products") }}
      </span>
    </p>
    <p class="products-data">
      <span :class="getLoader">
        {{ formatProducts(getOrderTrackingData.order.products) }}
      </span>
    </p>
    <p class="products-view">
      <span
        :class="getLoader"
        @click="
          setOverlayStatus({
            overlay: true,
            popup: 'viewProducts',
          })
        "
      >
        {{ $t("deliveries.viewProducts") }}
      </span>
    </p>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      viewProducts: false,
    };
  },
  computed: {
    ...mapGetters(["getLoader", "getProducts", "getOrderTrackingData"]),
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setOverlayStatus"]),
    formatProducts(products) {
      return `${products[0].product_variant_description} ${
        products.length > 1
          ? this.$t("deliveries.otherItems", { count: products.length - 1 })
          : ""
      }`;
    },
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
  background: white;
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
  font-size: 20px;
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
