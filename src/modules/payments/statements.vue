<template>
  <div>
    <div class="statements-top-bar-container">
      <div />
      <div>
        <p>
          <span :class="$store.getters.getLoader">
            {{ orders }} {{ $t("payments.orders") }}
          </span>
        </p>
        <p class="statements-top-bar-description">
          <span :class="$store.getters.getLoader">
            {{ $t("payments.completedToday") }}
          </span>
        </p>
      </div>
      <div>
        <p>
          <span :class="$store.getters.getLoader">
            {{ amount }}
          </span>
        </p>
        <p class="statements-top-bar-description">
          <span :class="$store.getters.getLoader">
            {{ $t("payments.youWillBeCharged") }}
          </span>
        </p>
      </div>
    </div>
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
      <div />
    </div>
    <div>
      <div
        v-for="(item, i) in $store.getters.getStatements"
        :key="i"
        class="statements-table"
      >
        <p class="statements-table-date">
          <span :class="$store.getters.getLoader">
            {{ item.date }}
          </span>
        </p>
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
  mounted() {
    this.$store.commit("setComponent", this.$t("common.statements"));
    setTimeout(() => {
      this.$store.commit("setLoader", "");
    }, 3000);
  },
};
</script>

<style>
.statements-top-bar-container {
  display: grid;
  grid-template-columns: 70% 15% 15%;
  margin: 50px 30px;
}
.statements-top-bar-description {
  color: #909399;
  font-size: 13px;
}
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
</style>
