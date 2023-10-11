import { mapGetters, mapMutations, mapActions } from "vuex";

const mqttClient = {
  computed: {
    ...mapGetters(["getRiders", "getDirectDeliveriesTrackingData"]),
  },
  methods: {
    ...mapMutations(["setRiders"]),
    ...mapActions(["requestAxiosPost", "requestAxiosGet"]),
    initiateMQTT() {
      const script = document.createElement("script");
      script.onload = () => {
        const trackingNo = "358496525477244723017872";
        const cityCode = 1;
        const uri = `${cityCode}/${trackingNo}`;
        const clientId = `mqttjs_wtp_${Math.random()
          .toString(16)
          .substr(2, 8)}_${new Date().getTime()}`;
        const host = "mqtt://mqtttest.sendyit.com:443";
        const options = {
          keepalive: 10,
          clientId,
          protocolId: "MQTT",
          protocolVersion: 4,
          clean: true,
          reconnectPeriod: 1000,
          connectTimeout: 30 * 1000,
          will: {
            topic: "WillMsg",
            payload: "Connection Closed abnormally..!",
            qos: 0,
            retain: false,
          },
          username: "",
          password: "",
          rejectUnauthorized: false,
        };
        // eslint-disable-next-line no-undef
        const client = mqtt.connect(host, options);

        client.on("error", () => {
          console.log(`${clientId} closed`);
          // handle error
          client.end();
        });

        client.on("connect", () => {
          console.log("connected to mqtt");
        });

        client.subscribe(`partner_app_positions/${uri}`, {
          qos: 0,
        });

        client.on("message", (topic, message) => {
          console.log(message);
          console.log(topic);
        });

        client.on("close", () => {
          console.log(`${clientId} disconnected`);
          // closed
        });
      };
      script.src = "https://unpkg.com/mqtt@4.0.1/dist/mqtt.js";
      document.head.appendChild(script);
    },
    getPartnersLastPosition() {
      const payload = {
        rider_id: [
          parseInt(
            this.getDirectDeliveriesTrackingData?.order?.assigned_shipping_agent
              ?.agent_id
          ),
        ],
      };
      if (
        !["ORDER_CANCELED", "ORDER_COMPLETED"].includes(
          this.getDirectDeliveriesTrackingData?.order?.order_status
        )
      ) {
        this.requestAxiosPost({
          app: process.env.AUTH,
          endpoint: `positions/partner_cached_position`,
          values: payload,
        }).then((response) => {
          const riders = [];
          response?.data?.partnerArray.forEach((rider) => {
            riders.push({
              name: "rider",
              position: {
                lat: rider.lat,
                lng: rider.lng,
              },
              location: "",
              icon: {
                url: this.getDirectDeliveriesTrackingData?.order
                  ?.assigned_shipping_agent?.vehicle_type_image_url,
                scaledSize: { width: 50, height: 50 },
              },
            });
            this.setRiders(riders);
          });
        });
      } else {
        this.setRiders([]);
      }
    },
  },
};
export default mqttClient;
