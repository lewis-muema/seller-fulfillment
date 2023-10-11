<template>
  <div class="onboarding-container">
    <div class="welcome-text">
      <h5>
        {{
          $t("dashboard.welcome", {
            name: `${getUserDetails.first_name}`,
          })
        }}
        🎉
      </h5>
      <p>{{ $t("dashboard.completeSteps") }}</p>
    </div>
    <v-row>
      <v-col cols="9" class="desktop-dashboard-content">
        <v-card
          tile
          variant="outlined"
          class="mt-3 mx-auto"
          v-for="(content, i) in dashboardContent"
          :key="i"
        >
          <div class="desktop-dashboard-list">
            <div class="d-flex">
              <i
                v-if="getAchievements[content.key]"
                class="step-check-icon"
                :class="`mdi ${content.icon}`"
              ></i>
              <v-avatar
                size="25"
                class="desktop-content-icon"
                v-else
                :class="{
                  'desktop-content-icon-active': i === activeStep,
                }"
              >
                <span
                  class="white--text onboarding-steps"
                  :class="{
                    'onboarding-steps-active': i === activeStep,
                  }"
                  >{{ i + 1 }}</span
                >
              </v-avatar>
              <v-list-item-header>
                <v-list-item-title>
                  <div class="desktop-content-title">
                    {{ content.title ? $t(content.title) : "" }}
                  </div>
                </v-list-item-title>
                <v-list-item-subtitle
                  v-if="buttonVisible(content.key, i)"
                  class="mt-1"
                  >{{
                    content.text ? $t(content.text) : ""
                  }}</v-list-item-subtitle
                >
                <button
                  v-if="buttonVisible(content.key, i)"
                  type="submit"
                  class="btn btn-primary desktop-content-button"
                  @click="$router.push(content.link)"
                >
                  {{ content.button ? $t(content.button) : "" }}
                </button>
              </v-list-item-header>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="3" class="desktop-dashboard-content mt-3">
        <v-card variant="outlined">
          <p class="ml-3 mt-3">{{ $t("dashboard.getMoreoutOfSendy") }}</p>
          <v-list
            v-for="(link, i) in dashboardLinks"
            :key="i"
            class="dashboard-links-content"
          >
            <v-list-item>
              <v-list-item-avatar>
                <v-icon class="dashboard-links-icon mr-5">{{
                  link.icon
                }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-header>
                <v-list-item-title
                  class="desktop-dashboard-link-title"
                  @click="redirect(link.link)"
                  >{{ $t(link.title) }}</v-list-item-title
                >
                <v-list-item-subtitle>{{ $t(link.name) }}</v-list-item-subtitle>
              </v-list-item-header>
            </v-list-item>
            <v-divider
              class="mt-1"
              :class="
                link.title === 'dashboard.meetUsInPerson'
                  ? 'v-divider-last-item'
                  : 'v-divider-height'
              "
            ></v-divider>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      name: "Irene",
      checkbox: true,
      totalSteps: 4,
      dashboardContent: [
        {
          step: 1,
          title: "dashboard.accountCreated",
          text: "",
          button: "",
          icon: "mdi-check-circle",
          key: "account_created",
        },
        {
          step: 2,
          title: "dashboard.addYourProducts",
          text: "dashboard.addOrImport",
          button: "dashboard.addProducts",
          icon: "mdi-check-circle",
          key: "added_at_least_one_product",
          link: "/inventory/add-product",
        },
        {
          title: "dashboard.sendUsYourInventory",
          text: "dashboard.yourProductsWillBeInsured",
          button: "dashboard.sendTheInventory",
          icon: "mdi-check-circle",
          key: "created_at_least_one_pickup_order",
          link: "/inventory/add-pickup-products",
        },
        {
          title: "dashboard.deliverToCustomer",
          text: "dashboard.weWillPackAndDeliverYourPackageWithin24hrs",
          button: "dashboard.deliverToACustomer",
          icon: "mdi-check-circle",
          key: "created_at_least_one_delivery_order",
          link: "/inventory/create-delivery",
        },
      ],
      dashboardLinks: [
        {
          title: "dashboard.needHelp",
          name: "dashboard.bookATime",
          icon: "mdi-face-agent",
          link: "https://meetings.hubspot.com/stacey79/fulfillment-sales-meetings-kenya",
        },
        {
          title: "dashboard.watchTutorial",
          name: "dashboard.learnHowToSend",
          icon: "mdi-play-box-multiple",
          link: "#",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getUserDetails", "getBusinessDetails", "getAchievements"]),
    activeStep() {
      let step = 0;
      this.dashboardContent.forEach((row, i) => {
        if (this.getAchievements[row.key]) {
          step = i + 1;
        }
      });
      return step;
    },
    crossDockingFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.cross_docking_enabled
        : false;
    },
  },
  mounted() {
    this.setComponent("common.getStarted");
  },
  methods: {
    ...mapMutations(["setComponent"]),
    completeSteps() {
      this.activeStep += 1;
    },
    redirect(link) {
      window.open(link);
    },
    buttonVisible(key, i) {
      return (
        (!this.getAchievements[key] && this.activeStep === i) ||
        (key === "created_at_least_one_delivery_order" &&
          this.activeStep + 1 === i &&
          this.crossDockingFlag)
      );
    },
  },
};
</script>

<style>
.desktop-dashboard-content .v-card {
  border-color: #e2e7ed;
}
.desktop-content-button {
  font-size: 14px !important;
  margin: 15px 0px;
}
.desktop-content-icon {
  margin-right: 10px;
  background-color: white !important;
  border: 1px solid #303133;
}
.desktop-content-icon-active {
  background-color: #324ba8 !important;
}
.dashboard-links-icon {
  background: #d3ddf6;
  height: 30px;
  width: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #324ba8;
  margin: 0px 10px 0px 0px;
}
.desktop-dashboard-link-title {
  color: #324ba8;
  font-weight: 500;
}
.desktop-content-title {
  font-size: 17px !important;
  color: #324ba8;
  font-weight: 500;
}
.desktop-dashboard-list {
  margin: 30px 40px;
  background: white;
}
.onboarding-steps {
  font-size: 14px !important;
}
.onboarding-steps-active {
  color: white !important;
}
.activestep {
  background-color: #324ba8;
}
.onboarding-container {
  max-width: 100%;
  margin: 0px 30px;
}
.welcome-text {
  margin-top: 40px;
}
.step-check-icon {
  font-size: 30px;
  color: #116f28;
  margin-top: -10px;
  margin-right: 10px;
}
.dashboard-links-content {
  box-shadow: none !important;
}
</style>
