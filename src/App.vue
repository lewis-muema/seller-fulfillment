<template>
  <v-app>
    <v-main>
      <Canvas />
    </v-main>
  </v-app>
</template>

<script>
import Canvas from "./components/canvas.vue";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export default {
  name: "App",
  components: { Canvas },
  data: () => ({
    //
  }),
  created() {
    window.addEventListener("register-fcm", () => {
      try {
        const messaging = getMessaging();
        getToken(messaging, {
          vapidKey: process.env.VAPIDKEY,
        }).then((currentToken) => {
          if (currentToken) {
            // ...
            const deviceId = Math.floor(new Date().getTime());
            localStorage.deviceId = localStorage.deviceId
              ? localStorage.deviceId
              : deviceId;
            this.$store.dispatch("requestAxiosPut", {
              app: process.env.FULFILMENT_SERVER,
              endpoint: `buyer/orders/${this.$store.getters.getData.data.order_id}/fcm`,
              values: {
                token: currentToken,
                device_id: localStorage.deviceId,
              },
            });
          }
        });
        onMessage(messaging, (payload) => {
          this.sendSegmentEvents({
            event: "Trigger for User",
            data: {
              userId: this.$store.getters.getData.data.destination.name,
              // eslint-disable-next-line max-len
              trigger: payload.notification.body,
            },
          });
          this.$store
            .dispatch("requestAxiosGet", {
              app: process.env.FULFILMENT_SERVER,
              endpoint: `buyer/orders/${this.$route.params.deliveryId}`,
            })
            .then((response) => {
              this.$store.commit("setData", response.data);
              this.$store.commit(
                "setDeliveryStatus",
                response.data.data.order_event_status
              );
            });
        });
      } catch (error) {
        // ...
      }
    });
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
</style>
