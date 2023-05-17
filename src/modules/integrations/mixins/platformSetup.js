export default {
  inject: ["nextStep", "lastStep", "backToIntegrations"],
  methods: {
    next(params = null) {
      if (params) {
        this.nextStep(params);
      } else {
        this.nextStep();
      }
    },
    back(params = null) {
      if (params) {
        this.lastStep(params);
      } else {
        this.lastStep();
      }
    },
    backToIntegrationsPage() {
      this.backToIntegrations();
    },
  },
};
