<template>
  <div class="invoices-container">
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
        <v-menu transition="slide-y-transition" anchor="bottom center">
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
        </v-menu>
      </div>
    </div>
    <div>
      <div class="invoices-table">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                <span :class="getLoader" class="first-col-padding">{{
                  $t("payments.invoiceNumber")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{ $t("payments.deliveries") }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{ $t("payments.amount") }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{ $t("payments.status") }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{ $t("payments.dateSent") }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{ $t("payments.action") }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(invoice, x) in getInvoices"
              :key="x"
              class="invoices-table-row"
            >
              <td class="invoices-table-col">
                <span :class="getLoader" class="first-col-padding">
                  {{ invoice.number }}
                </span>
              </td>
              <td class="invoices-table-col">
                <span :class="getLoader">
                  {{ invoice.deliveries }} {{ $t("payments.deliveries") }}
                </span>
              </td>
              <td class="invoices-table-col">
                <span :class="getLoader">
                  {{ invoice.amount }}
                </span>
              </td>
              <td class="invoices-table-col">
                <span v-if="getLoader" :class="getLoader">
                  {{ invoice.status }}
                </span>
                <span v-else :class="`invoices-${invoice.status}-status`">
                  {{ invoice.status }}</span
                >
              </td>
              <td class="invoices-table-col">
                <span :class="getLoader">
                  {{ invoice.dateSent }}
                </span>
              </td>
              <td class="invoices-table-col-last">
                <span
                  class="invoices-view-col"
                  :class="getLoader"
                  @click="$router.push(invoice.link)"
                >
                  {{ invoice.action }}
                </span>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getLoader", "getInvoices", "getDownloadActions"]),
  },
  data() {
    return {
      orders: "3",
      amount: "KES 750",
      from: "",
      to: "",
      range: "",
    };
  },
};
</script>

<style>
.invoices-top-bar-container {
  display: grid;
  grid-template-columns: 70% 15% 15%;
  margin: 50px 30px;
}
.invoices-top-bar-description {
  color: #909399;
  font-size: 13px;
}
.invoices-info-bar-container {
  display: grid;
  grid-template-columns: 15% 15% 5% 65%;
  margin-top: 100px;
}
.invoices-info-bar-filter-from,
.invoices-info-bar-filter-to {
  margin-left: 20px;
  height: 40px;
}
.paymnets-info-bar-search {
  font-size: 25px;
  margin: auto;
  cursor: pointer;
}
.invoices-table {
  margin: 20px 0px;
}
.invoices-table-row {
  height: 60px;
}
.invoices-table-date {
  margin: 30px 0px 10px 0px;
}
.invoices-table-col {
  width: 17%;
  height: 80px !important;
  align-items: center;
}
.invoices-table-col-last {
  width: 15%;
}
.invoices-Pending-status {
  background: #fbdf9a;
  padding: 2px 20px;
  border-radius: 10px;
  color: #7f3b02;
}
.invoices-Paid-status {
  background: #b8f5a8;
  padding: 2px 20px;
  border-radius: 10px;
  color: #064a23;
}
.invoices-view-col {
  color: #324ba8;
  cursor: pointer;
}
.invoices-container {
  padding-top: 30px;
  background: white;
}
.first-col-padding {
  padding-left: 20px;
}
</style>
