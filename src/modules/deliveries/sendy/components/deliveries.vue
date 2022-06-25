<template>
  <div class="deliveries-container">
    <div class="deliveries-container-inner">
      <div class="deliveries-mid-bar">
        <div class="deliveries-search">
          <searchAlgolia type="product" />
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
              <th class="text-left">
                <span :class="getLoader">{{ $t("deliveries.products") }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{ $t("deliveries.progress") }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{
                  $t("deliveries.deliveryDate")
                }}</span>
              </th>
              <th class="text-left">
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
                <p class="deliveries-progress-row-top">
                  <span :class="getLoader">
                    {{ formatStatus(item.order_event_status) }}
                  </span>
                </p>
                <v-progress-linear
                  :model-value="30"
                  color="#324BA8"
                  height="10"
                  rounded
                ></v-progress-linear>
              </td>
              <td class="deliveries-date-row">
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
</template>

<script>
import moment from "moment";
import { mapMutations, mapGetters, mapActions } from "vuex";
import searchAlgolia from "../../../common/searchAlgolia.vue";

export default {
  components: { searchAlgolia },
  data: () => ({
    deliveries: [],
    range: "",
    params: "",
    placeholders: [],
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
      this.setConsignments(this.placeholders);
      this.fetchOrders();
    },
  },
  mounted() {
    this.placeholders = this.getConsignments;
    this.getPickUpStats();
    this.fetchOrders();
  },
  computed: {
    ...mapGetters([
      "getConsignments",
      "getLoader",
      "getTabStatus",
      "getStorageUserDetails",
    ]),
  },
  methods: {
    ...mapActions(["requestAxiosPost", "requestAxiosGet"]),
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setConsignments",
      "setConsignmentStatistics",
    ]),
    navigate(route) {
      this.$router.push(route);
    },
    limitParams() {
      return `?lowerLimitDate=${moment(this.range[0]).format(
        "YYYY-MM-DD"
      )}&?upperLimitDate=${moment(this.range[1]).format("YYYY-MM-DD")}`;
    },
    statusParams() {
      return `?status=${this.getTabStatus}`;
    },
    allParams(status, range) {
      this.params = `${range}${status && range ? "&" : ""}${status}`;
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
    formatStatus(status) {
      const fullStatus = status.replaceAll(".", " ");
      return fullStatus.charAt(0).toUpperCase() + fullStatus.slice(1);
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
  margin-top: 5px;
  color: #909399;
  white-space: nowrap;
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.deliveries-name-row {
  font-size: 16px;
  margin-bottom: 5px;
  margin-top: 10px;
  white-space: nowrap;
  color: #303133;
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
