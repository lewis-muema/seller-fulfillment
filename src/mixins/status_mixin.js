import { mapGetters } from "vuex";

const statusMixin = {
  computed: {
    ...mapGetters(["getOrderStatuses"]),
  },
  methods: {
    getStatus(index) {
      const statuses = [];
      this.getOrderStatuses.forEach((row, i) => {
        if (index.includes(i)) {
          statuses.push(row);
        }
      });
      return statuses;
    },
  },
};
export default statusMixin;
