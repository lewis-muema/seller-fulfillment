<template>
  <div class="dpp-container">
    <div class="dpp-top">
      <i
        class="mdi mdi-arrow-left dpp-top-back"
        aria-hidden="true"
        @click="$router.back()"
      ></i>
      <p class="dpp-top-amount" v-if="getBillingCycle.paid_status !== 'PAID'">
        {{ getBusinessDetails.currency }} {{ getBillingCycle.amount_to_charge }}
      </p>
      <p v-if="getBillingCycle.paid_status !== 'PAID'">
        <span class="dpp-top-charged">{{
          $t("payments.willBeChargedOn", {
            Date: formatDate(getBillingCycle.billing_cycle_end_date),
          })
        }}</span>
        <span class="dpp-top-billing-cycle"
          >{{ $t("payments.billingCycle") }}:
          {{ getBillingCycle.cycle_interval_type }}</span
        >
      </p>
    </div>
    <hr />
    <div v-for="(item, i) in cycleLineItems" :key="i" class="dpp-top-row">
      <div class="dpp-top-row-date" v-if="item.show_date">
        <span class="" :class="getLoader.dpp">
          {{ formatLongDate(item.created_date) }}
        </span>
      </div>
      <div>
        <p class="dpp-top-recent-list-top">
          <span class="" :class="getLoader.dpp">{{
            item.line_item_title
          }}</span>
          <span class="dpp-top-recent-list-right">
            <span :class="getLoader.dpp">
              + {{ getBusinessDetails.currency }}
              {{ item.amount }}
            </span>
            <i
              class="mdi mdi-chevron-right dpp-top-recent-arrow"
              @click="$router.push(`/deliveries/tracking/${item.resource_id}`)"
            ></i>
          </span>
        </p>
        <p class="dpp-top-recent-list-bottom-row">
          <span
            class="statements-expansion-title-amount"
            :class="getLoader.dpp"
          >
            {{ item.line_item_subtitle }}
          </span>
          <span
            class="dpp-top-recent-list-right dpp-top-recent-date"
            :class="getLoader.dpp"
          >
            {{ timeFormat(item.created_date) }}
          </span>
        </p>
      </div>
      <hr v-if="i < getCycleLineItems.length - 1" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import moment from "moment";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "getWallets",
      "getStorageUserDetails",
      "getTransactions",
      "getLoader",
      "getBillingCycles",
      "getCycleLineItems",
      "getBillingCycle",
      "getBusinessDetails",
    ]),
    cycleLineItems() {
      const cycleLineItems = [];
      let firstDate = "";
      this.getCycleLineItems.forEach((row) => {
        if (
          firstDate === "" ||
          firstDate !== this.formatLongDate(row.created_date)
        ) {
          firstDate = this.formatLongDate(row.created_date);
          row.show_date = true;
        }
        cycleLineItems.push(row);
      });
      return cycleLineItems;
    },
  },
  mounted() {
    this.setComponent("payments.deliveriesPendingPayment");
    this.getSingleBillingCycle();
    this.getBillingCycleLineItems();
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations([
      "setWallets",
      "setTransactions",
      "setLoader",
      "setBillingCycles",
      "setComponent",
      "setCycleLineItems",
      "setBillingCycle",
    ]),
    timeFormat(date) {
      return moment(date).format("h:mm A");
    },
    formatDate(date) {
      return moment(date).format("Do MMM, YYYY");
    },
    formatLongDate(date) {
      return moment(date).format("ddd, Do MMM YYYY");
    },
    getSingleBillingCycle() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/${this.$route.params.cycle_id}`,
      }).then((response) => {
        if (response.status === 200) {
          this.setBillingCycle(response.data.data);
        }
      });
    },
    getBillingCycleLineItems() {
      this.setLoader({
        type: "dpp",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/${this.$route.params.cycle_id}/lineitems`,
      }).then((response) => {
        this.setLoader({
          type: "dpp",
          value: "",
        });
        if (response.status === 200) {
          this.setCycleLineItems(response.data.data.billing_cycle_line_items);
        }
      });
    },
  },
};
</script>

<style>
.dpp-container {
  margin: 45px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  background: white;
}
.dpp-top {
  padding: 20px 40px;
}
.dpp-top-back {
  font-size: 25px;
}
.dpp-top-amount {
  font-size: 25px;
  font-weight: 500;
  margin-top: 10px;
}
.dpp-top-charged {
  font-size: 15px;
  color: #909399;
}
.dpp-top-billing-cycle {
  float: right;
}
.dpp-top-recent-title {
  font-weight: 500;
  font-size: 18px;
}
.dpp-top-see-all-title {
  float: right;
  font-weight: 500;
  font-size: 17px;
  cursor: pointer;
  color: #324ba8;
}
.dpp-top-recent-list-right {
  float: right;
  display: flex;
}
.dpp-top-recent-arrow {
  color: #909399;
  cursor: pointer;
  font-size: 20px;
  margin-left: 5px;
}
.dpp-top-recent-date {
  margin-right: 25px;
}
.dpp-top-recent-list {
  text-align: left;
  margin: 20px 15px;
}
.dpp-top-recent-list-bottom-row {
  color: #606266;
  font-size: 14px;
}
.dpp-top-recent-list-top {
  margin-bottom: 7px;
}
.dpp-top-row {
  margin: 20px 40px;
}
.dpp-top-row-date {
  font-size: 13px;
  color: #606266;
  margin-bottom: 20px;
}
</style>
