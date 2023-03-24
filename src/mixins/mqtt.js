import { mapGetters, mapMutations, mapActions } from "vuex";

const mqttClient = {
  computed: {
    ...mapGetters([]),
  },
  methods: {
    ...mapMutations([]),
    ...mapActions(["requestAxiosPost"]),
    initiateMQTT() {
      const script = document.createElement("script");
      script.onload = () => {
        const trackingNo = "357498525477244728531417";
        const cityCode = 1;
        const uri = `${cityCode}/${trackingNo}`;
        const clientId = `mqttjs_wtp_${Math.random()
          .toString(16)
          .substr(2, 8)}_${Math.random()}_${new Date().getTime()}`;
        const host = "mqtt://chat.sendyit.com:443";
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
          username: "sendy",
          password: "93a3a43dbac9ddd362702fb525b42a2d",
          rejectUnauthorized: false,
        };
        // eslint-disable-next-line no-undef
        const client = mqtt.connect(host, options);

        client.on("error", () => {
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
      const payload = { rider_id: [6218] };
      this.requestAxiosPost({
        app: process.env.AUTH,
        endpoint: `positions/partner_cached_position`,
        values: payload,
      }).then((response) => {
        console.log(response);
      });
    },
  },
};
export default mqttClient;
