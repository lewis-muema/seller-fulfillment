<template>
  <div class="deliveries-container">
    <div class="deliveries-search">
      <v-text-field
        color="#324BA8"
        prepend-inner-icon="mdi-magnify"
        :label="$t('deliveries.searchDelivery')"
        variant="outlined"
        :placeholder="$t('deliveries.searchDelivery')"
      ></v-text-field>
    </div>
    <div>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("deliveries.products")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("deliveries.progress")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("deliveries.deliveryDate")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("deliveries.actions")
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="deliveries-table-column"
            v-for="(item, i) in $store.getters.getDeliveries"
            :key="i"
          >
            <td class="deliveries-product-row">
              <span :class="$store.getters.getLoader">{{ item.products }}</span>
            </td>
            <td class="deliveries-progress-row">
              <p class="deliveries-progress-row-top">
                <span :class="$store.getters.getLoader">
                  {{ item.progress.status }}
                </span>
              </p>
              <v-progress-linear
                :model-value="item.progress.step"
                color="#324BA8"
                height="10"
                rounded
              ></v-progress-linear>
            </td>
            <td class="deliveries-date-row">
              <p class="deliveries-date-row-top">
                <span :class="$store.getters.getLoader">
                  {{ item.deliveryDate.date }}
                </span>
              </p>
              <p class="deliveries-date-row-bottom">
                <span :class="$store.getters.getLoader">
                  {{ item.deliveryDate.time }}
                </span>
              </p>
            </td>
            <td class="deliveries-action-row">
              <p
                class="deliveries-action-row-top"
                @click="navigate(item.actions.link)"
              >
                <span :class="$store.getters.getLoader">
                  {{ item.actions.title }}
                </span>
              </p>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    deliveries: [],
  }),
  mounted() {
    setTimeout(() => {
      this.$store.commit("setLoader", "");
    }, 3000);
  },
  methods: {
    navigate(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style>
.deliveries-search {
  width: 30%;
  zoom: 85%;
  margin: 25px;
}
.deliveries-container {
  border-radius: 10px;
  border: 1px solid #e2e7ed;
  margin: 30px;
}
.deliveries-table-column {
  height: 60px;
}
.deliveries-product-row,
.deliveries-date-row,
.deliveries-action-row {
  width: 20%;
}
.deliveries-progress-row {
  width: 40%;
}
.deliveries-product-row {
  font-size: 16px !important;
}
.deliveries-date-row-top {
  font-size: 14px;
}
.deliveries-date-row-bottom {
  font-size: 12px;
  color: #606266;
}
.deliveries-progress-row-top {
  font-size: 12px;
  margin: 5px 0px;
}
.deliveries-action-row-top {
  color: #324ba8;
  cursor: pointer;
}
</style>
