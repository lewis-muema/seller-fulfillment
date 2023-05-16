const eventsMixin = {
  methods: {
    sendSegmentEvents(payload) {
      if (process.env.NODE_ENV === "production") {
        // eslint-disable-next-line no-undef
        analytics.track(payload.event, payload.data);
        window.gtag("event", payload.event, payload.data);
      }
    },
  },
};
export default eventsMixin;
