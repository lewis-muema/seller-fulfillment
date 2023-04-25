<template>
  <div class="deliveries-container-inner" v-if="getOnDemandDeliveries.length">
    <v-table class="">
      <thead>
        <tr>
          <th class="text-left table-headers">
            {{ $t("deliveries.pickupLocation") }}
          </th>
          <th class="text-left table-headers">
            {{ $t("deliveries.deliveryLocation") }}
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
          v-for="(item, index) in getOnDemandDeliveries"
          :key="index"
          class="dashboard-deliveries-row-container"
        >
          <td class="deliveries-date-row">
            <v-list-item class="dashboard-customer-columns" lines="two">
              <v-list-item-header>
                <v-list-item-title class="deliveries-name-row">
                  <span :class="getLoader.onDemandOrders">
                    {{ item.instructions[0].delivery_location.description }}
                  </span>
                </v-list-item-title>
              </v-list-item-header>
            </v-list-item>
          </td>
          <td class="deliveries-date-row">
            <v-list-item class="dashboard-customer-columns" lines="two">
              <v-list-item-header>
                <v-list-item-title class="deliveries-name-row">
                  <span :class="getLoader.onDemandOrders">
                    {{ item.instructions[1].delivery_location.description }}
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
                  <span :class="getLoader.onDemandOrders">
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
                :class="getLoader.onDemandOrders"
                class="deliveries-platform-tag-storefront"
                v-if="item.sales_channel_name"
              >
                {{ item.sales_channel_name }}
              </span>
              <span
                :class="getLoader.onDemandOrders"
                class="deliveries-platform-tag-fulfillment"
                v-else
              >
                {{ $t("dashboard.fulfillmentApp") }}
              </span>
            </span>
          </td>
          <td class="deliveries-date-row">
            <router-link
              :to="`/deliveries/track-direct-deliveries/${item.order_id}`"
              class="dashboard-track-order"
            >
              <span :class="getLoader.onDemandOrders">
                {{ $t("deliveries.trackOrder") }}
              </span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="show-more-deliveries-link" v-if="showMoreDeliveries">
      <router-link
        :to="'/deliveries/direct-deliveries/'"
        class="show-more-deliveries-link"
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
      {{ $t("deliveries.deliverToACustomer") }}
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
    ...mapGetters(["getOnDemandDeliveries", "getLoader"]),
  },
  methods: {
    redirect() {
      this.$router.push("/direct/create-delivery");
    },
    showMoreDeliveries() {
      return this.getOnDemandDeliveries.length >= 5;
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
