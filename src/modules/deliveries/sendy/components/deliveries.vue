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
      <div v-if="getConsignments.length > 0">
        <v-table>
          <thead>
            <tr>
              <th class="text-left deliveries-table-header">
                <span :class="getLoader">{{ $t("deliveries.products") }}</span>
              </th>
              <th class="text-left deliveries-table-header">
                <span :class="getLoader">{{ $t("deliveries.progress") }}</span>
              </th>
              <th class="text-left deliveries-table-header">
                <span :class="getLoader">{{
                  $t("deliveries.deliveryDate")
                }}</span>
              </th>
              <th class="text-left deliveries-table-header">
                <span :class="getLoader">{{ $t("deliveries.actions") }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="deliveries-table-column"
              v-for="(item, i) in getConsignments"
              :key="i"
            >
              <td class="deliveries-product-row">
                <div class="deliveries-name-row">
                  <span :class="getLoader">
                    {{ formatProducts(item.products) }}
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
                    <span :class="getLoader">
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
              <td class="deliveries-date-row">
                <div v-if="item.order_status === 'ORDER_COMPLETED'">
                  <p class="deliveries-date-row-top">
                    <span :class="getLoader">
                      {{ deliveryDate(item.completed_date) }}
                    </span>
                  </p>
                </div>
                <div v-else>
                  <p class="deliveries-date-row-top">
                    <span :class="getLoader">
                      {{ deliveryDate(item.scheduled_date) }}
                    </span>
                  </p>
                  <p class="deliveries-date-row-bottom">
                    <span :class="getLoader">
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
                  <span :class="getLoader">
                    {{ $t("deliveries.trackOrder") }}
                  </span>
                </p>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div v-else>
        <div v-if="ongoingDeliveries > 0">
          <div class="no-products-card-container">
            <span class="no-deliveries-icon-halo">
              <i class="mdi mdi-magnify no-products-icon"></i>
            </span>
            <div class="no-products-description">
              {{ $t("deliveries.sorryNoConsignmentsFound") }}
            </div>
            <div class="no-deliveries-description">
              {{ $t("deliveries.weCouldntFindAnyConsignments") }}
            </div>
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
          <v-btn
            class="deliveries-btn"
            @click="
              $router.push('/inventory/send-inventory/sendy/select-products')
            "
            size="default"
          >
            {{ $t("deliveries.deliverToSendy") }}
          </v-btn>
        </div>
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
  }),
  watch: {
    range(val) {
      if (val && !this.getTabStatus) {
        this.allParams("", this.limitParams());
      } else if (val && this.getTabStatus) {
        this.allParams(this.statusParams(), this.limitParams());
      } else if (!val && this.getTabStatus) {
        this.allParams(this.statusParams(), "");
      } else if (!val && !this.getTabStatus) {
        this.allParams("", "");
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
      this.setConsignments(this.placeholderConsignments);
      this.fetchOrders();
    },
  },
  mounted() {
    this.setConsignments(this.placeholderConsignments);
    this.getPickUpStats();
    this.fetchOrders();
    this.setTab("All");
  },
  computed: {
    ...mapGetters([
      "getConsignments",
      "getLoader",
      "getTabStatus",
      "getStorageUserDetails",
      "getConsignmentStatistics",
    ]),
    ongoingDeliveries() {
      let orderCount = 0;
      Object.values(this.getConsignmentStatistics).forEach((row) => {
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
      "setConsignments",
      "setConsignmentStatistics",
      "setTab",
    ]),
    navigate(route) {
      this.$router.push(route);
    },
    limitParams() {
      return `?lowerLimitDate=${moment(this.range[0]).format(
        "YYYY-MM-DD"
      )}&upperLimitDate=${moment(this.range[1]).format("YYYY-MM-DD")}`;
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
      this.setLoader("loading-text");
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/consignments${this.params}`,
      }).then((response) => {
        if (response.status === 200) {
          this.setConsignments(response.data.data.orders);
        }
        if (this.$route.path === "/deliveries/sendy") {
          this.setLoader("");
        }
      });
    },
    getPickUpStats() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/consignments/statistics`,
      }).then((response) => {
        if (response.status === 200) {
          this.setConsignmentStatistics(
            response.data.data.grouped_by_status_count
          );
        }
      });
    },
    deliveryDate(date) {
      return moment(date).format("MMM M/D/YYYY");
    },
    deliveryTime(date) {
      const finalTime = moment(date).add(2, "hours");
      return `${moment(date).format("ha")} - ${moment(finalTime).format("ha")}`;
    },
    formatProducts(products) {
      return `${products[0].product_variant_description} ${
        products.length > 1
          ? this.$t("deliveries.otherItems", { count: products.length - 1 })
          : ""
      }`;
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
.deliveries-product-row,
.deliveries-date-row,
.deliveries-action-row {
  width: 20%;
}
.deliveries-progress-row {
  width: 40%;
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
</style>
