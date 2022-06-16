<template>
  <div>
    <div class="mb-3">
      <v-menu
        transition="slide-y-transition"
        anchor="bottom end"
        v-model="variantsToggle"
        v-if="product.product_variants"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            dark
            v-bind="props"
            append-icon="mdi-chevron-down"
            class="product-details-variant-select product-details-variant-btn"
          >
            {{ variantSelected }}
          </v-btn>
        </template>
        <v-list class="header-list-popup">
          <v-list-item
            v-for="(product, i) in product.product_variants"
            :key="i"
          >
            <v-list-item-title class="product-details-variant">
              <span>
                <img
                  :src="product.product_variant_image_link"
                  alt="img"
                  class="product-details-img"
                />
              </span>
              <div class="product-details-variant-row">
                <span>
                  {{ product.product_variant_quantity }}
                  {{ product.product_variant_quantity_type }}
                </span>
                <span>
                  {{ product.product_variant_currency }}
                  {{ product.product_variant_unit_price }}
                </span>
              </div>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <span v-else>
        <img
          :src="product.product_link"
          alt="img"
          class="product-details-img"
        />
        {{ product.product_name }}
      </span>
    </div>
    <v-table v-if="activityHistory">
      <table-header
        :header="product.product_variants ? tableHeaders2 : tableHeaders"
      />
      <tbody>
        <tr v-for="(activity, index) in activityHistory" :key="index">
          <td>
            {{
              product.product_variants ? "23/2/2022 12:00 pm" : activity.date
            }}
          </td>
          <td v-if="product.product_variants">
            {{ activity.product_variant_quantity }} ml
          </td>
          <td>
            {{
              product.product_variants
                ? "3 items sent to James doe"
                : activity.activity
            }}
          </td>
          <td>
            <router-link to="/inventory/view-product" class="view-product-link"
              >View</router-link
            >
          </td>
        </tr>
      </tbody>
    </v-table>
    <div v-else class="no-activity-container">
      <v-icon class="history-back-icon">mdi mdi-history</v-icon>
      <p>
        {{ $t("inventory.noActivity") }}
      </p>
    </div>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
export default {
  components: { tableHeader },
  props: ["product"],
  data() {
    return {
      variantSelected: "All product options",
      variantsToggle: false,
      tableHeaders: [
        {
          title: this.$t("inventory.date"),
        },
        {
          title: this.$t("inventory.activity"),
        },
        {
          title: "",
        },
      ],
      tableHeaders2: [
        {
          title: this.$t("inventory.date"),
        },
        {
          title: this.$t("inventory.producTOptions"),
        },
        {
          title: this.$t("inventory.activity"),
        },
        {
          title: "",
        },
      ],
      activities: [
        {
          date: "23/2/2022 12:00 pm",
          activity: "3 items sent to James doe",
          link: "/deliveries/tracking",
        },
        {
          date: "23/2/2022 12:00 pm",
          activity: "13 items received at the Sendy fulfillment centre",
          link: "/deliveries/tracking",
        },
      ],
    };
  },
  computed: {
    activityHistory() {
      const res = this.product.product_variants;
      return res ? this.product.product_variants : this.activities;
    },
  },
};
</script>

<style>
.history-back-icon {
  color: #324ba8;
}
.no-activity-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.product-options-select {
  width: 30% !important;
}
.product-details-variant-select
  .select-trigger
  .el-input
  .el-input__wrapper
  .el-input__inner {
  height: 40px;
}
.product-details-variant-btn {
  text-transform: capitalize;
  letter-spacing: 0px;
}
.product-details-variant-row {
  display: flex;
  flex-direction: column;
}
.product-details-variant {
  display: flex;
}
</style>
