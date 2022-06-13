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
                  <v-list-item v-for="(action, i) in actions" :key="i">
                    <v-list-item-title @click="trigger(action)">
                      {{ action.label }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
          <product-details-tabs v-if="stockSelectedTab === 'Overview'">
            <product-overview :product="product" />
          </product-details-tabs>
          <product-details-tabs v-if="stockSelectedTab === 'History'">
            <product-history :product="product" />
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
import { mapGetters } from "vuex";
export default {
  components: { productDetailsTabs, productOverview, productHistory },
  data() {
    return {
      actions: [
        {
          label: this.$t("inventory.edit"),
          link: "/inventory/edit-product",
        },
        {
          label: this.$t("inventory.archive"),
          link: "",
        },
        {
          label: this.$t("inventory.addProductOptions"),
          link: "",
        },
      ],
      product: [],
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.viewProduct"));
    if (this.$route.params.product !== undefined) {
      this.product = JSON.parse(this.$route.params.product);
    }
  },
  computed: {
    ...mapGetters(["getStockSelectedTab"]),
    stockSelectedTab() {
      return this.getStockSelectedTab;
    },
  },
  methods: {
    trigger(action) {
      if (action.link) {
        this.$router.push(action.link);
      }
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
</style>
