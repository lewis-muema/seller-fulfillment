<template>
  <div class="deliveries-container">
    <div class="deliveries-container-inner">
      <div class="deliveries-mid-bar">
        <div class="deliveries-search">
          <searchAlgolia type="delivery" />
        </div>
        <div class="deliveries-date-range">
          <label for="range" class="deliveries-date-label">
            {{ $t("deliveries.filterByCompletionDate") }}
          </label>
          <el-date-picker
            class="deliveries-date-picker"
            id="range"
            v-model="range"
            type="daterange"
            :start-placeholder="$t('deliveries.startDate')"
            :end-placeholder="$t('deliveries.endDate')"
          />
        </div>
      </div>
      <div
        v-if="getDeliveries.length > 0"
        class="deliveries-to-customers-container"
      >
        <v-table>
          <thead>
            <tr>
              <th class="text-left deliveries-table-header">
                <span :class="getLoader.deliveries">{{
                  $t("deliveries.customerInfo")
                }}</span>
              </th>
              <th class="text-left deliveries-table-header">
                <span :class="getLoader.deliveries">{{
                  $t("deliveries.progress")
                }}</span>
              </th>
              <th class="text-left deliveries-table-header">
                <span :class="getLoader.deliveries">{{
                  $t("deliveries.platforms")
                }}</span>
              </th>
              <th class="text-left deliveries-table-header">
                <span :class="getLoader.deliveries">{{
                  $t("deliveries.deliveryDate")
                }}</span>
              </th>
              <th class="text-left deliveries-table-header">
                <span :class="getLoader.deliveries">{{
                  $t("deliveries.actions")
                }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="deliveries-table-column"
              v-for="(item, i) in getDeliveries"
              :key="i"
            >
              <td class="deliveries-product-row">
                <div class="deliveries-name-row">
                  <span :class="getLoader.deliveries">
                    {{ formatName(item.destination.name) }}
                  </span>
                </div>
                <div class="deliveries-location-row">
                  <span :class="getLoader.deliveries">
                    {{
                      formatName(item.destination.delivery_location.description)
                    }}
                  </span>
                </div>
              </td>
              <td class="deliveries-progress-row">
                <div v-if="item.order_status === 'ORDER_FAILED'">
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
                </div>
                <div v-else>
                  <p class="deliveries-progress-row-top">
                    <span :class="getLoader.deliveries">
                      {{ formatStatus(item.order_event_status, item) }}
                    </span>
                  </p>
                  <v-progress-linear
                    :model-value="item.delivery_progress_ratio * 100"
                    color="#324BA8"
                    height="10"
                    rounded
                  ></v-progress-linear>
                </div>
              </td>
              <td class="deliveries-platform-row">
                <span
                  :class="getLoader.deliveries"
                  class="deliveries-platform-tag"
                >
                  <span
                    :class="getLoader.deliveries"
                    class="deliveries-platform-tag-storefront"
                    v-if="item.sales_channel_name"
                  >
                    {{ item.sales_channel_name }}
                  </span>
                  <span
                    :class="getLoader.deliveries"
                    class="deliveries-platform-tag-fulfillment"
                    v-else
                  >
                    {{ $t("dashboard.fulfillmentApp") }}
                  </span>
                </span>
              </td>
              <td class="deliveries-date-row">
                <div v-if="item.order_status === 'ORDER_COMPLETED'">
                  <p class="deliveries-date-row-top">
                    <span :class="getLoader.deliveries">
                      {{ deliveryDate(item.completed_date) }}
                    </span>
                  </p>
                </div>
                <div v-else-if="item.order_status === 'ORDER_CANCELED'">
                  <p class="deliveries-date-row-top">
                    <span :class="getLoader.deliveries">
                      {{ deliveryDate(item.updated_date) }}
                    </span>
                  </p>
                </div>
                <div v-else>
                  <p class="deliveries-date-row-top">
                    <span :class="getLoader.deliveries">
                      {{ deliveryDate(item.scheduled_date) }}
                    </span>
                  </p>
                  <p class="deliveries-date-row-bottom">
                    <span :class="getLoader.deliveries">
                      {{ deliveryTime(item.scheduled_date) }}
                    </span>
                  </p>
                </div>
              </td>
              <td class="deliveries-action-row">
                <p
                  class="deliveries-action-row-top"
                  @click="navigate(`/deliveries/tracking/${item.order_id}`)"
                >
                  <span
                    :class="getLoader.deliveries"
                    class="delivery-order-id-component"
                  >
                    {{ $t("deliveries.trackOrder") }}
                  </span>
                </p>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div v-else class="no-deliveries-to-customers-container">
        <div v-if="ongoingDeliveries > 0">
          <div class="no-products-card-container">
            <span class="no-deliveries-icon-halo">
              <i class="mdi mdi-magnify no-products-icon"></i>
            </span>
            <div class="no-products-description">
              {{ $t("deliveries.sorryNoDeliveriesFound") }}
            </div>
            <div class="no-deliveries-description">
              {{ $t("deliveries.weCouldntFindAnyDeliveries") }}
            </div>
          </div>
        </div>
        <div v-else class="deliveries-empty">
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
          <v-btn
            class="deliveries-btn"
            @click="$router.push('/inventory/create-delivery')"
            size="default"
          >
            {{ $t("deliveries.deliverToACustomer") }}
          </v-btn>
        </div>
      </div>
      <div>
        <v-pagination
          class="mt-3"
          v-model="page"
          :length="getPagination.page_count"
          :total-visible="getPagination.page_count < 10 ? '' : 10"
          rounded="circle"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapMutations, mapGetters, mapActions } from "vuex";
import searchAlgolia from "../../../common/searchAlgolia.vue";
import eventLabels from "../../../../mixins/event_labels";
import placeholder from "../../../../mixins/placeholders";

export default {
  components: { searchAlgolia },
  mixins: [eventLabels, placeholder],
  data: () => ({
    deliveries: [],
    range: "",
    params: "",
    page: 1,
  }),
  watch: {
    range(val) {
      const length = val ? val.length : 0;
      if (length !== 3) {
        if (val && !this.getTabStatus) {
          this.allParams("", this.limitParams());
        } else if (val && this.getTabStatus) {
          this.allParams(this.statusParams(), this.limitParams());
        } else if (!val && this.getTabStatus) {
          this.allParams(this.statusParams(), "");
        } else if (!val && !this.getTabStatus) {
          this.allParams("", "");
        }
      }
    },
    "$store.state.tabStatus": function tabStatus(val) {
      if (val && !this.range) {
        this.allParams(this.statusParams(), "");
      } else if (val && this.range) {
        this.allParams(this.statusParams(), this.limitParams());
      } else if (!val && this.range) {
        this.allParams("", this.limitParams());
      } else if (!val && !this.range) {
        this.allParams("", "");
      }
    },
    params() {
      this.setDeliveries(this.placeHolderDeliveries);
      this.fetchOrders();
    },
    page() {
      if (this.params === "?" || this.params.includes("?offset=")) {
        this.params = `?offset=${this.page - 1}`;
      } else {
        const offset = this.params.split("&offset");
        this.params = offset[1]
          ? `${offset[0]}&offset=${this.page - 1}`
          : `${this.params}&offset=${this.page - 1}`;
      }
    },
  },
  mounted() {
    this.setDeliveries(this.placeHolderDeliveries);
    this.getDeliveryStats();
    this.range = this.$route.params.date
      ? [
          new Date(parseInt(this.$route.params.date)),
          new Date(parseInt(this.$route.params.date)),
          new Date(parseInt(this.$route.params.date)),
        ]
      : "";
    this.params = this.$route.params.tab ? "" : "?";
    this.setTab(this.$route.params.tab ? this.$route.params.tab : "All");
  },
  beforeUnmount() {
    this.setTab("All");
    this.setTabStatus("");
  },
  computed: {
    ...mapGetters([
      "getDeliveries",
      "getLoader",
      "getTabStatus",
      "getStorageUserDetails",
      "getDeliveriesStatistics",
      "getTabStatuses",
      "getPagination",
    ]),
    ongoingDeliveries() {
      let orderCount = 0;
      Object.values(this.getDeliveriesStatistics).forEach((row) => {
        orderCount = row + orderCount;
      });
      return orderCount;
    },
  },
  methods: {
    ...mapActions(["requestAxiosPost", "requestAxiosGet"]),
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setDeliveries",
      "setDeliveriesStatistics",
      "setTab",
      "setTabStatus",
      "setPagination",
    ]),
    navigate(route) {
      this.$router.push(route);
    },
    limitParams() {
      return `?lower_limit_date=${moment(this.range[0]).format(
        "YYYY-MM-DD"
      )}&upper_limit_date=${moment(this.range[1]).format("YYYY-MM-DD")}`;
    },
    statusParams() {
      return `status=${this.getTabStatus}`;
    },
    allParams(status, range) {
      this.params = `${range}${status && range ? "&" : ""}${
        range ? "" : "?"
      }${status}`;
    },
    fetchOrders() {
      this.setLoader({
        type: "deliveries",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/deliveries${this.params}`,
      }).then((response) => {
        if (response.status === 200) {
          this.setDeliveries(response.data.data.orders);
          this.setPagination(response.data.data.pagination);
          this.page = response.data.data.pagination.current_page + 1;
        }
        if (this.$route.path.includes("/deliveries/customer")) {
          this.setLoader({
            type: "deliveries",
            value: "",
          });
        }
      });
    },
    getDeliveryStats() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/deliveries/statistics`,
      }).then((response) => {
        if (response.status === 200) {
          this.setDeliveriesStatistics(
            response.data.data.grouped_by_status_count
          );
        }
      });
    },
    deliveryDate(date) {
      return moment(date).format("Do MMM YYYY");
    },
    deliveryTime(date) {
      const finalTime = moment(date).add(2, "hours");
      return `${moment(date).format("ha")} - ${moment(finalTime).format("ha")}`;
    },
    formatName(name) {
      const nameArr = name.split(" ");
      nameArr.forEach((name, i) => {
        nameArr[i] = name.charAt(0).toUpperCase() + name.slice(1);
      });
      return nameArr.join(" ");
    },
    formatStatus(status, item) {
      return this.showEventLabels(status, item);
    },
  },
};
</script>

<style>
.deliveries-search {
  width: 30%;
  zoom: 85%;
  margin: 25px;
}
.deliveries-container {
  border-radius: 10px;
  border: 1px solid #e2e7ed;
  margin: 30px;
}
.deliveries-table-column {
  height: 60px;
}
.deliveries-product-row {
  width: 20%;
}
.deliveries-date-row,
.deliveries-action-row,
.deliveries-platform-row {
  width: 10%;
}
.deliveries-progress-row {
  width: 30%;
}
.deliveries-product-row {
  font-size: 16px !important;
}
.deliveries-date-row-top {
  font-size: 14px;
  margin: 0px;
}
.deliveries-date-row-bottom {
  font-size: 12px;
  color: #606266;
  margin-bottom: 0px;
}
.deliveries-progress-row-top {
  font-size: 12px;
  margin: 5px 0px;
}
.deliveries-action-row-top {
  color: #324ba8;
  cursor: pointer;
}
.deliveries-btn {
  margin: 8px 25px;
  text-transform: inherit;
  font-size: 14px;
  letter-spacing: 0px;
  color: #324ba8 !important;
  border: 1px solid #324ba8 !important;
}
.deliveries-empty-img {
  width: 60px;
  margin-bottom: 80px;
}
.deliveries-empty-title {
  width: 300px;
  text-align: center;
}
.deliveries-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
.deliveries-mid-bar {
  display: flex;
}
.deliveries-date-range {
  height: 70px;
  margin-top: 10px;
  margin-right: 125px;
  margin-left: auto;
  display: flex;
  flex-direction: column;
}
.deliveries-date-picker {
  height: 50px !important;
}
.deliveries-date-label {
  font-size: 14px;
}
.deliveries-container-inner {
  width: 100%;
  background: white;
  margin-bottom: auto;
}
.deliveries-location-row {
  font-size: 14px;
  margin-bottom: 10px;
  margin-top: 0px;
  color: #909399;
  white-space: nowrap;
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.deliveries-name-row {
  font-size: 16px;
  margin-bottom: 0px;
  margin-top: 10px;
  white-space: nowrap;
  color: #303133;
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.deliveries-table-header {
  font-weight: 500;
}
.delivery-attempted-error {
  margin-bottom: 0px;
  margin-top: 10px;
  color: #9b101c;
  font-size: 16px;
  font-weight: 500;
}
.no-deliveries-icon-halo {
  height: 100px;
  width: 100px;
  border-radius: 70px;
  background: #f0f3f7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.no-deliveries-description {
  margin-top: 10px;
  color: #606266;
  width: 400px;
  text-align: center;
}
</style>
