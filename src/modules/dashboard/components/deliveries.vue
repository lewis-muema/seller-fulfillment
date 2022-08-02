<template>
  <v-card variant="outlined" class="dashboard-deliveries-container">
    <div v-if="!noAccess">
      <div class="deliveries-container-inner" v-if="filteredDeliveries.length">
        <v-table class="">
          <thead>
            <tr>
              <th class="text-left table-headers">
                {{
                  getSelectedTab === "dashboard.toYourCustomers"
                    ? $t("deliveries.customerInfo")
                    : $t("deliveries.products")
                }}
              </th>
              <th class="text-left table-headers">
                {{ $t("dashboard.progress") }}
              </th>
              <th class="text-left table-headers">
                {{ $t("dashboard.action") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredDeliveries" :key="index">
              <td>
                <v-list-item class="dashboard-customer-columns" lines="two">
                  <v-list-item-header>
                    <v-list-item-title>
                      <span
                        :class="
                          getSelectedTab === 'dashboard.toYourCustomers'
                            ? getLoader.deliveries
                            : getLoader.consignments
                        "
                      >
                        {{
                          getSelectedTab === "dashboard.toYourCustomers"
                            ? formatName(item.destination.name)
                            : formatProducts(item.products)
                        }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="dashboard-customer-delivery-location"
                      v-if="getSelectedTab === 'dashboard.toYourCustomers'"
                    >
                      <div class="dashboard-customer-delivery-location-inner">
                        <span
                          :class="
                            getSelectedTab === 'dashboard.toYourCustomers'
                              ? getLoader.deliveries
                              : getLoader.consignments
                          "
                        >
                          {{
                            formatName(
                              item.destination.delivery_location.description
                            )
                          }}
                        </span>
                      </div>
                    </v-list-item-subtitle>
                  </v-list-item-header>
                </v-list-item>
              </td>
              <td>
                <v-list-item class="dashboard-customer-columns" lines="two">
                  <v-list-item-header
                    v-if="item.order_status === 'ORDER_FAILED'"
                  >
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
                      <span
                        :class="
                          getSelectedTab === 'dashboard.toYourCustomers'
                            ? getLoader.deliveries
                            : getLoader.consignments
                        "
                      >
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
              <td>
                <router-link
                  :to="`/deliveries/tracking/${item.order_id}`"
                  class="dashboard-track-order"
                >
                  <span
                    :class="
                      getSelectedTab === 'dashboard.toYourCustomers'
                        ? getLoader.deliveries
                        : getLoader.consignments
                    "
                  >
                    {{ $t("deliveries.trackOrder") }}
                  </span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div class="show-more-deliveries-link" v-if="showMoreDeliveries">
          <router-link
            :to="
              getSelectedTab === 'dashboard.toYourCustomers'
                ? '/deliveries/customer'
                : '/deliveries/sendy'
            "
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
          {{
            getSelectedTab === "dashboard.toYourCustomers"
              ? $t("deliveries.deliverToACustomer")
              : $t("deliveries.deliverToSendy")
          }}
        </v-btn>
      </div>
    </div>
    <div class="dashboard-noaccess-container" v-else>
      <accessDeniedComponent />
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import accessDeniedComponent from "../../common/accessDenied.vue";
import eventLabels from "../../../mixins/event_labels";
import placeholder from "../../../mixins/placeholders";
import moment from "moment";

export default {
  props: ["deliveries", "selectedTab"],
  mixins: [eventLabels, placeholder],
  components: { accessDeniedComponent },
  data() {
    return {
      params: "?max=5",
      noAccess: false,
    };
  },
  computed: {
    ...mapGetters([
      "getDashboardSelectedTab",
      "getLoader",
      "getDeliveries",
      "getConsignments",
      "getStorageUserDetails",
      "getAccessDenied",
    ]),
    getSelectedTab() {
      return this.selectedTab;
    },
    filteredDeliveries() {
      if (this.getSelectedTab === "dashboard.toYourCustomers") {
        return this.getDeliveries;
      }
      return this.getConsignments;
    },
    showMoreDeliveries() {
      return this.filteredDeliveries.length >= 5;
    },
  },
  watch: {
    selectedTab() {
      if (this.getSelectedTab === "dashboard.toYourCustomers") {
        this.noAccess = this.getAccessDenied.includes("/deliveries/customer");
        this.setDeliveries(this.placeHolderDeliveries);
      } else {
        this.noAccess = this.getAccessDenied.includes("/deliveries/sendy");
        this.setConsignments(this.placeholderConsignments);
      }
      this.fetchOrders();
    },
    "$store.state.accessDenied": function accessDenied(val) {
      this.noAccess =
        this.getSelectedTab === "dashboard.toYourCustomers"
          ? val.includes("/deliveries/customer")
          : val.includes("/deliveries/sendy");
    },
  },
  mounted() {
    if (this.getSelectedTab === "dashboard.toYourCustomers") {
      this.noAccess = this.getAccessDenied.includes("/deliveries/customer");
      this.setDeliveries(this.placeHolderDeliveries);
    } else {
      this.noAccess = this.getAccessDenied.includes("/deliveries/sendy");
      this.setConsignments(this.placeholderConsignments);
    }
    this.fetchOrders();
  },
  methods: {
    ...mapActions(["requestAxiosPost", "requestAxiosGet"]),
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setDeliveries",
      "setConsignments",
    ]),
    fetchOrders() {
      this.setLoader({
        type:
          this.getSelectedTab === "dashboard.toYourCustomers"
            ? "deliveries"
            : "consignments",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/${
          this.getSelectedTab === "dashboard.toYourCustomers"
            ? "deliveries"
            : "consignments"
        }${this.params}`,
      }).then((response) => {
        if (response.status === 200) {
          if (this.getSelectedTab === "dashboard.toYourCustomers") {
            this.setDeliveries(response.data.data.orders);
          } else {
            this.setConsignments(response.data.data.orders);
          }
        }
        if (this.$route.path === "/") {
          this.setLoader({
            type: "consignments",
            value: "",
          });
          this.setLoader({
            type: "deliveries",
            value: "",
          });
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
    formatName(name) {
      const nameArr = name.split(" ");
      nameArr.forEach((name, i) => {
        nameArr[i] = name.charAt(0).toUpperCase() + name.slice(1);
      });
      return nameArr.join(" ");
    },
    formatProducts(products) {
      return `${products[0].product_variant_description} ${
        products.length > 1
          ? this.$t("deliveries.otherItems", { count: products.length - 1 })
          : ""
      }`;
    },
    formatStatus(status, item) {
      return this.showEventLabels(status, item);
    },
    redirect() {
      this.$router.push(
        `/inventory/send-inventory/${
          this.getSelectedTab === "dashboard.toYourCustomers"
            ? "customer"
            : "sendy"
        }/select-products?`
      );
    },
  },
};
</script>

<style>
.dashboard-track-order {
  color: #324ba8;
  font-weight: 500;
  text-decoration: none;
}
.dashboard-customer-delivery-location {
  font-weight: 100 !important;
  color: #909399;
}
.show-more-deliveries-link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  color: #324ba8;
  background: #e3e9f7;
  width: max-content;
  margin: auto;
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
}
.show-more-deliveries-link a {
  color: #324ba8;
  background: rgba(211, 221, 246, 0.5);
  padding: 5px 10px;
  border-radius: 15px;
  text-decoration: none;
}
.send-inventory-to-sendy-container {
  display: flex;
  flex-direction: column;
  justify-content: center !important;
  align-items: center;
}
.send-inventory-to-sendy-link a {
  color: #324ba8;
  text-decoration: none;
}
.dashboard-deliveries-container {
  margin: 30px 0px;
  border-color: #e2e7ed;
  height: auto;
  min-height: 80%;
}
.deliveries-container-inner {
  width: 100%;
  margin-bottom: auto;
}
.dashboard-customer-delivery-location-inner {
  white-space: nowrap;
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dashboard-customer-columns {
  padding: 15px 0px;
}
.dashboard-noaccess-container {
  zoom: 80%;
  margin-top: -5%;
}
</style>
