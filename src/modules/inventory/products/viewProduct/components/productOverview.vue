<template>
  <!-- {{ variants }} -->
  <div class="">
    <div class="mb-3">
      <span>
        <img src="" alt="img" />
        {{ product.product_name }}
      </span>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">Description</p>
      <p>{{ product.product_description }}</p>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">Price</p>
      <p>400</p>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">The weight or capacity of the product</p>
      <p>500ml</p>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">Inventory Summary</p>
      <p>Total stock available: 56</p>
    </div>
    <v-table>
      <table-header
        :header="product.product_variants ? tableHeaders2 : tableHeaders"
      />
      <tbody>
        <tr v-for="(variant, index) in variants" :key="index">
          <td>
            {{ product.product_variants ? `image` : variant.fulfillmentCenter }}
          </td>
          <td v-if="product.product_variants">
            <v-list-item lines="two">
              <v-list-item-header>
                <v-list-item-title
                  >{{ variant.product_variant_quantity }}
                  {{ variant.product_variant_quantity_type }}</v-list-item-title
                >
                <v-list-item-subtitle>
                  {{ variant.product_variant_currency }}
                  {{ variant.product_variant_unit_price }}
                </v-list-item-subtitle>
              </v-list-item-header>
            </v-list-item>
          </td>
          <td>
            {{
              product.product_variants
                ? variant.product_variant_stock_levels.available
                : variant.available
            }}
          </td>
          <td>
            {{
              product.product_variants
                ? variant.product_variant_stock_levels.quantity_in_inventory
                : variant.committed
            }}
          </td>
          <td>
            {{
              product.product_variants
                ? variant.product_variant_stock_levels.quantity_in_sales_orders
                : variant.incoming
            }}
          </td>
          <td v-if="product.product_variants">
            <p class="add-product-options" @click="showProductVariants = true">
              View
            </p>
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
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
import productVariants from "@/modules/inventory/products/viewProduct/components/productVariants";
export default {
  components: { tableHeader, productVariants },
  props: ["product"],
  data() {
    return {
      showProductVariants: false,
      tableHeaders: [
        "Fulfillment Center",
        "Available",
        "Committed",
        "Incoming",
      ],
      tableHeaders2: [
        "Image",
        "Product Option",
        "Available",
        "Committed",
        "Incoming",
        "",
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
    variants() {
      const res = this.product.product_variants;
      return res ? this.product.product_variants : this.pSummary;
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
</style>
