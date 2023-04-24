<template>
  <div>
    <div>
      <div class="transaction-container">
        <i
          class="mdi mdi-arrow-left dpp-top-back"
          aria-hidden="true"
          @click="$router.back()"
        ></i>
        <p class="transaction-title">
          {{ getActiveTransaction.transaction_description }}
        </p>
        <div
          v-if="
            [
              'UPCOMING_EARNING_FROM_SALE_OF_GOOD',
              'EARNING_FROM_SALE_OF_GOOD',
            ].includes(getActiveTransaction.transaction_type)
          "
        >
          <div class="transaction-label">
            {{ $t("payments.statusOfCollection") }}
          </div>
          <div>
            <span
              class="transaction-pending-badge"
              v-if="
                getActiveTransaction.transaction_type ===
                'UPCOMING_EARNING_FROM_SALE_OF_GOOD'
              "
              >{{ $t("deliveries.pending") }}</span
            >
            <span
              class="transaction-paid-badge"
              v-if="
                getActiveTransaction.transaction_type ===
                'EARNING_FROM_SALE_OF_GOOD'
              "
              >{{ $t("deliveries.completed") }}</span
            >
          </div>
        </div>
        <p
          v-if="
            getActiveTransaction.transaction_type ===
            'UPCOMING_EARNING_FROM_SALE_OF_GOOD'
          "
          class="transaction-pending-text"
        >
          {{ $t("deliveries.pendingReasons") }}
        </p>
        <div>
          <div class="transaction-label">
            {{ $t("payments.transactionID") }}
          </div>
          <div class="transaction-data">
            {{ getActiveTransaction.transaction_id }}
          </div>
        </div>
        <div>
          <div
            class="transaction-label"
            v-if="
              getActiveTransaction.transaction_type.includes('WITHDRAWAL') ||
              getActiveTransaction.transaction_type.includes(
                'FULFILMENT_FEE_PAYMENT'
              )
            "
          >
            {{ $t("payments.withdrawalDate") }}
          </div>
          <div class="transaction-label" v-else>
            {{ $t("payments.date") }}
          </div>
          <div class="transaction-data">
            {{ formatDate(getActiveTransaction.date_created) }}
          </div>
        </div>
        <div
          v-if="
            [
              'UPCOMING_EARNING_FROM_SALE_OF_GOOD',
              'EARNING_FROM_SALE_OF_GOOD',
            ].includes(getActiveTransaction.transaction_type)
          "
        >
          <div class="transaction-label">
            {{ $t("payments.delivery") }}
          </div>
          <div class="transaction-data">
            {{ getActiveTransaction.transaction_subtitle }}
          </div>
        </div>
        <div
          v-if="
            ['EARNING_FROM_WITHDRAWAL_REFUND'].includes(
              getActiveTransaction.transaction_type
            )
          "
        >
          <div class="transaction-label">{{ $t("inventory.desc") }}</div>
          <div class="transaction-data">
            {{ getActiveTransaction.transaction_subtitle }}
          </div>
        </div>
        <div
          class="transaction-view"
          v-if="
            [
              'UPCOMING_EARNING_FROM_SALE_OF_GOOD',
              'EARNING_FROM_SALE_OF_GOOD',
            ].includes(getActiveTransaction.transaction_type)
          "
          @click="
            $router.push(
              `/deliveries/tracking/${getActiveTransaction.resource_id}`
            )
          "
        >
          {{ $t("payments.view") }}
        </div>
        <hr class="mt-5" />
        <div class="transaction-amount">
          <div v-if="witholdingTax !== 0">
            <div>
              <span>{{ $t("payments.totalDue") }}</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Total value inclusive of 16% sales tax"
                placement="right"
              >
                <i class="mdi mdi-information-outline billing-info-icon"></i>
              </el-tooltip>
              <span
                :class="
                  getSignMapping[getActiveTransaction.transaction_type] === '+'
                    ? 'transaction-amount-right'
                    : 'transaction-amount-right-negative'
                "
                >{{ getSignMapping[getActiveTransaction.transaction_type] }}
                {{ getActiveTransaction.transaction_currency }}
                {{ TotalDue }}</span
              >
            </div>
            <div class="mt-2">
              <span>{{ $t("payments.vat") }}</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Withholding tax; 2% of Total Due excluding VAT"
                placement="right"
              >
                <i class="mdi mdi-information-outline billing-info-icon"></i>
              </el-tooltip>
              <span
                :class="
                  getSignMapping[getActiveTransaction.transaction_type] === '+'
                    ? 'transaction-amount-right'
                    : 'transaction-amount-right-negative'
                "
                >{{ getSignMapping[getActiveTransaction.transaction_type] }}
                {{ getActiveTransaction.transaction_currency }}
                {{ witholdingTax }}</span
              >
            </div>
            <hr class="mt-2" />
          </div>
          <div class="transaction-wth-amount">
            <span
              >{{ $t("payments.amount") }}
              <i
                v-if="
                  [
                    'UPCOMING_EARNING_FROM_SALE_OF_GOOD',
                    'EARNING_FROM_SALE_OF_GOOD',
                  ].includes(getActiveTransaction.transaction_type)
                "
                class="mdi mdi-alert-circle-outline"
                @click="
                  setOverlayStatus({
                    overlay: true,
                    popup: 'paymentBreakdown',
                  })
                "
              ></i>
            </span>
            <span
              :class="
                getSignMapping[getActiveTransaction.transaction_type] === '+'
                  ? 'transaction-amount-right'
                  : 'transaction-amount-right-negative'
              "
              >{{ getSignMapping[getActiveTransaction.transaction_type] }}
              {{ getActiveTransaction.transaction_currency }}
              {{ getActiveTransaction.transaction_amount }}</span
            >
          </div>
        </div>
        <div
          v-if="
            [
              'UPCOMING_EARNING_FROM_SALE_OF_GOOD',
              'EARNING_FROM_SALE_OF_GOOD',
            ].includes(getActiveTransaction.transaction_type)
          "
        >
          <p class="transaction-price" v-if="deliveryFee">
            {{ $t("inventory.priceOfProducts&DeliveryFee") }}
          </p>
          <p class="transaction-price" v-else>
            {{ $t("inventory.priceOfProducts") }}
          </p>
        </div>
        <div
          v-if="
            ['FULFILMENT_FEE_PAYMENT', 'FULFILMENT_FEE_COST'].includes(
              getActiveTransaction.transaction_type
            )
          "
          class="transaction-line-items-select"
          @click="showLineItems = !showLineItems"
        >
          <hr class="mt-3" />
          <div class="transaction-label">
            {{ $t("payments.deliveries") }}
          </div>
          <div class="transaction-deliveries">
            {{
              $t("payments.completedOn", {
                Date: formatDate(getActiveTransaction.date_created),
              })
            }}
            <i
              class="mdi mdi-chevron-up transaction-line-items-arrow"
              v-if="showLineItems"
            ></i>
            <i
              class="mdi mdi-chevron-down transaction-line-items-arrow"
              v-else
            ></i>
          </div>
          <div class="transaction-completed-deliveries">
            {{ getActiveTransaction.transaction_subtitle }}
          </div>
          <div v-if="showLineItems">
            <div v-for="(item, i) in getCycleLineItems" :key="i">
              <p class="mb-1 mt-4">
                <span class="transaction-line-items-top">{{
                  item.line_item_title
                }}</span>
                <span
                  :class="
                    getSignMapping[getActiveTransaction.transaction_type] ===
                    '+'
                      ? 'transaction-amount-right'
                      : 'transaction-amount-right-negative'
                  "
                >
                  {{ getSignMapping[getActiveTransaction.transaction_type] }}
                  {{ getActiveTransaction.transaction_currency }}
                  {{ item.amount }}</span
                >
              </p>
              <p>
                <span class="transaction-line-items-bottom">{{
                  item.line_item_subtitle
                }}</span>
              </p>
              <hr v-if="i < getCycleLineItems.length - 1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import moment from "moment";

export default {
  computed: {
    ...mapGetters([
      "getActiveTransaction",
      "getStorageUserDetails",
      "getOrderTrackingData",
      "getSignMapping",
      "getCycleLineItems",
      "getBusinessDetails",
    ]),
    witholdingTaxEnabled() {
      return this.getBusinessDetails.settings.withholding_tax_enabled;
    },
    witholdingTax() {
      let withheldTaxAdjustmentUnitValue = 0;
      if (
        this.getCycleLineItems.every(
          (item) => item.invoice_adjustments?.length > 0
        )
      ) {
        withheldTaxAdjustmentUnitValue = this.getCycleLineItems
          .flatMap((item) => item.invoice_adjustments)
          .filter((adjustment) => adjustment.adjustment_type === "WITHHELD_TAX")
          .reduce(
            (acc, adjustment) => acc + adjustment.adjustment_unit_value,
            0
          );
      }
      return withheldTaxAdjustmentUnitValue;
    },
    TotalDue() {
      const totalDue = this.netDue + this.witholdingTax;
      return totalDue;
    },
    netDue() {
      const netDue = this.getCycleLineItems.reduce(
        (acc, item) => acc + item.amount,
        0
      );
      return netDue;
    },
    deliveryFee() {
      let fee = 0;
      if (this.getOrderTrackingData.order.sale_of_goods_invoice) {
        this.getOrderTrackingData.order.sale_of_goods_invoice.invoice_adjustments_subtotals.forEach(
          (row) => {
            if (row.adjustment_type === "DELIVERY_FEE") {
              fee = row.adjustment_subtotal;
            }
          }
        );
      }
      return fee;
    },
    invoiceStatus() {
      return this.getOrderTrackingData.order.sale_of_goods_invoice
        ? this.getOrderTrackingData.order.sale_of_goods_invoice.invoice_status
        : "";
    },
  },
  data() {
    return {
      showLineItems: false,
    };
  },
  mounted() {
    this.setComponent("payments.transactions");
    if (
      ["FULFILMENT_FEE_PAYMENT", "FULFILMENT_FEE_COST"].includes(
        this.getActiveTransaction.transaction_type
      )
    ) {
      this.getLineCycleItems();
    } else if (
      [
        "UPCOMING_EARNING_FROM_SALE_OF_GOOD",
        "EARNING_FROM_SALE_OF_GOOD",
      ].includes(this.getActiveTransaction.transaction_type)
    )
      this.fetchOrder();
  },
  methods: {
    ...mapMutations([
      "setStatisticsStats",
      "setWallets",
      "setComponent",
      "setOverlayStatus",
      "setOrderTrackingData",
      "setCycleLineItems",
      "setActivePayment",
    ]),
    ...mapActions(["requestAxiosGet"]),
    formatDate(date) {
      return moment(date).format("ddd, Do MMMM");
    },
    fetchOrder() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/deliveries/${this.getActiveTransaction.resource_id}`,
      }).then((response) => {
        if (response.status === 200) {
          this.setOrderTrackingData(response.data.data);
        }
      });
    },
    getLineCycleItems() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles/${this.getActiveTransaction.resource_id}/lineitems`,
      }).then((response) => {
        if (response.status === 200) {
          this.setCycleLineItems(response.data.data.billing_cycle_line_items);
        } else {
          this.setActivePayment({});
        }
      });
    },
  },
};
</script>

<style>
.transaction-container {
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  padding: 50px;
  background: white;
  width: 40%;
  margin: auto;
  margin-top: 100px;
}
.transaction-title {
  font-weight: 500;
  font-size: 25px;
  margin-bottom: 20px;
}
.transaction-pending-badge {
  background: #fbdf9a;
  padding: 2px 20px;
  border-radius: 10px;
  color: #7f3b02;
}
.transaction-paid-badge {
  background: #b8f5a8;
  padding: 2px 20px;
  border-radius: 10px;
  color: #064a23;
}
.transaction-label {
  color: #606266;
  font-size: 15px;
  margin-bottom: 5px;
  margin-top: 25px;
}
.transaction-price {
  color: #909399;
  font-size: 16px;
  margin-bottom: 25px;
  margin-top: 10px;
}
.transaction-data {
  font-size: 16px;
}
.transaction-view {
  margin-top: 25px;
  cursor: pointer;
  color: #324ba8;
  margin-bottom: 30px;
}
.transaction-amount {
  font-weight: 500;
  font-size: 18px;
  margin-top: 20px;
}
.billing-info-icon {
  cursor: pointer;
}
.transaction-amount-right {
  float: right;
  color: #116f28;
}
.transaction-amount-right-negative {
  float: right;
  color: #9b101c;
}
.transaction-deliveries {
  margin-top: 15px;
  font-weight: 500;
}
.transaction-completed-deliveries {
  color: #909399;
  font-size: 15px;
  margin-top: 5px;
}
.transaction-line-items-top {
  color: #324ba8;
  font-weight: 500;
}
.transaction-line-items-bottom {
  color: #909399;
}
.transaction-line-items-select {
  cursor: pointer;
}
.transaction-line-items-arrow {
  float: right;
  font-size: 20px;
}
.transaction-pending-text {
  padding-top: 1rem;
  color: #9d5004;
  font-style: italic;
}
.transaction-wth-amount {
  padding: 10px 0px;
}
</style>
