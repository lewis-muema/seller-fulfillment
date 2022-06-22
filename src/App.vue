<template>
  <v-app>
    <v-main>
      <Canvas />
    </v-main>
  </v-app>
</template>

<script>
import Canvas from "./components/canvas.vue";
import { mapGetters } from "vuex";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export default {
  name: "App",
  components: { Canvas },
  data: () => ({
    //
  }),
  watch: {
    $route() {
      if (!localStorage.userDetails) {
        this.$router.push("/auth/sign-in");
      }
    },
  },
  computed: {
    ...mapGetters(["getUserDetails", "getStorageUserDetails"]),
  },
  created() {
    if (!localStorage.userDetails) {
      this.$router.push("/auth/sign-in");
    }
    window.addEventListener("register-fcm", () => {
      this.firebase();
    });
  },
  methods: {
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
            this.$store.dispatch("requestAxiosPut", {
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
          console.log(payload);
        });
      } catch (error) {
        // ...
      }
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
  },
};
</script>

<style>
#app {
  font-family: "DM Sans";
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
</style>
