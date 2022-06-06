<template>
  <div>
    <div class="statements-info-bar-container">
      <el-date-picker
        class="statements-info-bar-filter-from"
        v-model="from"
        type="date"
        :placeholder="$t('payments.from')"
      />
      <el-date-picker
        class="statements-info-bar-filter-to"
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
    <div v-if="$store.getters.getStatements.length > 0">
      <v-expansion-panels multiple class="statements-expansion-panel">
        <v-expansion-panel
          v-for="(item, i) in $store.getters.getStatements"
          :key="i"
        >
          <v-expansion-panel-title>
            <div class="statements-expansion-title">
              <p :class="$store.getters.getLoader">
                {{ item.date }}
              </p>
              <p
                class="statements-expansion-title-bottom-row"
                :class="$store.getters.getLoader"
              >
                <span
                  v-if="item.amount"
                  class="statements-expansion-title-amount"
                >
                  {{ item.amount }}
                </span>
                <span>
                  {{ item.items.length }} {{ $t("payments.completedOrders") }}
                </span>
              </p>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table>
              <thead></thead>
              <tbody>
                <tr
                  v-for="(row, x) in item.items"
                  :key="x"
                  class="statements-table-row"
                >
                  <td class="statements-table-icon-row">
                    <span
                      v-if="$store.getters.getLoader"
                      :class="$store.getters.getLoader"
                    >
                      {{ row.icon }}
                    </span>
                    <i v-else :class="`mdi ${row.icon}`"></i>
                  </td>
                  <td class="statements-table-description-row">
                    <span :class="$store.getters.getLoader">
                      {{ row.description }}
                    </span>
                  </td>
                  <td class="statements-table-item-row">
                    <span :class="$store.getters.getLoader">
                      {{ row.items }}
                    </span>
                  </td>
                  <td class="statements-table-date-row">
                    <span :class="$store.getters.getLoader">
                      {{ row.date }}
                    </span>
                  </td>
                  <td class="statements-table-status-row">
                    <span
                      v-if="$store.getters.getLoader"
                      :class="$store.getters.getLoader"
                    >
                      {{ row.class }}
                    </span>
                    <span v-else :class="`statements-${row.class}-status`">
                      {{ row.status }}</span
                    >
                  </td>
                  <td class="statements-table-price-row">
                    <span :class="$store.getters.getLoader">
                      {{ row.price }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
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
        {{ $t("payments.noTransactionsYet") }}
      </p>
      <p class="statements-empty-label">
        {{ $t("payments.trackTransactions") }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      from: "",
      to: "",
    };
  },
};
</script>

<style>
.statements-info-bar-container {
  display: grid;
  grid-template-columns: 15% 15% 5% 65%;
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
  background: #fbdf9a;
  padding: 2px 20px;
  border-radius: 10px;
  color: #7f3b02;
}
.statements-paid-status {
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
}
.statements-expansion-title-bottom-row {
  color: #606266;
  font-size: 14px;
  margin-bottom: 0px;
}
.statements-expansion-title-amount {
  margin-right: 15px;
}
.statements-expansion-panel {
  width: 95%;
  margin-top: 30px;
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
  margin-right: 8%;
}
</style>
