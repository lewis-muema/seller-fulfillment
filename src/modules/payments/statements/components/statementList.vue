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
    <div v-if="getStatements.length > 0">
      <v-expansion-panels multiple class="statements-expansion-panel">
        <v-expansion-panel v-for="(item, i) in getStatements" :key="i">
          <v-expansion-panel-title>
            <div class="statements-expansion-title">
              <p :class="getLoader">
                {{ item.date }}
              </p>
              <p
                class="statements-expansion-title-bottom-row"
                :class="getLoader"
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
                    <span v-if="getLoader" :class="getLoader">
                      {{ row.icon }}
                    </span>
                    <i v-else :class="`mdi ${row.icon}`"></i>
                  </td>
                  <td class="statements-table-description-row">
                    <span :class="getLoader">
                      {{ row.description }}
                    </span>
                  </td>
                  <td class="statements-table-item-row">
                    <span :class="getLoader">
                      {{ row.items }}
                    </span>
                  </td>
                  <td class="statements-table-date-row">
                    <span :class="getLoader">
                      {{ row.date }}
                    </span>
                  </td>
                  <td class="statements-table-status-row">
                    <span v-if="getLoader" :class="getLoader">
                      {{ row.class }}
                    </span>
                    <span v-else :class="`statements-${row.class}-status`">
                      {{ row.status }}</span
                    >
                  </td>
                  <td class="statements-table-price-row">
                    <span :class="getLoader">
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      from: "",
      to: "",
      range: "",
    };
  },
  computed: {
    ...mapGetters(["getLoader", "getDownloadActions", "getStatements"]),
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
  margin: 15px;
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
  width: calc(100% - 60px);
  margin: 30px;
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
</style>
