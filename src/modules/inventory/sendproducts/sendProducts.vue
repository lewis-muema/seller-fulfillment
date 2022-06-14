<template>
  <div>
    <div v-if="this.step === 0">
      <span class="send-products-header-text text-center">
        {{ $t("inventory.toDo") }}
      </span>
      <div class="send-products-container">
        <div @click="deliverToCustomer" class="send-products-content">
          <v-card class="send-products-card" variant="outlined">
            <div class="text-center">
              <v-icon class="dashboard-links-icon send-products-icon"
                >mdi mdi-truck</v-icon
              >
              <p class="mt-4">{{ $t("inventory.deliverToCustomer") }}</p>
            </div>
          </v-card>
        </div>
        <div @click="deliverToSendy" class="send-products-content">
          <v-card variant="outlined">
            <div class="text-center">
              <v-icon class="dashboard-links-icon send-products-icon"
                >mdi mdi-warehouse</v-icon
              >
              <p class="mt-4">{{ $t("inventory.deliverToSendy") }}</p>
            </div>
          </v-card>
        </div>
      </div>
    </div>
    <div v-else>
      <v-row>
        <v-col cols="6" class="mx-auto mt-4 mb-3">
          <el-steps :active="active" finish-status="success">
            <el-step title="Select Products"></el-step>
            <el-step title="Add Quantity"></el-step>
            <el-step title="Checkout"></el-step>
          </el-steps>
        </v-col>
      </v-row>
      <div>
        <ProductsSelect @pickScreen="resetScreen()" v-if="active === 0" />
        <AddQuantity v-if="active === 1" />
        <Checkout :to="to" v-if="active === 2" />
      </div>
    </div>
  </div>
</template>

<script>
import ProductsSelect from "./components/productsSelect.vue";
import AddQuantity from "./components/addQuantity.vue";
import Checkout from "./components/checkout";
import { ref } from "vue";
import { mapMutations } from "vuex";

export default {
  components: { ProductsSelect, AddQuantity, Checkout },
  data() {
    return {
      active: ref(0),
      step: 0,
      to: "",
    };
  },
  watch: {
    "$store.state.productStep": function (val) {
      this.active = ref(val);
    },
  },
  mounted() {
    this.setComponent(this.$t("common.sendInventory"));
  },
  methods: {
    ...mapMutations(["setSendProductsRoute", "setComponent"]),
    deliverToCustomer() {
      this.setSendProductsRoute("ProductsToCustomer");
      this.step = 1;
      this.to = "customer";
    },
    deliverToSendy() {
      this.setSendProductsRoute("ProductsToSendy");
      this.step = 1;
      this.to = "sendy";
    },
    resetScreen() {
      this.step = 0;
      this.setComponent(this.$t("common.sendInventory"));
    },
  },
};
</script>

<style>
.send-products-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
}
.send-products-container .v-card {
  height: 200px;
  width: 300px;
  border-color: #e2e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}
.send-products-content {
  cursor: pointer;
}
.send-products-icon {
  border-radius: 50% !important;
  height: 48px !important;
  width: 48px !important;
  background-color: #f0f3f7 !important;
  margin-bottom: 40px;
}
.send-products-card {
  margin-right: 30px !important;
}
.send-products-header-text {
  font-size: 19px;
  font-weight: 500;
  color: #303133;
  display: flex;
  justify-content: center;
  margin: 80px 0;
}
.el-step__head.is-success {
  border-color: #324ba8 !important;
}
.el-step__head.is-success .el-step__icon.is-text {
  background: #324ba8 !important;
  color: white !important;
}
.el-step__title.is-success {
  color: #324ba8 !important;
}
</style>
