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
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.viewProducts") }}
      </span>
    </p>
  </div>
</template>

<script>
export default {};
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
</style>
