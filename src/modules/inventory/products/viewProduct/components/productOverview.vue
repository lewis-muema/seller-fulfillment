<template>
  <div class="">
    <div class="mb-3">
      <span>
        <img
          :src="product.product_variants[0].product_variant_image_link"
          v-if="!getLoader.productDetails"
          alt="img"
          class="product-details-img"
        />
        <span :class="getLoader.productDetails">
          {{ product.product_name }}
        </span>
      </span>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">{{ $t("inventory.desc") }}</p>
      <p>
        <span :class="getLoader.productDetails">
          {{
            product.product_description
              ? product.product_description
              : $t("inventory.noDescriptionProvided")
          }}
        </span>
      </p>
    </div>
    <div v-if="product.product_variants.length <= 1">
      <div class="product-details-content mb-3">
        <p class="product-header">{{ $t("inventory.price") }}</p>
        <p>
          <span :class="getLoader.productDetails">
            {{ product.product_variants[0].product_variant_currency }}
            {{ product.product_variants[0].product_variant_unit_price }}
          </span>
        </p>
      </div>
      <div class="product-details-content mb-3">
        <p class="product-header">{{ $t("inventory.weight") }}</p>
        <p>
          <span :class="getLoader.productDetails">
            {{ product.product_variants[0].product_variant_quantity }}
            {{ product.product_variants[0].product_variant_quantity_type }}
          </span>
        </p>
      </div>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">{{ $t("inventory.inventorySummary") }}</p>
      <p>
        <span :class="getLoader.productDetails">
          {{ $t("inventory.totalStockAvailable") }}:
          {{ totalStock(product) }}
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
                v-if="!getLoader.productDetails"
                alt="img"
                class="product-details-img"
              />
            </div>
            <div v-else>
              {{ variant.fulfillmentCenter }}
            </div>
          </td>
          <td>
            <div v-if="product.product_variants.length > 1">
              <v-list-item lines="two">
                <v-list-item-header>
                  <v-list-item-title>
                    <span :class="getLoader.productDetails">
                      {{ variant.product_variant_description }}
                    </span></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    <span :class="getLoader.productDetails">
                      {{ variant.product_variant_quantity }}
                      {{ variant.product_variant_quantity_type }}
                    </span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span :class="getLoader.productDetails">
                      {{ variant.product_variant_currency }}
                      {{ variant.product_variant_unit_price }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-header>
              </v-list-item>
            </div>
            <div></div>
          </td>
          <td>
            <span :class="getLoader.productDetails">
              {{
                variant.product_variant_stock_levels
                  ? variant.product_variant_stock_levels.quantity_in_inventory
                  : "-"
              }}
            </span>
          </td>
          <td>
            <span :class="getLoader.productDetails">
              {{
                variant.product_variant_stock_levels
                  ? variant.product_variant_stock_levels
                      .quantity_in_sales_orders
                  : "-"
              }}
            </span>
          </td>
          <td>
            <span :class="getLoader.productDetails">
              {{
                false
                  ? variant.product_variant_stock_level.quantity_in_sales_orders
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
          title: "inventory.fulfillmentCenter",
          description: "",
        },
        {
          title: "inventory.available",
          description: "inventory.availableProducts",
        },
        {
          title: "inventory.committed",
          description: "inventory.CommittedProducts",
        },
        {
          title: "inventory.incoming",
          description: "inventory.IncomingProducts",
        },
      ],
      tableHeaders2: [
        {
          title: "inventory.img",
          description: "",
        },
        {
          title: "inventory.option",
          description: "",
        },
        {
          title: "inventory.available",
          description: "inventory.availableProducts",
        },
        {
          title: "inventory.committed",
          description: "inventory.CommittedProducts",
        },
        {
          title: "inventory.incoming",
          description: "inventory.IncomingProducts",
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
      this.product.product_variants.forEach((row, i) => {
        if (
          (this.product.product_variants.length === 1 ||
            (this.product.product_variants.length > 1 && i >= 1)) &&
          !row.product_variant_archived
        ) {
          res.push(row);
        }
      });
      return res;
    },
    product() {
      return this.getProduct;
    },
  },
  methods: {
    totalStock(product) {
      let total = 0;
      product.product_variants.forEach((row) => {
        total =
          total + row.product_variant_stock_levels
            ? row.product_variant_stock_levels.quantity_in_inventory
            : 0;
      });
      if (product.product_variants.length === 1) {
        this.tableHeaders2[1].title = "";
      } else {
        this.tableHeaders2[1].title = "inventory.option";
      }
      return total;
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
