<template>
  <div>
    <p class="invoice-content-title">
      <span :class="getLoader">
        {{ $t("payments.invoiceContent") }}
      </span>
    </p>
    <div class="invoice-content-container">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              <span :class="getLoader">{{ $t("payments.customerInfo") }}</span>
            </th>
            <th class="text-left">
              <span :class="getLoader">{{ $t("payments.products") }}</span>
            </th>
            <th class="text-left">
              <span :class="getLoader">{{ $t("payments.dateCompleted") }}</span>
            </th>
            <th class="text-left">
              <span :class="getLoader">{{
                $t("payments.costOfProducts")
              }}</span>
            </th>
            <th class="text-left">
              <span class="invoices-price-col" :class="getLoader">{{
                $t("payments.fulfilmentPrice")
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(invoice, x) in getInvoiceContent"
            :key="x"
            class="invoices-table-row"
          >
            <td class="invoices-table-col">
              <p>
                <span class="invoices-table-customer-info" :class="getLoader">
                  {{ invoice.customerInfo.customer }}
                </span>
              </p>
              <p class="invoice-subtitle">
                <span :class="getLoader">
                  {{ invoice.customerInfo.location }}
                </span>
              </p>
            </td>
            <td class="invoices-table-col">
              <span :class="getLoader">
                {{ invoice.products }}
              </span>
            </td>
            <td class="invoices-table-col">
              <span :class="getLoader">
                {{ invoice.dateCompleted }}
              </span>
            </td>
            <td class="invoices-table-col">
              <span :class="getLoader"> {{ invoice.costOfProducts }}</span>
            </td>
            <td class="invoices-table-col">
              <span class="invoices-price-col" :class="getLoader">
                {{ invoice.fulfilmentPrice }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
      <div class="invoice-content-total-due">
        <span :class="getLoader">
          {{ $t("payments.totalDue") }}: {{ getTotalDue }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getTotalDue", "getLoader", "getInvoiceContent"]),
  },
};
</script>

<style>
.invoice-content-container {
  margin: 30px;
  padding: 35px;
  border: 1px solid #e2e7ed;
  background: white;
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
.invoice-subtitle {
  margin: 0px;
}
</style>
