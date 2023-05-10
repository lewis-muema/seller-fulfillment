<template>
  <v-card variant="outlined" class="dashboard-deliveries-container">
    <div v-if="!noAccess">
      <div v-if="getSelectedTab === 'dashboard.toYourCustomers'">
        <to-your-customers-tab />
      </div>
      <div v-if="getSelectedTab === 'dashboard.toSendy'">
        <to-sendy-tab />
      </div>
      <div v-if="getSelectedTab === 'dashboard.onDemand'">
        <on-demand-tab />
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
import toYourCustomersTab from "./toYourCustomersTab.vue";
import toSendyTab from "./toSendyTab.vue";
import onDemandTab from "./onDemandTab.vue";

export default {
  props: ["deliveries", "selectedTab"],
  mixins: [eventLabels, placeholder],
  components: {
    onDemandTab,
    accessDeniedComponent,
    toYourCustomersTab,
    toSendyTab,
  },
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
      "getOnDemandDeliveries",
    ]),
    getSelectedTab() {
      return this.selectedTab;
    },
    deliveriesLoaderText() {
      let loaderText = "";
      switch (this.getSelectedTab) {
        case "dashboard.toYourCustomers":
          loaderText = "deliveries";
          break;
        case "dashboard.toSendy":
          loaderText = "consignments";
          break;
        case "dashboard.onDemand":
          loaderText = "onDemandOrders";
          break;
      }
      return loaderText;
    },
    deliveriesEndpoint() {
      let deliveriesUrl = "";
      switch (this.getSelectedTab) {
        case "dashboard.toYourCustomers":
          deliveriesUrl = "deliveries";
          break;
        case "dashboard.toSendy":
          deliveriesUrl = "consignments";
          break;
        case "dashboard.onDemand":
          deliveriesUrl = "point-to-point";
          break;
      }
      return deliveriesUrl;
    },
  },
  watch: {
    selectedTab() {
      switch (this.getSelectedTab) {
        case "dashboard.toYourCustomers":
          this.noAccess = this.getAccessDenied.includes("/deliveries/customer");
          this.setDeliveries(this.placeHolderDeliveries);
          break;
        case "dashboard.toSendy":
          this.noAccess = this.getAccessDenied.includes("/deliveries/sendy");
          this.setConsignments(this.placeholderConsignments);
          break;
        case "dashboard.onDemand":
          this.noAccess = this.getAccessDenied.includes(
            "/deliveries/direct-deliveries/"
          );
          this.setOnDemandDeliveries(this.placeholderOnDemandDeliveries);
          break;
      }
      this.fetchOrders();
    },
    "$store.state.accessDenied": function accessDenied(val) {
      if (this.getSelectedTab === "dashboard.toYourCustomers") {
        this.noAccess = val.includes("/deliveries/customer");
      }
      if (this.getSelectedTab === "dashboard.toSendy") {
        this.noAccess = val.includes("/deliveries/sendy");
      }
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
      "setOnDemandDeliveries",
    ]),
    fetchOrders() {
      this.setLoader({
        type: this.deliveriesLoaderText,
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/${this.deliveriesEndpoint}${this.params}`,
      }).then((response) => {
        if (response.status === 200) {
          if (this.getSelectedTab === "dashboard.toYourCustomers") {
            this.setDeliveries(response.data.data.orders);
          } else if (this.getSelectedTab === "dashboard.onDemand") {
            this.setOnDemandDeliveries(response.data.data.orders);
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
          this.setLoader({
            type: "onDemandOrders",
            value: "",
          });
        }
      });
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
.deliveries-platform-tag {
  font-weight: 500;
  font-size: 13px;
}
.deliveries-platform-tag-fulfillment {
  color: #303133;
}
.deliveries-platform-tag-storefront {
  color: #ee7d00;
}
.on-demand-progress-bar {
  width: 300px !important;
}
.on-demand-title-row {
  width: 150px !important;
}
</style>
