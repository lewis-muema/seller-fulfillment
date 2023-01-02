<template>
  <div>
    <div>
      <span class="send-products-header-text text-center">
        {{ $t("inventory.toDo") }}
      </span>
      <div class="send-products-container">
        <div
          @click="$router.push('/inventory/create-delivery')"
          class="send-products-content"
        >
          <v-card class="send-products-card" variant="outlined">
            <div class="text-center">
              <v-icon class="dashboard-links-icon send-products-icon"
                >mdi mdi-truck</v-icon
              >
              <p class="">{{ $t("common.sendDeliveryToCustomer") }}</p>
            </div>
          </v-card>
        </div>
        <div
          @click="$router.push('/inventory/add-pickup-products')"
          class="send-products-content"
        >
          <v-card variant="outlined">
            <div class="text-center">
              <v-icon class="dashboard-links-icon send-products-icon"
                >mdi mdi-warehouse</v-icon
              >
              <p class="">{{ $t("inventory.deliverToSendy") }}</p>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventsMixin from "../../mixins/events_mixin";
import { mapMutations, mapGetters } from "vuex";

export default {
  mixins: [eventsMixin],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getStorageUserDetails", "getEditValue"]),
  },
  mounted() {
    this.setComponent("common.sendInventory");
    this.setSelectedProducts([]);
  },
  methods: {
    ...mapMutations([
      "setSendProductsRoute",
      "setComponent",
      "setSelectedProducts",
      "setEditValue",
    ]),
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
  margin-bottom: 30px;
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
.el-step__title.is-process {
  font-weight: 500 !important;
}
</style>
