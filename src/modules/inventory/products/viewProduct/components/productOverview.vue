<template>
  <div class="">
    <div class="mb-3">
      <span>
        <img
          :src="product.product_variants[0].product_variant_image_link"
          v-if="!getLoader"
          alt="img"
          class="product-details-img"
        />
        <span :class="getLoader">
          {{ product.product_name }}
        </span>
      </span>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">{{ $t("inventory.desc") }}</p>
      <p>
        <span :class="getLoader">
          {{ product.product_description }}
        </span>
      </p>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">{{ $t("inventory.price") }}</p>
      <p>
        <span :class="getLoader">
          {{ product.product_variants[0].product_variant_currency }}
          {{ product.product_variants[0].product_variant_unit_price }}
        </span>
      </p>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">{{ $t("inventory.weight") }}</p>
      <p>
        <span :class="getLoader">
          {{ product.product_variants[0].product_variant_quantity }}
          {{ product.product_variants[0].product_variant_quantity_type }}
        </span>
      </p>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">{{ $t("inventory.inventorySummary") }}</p>
      <p>
        <span :class="getLoader">
          {{ $t("inventory.totalStockAvailable") }}:
          {{ product.product_variants.length }}
        </span>
      </p>
    </div>
    <v-table v-if="product.product_variants">
      <table-header
        :header="product.product_variants ? tableHeaders2 : tableHeaders"
      />
      <tbody>
        <tr v-for="(variant, index) in variants" :key="index">
          <td>
            <div v-if="product.product_variants">
              <img
                :src="variant.product_variant_image_link"
                v-if="!getLoader"
                alt="img"
                class="product-details-img"
              />
            </div>
            <div v-else>
              {{ variant.fulfillmentCenter }}
            </div>
          </td>
          <td v-if="product.product_variants">
            <v-list-item lines="two">
              <v-list-item-header>
                <v-list-item-title>
                  <span :class="getLoader">
                    {{ variant.product_variant_quantity }}
                    {{ variant.product_variant_quantity_type }}
                  </span></v-list-item-title
                >
                <v-list-item-subtitle>
                  <span :class="getLoader">
                    {{ variant.product_variant_currency }}
                    {{ variant.product_variant_unit_price }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item-header>
            </v-list-item>
          </td>
          <td>
            <span :class="getLoader">
              {{
                variant.product_variant_stock_levels
                  ? variant.product_variant_stock_levels.available
                  : "-"
              }}
            </span>
          </td>
          <td>
            <span :class="getLoader">
              {{
                variant.product_variant_stock_levels
                  ? variant.product_variant_stock_levels.quantity_in_inventory
                  : "-"
              }}
            </span>
          </td>
          <td>
            <span :class="getLoader">
              {{
                variant.product_variant_stock_levels
                  ? variant.product_variant_stock_levels
                      .quantity_in_sales_orders
                  : "-"
              }}
            </span>
          </td>
          <!-- <td v-if="product.product_variants">
            <product-variants
              @close="showProductVariants = false"
              :visible="showProductVariants"
              :incoming="
                variant.product_variant_stock_levels.quantity_in_inventory
              "
              :available="variant.product_variant_stock_levels.available"
              :committed="
                variant.product_variant_stock_levels.quantity_in_sales_orders
              "
            />
          </td> -->
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tableHeader from "@/modules/inventory/tables/tableHeader";
import productVariants from "@/modules/inventory/products/viewProduct/components/productVariants";
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { tableHeader, productVariants },
  data() {
    return {
      showProductVariants: false,
      tableHeaders: [
        {
          title: this.$t("inventory.fulfillmentCenter"),
          description: "",
        },
        {
          title: this.$t("inventory.available"),
          description: this.$t("inventory.availableProducts"),
        },
        {
          title: this.$t("inventory.committed"),
          description: this.$t("inventory.CommittedProducts"),
        },
        {
          title: this.$t("inventory.incoming"),
          description: this.$t("inventory.IncomingProducts"),
        },
      ],
      tableHeaders2: [
        {
          title: this.$t("inventory.img"),
          description: "",
        },
        {
          title: this.$t("inventory.option"),
          description: "",
        },
        {
          title: this.$t("inventory.productOption"),
          description: this.$t("inventory.availableProducts"),
        },
        {
          title: "Committed",
          description: this.$t("inventory.CommittedProducts"),
        },
        {
          title: "Incoming",
          description: this.$t("inventory.IncomingProducts"),
        },
      ],
      pSummary: [
        {
          fulfillmentCenter: "Marsabit Plaza",
          available: "23",
          committed: "3",
          incoming: "0",
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["getProduct", "getLoader"]),
    variants() {
      const res = [];
      this.product.product_variants.forEach((row) => {
        if (!row.product_variant_archived) {
          res.push(row);
        }
      });
      return res;
    },
    product() {
      return this.getProduct;
    },
  },
};
</script>

<style>
.product-details-content > p {
  margin: 0;
  line-height: 2;
}
.product-details-container {
  margin-left: 70px;
}
.product-details-header {
  padding: 30px 0px 0px 30px;
}
.actions-dropdown {
  position: absolute !important;
  right: 0 !important;
  margin-right: 80px !important;
}
.product-header {
  color: #606266;
  font-size: 13px;
}
.product-details-img {
  height: 40px;
  margin-right: 10px;
}
</style>
