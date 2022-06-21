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
    $route(to) {
      if (to.path === "/") {
        this.firebase();
      }
    },
  },
  computed: {
    ...mapGetters(["getUserDetails"]),
  },
  created() {},
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
      const userDetails = JSON.parse(localStorage.userDetails).data;
      try {
        const messaging = getMessaging();
        getToken(messaging, {
          vapidKey: process.env.VAPIDKEY,
        }).then((currentToken) => {
          if (currentToken) {
            if ("serviceWorker" in navigator) {
              window.addEventListener("load", () => {
                navigator.serviceWorker.register("/firebase-messaging-sw.js");
              });
            }
            const deviceId = Math.floor(new Date().getTime());
            localStorage.deviceId = localStorage.deviceId
              ? localStorage.deviceId
              : deviceId;
            this.$store.dispatch("requestAxiosPut", {
              app: process.env.FULFILMENT_SERVER,
              endpoint: `seller/${userDetails.business_id}/user/fcm`,
              values: {
                token: currentToken,
                device_id: localStorage.deviceId,
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
input {
  border: 0px !important;
}
</style>
