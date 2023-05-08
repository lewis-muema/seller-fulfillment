export default {
  inject: ["nextStep", "lastStep", "backToIntegrations"],
  methods: {
    next() {
      this.nextStep();
    },
    back() {
      this.lastStep();
    },
    backToIntegrationsPage() {
      this.backToIntegrations();
    },
  },
};
