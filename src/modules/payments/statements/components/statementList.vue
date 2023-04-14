<template>
  <div>
    <div class="statements-info-bar-container-list">
      <div class="statement-info-bar-filter">
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
      <div class="statement-info-bar-download">
        <div class="statement-info-export">
          <div class="export-button" @click="triggerExport()">
            <span>
              <i class="mdi mdi-export-variant export-icon"></i>
            </span>
            <span>
              {{ $t("common.export") }}
            </span>
          </div>
        </div>
        <!-- <v-menu transition="slide-y-transition" anchor="bottom center">
          <template v-slot:activator="{ props }">
            <v-btn
              class="statements-actions-btn"
              append-icon="mdi-chevron-down"
              v-bind="props"
            >
              {{ $t("payments.download") }}
            </v-btn>
          </template>
          <v-list class="users-actions-popup">
            <v-list-item v-for="(action, i) in getDownloadActions" :key="i">
              <v-list-item-title>
                {{ $t(action.label) }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->
      </div>
    </div>
    <div v-if="getBillingCycles.length > 0">
      <v-expansion-panels multiple class="statements-expansion-panel">
        <v-expansion-panel
          v-for="(cycle, i) in getBillingCycles"
          :key="i"
          @click="expandCycle(cycle, i)"
        >
          <v-expansion-panel-title>
            <v-row no-gutters>
              <v-col cols="12" sm="2">
                <p
                  class="ma-2 pa-2 statements-expansion-text statement-expansion-date"
                  :class="getLoader.billingCycles"
                >
                  {{ formatDate(cycle.billing_cycle_start_date) }}
                </p>
              </v-col>
              <v-col cols="12" sm="2">
                <p
                  class="ma-2 pa-2 statements-expansion-text statement-expansion-ordercount"
                  :class="getLoader.billingCycles"
                >
                  {{ cycle.order_count }}
                  {{ $t("payments.completedOrders") }}
                </p>
              </v-col>
              <v-col cols="12" sm="2">
                <p
                  class="ma-2 pa-2 statements-expansion-text"
                  :class="getLoader.billingCycles"
                >
                  {{ getBusinessDetails.currency }}
                  {{ Math.round(cycle.billable_amount * 100) / 100 }}
                </p>
              </v-col>
              <v-col cols="12" sm="2">
                <div class="ma-2 pa-2">
                  <p :class="[paidClass(cycle), getLoader.billingCycles]">
                    {{ billingStatus(cycle.paid_status) }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table>
              <thead class="statement-table-titles">
                <tr class="statement-table-headers">
                  <th v-for="(head, index) in headers" :key="index">
                    {{ head.title }}
                    <el-tooltip
                      v-if="head.description"
                      class="box-item"
                      effect="dark"
                      :content="$t(head.description)"
                      placement="bottom"
                      :popper-class="colorTooltipClass"
                    >
                      <i
                        v-if="head.description"
                        class="mdi mdi-information-outline product-info"
                      ></i>
                    </el-tooltip>
                  </th>
                </tr>
              </thead>
              <hr />
              <tbody>
                <tr
                  v-for="(row, x) in cycle.lineItems"
                  :key="x"
                  class="statements-table-row"
                >
                  <td class="statements-table-icon-row">
                    <span v-if="cycle.loading" :class="cycle.loading">
                      {{ row.amount }}
                    </span>
                    <i v-else :class="`mdi ${getIcon(row)}`"></i>
                  </td>
                  <td class="statements-table-description-row">
                    <span
                      :class="cycle.loading"
                      @click="
                        $router.push(`/deliveries/tracking/${row.resource_id}`)
                      "
                    >
                      {{ row.resource_id }}
                    </span>
                  </td>
                  <td class="statements-table-item-row">
                    <span :class="cycle.loading">
                      {{ row.line_item_title }}
                    </span>
                  </td>
                  <td class="statements-table-item-row">
                    <span :class="cycle.loading">
                      {{ row.line_item_subtitle }}
                    </span>
                  </td>
                  <td class="statements-table-date-row">
                    <span :class="cycle.loading">
                      {{ formatLineItemDate(row.created_date) }}
                    </span>
                  </td>
                  <td class="statements-table-price-row">
                    <span :class="cycle.loading">
                      {{ getBusinessDetails.currency }}
                      {{ Math.round(row.amount * 100) / 100 }}
                    </span>
                  </td>
                  <td
                    class="statements-table-price-row"
                    v-if="witholdingTaxEnabled"
                  >
                    <span :class="cycle.loading">
                      {{ getBusinessDetails.currency }}
                      {{ witheldTax(row) }}
                    </span>
                  </td>
                  <td
                    class="statements-table-price-row"
                    v-if="witholdingTaxEnabled"
                  >
                    <span :class="cycle.loading">
                      {{ getBusinessDetails.currency }}
                      {{ netDue(row) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <div class="statement-amount-container">
              <span class="statement-amount-container-total-value"
                >{{ $t("payments.totalValue") }}
              </span>
              <span class="statement-amount-container-currency"
                >{{ getBusinessDetails.currency }}
                {{ Math.round(cycle.billable_amount * 100) / 100 }}</span
              >
            </div>
            <div v-if="cycle.payments && cycle.payments.length > 0">
              <div v-for="(row, i) in cycle.payments" :key="i">
                <div
                  class="statement-paid-container"
                  v-if="row.payment_status === 'SUCCESS'"
                >
                  <span>
                    <i class="mdi mdi-information statement-info-icon"></i
                  ></span>
                  <span>
                    <span class="mr-1"
                      >{{ $t("payments.paidOn") }}
                      {{ formatLineItemDate(row.payment_attempt_date) }}</span
                    >
                    <span class="mr-1"
                      >{{ $t("payments.via") }}
                      {{
                        row.used_means_of_payment.means_of_payment_type
                      }}</span
                    >
                    <span class="statement-amount-container-currency"
                      >{{ getBusinessDetails.currency }}
                      {{ row.payment_amount }}</span
                    >
                  </span>
                </div>
              </div>
            </div>
            <div
              class="statement-overdue-container"
              v-if="cycle.paid_status === 'NOT_PAID' && !cycle.active"
            >
              <i class="mdi mdi-alert-rhombus statement-overdue-icon"></i>
              <span class="">
                <span class="payment-overdue-text mr-2">{{
                  $t("payments.paymentOverdue")
                }}</span
                >{{ $t("payments.pleasePay") }}
              </span>
            </div>
            <div
              class="statement-pay-container"
              v-if="cycle.paid_status === 'NOT_PAID' && cycle.active"
            >
              <i class="mdi mdi-alert-rhombus statement-pay-icon"></i>
              <span class=""
                >{{ $t("payments.toBeChargedOn") }}
                {{ formatDate(cycle.billing_cycle_end_date) }}</span
              >
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-else>
      <div v-if="activeCycle.active">
        <div class="no-products-card-container">
          <span class="no-deliveries-icon-halo">
            <i class="mdi mdi-magnify no-products-icon"></i>
          </span>
          <div class="no-products-description">
            {{ $t("payments.sorryNoTransactionsFound") }}
          </div>
          <div class="no-deliveries-description">
            {{ $t("payments.WecouldntFindAnyTransactions") }}
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
        <p class="statements-empty-title">
          {{ $t("payments.noInvoicesYet") }}
        </p>
        <p class="statements-empty-label">
          {{ $t("payments.trackInvoices") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import moment from "moment";
import placeholder from "../../../../mixins/placeholders";

export default {
  props: ["activeCycle"],
  mixins: [placeholder],
  data() {
    return {
      from: "",
      to: "",
      range: "",
      params: "",
      colorTooltipClass: "colorTooltipClass",
      header: [
        {
          title: "",
          description: "",
        },
        {
          title: this.$t("payments.orderNo"),
          description: "",
        },

        {
          title: this.$t("payments.orderType"),
          description: "",
        },

        {
          title: this.$t("payments.deliveryLocation"),
          description: "",
        },

        {
          title: this.$t("payments.deliveryDate"),
          description: "",
        },
        {
          title: this.$t("payments.totalDue"),
          description: "Total value inclusive of 16% sales tax",
        },
        {
          title: this.$t("payments.wthVat"),
          description: "Withholding tax; 2% of Total Due excluding VAT",
        },
        {
          title: this.$t("payments.netDue"),
          description: "Net total due is the Total Due less Withholding Tax",
        },
      ],
      header2: [
        {
          title: "",
          description: "",
        },
        {
          title: this.$t("payments.orderNo"),
          description: "",
        },

        {
          title: this.$t("payments.orderType"),
          description: "",
        },

        {
          title: this.$t("payments.deliveryLocation"),
          description: "",
        },

        {
          title: this.$t("payments.deliveryDate"),
          description: "",
        },
        {
          title: this.$t("payments.totalDue"),
          description: "Total value inclusive of 16% sales tax",
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getDownloadActions",
      "getStatements",
      "getBillingCycles",
      "getBusinessDetails",
      "getStorageUserDetails",
      "getLineItems",
      "getExportDataType",
      "getActivePayment",
    ]),
    headers() {
      return this.witholdingTaxEnabled ? this.header : this.header2;
    },
    witholdingTaxEnabled() {
      return this.getBusinessDetails.settings.withholding_tax_enabled;
    },
  },
  watch: {
    range(val) {
      this.$emit("range", val);
    },
  },
  mounted() {
    this.setBillingCycles(this.placeholderBillingCycles);
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations([
      "setBillingCycles",
      "setOverlayStatus",
      "setExportDataType",
    ]),
    witheldTax(row) {
      let withheldTax = 0;
      if (row.invoice_adjustments?.length > 1) {
        withheldTax = row.invoice_adjustments.find(
          (adj) => adj.adjustment_type === "WITHHELD_TAX"
        ).adjustment_value;
      }
      return Math.round(withheldTax * 100) / 100;
    },
    netDue(row) {
      let withheldTax = 0;
      if (row.invoice_adjustments?.length > 1) {
        withheldTax = row.invoice_adjustments.find(
          (adj) => adj.adjustment_type === "WITHHELD_TAX"
        ).adjustment_value;
      }
      let amount = 0;
      amount = row.amount - withheldTax;
      return Math.round(amount * 100) / 100;
    },
    formatDate(date) {
      return moment(date).format("dddd, Do MMM YYYY");
    },
    triggerExport() {
      this.setOverlayStatus({
        overlay: true,
        popup: "export",
      });
      this.setExportDataType("BILLING_CYCLE");
    },
    expandCycle(cycle, i) {
      const dummyLineItems = this.getBillingCycles;
      dummyLineItems[i].lineItems = this.placeholderLineItems;
      dummyLineItems[i].loading = "loading-text";
      this.setBillingCycles(dummyLineItems);
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/${cycle.billing_cycle_instance_id}/lineitems`,
      }).then((response) => {
        if (response.status === 200) {
          const billingcycles = this.getBillingCycles;
          billingcycles[i].lineItems =
            response.data.data.billing_cycle_line_items;
          this.setBillingCycles(billingcycles);
          this.getPayments(cycle, i);
        }
      });
    },
    getPayments(cycle, i) {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/${cycle.billing_cycle_instance_id}/paymentattempts`,
      }).then((response) => {
        if (response.status === 200) {
          const billingcycles = this.getBillingCycles;
          billingcycles[i].payments = response.data.data.payment_attempts;
          billingcycles[i].loading = "";
          this.setBillingCycles(billingcycles);
        }
      });
    },
    formatLineItemDate(date) {
      return moment(date).format("D/MM/YYYY hh:mm a");
    },
    billingStatus(billing) {
      const billingStatus = billing.replaceAll("_", " ").toLowerCase();
      if (billingStatus === "not paid") {
        return "Pending";
      }
      return billingStatus.charAt(0).toUpperCase() + billingStatus.slice(1);
    },
    getIcon(row) {
      if (row.line_item_title === "Delivery to Sendy") {
        return "mdi-warehouse";
      }
      return "mdi-truck-outline";
    },
    paidClass(cycle) {
      if (cycle.paid_status === "PAID") {
        return "statements-paid-status";
      }
      return "statements-pending-status";
    },
    successClass(cycle) {
      if (cycle.payment_status === "SUCCESS") {
        return "statements-paid-status";
      }
      return "statements-pending-status";
    },
  },
};
</script>

<style>
.statements-info-bar-container-list {
  display: grid;
  grid-template-columns: 30% 70%;
}
.statements-info-bar-filter-from,
.statements-info-bar-filter-to {
  margin-left: 20px;
  height: 40px;
}
.paymnets-info-bar-search {
  font-size: 25px;
  margin: auto;
  cursor: pointer;
}
.statements-table {
  margin: 20px;
}
.statements-table-row {
  height: 60px;
}
.statements-table-date {
  margin: 30px 0px 10px 0px;
}
.statements-table-icon-row {
  width: 5%;
  border-bottom: none !important;
  text-align: center;
  font-size: 20px !important;
  color: #324ba8;
}
.statements-table-description-row {
  width: 20%;
  border-bottom: none !important;
  color: #324ba8;
  cursor: pointer;
}
.statements-table-item-row {
  width: 20%;
  border-bottom: none !important;
}
.statements-table-date-row {
  width: 20%;
  border-bottom: none !important;
}
.statements-table-status-row {
  width: 20%;
  border-bottom: none !important;
}
.statements-table-price-row {
  width: 15%;
  border-bottom: none !important;
}
.statements-pending-status {
  width: fit-content;
  background: #fbdf9a;
  padding: 2px 20px;
  border-radius: 10px;
  color: #7f3b02;
}
.statements-paid-status {
  width: fit-content;
  background: #b8f5a8;
  padding: 2px 20px;
  border-radius: 10px;
  color: #064a23;
}
.statements-top-bar-cash-icon {
  color: #324ba8;
  font-size: 23px;
  margin-right: 10px;
  font-weight: 500;
}
.statements-expansion-title {
  text-align: left;
  margin: 15px;
  display: flex;
}
.statements-expansion-text {
  font-weight: 500;
}
.statement-expansion-ordercount {
  color: #606266;
}
/*.statements-expansion-title-bottom-row {*/
/*  color: #606266;*/
/*  font-size: 14px;*/
/*  margin-bottom: 0px;*/
/*}*/
.statements-expansion-title-amount {
  margin-right: 15px;
}
.statements-expansion-panel {
  width: calc(100% - 60px);
  margin: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}
.statements-expansion-panel .v-expansion-panel .v-expansion-panel__shadow {
  box-shadow: none !important;
}
.statements-empty-title {
  font-weight: 600;
  color: #606266;
  margin-bottom: 0px;
}
.statements-empty-label {
  color: #606266;
}
.statements-actions-btn {
  float: right;
  margin-right: 30px;
  text-transform: capitalize;
  letter-spacing: 0px;
  width: 140px;
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
  color: #303133 !important;
  height: 50px !important;
}
.statement-info-bar-filter {
  padding-left: 30px;
}
.statement-info-bar-download {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.payments-amount {
  float: right;
  margin-right: 15px;
}
.statement-info-export {
  height: 40px;
  margin-right: 20px;
}
.statement-order-no {
  max-width: 30px !important;
}
.statement-table-titles th:nth-last-child(2) {
  margin-right: 10px; /* Adjust the margin value as needed */
}
.colorTooltipClass .el-tooltip__popper {
  color: #303133;
}
.statement-amount-container {
  float: right;
  background: #f7f9fc;
  padding: 7px;
  border-radius: 5px;
}
.statement-amount-container-total-value {
  color: #909399;
  font-size: 13px;
  margin-right: 7px;
  font-weight: 500;
}
.statement-amount-container-currency {
  color: #303133;
  font-weight: 700;
}
.statement-paid-container {
  margin-left: auto;
  margin-top: 50px;
  width: fit-content;
  background: #defad2;
  padding: 5px;
  border-radius: 5px;
}
.statement-table-headers {
  white-space: nowrap;
}
.statement-info-icon {
  color: #116f28;
}
.statement-overdue-container {
  margin-left: auto;
  margin-top: 50px;
  width: fit-content;
  background: #fbdecf;
  padding: 5px;
  border-radius: 5px;
}
.statement-overdue-icon {
  color: #9b101c;
}
.payment-overdue-text {
  font-weight: 500;
}
.statement-pay-container {
  margin-left: auto;
  margin-top: 50px;
  width: fit-content;
  background: #fdf1cc;
  padding: 5px;
  border-radius: 5px;
}
.statement-pay-icon {
  color: #cc6100;
}
</style>
