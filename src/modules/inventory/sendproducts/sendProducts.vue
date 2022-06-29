<template>
  <div>
    <div v-if="!$route.params.path">
      <span class="send-products-header-text text-center">
        {{ $t("inventory.toDo") }}
      </span>
      <div class="send-products-container">
        <div
          @click="redirect(`${customerRoute}/select-products`, customerHeader)"
          class="send-products-content"
        >
          <v-card class="send-products-card" variant="outlined">
            <div class="text-center">
              <v-icon class="dashboard-links-icon send-products-icon"
                >mdi mdi-truck</v-icon
              >
              <p class="mt-4">{{ $t("inventory.deliverToCustomer") }}</p>
            </div>
          </v-card>
        </div>
        <div
          @click="redirect(`${sendyRoute}/select-products`, sendyHeader)"
          class="send-products-content"
        >
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
          <el-steps :active="step" finish-status="success">
            <el-step :title="$t('inventory.selectProducts')"></el-step>
            <el-step :title="$t('inventory.enterQuantity')"></el-step>
            <el-step :title="$t('inventory.checkout')"></el-step>
          </el-steps>
        </v-col>
      </v-row>
      <div>
        <ProductsSelect
          @pickScreen="redirect(mainRoute, mainHeader)"
          v-if="$route.params.page === 'select-products'"
        />
        <AddQuantity v-if="$route.params.page === 'add-quantity'" />
        <Checkout v-if="$route.params.page === 'checkout'" />
      </div>
    </div>
  </div>
</template>

<script>
import ProductsSelect from "./components/productsSelect.vue";
import AddQuantity from "./components/addQuantity.vue";
import Checkout from "./components/checkout";
import eventsMixin from "../../../mixins/events_mixin";
import { mapMutations, mapGetters } from "vuex";

export default {
  components: { ProductsSelect, AddQuantity, Checkout },
  mixins: [eventsMixin],
  data() {
    return {
      customerRoute: "/inventory/send-inventory/customer",
      sendyRoute: "/inventory/send-inventory/sendy",
      mainRoute: "/inventory/send-inventory",
      customerHeader: "common.sendDeliveryToCustomer",
      sendyHeader: "common.sendInventoryToSendy",
      mainHeader: "common.sendInventory",
    };
  },
  computed: {
    ...mapGetters(["getStorageUserDetails"]),
    step() {
      if (this.$route.params.page === "add-quantity") {
        return 1;
      } else if (this.$route.params.page === "checkout") {
        return 2;
      }
      return 0;
    },
  },
  watch: {
    $route() {
      if (this.$route.params.path === "customer") {
        this.redirect(this.customerRoute, this.customerHeader);
      } else if (this.$route.params.path === "sendy") {
        this.redirect(this.sendyRoute, this.sendyHeader);
      } else if (this.$route.params.path === "") {
        this.redirect(this.mainRoute, this.mainHeader);
      }
    },
  },
  mounted() {
    this.setComponent("common.sendInventory");
    if (this.$route.params.path === "customer") {
      this.redirect(this.customerRoute, this.customerHeader);
    } else if (this.$route.params.path === "sendy") {
      this.redirect(this.sendyRoute, this.sendyHeader);
    } else if (this.$route.params.path === "") {
      this.redirect(this.mainRoute, this.mainHeader);
    }
  },
  methods: {
    ...mapMutations([
      "setSendProductsRoute",
      "setComponent",
      "setSelectedProducts",
    ]),
    redirect(route, header) {
      if (route === `${this.customerRoute}/select-products`) {
        this.sendSegmentEvents({
          event: "Send to Customer",
          data: {
            userId: this.getStorageUserDetails.business_id,
            clientType: "web",
            device: "desktop",
          },
        });
      } else if (route === `${this.sendyRoute}/select-products`) {
        this.sendSegmentEvents({
          event: "Manage Inventory",
          data: {
            userId: this.getStorageUserDetails.business_id,
            clientType: "web",
            device: "desktop",
          },
        });
      }
      if (this.$route.params.path === "") {
        this.setSelectedProducts([]);
      }
      this.$router.push(
        `${route}${this.$route.params.page ? "/" : ""}${
          this.$route.params.page
        }`
      );
      this.setComponent(header);
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
