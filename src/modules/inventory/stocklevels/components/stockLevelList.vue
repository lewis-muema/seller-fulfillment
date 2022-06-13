<template>
  <div>
    <v-card class="desktop-product-details" variant="outlined">
      <div class="products-search">
        <v-text-field
          color="#324BA8"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          variant="outlined"
          placeholder="Search Product"
        ></v-text-field>
      </div>

      <v-table class="" v-if="products.length > 0">
        <table-header :header="tableHeaders" />
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>
              <v-list-item lines="two">
                <v-list-item-avatar class="product-image-container">
                  <img
                    src="https://images.sendyit.com/fulfilment/seller/shea.png"
                    alt="img"
                    class="product-img"
                  />
                </v-list-item-avatar>
                <v-list-item-header>
                  <v-list-item-title>{{
                    product.product_name
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      product.product_variants
                        ? `${product.product_variants.length} product options`
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-header>
              </v-list-item>
            </td>
            <td>{{ product.available }}</td>
            <td>{{ product.committed }}</td>
            <td>{{ product.incoming }}</td>
            <td>
              <router-link
                :to="{
                  name: 'View Product',
                  params: {
                    product: JSON.stringify(product),
                  },
                }"
                class="view-product-link"
                >{{ $t("inventory.view") }}</router-link
              >
            </td>
          </tr>
        </tbody>
      </v-table>
      <div class="deliveries-empty" v-else>
        <div>
          <img
            src="https://images.sendyit.com/fulfilment/seller/track.png"
            alt=""
            class="deliveries-empty-img"
          />
        </div>
        <p class="deliveries-empty-title">
          {{ $t("inventory.noInventoryToTrackYet") }}
        </p>
        <v-btn
          class="deliveries-btn"
          @click="$router.push('/inventory/send-inventory')"
          size="default"
        >
          {{ $t("inventory.sendInventoryToSendy") }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
export default {
  props: ["products"],
  data() {
    return {
      headers: [
        {
          title: "Product",
          description: "",
        },
        {
          title: "Available",
          description:
            "Available: Products that are at the fulfillment centre and the seller can place a request on",
        },
        {
          title: "Committed",
          description:
            "Committed: Products that the user has placed a delivery request on but have not yet been delivered to the user, also includes items under failed deliveries",
        },
        {
          title: "Incoming",
          description:
            "Incoming: Products that the user has placed a consignment request for but have not yet been approved at the warehouse",
        },
        {
          title: "Actions",
          description: "",
        },
      ],
    };
  },
  components: {
    tableHeader,
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.stocks"));
  },
  computed: {
    tableHeaders() {
      return this.headers;
    },
  },
};
</script>

<style scoped></style>
