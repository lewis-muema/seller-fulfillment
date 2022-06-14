<template>
  <div class="header-container">
    <div class="header-section-left">{{ getComponent }}</div>
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
              prepend-icon="mdi-plus"
              append-icon="mdi-chevron-down"
              class="header-shortcuts-button"
            >
              {{ $t("common.new") }}
            </v-btn>
          </template>
          <v-list class="header-list-popup">
            <v-list-item v-for="(shrt, i) in shortcuts" :key="i">
              <v-list-item-title>
                <i :class="`header-shortcut-icon mdi ${shrt.icon}`" />
                {{ shrt.title }}</v-list-item-title
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
              max="10"
              :content="`${notifications.length}`"
            >
              <i
                class="mdi mdi-bell-outline notification-bell"
                v-bind="props"
              ></i>
            </v-badge>
          </template>
          <v-list class="header-list-popup">
            <p class="header-notification-list-title">
              {{ $t("common.notifications") }}
            </p>
            <v-list-item v-for="(not, i) in notifications" :key="i">
              <v-list-item-title>
                <div class="header-notification-flex">
                  <div class="header-notifications-icon">
                    <i :class="`mdi ${not.icon}`"></i>
                  </div>
                  <div>
                    <div class="header-notification-text">
                      {{ not.content }}
                    </div>
                    <div class="header-notification-action">
                      {{ not.action }}
                    </div>
                    <div>{{ not.period }}</div>
                  </div>
                </div>
              </v-list-item-title>
            </v-list-item>
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
              class="header-shortcuts-button"
              append-icon="mdi-menu-down"
            >
              <div class="header-profile-pic">
                {{ this.profileName.charAt(0) }}
              </div>
              {{ profileName }}
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
import { mapGetters } from "vuex";

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
          title: this.$t("common.deliverToCustomer"),
          icon: "mdi-truck-outline",
          url: "en",
        },
        {
          title: this.$t("common.sendToFC"),
          icon: "mdi-warehouse",
          url: "fr",
        },
        {
          title: this.$t("common.addProducts"),
          icon: "mdi-plus",
          url: "fr",
        },
      ],
      notifications: [
        {
          content: "Your delivery to Windsor Heights is on the way.",
          action: "Track delivery",
          period: "3 min ago",
          icon: "mdi-truck-outline",
        },
        {
          content: "Shea butter is running out of stock. Please restock soon.",
          action: "Restock inventory",
          period: "2 days ago",
          icon: "mdi-store-outline",
        },
        {
          content:
            "Yellow butter and 3 other items have been received at the fulfilment centre",
          action: "",
          period: "1 week ago",
          icon: "mdi-warehouse",
        },
      ],
      profile: [
        {
          item: "Irene Jane",
          actionLabel: "See profile",
          route: "/settings/profile",
          icon: "",
        },
        {
          item: "Language: English",
          actionLabel: "",
          route: "/settings/profile",
          icon: "mdi-chevron-right",
        },
        {
          item: "Log Out",
          actionLabel: "",
          route: "/auth/sign-in",
          icon: "",
        },
      ],
      lang: "English",
      rail: false,
    };
  },
  computed: {
    ...mapGetters(["getComponent"]),
  },
  methods: {
    showLangs(lang) {
      this.lang = lang.title;
      this.menu = false;
      window.dispatchEvent(
        new CustomEvent("language-changed", { detail: lang.locale })
      );
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
  font-size: 15px;
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
</style>
