<template>
  <div>
    <div class="invoices-info-bar-container">
      <el-date-picker
        class="invoices-info-bar-filter-from"
        v-model="from"
        type="date"
        :placeholder="$t('payments.from')"
      />
      <el-date-picker
        class="invoices-info-bar-filter-to"
        v-model="to"
        type="date"
        :placeholder="$t('payments.to')"
      />
      <i class="mdi mdi-magnify paymnets-info-bar-search"></i>
      <div>
        <v-menu transition="slide-y-transition" anchor="bottom center">
          <template v-slot:activator="{ props }">
            <v-btn class="statements-actions-btn" v-bind="props">
              {{ $t("payments.download") }}
            </v-btn>
          </template>
          <v-list class="users-actions-popup">
            <v-list-item
              v-for="(action, i) in $store.getters.getDownloadActions"
              :key="i"
            >
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
                <span :class="$store.getters.getLoader">{{
                  $t("payments.invoiceNumber")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="$store.getters.getLoader">{{
                  $t("payments.deliveries")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="$store.getters.getLoader">{{
                  $t("payments.amount")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="$store.getters.getLoader">{{
                  $t("payments.status")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="$store.getters.getLoader">{{
                  $t("payments.dateSent")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="$store.getters.getLoader">{{
                  $t("payments.action")
                }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(invoice, x) in $store.getters.getInvoices"
              :key="x"
              class="invoices-table-row"
            >
              <td class="invoices-table-col">
                <span :class="$store.getters.getLoader">
                  {{ invoice.number }}
                </span>
              </td>
              <td class="invoices-table-col">
                <span :class="$store.getters.getLoader">
                  {{ invoice.deliveries }} {{ $t("payments.deliveries") }}
                </span>
              </td>
              <td class="invoices-table-col">
                <span :class="$store.getters.getLoader">
                  {{ invoice.amount }}
                </span>
              </td>
              <td class="invoices-table-col">
                <span
                  v-if="$store.getters.getLoader"
                  :class="$store.getters.getLoader"
                >
                  {{ invoice.status }}
                </span>
                <span v-else :class="`invoices-${invoice.status}-status`">
                  {{ invoice.status }}</span
                >
              </td>
              <td class="invoices-table-col">
                <span :class="$store.getters.getLoader">
                  {{ invoice.dateSent }}
                </span>
              </td>
              <td class="invoices-table-col-last">
                <span
                  class="invoices-view-col"
                  :class="$store.getters.getLoader"
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
export default {
  data() {
    return {
      orders: "3",
      amount: "KES 750",
      from: "",
      to: "",
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
  margin: 20px;
}
.invoices-table-row {
  height: 60px;
}
.invoices-table-date {
  margin: 30px 0px 10px 0px;
}
.invoices-table-col {
  width: 17%;
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
</style>
