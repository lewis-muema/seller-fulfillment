<template>
  <v-app>
    <v-main>
      <Canvas />
    </v-main>
  </v-app>
</template>

<script>
import Canvas from "./components/canvas.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { initializeApp } from "firebase/app";
import eventsMixin from "../src/mixins/events_mixin";
import cookieMixin from "@/mixins/cookie_mixin";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export default {
  name: "App",
  components: { Canvas },
  mixins: [eventsMixin, cookieMixin],
  data: () => ({}),
  watch: {
    $route(to) {
      if (
        this.$route.path !== "/auth/sign-up" &&
        this.$route.path !== "/auth/otp" &&
        this.onboardingStatus &&
        typeof localStorage.userDetails === "string"
      ) {
        this.getOnboardingStatus();
      }
      if (to.path.includes("/inventory/send-inventory/customer")) {
        this.$router.push("/inventory/create-delivery");
      }
      if (to.path.includes("/inventory/create-delivery") && this.activeCycle) {
        this.$router.go(-1);
        setTimeout(() => {
          this.setOverlayStatus({
            overlay: true,
            popup: "payments",
          });
        }, 500);
      }
    },
    "$store.state.defaultLanguage": function language(val) {
      window.dispatchEvent(
        new CustomEvent("language-changed", { detail: val })
      );
    },
  },
  computed: {
    ...mapGetters([
      "getUserDetails",
      "getStorageUserDetails",
      "getAchievements",
      "getSendyPhoneProps",
      "getActivePayment",
      "getParent",
    ]),
    onboardingStatus() {
      if (
        Object.values(this.getAchievements).includes(false) ||
        Object.values(this.getAchievements).length === 0
      ) {
        return true;
      }
      return false;
    },
    activeCycle() {
      const cycle = this.getActivePayment ? this.getActivePayment : {};
      return Object.keys(cycle).length > 0 && cycle?.paid_status !== "PAID";
    },
  },
  created() {
    this.getOnboarding();
    this.registerFCM();
    this.freshchatInit();
    this.changeLanguage();
    this.autoZoom();
    this.detectMobile();
    this.detectPayments();
    this.countryDefault();
    this.setVirtualTourCookie();
  },
  methods: {
    ...mapActions(["requestAxiosPut", "requestAxiosGet"]),
    ...mapMutations([
      "setNotifications",
      "setAchievements",
      "setSendyPhoneProps",
      "setDefaultCountryCode",
      "setDefaultCountryName",
      "setDefaultLanguage",
      "setOverlayStatus",
      "setDirectDeliveriesTrackingData",
      "setOrderTimelines",
    ]),
    registerFCM() {
      window.addEventListener("register-fcm", () => {
        this.firebase();
      });
    },
    getOnboarding() {
      setTimeout(() => {
        if (
          this.$route.path !== "/auth/sign-up" &&
          this.$route.path !== "/auth/otp" &&
          this.onboardingStatus &&
          typeof localStorage.userDetails === "string"
        ) {
          this.getOnboardingStatus();
        }
      }, 500);
    },
    freshchatInit() {
      window.addEventListener("freshchat-loaded", () => {
        this.sendSegmentEvents({
          event: "Sendy_Support",
          data: {
            userId: this.getStorageUserDetails.business_id,
            email: this.getStorageUserDetails.email,
            clientType: "web",
            device: "desktop",
          },
        });
      });
    },
    changeLanguage() {
      if (localStorage.language) {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("language-changed", {
              detail: localStorage.language,
            })
          );
        }, 500);
      }
    },
    autoZoom() {
      onResizeFunction(window.innerWidth);
      window.addEventListener("resize", (event) => {
        onResizeFunction(event.target.innerWidth);
      });

      function onResizeFunction(width) {
        if (width >= 1440) {
          document.querySelector("#app").style.zoom = "100%";
        } else if (width < 1440 && width >= 1200) {
          document.querySelector("#app").style.zoom = "90%";
        } else if (width < 1200 && width >= 1024) {
          document.querySelector("#app").style.zoom = "80%";
        } else {
          document.querySelector("#app").style.zoom = "70%";
        }
      }
    },
    detectMobile() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i)
      ) {
        window.location = "https://fulfilment.page.link/app";
      }
    },
    detectPayments() {
      setTimeout(() => {
        if (this.$route.path === "/payment-option-page") {
          this.$router.push("/settings/payment-options");
        }
      }, 100);
    },
    countryDefault() {
      window.dispatchEvent(new CustomEvent("country-default"));
      window.addEventListener("country-fetched", () => {
        const props = this.getSendyPhoneProps;
        props.defaultCountry = localStorage?.country?.toLowerCase();
        this.setSendyPhoneProps(props);
        this.setDefaultCountryCode(localStorage?.country?.toLowerCase());
        this.setDefaultCountryName(
          localStorage?.country_name === "Ivory Coast"
            ? "COTE_D_VOIRE"
            : localStorage?.country_name
        );
        const francoPhoneCountries = ["FR", "CI"].includes(
          localStorage?.country
        );
        let locale;
        if (francoPhoneCountries) {
          locale = "fr";
        } else {
          locale = "en";
        }
        this.setDefaultLanguage(locale);
        setTimeout(() => {
          localStorage.language = locale;
          this.changeLanguage();
        }, 100);
      });
    },
    firebase() {
      initializeApp({
        apiKey: "AIzaSyDAAvZPAgy7HX8JUqxWsFxn28ixGoOnHPs",
        authDomain: "sendy-fulfilment.firebaseapp.com",
        projectId: "sendy-fulfilment",
        storageBucket: "sendy-fulfilment.appspot.com",
        messagingSenderId: "724697801657",
        appId: "1:724697801657:web:25458f9c1a52c4f7430c68",
        measurementId: "G-J8KW3YLS1N",
      });
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker.register("/firebase-messaging-sw.js");
        });
      }
      try {
        const messaging = getMessaging();
        getToken(messaging, {
          vapidKey: process.env.VAPIDKEY,
        }).then((currentToken) => {
          if (currentToken) {
            const deviceId = Math.floor(new Date().getTime());
            let device = "";
            if (this.getCookie("deviceId")) {
              device = this.getCookie("deviceId");
            } else {
              this.setCookie("deviceId", deviceId, 365);
              device = this.getCookie("deviceId");
            }
            this.requestAxiosPut({
              app: process.env.FULFILMENT_SERVER,
              endpoint: `seller/${this.getStorageUserDetails.business_id}/user/fcm`,
              values: {
                token: currentToken,
                device_id: device,
                user_id: this.getUserDetails.user_id,
              },
            });
          }
        });
        onMessage(messaging, (payload) => {
          this.listNotifications(payload);
          this.fetchTrackingOrder();
          this.fetchTrackingSummary();
        });
      } catch (error) {
        // ...
      }
    },
    listNotifications() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/notifications`,
      }).then((response) => {
        if (response.status === 200) {
          this.setNotifications(response.data.data.notifications);
        }
      });
    },
    fetchTrackingOrder() {
      if (
        this.$route.path.includes("track-direct-deliveries") ||
        this.$route.path.includes("tracking")
      ) {
        this.requestAxiosGet({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/${
            this.$route.path.includes("track-direct-deliveries")
              ? "point-to-point"
              : this.getParent === "sendy"
              ? "consignments"
              : "deliveries"
          }/${this.$route.params.order_id}`,
        }).then((response) => {
          if (response.status === 200) {
            this.setDirectDeliveriesTrackingData(response?.data?.data);
          }
        });
      }
    },
    fetchTrackingSummary() {
      if (
        this.$route.path.includes("track-direct-deliveries") ||
        this.$route.path.includes("tracking")
      ) {
        this.requestAxiosGet({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/tracking/summary/${this.$route.params.order_id}`,
        }).then((response) => {
          if (response.status === 200) {
            this.setOrderTimelines(response.data.data.events);
          }
        });
      }
    },
    getOnboardingStatus() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/onboarding/achievements`,
      }).then((response) => {
        response.data.data.achievements.account_created = true;
        this.setAchievements(response.data.data.achievements);
      });
    },
    setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie(cname) {
      let name = cname + "=";
      let ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    setVirtualTourCookie() {
      let initialVal = true;
      if (this.getCookie("new_features_virtual_tour")) {
        initialVal = this.getCookie("new_features_virtual_tour");
      } else {
        this.setCookie("new_features_virtual_tour", initialVal, 365);
      }
    },
  },
};
</script>

<style>
#app {
  font-family: "DM Sans";
  zoom: 100%;
}
.v-btn--variant-contained {
  box-shadow: 0px 0px 2px 0px rgb(0 0 0 / 20%),
    0px 0px 10px 0px rgb(0 0 0 / 14%), 0px 0px 10px 0px rgb(0 0 0 / 12%) !important;
}
.v-list {
  font-family: "DM sans";
  box-shadow: 0px 0px 2px 0px rgb(0 0 0 / 20%),
    0px 0px 10px 0px rgb(0 0 0 / 14%), 0px 0px 10px 0px rgb(0 0 0 / 12%);
}
.v-list-item-title {
  font-size: 14px !important;
  cursor: pointer;
}
.v-main__wrap {
  background: #fcfdff;
}
.container-border {
  border: 1px solid #e2e7ed;
  margin-left: 30px;
  margin-right: 40px;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px 0px;
  background: white;
}
.pac-container {
  z-index: 10000 !important;
}
.el-select-dropdown__item {
  display: flex;
  align-items: center;
  height: 60px !important;
}
.el-select-dropdown__item.selected {
  color: #324ba8 !important;
}
.el-input__inner {
  color: black !important;
}
.el-loading-spinner {
  top: 10% !important;
  width: 30px !important;
  text-align: center;
  position: relative !important;
  margin: auto !important;
}
.v-text-field__prefix {
  margin-left: 15px;
}
.el-date-editor .el-range__close-icon {
  height: 1rem !important;
  width: 1rem !important;
}
.v-field__append-inner {
  padding-top: 5px !important;
}
</style>
