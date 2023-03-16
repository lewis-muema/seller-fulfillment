<template>
  <div>
    <v-card variant="outlined" class="desktop-dashboard-upper-card mt-3">
      <div class="mt-3">
        {{ $t("dashboard.doMoreWithSendy") }}
      </div>
      <v-row class="desktop-dashboard-upper-content">
        <v-col cols="11">
          <div class="">
            <div class="" v-for="(link, i) in links" :key="i">
              <v-list class="stats-list-item" lines="two">
                <v-list-item>
                  <v-list-item-header>
                    <v-list-item-title class="d-flex">
                      <div>
                        <div class="articles-link-title">
                          {{ $t(link.title) }}
                        </div>
                        <div class="articles-link-desc">
                          {{ $t(link.description) }}
                        </div>
                        <div
                          class="articles-link-arrow"
                          @click="$router.push(link.redirect)"
                        >
                          <span>{{ $t(link.action) }}</span>
                          <span>
                            <i class="mdi mdi-arrow-right"></i>
                          </span>
                        </div>
                      </div>
                      <div class="ml-auto articles-link-image-container">
                        <div>
                          <img
                            :src="`https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/${link.icon}`"
                            alt=""
                            class="articles-link-image"
                          />
                        </div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-header>
                </v-list-item>
              </v-list>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      name: "Irene",
      links: [
        {
          title: "dashboard.valentinesDiscount",
          icon: "valentines.png",
          description: "dashboard.get14off",
          action: "dashboard.deliverToCustomer",
          redirect: "/inventory/create-delivery",
        },
        {
          title: "dashboard.hireAVehicle",
          icon: "hireAVehicle.png",
          description: "dashboard.getATruckOrMotorbike",
          action: "dashboard.learnMore",
          redirect: "/",
        },
        {
          title: "dashboard.getFinancing",
          icon: "financing.png",
          description: "dashboard.fromAsLowAs",
          action: "dashboard.learnMore",
          redirect: "/",
        },
      ],
      ongoing: "",
    };
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getUserDetails",
      "getStockStatistics",
      "getDeliveriesStatisticsToday",
      "getConsignmentStatisticsToday",
      "getDashboardSelectedTab",
      "getConsignmentStatistics",
      "getDeliveriesStatistics",
    ]),
  },
  mounted() {},
};
</script>

<style>
.desktop-dashboard-upper-card {
  border-color: #e2e7ed;
  height: auto;
  padding-left: 25px;
  background: white;
}
.desktop-dashboard-icon {
  background: #f1f2f4;
  height: 40px;
  width: 40px;
  display: inline-flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  margin: 0px 10px 0px 0px;
}
.count {
  font-size: 24px !important;
  font-weight: 700;
  line-height: 28px;
}
.v-divider-height {
  height: 40px !important;
  border-color: #c0c4cc !important;
}
.v-divider-last-item {
  height: 40px !important;
  color: transparent !important;
  border: none;
}
.desktop-dashboard-subtitle {
  overflow: visible !important;
  text-overflow: inherit !important;
}
.dashboard-cards .v-list-item {
  padding: 12px 0px !important;
}
.stats-list-item {
  border-bottom: 1px solid #dcdfe6;
  box-shadow: none !important;
  padding: 0px;
}
.stats-list-count {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  text-align: center;
  padding: 0px 15px;
}
.stats-list-item .v-list-item {
  padding: 0px 5px !important;
  min-height: 55px;
}
.articles-link-image {
  width: 55px;
}
.articles-link-desc {
  width: 185px;
  white-space: initial !important;
  color: #606266;
  font-size: 15px;
  margin-bottom: 15px;
}
.articles-link-image-container {
  display: flex;
  align-items: center;
}
.articles-link-title {
  font-size: 15px;
  font-weight: 500;
  margin: 10px 0px 5px 0px;
}
.articles-link-arrow {
  color: #324ba8;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
