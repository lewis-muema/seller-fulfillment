<template>
  <div class="deliveries-container">
    <div class="deliveries-container-inner" v-if="getDeliveries.length > 0">
      <div class="deliveries-mid-bar">
        <div class="deliveries-search">
          <searchAlgolia />
        </div>
        <div class="deliveries-date-range">
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
      </div>
      <div>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                <span :class="getLoader">{{ $t("deliveries.products") }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{ $t("deliveries.progress") }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{
                  $t("deliveries.deliveryDate")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader">{{ $t("deliveries.actions") }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="deliveries-table-column"
              v-for="(item, i) in getDeliveries"
              :key="i"
            >
              <td class="deliveries-product-row">
                <span :class="getLoader">{{ item.products }}</span>
              </td>
              <td class="deliveries-progress-row">
                <p class="deliveries-progress-row-top">
                  <span :class="getLoader">
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
                  <span :class="getLoader">
                    {{ item.deliveryDate.date }}
                  </span>
                </p>
                <p class="deliveries-date-row-bottom">
                  <span :class="getLoader">
                    {{ item.deliveryDate.time }}
                  </span>
                </p>
              </td>
              <td class="deliveries-action-row">
                <p
                  class="deliveries-action-row-top"
                  @click="navigate(item.actions.link)"
                >
                  <span :class="getLoader">
                    {{ item.actions.title }}
                  </span>
                </p>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <div class="deliveries-empty" v-else>
      <div>
        <img
          src="https://images.sendyit.com/fulfilment/seller/track.png"
          alt=""
          class="deliveries-empty-img"
        />
      </div>
      <p class="deliveries-empty-title">
        {{ $t("deliveries.noDeliveriesToTrack") }}
      </p>
      <v-btn class="deliveries-btn" size="default">
        {{ $t("deliveries.deliverToACustomer") }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import searchAlgolia from "../../../common/searchAlgolia.vue";

export default {
  components: { searchAlgolia },
  data: () => ({
    deliveries: [],
    range: "",
  }),
  mounted() {
    setTimeout(() => {
      this.setLoader("");
    }, 3000);
  },
  computed: {
    ...mapGetters(["getDeliveries", "getLoader"]),
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader"]),
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
  margin: 0px;
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
.deliveries-btn {
  margin: 8px 25px;
  text-transform: inherit;
  font-size: 14px;
  letter-spacing: 0px;
  color: #324ba8 !important;
  border: 1px solid #324ba8 !important;
}
.deliveries-empty-img {
  width: 60px;
  margin-bottom: 80px;
}
.deliveries-empty-title {
  width: 300px;
  text-align: center;
}
.deliveries-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
.deliveries-mid-bar {
  display: flex;
}
.deliveries-date-range {
  height: 70px;
  margin-top: 10px;
  margin-right: 125px;
  margin-left: auto;
  display: flex;
  flex-direction: column;
}
.deliveries-date-picker {
  height: 50px !important;
}
.deliveries-date-label {
  font-size: 14px;
}
.deliveries-container-inner {
  width: 100%;
  background: white;
}
</style>
