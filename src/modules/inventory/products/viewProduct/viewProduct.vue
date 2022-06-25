<template>
  <div>
    <v-row>
      <v-col cols="8" class="mx-auto">
        <v-card variant="outlined" class="p-details">
          <div class="d-flex desktop-header-title mb-2">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="$router.back()"
            ></i>

            <v-card-title class="text-center"
              >{{ $t("inventory.productDetails") }}
              <span class="archived-badge" v-if="getProduct.product_archived">{{
                $t("inventory.archived")
              }}</span>
            </v-card-title>
            <div class="dropdown actions-dropdown mt-2">
              <v-menu transition="slide-y-transition" anchor="bottom center">
                <template v-slot:activator="{ props }">
                  <v-btn
                    class="product-details-actions-btn"
                    append-icon="mdi-menu-down"
                    v-bind="props"
                  >
                    {{ $t("inventory.actions") }}
                  </v-btn>
                </template>
                <v-list class="users-actions-popup">
                  <v-list-item
                    v-for="(action, i) in filteredActions"
                    @click="trigger(action)"
                    :key="i"
                  >
                    <v-list-item-title>
                      {{ action.label }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
          <product-details-tabs v-if="stockSelectedTab === 'Overview'">
            <product-overview />
          </product-details-tabs>
          <product-details-tabs v-if="stockSelectedTab === 'History'">
            <product-history />
          </product-details-tabs>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import productDetailsTabs from "@/modules/inventory/products/viewProduct/components/productDetailsTabs";
import productOverview from "@/modules/inventory/products/viewProduct/components/productOverview";
import productHistory from "@/modules/inventory/products/viewProduct/components/productHistory";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { ElNotification } from "element-plus";

export default {
  components: { productDetailsTabs, productOverview, productHistory },
  data() {
    return {
      actions: [
        {
          label: this.$t("inventory.edit"),
          link: "/inventory/edit-product",
          show: true,
        },
        {
          label: this.$t("inventory.archive"),
          link: "",
          action: "archive",
          show: true,
        },
        {
          label: this.$t("inventory.unarchive"),
          link: "",
          action: "unarchive",
          show: false,
        },
        {
          label: this.$t("inventory.addProductOptions"),
          link: "/inventory/edit-product",
          action: "addProduct",
          show: true,
        },
      ],
    };
  },
  mounted() {
    this.setComponent(this.$t("common.viewProduct"));
    this.fetchProduct();
  },
  computed: {
    ...mapGetters([
      "getStockSelectedTab",
      "getProduct",
      "getStorageUserDetails",
    ]),
    stockSelectedTab() {
      return this.getStockSelectedTab;
    },
    filteredActions() {
      const filteredActions = [];
      this.actions.forEach((row) => {
        if (row.show) {
          filteredActions.push(row);
        }
      });
      return filteredActions;
    },
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setProduct",
      "setAddProductStatus",
    ]),
    ...mapActions(["requestAxiosGet", "requestAxiosPut"]),
    trigger(action) {
      if (action.action) {
        this[action.action]();
      }
      if (action.link) {
        this.$router.push(action.link);
      }
    },
    addProduct() {
      this.setAddProductStatus(true);
    },
    fetchProduct() {
      this.setLoader("loading-text");
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products/${this.$route.params.product}`,
      }).then((response) => {
        if (this.$route.path.includes("/inventory/view-product")) {
          this.setLoader("");
        }
        if (response.status === 200) {
          this.setProduct(response.data.data.product);
          this.actions[1].show = !this.getProduct.product_archived;
          this.actions[2].show = this.getProduct.product_archived;
        }
      });
    },
    archive() {
      this.setLoader("loading-text");
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products/${this.$route.params.product}/archive`,
      }).then((response) => {
        if (this.$route.path.includes("/inventory/view-product")) {
          this.setLoader("");
        }
        if (response.status === 200) {
          ElNotification({
            title: this.$t("inventory.productArchivedSuccessfully"),
            message: "",
            type: "success",
          });
          this.fetchProduct();
        }
      });
    },
    unarchive() {
      this.setLoader("loading-text");
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products/${this.$route.params.product}/unarchive`,
      }).then((response) => {
        if (this.$route.path.includes("/inventory/view-product")) {
          this.setLoader("");
        }
        if (response.status === 200) {
          ElNotification({
            title: this.$t("inventory.productUnarchivedSuccessfully"),
            message: "",
            type: "success",
          });
          this.fetchProduct();
        }
      });
    },
  },
};
</script>

<style>
.p-details {
  padding: 20px 30px;
  border-color: #e2e7ed;
  margin-top: 50px !important;
  height: auto;
  background: white;
}
.view-product-dropdown-list a {
  color: #606266;
  text-decoration: none;
}
.product-details-actions-btn {
  text-transform: capitalize;
  letter-spacing: 0px;
  color: #606266 !important;
  font-weight: 300;
}
.archived-badge {
  background: #9b101c;
  color: white;
  padding: 0px 15px;
  border-radius: 10px;
  font-size: 14px;
  margin-left: 10px;
}
</style>
