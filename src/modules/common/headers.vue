<template>
  <div class="header-container">
    <div class="header-section-left">{{ $t(getComponent) }}</div>
    <div class="header-section-right">
      <div></div>
      <div class="header-button-section">
        <v-menu
          transition="slide-y-transition"
          anchor="bottom end"
          v-model="shortcutToggle"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              dark
              v-bind="props"
              append-icon="mdi-chevron-down"
              class="header-shortcuts-button-blue elevation-0"
              variant="outlined"
            >
              {{ $t("common.send") }}
            </v-btn>
          </template>
          <v-list class="header-list-popup">
            <v-list-item v-for="(shrt, i) in shortcuts" :key="i">
              <v-list-item-title
                @click="$router.push(shrt.url)"
                class="header-list-item"
              >
                <i :class="`header-shortcut-icon mdi ${shrt.icon}`" />
                {{ $t(shrt.title) }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="header-button-section">
        <v-menu
          transition="slide-y-transition"
          anchor="bottom center"
          v-model="notificationToggle"
        >
          <template v-slot:activator="{ props }">
            <v-badge
              color="#324BA8"
              text-color="white"
              max=""
              :content="`${filteredNotifications.length}`"
            >
              <i
                class="mdi mdi-bell-outline notification-bell"
                v-bind="props"
              ></i>
              <iframe id="my_iframe" style="display: none"></iframe>
            </v-badge>
          </template>
          <v-list class="header-list-popup">
            <p class="header-notification-list-title">
              {{ $t("common.notifications") }}
            </p>
            <v-list-item v-for="(not, i) in filteredNotifications" :key="i">
              <v-list-item-title>
                <div class="header-notification-flex">
                  <div class="header-notifications-icon">
                    <i :class="`mdi ${getIcon(not)}`"></i>
                  </div>
                  <div>
                    <div class="header-notification-text">
                      <span :class="notificationLoader">
                        {{ not.message }}
                      </span>
                    </div>
                    <div
                      class="header-notification-action"
                      @click="
                        getAction(not).link
                          ? $router.push(getAction(not).link)
                          : triggerAction(not)
                      "
                    >
                      <span :class="notificationLoader">
                        {{ getAction(not).label }}
                      </span>
                    </div>
                    <div>
                      <span :class="notificationLoader">
                        {{ formatPeriod(not) }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <i
                      class="mdi mdi-close"
                      @click="archiveNotifications(not.id)"
                    ></i>
                  </div>
                </div>
              </v-list-item-title>
            </v-list-item>
            <p class="notification-clear" @click="archiveAllNotifications()">
              {{ $t("dashboard.clearAll") }}
            </p>
          </v-list>
        </v-menu>
      </div>
      <div class="header-button-section">
        <v-menu
          transition="slide-y-transition"
          anchor="bottom end"
          v-model="profileToggle"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              dark
              v-bind="props"
              class="header-shortcuts-button elevation-0"
              append-icon="mdi-menu-down"
              variant="outlined"
            >
              <div class="header-profile-pic">
                {{ profile[0].item.charAt(0) }}
              </div>
              {{ profile[0].item }}
            </v-btn>
          </template>
          <v-list class="header-profile-popup">
            <v-list-item
              v-for="(prof, i) in profile"
              :key="i"
              class="header-profile-popup-item"
            >
              <v-list-item-title :append-icon="prof.icon">
                <div
                  class="header-notification-flex"
                  @click="$router.push(prof.route)"
                >
                  <div>
                    <div>{{ prof.item }}</div>
                    <div class="header-notification-action-label">
                      {{ prof.actionLabel }}
                    </div>
                  </div>
                  <i :class="`mdi ${prof.icon}`"></i>
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import moment from "moment";
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      shortcutToggle: false,
      notificationToggle: false,
      profileToggle: false,
      shortcutStat: false,
      drawer: true,
      profileName: "Irene Jane",
      shortcuts: [
        {
          title: "common.deliverToCustomer",
          icon: "mdi-truck-outline",
          url: "/inventory/create-delivery",
        },
        {
          title: "common.inventoryToSendy",
          icon: "mdi-warehouse",
          url: "/inventory/add-pickup-products",
        },
      ],
      profile: [
        {
          item: "",
          actionLabel: "",
          route: "/settings/profile/personal-info",
          icon: "",
        },
        {
          item: "",
          actionLabel: "",
          route: "/settings/profile/change-language",
          icon: "mdi-chevron-right",
        },
        {
          item: "",
          actionLabel: "",
          route: "/auth/sign-in",
          icon: "",
        },
      ],
      lang: "English",
      rail: false,
      notificationLoader: "",
    };
  },
  computed: {
    ...mapGetters([
      "getComponent",
      "getBusinessDetails",
      "getUserDetails",
      "getLanguages",
      "getNotifications",
      "getStorageUserDetails",
      "getMapOptions",
    ]),
    languageName() {
      let lang = "";
      this.getLanguages.forEach((row) => {
        if (row.value === this.getBusinessDetails.language) {
          lang = row.title;
          this.setDefaultLanguage(row.value);
          localStorage.language = row.value;
        }
      });
      return lang;
    },
    filteredNotifications() {
      const notifications = [];
      this.getNotifications.forEach((row) => {
        if (!row.archived) {
          notifications.push(row);
        }
      });
      return notifications;
    },
  },
  watch: {
    "$store.state.businessDetails": function businessDetails() {
      this.profile[1].item = `${this.$t("common.language")}: ${
        this.languageName
      }`;
      this.profile[2].actionLabel = this.$t("common.logOut");
    },
    "$store.state.userDetails": function businessDetails() {
      this.profile[0].item = `${this.getUserDetails.first_name} ${this.getUserDetails.last_name}`;
      this.profile[0].actionLabel = this.$t("common.seeProfile");
    },
  },
  mounted() {
    this.listLanguages();
    this.listUsersDetails();
    this.listNotifications();
  },
  methods: {
    ...mapMutations([
      "setBusinessDetails",
      "setUserDetails",
      "setLanguages",
      "setNotifications",
      "setDefaultLanguage",
      "setMapOptions",
    ]),
    ...mapActions(["requestAxiosGet", "requestAxiosPatch", "requestAxiosPut"]),
    getIcon(notification) {
      if (
        notification.message.includes(
          "driver has reached the fulfillment centre"
        )
      ) {
        return "mdi-warehouse";
      }
      if (notification.entity_type === "PAYMENT") {
        return "mdi-cash-multiple";
      }
      return "mdi-truck-outline";
    },
    getAction(notification) {
      if (
        notification.entity_type === "ORDER" &&
        ![
          "Successful Delivery",
          "Order Rescheduled",
          "Failed Delivery",
        ].includes(notification.title) &&
        notification.entity_identifier &&
        !notification.message.includes(
          "driver has reached the fulfillment centre"
        )
      ) {
        return {
          label: this.$t("common.trackDelivery"),
          link: `/deliveries/tracking/${notification.entity_identifier}`,
        };
      }
      if (notification.message.includes("Please make payment")) {
        return {
          label: this.$t("payments.makePayment"),
          link: "/payments/wallet",
        };
      }
      if (notification.notification_type === "EXPORT_DATA_SUCCESS_UPDATES") {
        return {
          label: this.$t("common.downloadCsvFile"),
          link: "",
        };
      }
      return "";
    },
    triggerAction(notification) {
      ElNotification({
        title: "",
        message: this.$t("common.fetchingDownloadFile"),
        type: "info",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/exporttasks/${notification.entity_identifier}`,
      }).then((response) => {
        if (response.status === 200) {
          document.getElementById("my_iframe").src =
            response.data.data.export_task.exported_file;
          ElNotification({
            title: "",
            message: this.$t("common.downloadingFile"),
            type: "success",
          });
        } else {
          ElNotification({
            title: "",
            message: this.$t("common.couldNotFetchDownloadFile"),
            type: "error",
          });
        }
      });
    },
    formatPeriod(notification) {
      return moment(notification.created_date).fromNow();
    },
    listBusinessDetails() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/business`,
      }).then((response) => {
        if (response.status === 200) {
          this.setBusinessDetails(response.data.data.business);
          this.profile[1].item = `${this.$t("common.language")}: ${
            this.languageName
          }`;
          if (!localStorage.country) {
            localStorage.country = response.data.data.business.country_code;
          }
        }
      });
    },
    listLanguages() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/business/signup/languages`,
      }).then((response) => {
        if (response.status === 200) {
          this.setLanguages(this.languageFormat(response.data.data.languages));
          this.listBusinessDetails();
        }
      });
    },
    languageFormat(languages) {
      const langs = [];
      languages.forEach((row) => {
        langs.push({
          title: row.name,
          value: row.tag,
        });
      });
      return langs;
    },
    listUsersDetails() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/user`,
      }).then((response) => {
        if (response.status === 200) {
          this.setUserDetails(response.data.data.user);
          window.dispatchEvent(new CustomEvent("register-fcm"));
          this.profile[0].item = `${this.getUserDetails.first_name} ${this.getUserDetails.last_name}`;
        }
      });
    },
    listNotifications() {
      this.notificationLoader = "loading-text";
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/notifications`,
      }).then((response) => {
        if (response.status === 200) {
          this.setNotifications(response.data.data.notifications);
          this.notificationLoader = "";
        }
      });
    },
    archiveNotifications(notificationId) {
      this.notificationLoader = "loading-text";
      this.requestAxiosPatch({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/notifications/${notificationId}/archive`,
      }).then((response) => {
        if (response.status === 200) {
          this.listNotifications();
        }
      });
    },
    archiveAllNotifications() {
      this.notificationLoader = "loading-text";
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/notifications/archive`,
      }).then((response) => {
        if (response.status === 200) {
          this.listNotifications();
        }
      });
    },
  },
};
</script>

<style>
.header-container {
  display: grid;
  grid-template-columns: auto auto;
  height: 60px;
  border-bottom: 1px solid #dededead;
  background: white;
}
.header-section-left {
  margin: auto 30px;
  font-size: 18px;
  font-weight: 500;
}
.header-section-right {
  display: flex;
  justify-content: flex-end;
}
.notification-bell {
  font-size: 25px;
  cursor: pointer;
}
.header-button-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 15px;
}
.header-shortcuts-button {
  text-transform: capitalize;
  color: #606266 !important;
  letter-spacing: 0.01em !important;
  font-weight: 600 !important;
  box-shadow: none !important;
  border: 1px solid #e0e0e0;
}
.header-shortcuts-button-blue {
  text-transform: capitalize;
  color: #314ba8 !important;
  letter-spacing: 0.01em !important;
  font-weight: 600 !important;
  box-shadow: none !important;
  border: 1px solid #314ba8;
}
.header-profile-pic {
  height: 25px;
  width: 25px;
  background-color: #20264a;
  border-radius: 20px;
  margin-right: 10px;
  color: white;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-list-popup {
  box-shadow: 0px 0px 2px 0px rgb(0 0 0 / 20%),
    0px 0px 10px 0px rgb(0 0 0 / 14%), 0px 0px 10px 0px rgb(0 0 0 / 12%) !important;
  padding: 5px 10px;
  margin-top: 5px;
}
.header-profile-popup {
  box-shadow: 0px 0px 2px 0px rgb(0 0 0 / 20%),
    0px 0px 10px 0px rgb(0 0 0 / 14%), 0px 0px 10px 0px rgb(0 0 0 / 12%) !important;
  margin-top: 5px;
}
.header-profile-popup-item {
  border-bottom: 1px solid #d8d8d8;
}
.header-shortcut-icon {
  margin-right: 6px;
  font-size: 16px !important;
}
.header-notification-list-title {
  margin: 5px 15px;
  font-weight: 500;
}
.header-notifications-icon {
  background: #d3ddf6;
  height: 25px;
  width: 25px;
  border-radius: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #324ba8;
  margin: 0px 10px 0px 0px;
}
.header-notification-flex {
  display: flex;
}
.header-notification-text {
  width: 250px;
  white-space: initial;
}
.header-notification-action {
  color: #324ba8;
  font-weight: 600;
  margin: 5px 0px;
}
.header-notification-action-label {
  margin-top: -5px;
  color: #606266;
  font-size: 12px;
}
.header-list-item {
  font-weight: 500 !important;
}
.notification-clear {
  font-weight: 500;
  cursor: pointer;
  color: #324ba8;
  float: right;
  margin: 16px;
}
</style>
