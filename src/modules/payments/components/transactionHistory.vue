<template>
  <div>
    <p class="transaction-history-content-title">
      <span :class="$store.getters.getLoader">
        {{ $t("payments.transactionHistory") }}
      </span>
    </p>
    <div class="transaction-history-content-container">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("payments.details")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("payments.paymentDetails")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("payments.datePaid")
              }}</span>
            </th>
            <th class="text-left">
              <span
                class="invoices-price-col"
                :class="$store.getters.getLoader"
                >{{ $t("payments.amountPaid") }}</span
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(invoice, x) in $store.getters.getTransationHistory"
            :key="x"
            class="invoices-table-row"
          >
            <td class="invoices-table-col">
              <span :class="$store.getters.getLoader">
                <i
                  v-if="!$store.getters.getLoader"
                  class="transaction-history-details-icon"
                  :class="`mdi ${invoice.details.icon}`"
                ></i>
              </span>
              <span :class="$store.getters.getLoader">
                {{ invoice.details.description }}
              </span>
            </td>
            <td class="invoices-table-col">
              <p>
                <span :class="$store.getters.getLoader">
                  {{ invoice.paymentDetails }}
                </span>
              </p>
              <p>
                <span :class="$store.getters.getLoader">
                  {{ invoice.code }}
                </span>
              </p>
            </td>
            <td class="invoices-table-col">
              <span :class="$store.getters.getLoader">
                {{ invoice.datePaid }}
              </span>
            </td>
            <td class="invoices-table-col">
              <span
                class="invoices-price-col"
                :class="$store.getters.getLoader"
              >
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
export default {};
</script>

<style>
.transaction-history-content-container {
  margin: 30px;
  padding: 35px;
  border: 1px solid #e2e7ed;
  border-radius: 10px;
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
