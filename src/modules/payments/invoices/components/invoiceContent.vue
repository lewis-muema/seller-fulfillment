<template>
  <div>
    <p class="invoice-content-title">
      <span :class="$store.getters.getLoader">
        {{ $t("payments.invoiceContent") }}
      </span>
    </p>
    <div class="invoice-content-container">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("payments.customerInfo")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("payments.products")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("payments.dateCompleted")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("payments.costOfProducts")
              }}</span>
            </th>
            <th class="text-left">
              <span
                class="invoices-price-col"
                :class="$store.getters.getLoader"
                >{{ $t("payments.fulfilmentPrice") }}</span
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(invoice, x) in $store.getters.getInvoiceContent"
            :key="x"
            class="invoices-table-row"
          >
            <td class="invoices-table-col">
              <p>
                <span
                  class="invoices-table-customer-info"
                  :class="$store.getters.getLoader"
                >
                  {{ invoice.customerInfo.customer }}
                </span>
              </p>
              <p>
                <span :class="$store.getters.getLoader">
                  {{ invoice.customerInfo.location }}
                </span>
              </p>
            </td>
            <td class="invoices-table-col">
              <span :class="$store.getters.getLoader">
                {{ invoice.products }}
              </span>
            </td>
            <td class="invoices-table-col">
              <span :class="$store.getters.getLoader">
                {{ invoice.dateCompleted }}
              </span>
            </td>
            <td class="invoices-table-col">
              <span :class="$store.getters.getLoader">
                {{ invoice.costOfProducts }}</span
              >
            </td>
            <td class="invoices-table-col">
              <span
                class="invoices-price-col"
                :class="$store.getters.getLoader"
              >
                {{ invoice.fulfilmentPrice }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
      <div class="invoice-content-total-due">
        <span :class="$store.getters.getLoader">
          {{ $t("payments.totalDue") }}: {{ $store.getters.getTotalDue }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.invoice-content-container {
  margin: 30px;
  padding: 35px;
  border: 1px solid #e2e7ed;
  border-radius: 10px;
}
.invoice-content-title {
  margin-left: 30px;
}
.invoice-content-total-due {
  float: right;
  margin-right: 30px;
}
.invoices-price-col {
  float: right;
  margin-right: 15px;
}
.invoices-table-customer-info {
  color: #324ba8;
}
</style>
