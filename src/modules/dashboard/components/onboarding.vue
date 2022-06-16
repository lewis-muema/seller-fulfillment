<template>
  <div class="onboarding-container">
    <div class="welcome-text">
      <h5>{{ $t("dashboard.welcome", { name: name }) }} 🎉</h5>
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
            <v-list density="compact">
              <v-list-item>
                <div class="d-flex">
                  <v-avatar
                    size="25"
                    class="desktop-content-icon"
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
                        {{ content.title }}
                      </div>
                    </v-list-item-title>
                    <v-list-item-subtitle class="mt-1">{{
                      content.text
                    }}</v-list-item-subtitle>
                    <button
                      type="submit"
                      class="btn btn-primary desktop-content-button"
                    >
                      {{ content.button }}
                    </button>
                  </v-list-item-header>
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
      <v-col cols="3" class="desktop-dashboard-content mt-3">
        <v-card variant="outlined">
          <p class="ml-3 mt-3">{{ $t("dashboard.getMoreoutOfSendy") }}</p>
          <v-list v-for="(link, i) in dashboardLinks" :key="i">
            <v-list-item>
              <v-list-item-avatar>
                <v-icon class="dashboard-links-icon mr-5">{{
                  link.icon
                }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-header>
                <v-list-item-title class="desktop-dashboard-link-title">{{
                  link.title
                }}</v-list-item-title>
                <v-list-item-subtitle>{{ link.name }}</v-list-item-subtitle>
              </v-list-item-header>
            </v-list-item>
            <v-divider
              class="mt-1"
              :class="
                link.title === 'Meet us in person'
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
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      name: "Irene",
      checkbox: true,
      activeStep: 0,
      totalSteps: 4,
      dashboardContent: [
        {
          step: 1,
          title: this.$t("dashboard.accountCreated"),
          text: "",
          button: "",
          icon: "mdi-check-circle",
        },
        {
          step: 2,
          title: this.$t("dashboard.addYourProducts"),
          text: this.$t("dashboard.addOrImport"),
          button: this.$t("dashboard.addProducts"),
          icon: "mdi-check-circle",
        },
        {
          title: this.$t("dashboard.sendUsYourInventory"),
          text: this.$t("dashboard.sendUsTheProducts"),
          button: this.$t("dashboard.sendTheInventory"),
          icon: "mdi-check-circle",
        },
        {
          title: this.$t("dashboard.deliverToCustomer"),
          text: this.$t("dashboard.sendADelivery"),
          button: this.$t("dashboard.deliverToACustomer"),
          icon: "mdi-check-circle",
        },
      ],
      dashboardLinks: [
        {
          title: this.$t("dashboard.needHelp"),
          name: this.$t("dashboard.bookATime"),
          icon: "mdi-face-agent",
        },
        {
          title: this.$t("dashboard.watchTutorial"),
          name: this.$t("dashboard.learnHowToSend"),
          icon: "mdi-play-box-multiple",
        },
        {
          title: this.$t("dashboard.meetUsInPerson"),
          name: this.$t("dashboard.attendOneOfOurUpcomingEvents"),
          icon: "mdi-calendar-week-begin",
        },
      ],
    };
  },
  mounted() {
    this.setComponent(this.$t("common.getStarted"));
  },
  methods: {
    ...mapMutations(["setComponent"]),
    completeSteps() {
      this.activeStep += 1;
    },
  },
  computed: {},
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
  margin: 10px 10px;
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
</style>
