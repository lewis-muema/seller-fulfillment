<template>
  <div class="delivery-info-container">
    <p class="delivery-info-title">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.deliveryInfo") }}
      </span>
      <span class="delivery-info-edit" :class="$store.getters.getLoader">
        <i class="mdi mdi-pencil"></i>
        {{ $t("deliveries.edit") }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.nameOfCustomer") }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{ $store.getters.getDeliveryInfo.name }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.deliveryLocation") }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{ $store.getters.getDeliveryInfo.location }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.phoneNumber") }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{ $store.getters.getDeliveryInfo.phoneNumber }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.instructions") }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{ $store.getters.getDeliveryInfo.instructions }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="$store.getters.getLoader">
        {{ $t("deliveries.paymentMethod") }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="$store.getters.getLoader">
        {{ $store.getters.getDeliveryInfo.payment }}
      </span>
    </p>
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$store.commit("setLoader", "");
    }, 3000);
  },
};
</script>

<style>
.delivery-info-container {
  border: 1px solid #e2e7ed;
  margin-left: 70px;
  padding: 35px;
  border-radius: 10px;
  width: 70%;
  margin-bottom: 25px;
  line-height: 25px;
  font-size: 14px;
}
.delivery-info-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}
.delivery-info-label {
  color: #606266;
}
.delivery-info-data {
  color: #303133;
  margin-bottom: 10px;
}
.delivery-info-edit {
  float: right;
  font-size: 14px;
  cursor: pointer;
  font-weight: 300;
  color: #324ba8;
}
</style>
