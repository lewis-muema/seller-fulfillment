const statusMixin = {
  methods: {
    getStatus(index) {
      const statuses = [];
      this.$store.getters.getOrderStatuses.forEach((row, i) => {
        if (index.includes(i)) {
          statuses.push(row);
        }
      });
      return statuses;
    },
  },
};
export default statusMixin;
