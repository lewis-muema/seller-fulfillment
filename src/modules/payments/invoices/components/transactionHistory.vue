<template>
  <div>
    <p class="transaction-history-content-title">
      <span :class="getLoader.invoices">
        {{ $t("payments.transactionHistory") }}
      </span>
    </p>
    <div class="transaction-history-content-container">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              <span :class="getLoader.invoices">{{
                $t("payments.details")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="getLoader.invoices">{{
                $t("payments.paymentDetails")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="getLoader.invoices">{{
                $t("payments.datePaid")
              }}</span>
            </th>
            <th class="text-left">
              <span class="invoices-price-col" :class="getLoader.invoices">{{
                $t("payments.amountPaid")
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(invoice, x) in getTransationHistory"
            :key="x"
            class="invoices-table-row"
          >
            <td class="invoices-table-col">
              <span :class="getLoader.invoices">
                <i
                  v-if="!getLoader.invoices"
                  class="transaction-history-details-icon"
                  :class="`mdi ${invoice.details.icon}`"
                ></i>
              </span>
              <span :class="getLoader.invoices">
                {{ invoice.details.description }}
              </span>
            </td>
            <td class="invoices-table-col">
              <p>
                <span :class="getLoader.invoices">
                  {{ invoice.paymentDetails }}
                </span>
              </p>
              <p class="invoice-subtitle">
                <span :class="getLoader.invoices">
                  {{ invoice.code }}
                </span>
              </p>
            </td>
            <td class="invoices-table-col">
              <span :class="getLoader.invoices">
                {{ invoice.datePaid }}
              </span>
            </td>
            <td class="invoices-table-col">
              <span class="invoices-price-col" :class="getLoader.invoices">
                {{ invoice.amountPaid }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getLoader", "getTransationHistory"]),
  },
};
</script>

<style>
.transaction-history-content-container {
  margin: 30px;
  padding: 35px;
  border: 1px solid #e2e7ed;
  border-radius: 10px;
  background: white;
}
.transaction-history-content-title {
  margin-left: 30px;
}
.transaction-history-content-total-due {
  float: right;
  margin-right: 30px;
}
.invoices-price-col {
  float: right;
  margin-right: 15px;
}
.transaction-history-details-icon {
  color: #324ba8;
  font-size: 25px;
  margin: 10px;
}
</style>
