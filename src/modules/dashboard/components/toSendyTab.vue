<template>
  <div class="deliveries-container-inner" v-if="getConsignments.length">
    <v-table class="">
      <thead>
        <tr>
          <th class="text-left table-headers">
            {{ $t("deliveries.products") }}
          </th>
          <th class="text-left table-headers">
            {{ $t("dashboard.progress") }}
          </th>
          <th class="text-left table-headers">
            {{ $t("deliveries.platforms") }}
          </th>
          <th class="text-left table-headers">
            {{ $t("dashboard.action") }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in getConsignments"
          :key="index"
          class="dashboard-deliveries-row-container"
        >
          <td class="deliveries-date-row">
            <v-list-item class="dashboard-customer-columns" lines="two">
              <v-list-item-header>
                <v-list-item-title>
                  <span :class="getLoader.consignments">
                    {{ formatProducts(item.products) }}
                  </span>
                </v-list-item-title>
              </v-list-item-header>
            </v-list-item>
          </td>
          <td class="deliveries-product-row">
            <v-list-item class="dashboard-customer-columns" lines="two">
              <v-list-item-header v-if="item.order_status === 'ORDER_FAILED'">
                <p class="delivery-attempted-error">
                  <i class="mdi mdi-information-outline mr-2"></i
                  >{{ $t("deliveries.deliveryAttempt") }}
                </p>
                <p class="ml-6 mb-1">
                  {{
                    $t("deliveries.weWillDeliverAgain", {
                      Date: deliveryDate(item.scheduled_date),
                    })
                  }}
                </p>
              </v-list-item-header>
              <v-list-item-header v-else>
                <v-list-item-title>
                  <span :class="getLoader.consignments">
                    {{ formatStatus(item.order_event_status, item) }}
                  </span>
                </v-list-item-title>
                <v-progress-linear
                  :model-value="item.delivery_progress_ratio * 100"
                  color="#324BA8"
                  rounded
                  height="7"
                ></v-progress-linear>
              </v-list-item-header>
            </v-list-item>
          </td>
          <td class="deliveries-platform-row">
            <span class="deliveries-platform-tag">
              <span
                :class="getLoader.consignments"
                class="deliveries-platform-tag-storefront"
                v-if="item.sales_channel_name"
              >
                {{ item.sales_channel_name }}
              </span>
              <span
                :class="getLoader.consignments"
                class="deliveries-platform-tag-fulfillment"
                v-else
              >
                {{ $t("dashboard.fulfillmentApp") }}
              </span>
            </span>
          </td>
          <td class="deliveries-date-row">
            <router-link
              :to="`/deliveries/tracking/${item.order_id}`"
              class="dashboard-track-order"
            >
              <span :class="getLoader.consignments">
                {{ $t("deliveries.trackOrder") }}
              </span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="show-more-deliveries-link" v-if="showMoreDeliveries">
      <router-link :to="'/deliveries/sendy'" class="show-more-deliveries-link"
        >{{ $t("dashboard.showMoreDeliveries")
        }}<v-icon>mdi mdi-arrow-right</v-icon></router-link
      >
    </div>
  </div>
  <div class="deliveries-empty" v-else>
    <div>
      <img
        src="https://images.sendyit.com/fulfilment/seller/track.png"
        alt=""
        class="deliveries-empty-img"
      />
    </div>
    <p class="deliveries-empty-title">
      {{ $t("deliveries.noDeliveriesToTrack") }}
    </p>
    <v-btn class="deliveries-btn" @click="redirect()" size="default">
      {{ $t("deliveries.deliverToSendy") }}
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment/moment";
import eventLabels from "../../../mixins/event_labels";

export default {
  mixins: [eventLabels],
  computed: {
    ...mapGetters(["getConsignments", "getLoader"]),
  },
  methods: {
    redirect() {
      this.$router.push("/inventory/add-pickup-products");
    },
    showMoreDeliveries() {
      return this.getConsignments.length >= 5;
    },
    formatProducts(products) {
      return `${products[0].product_variant_description} ${
        products.length > 1
          ? this.$t("deliveries.otherItems", { count: products.length - 1 })
          : ""
      }`;
    },
    deliveryDate(date) {
      return moment(date).format("MMM M/D/YYYY");
    },
    formatStatus(status, item) {
      return this.showEventLabels(status, item);
    },
  },
};
</script>
