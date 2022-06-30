import { mapGetters } from "vuex";
import moment from "moment";

const eventLabels = {
  computed: {
    ...mapGetters(["getEventLabels"]),
  },
  methods: {
    showEventLabels(event, item) {
      let date = "";
      if (
        ["orderPlaced", "orderPlacedOn"].includes(
          this.getEventLabels[event].split(".")[1]
        )
      ) {
        date = moment(item.created_date).format("D/MM/YYYY");
      } else if (
        [
          "rescheduledByBuyer",
          "rescheduledBySeller",
          "rescheduledBySendy",
          "youHaveRescheduledThisOrder",
          "youHaveRescheduledThisOrder",
          "sendyHasRescheduledThisOrder",
          "youRescheduledThisOrderFor",
          "sendyRescheduledThisOrderFor",
          "theCustomerRescheduledThisOrderFor",
        ].includes(this.getEventLabels[event].split(".")[1])
      ) {
        date = moment(item.scheduled_date).format("D/MM/YYYY");
      } else if (
        ["deliveryCompletedDate"].includes(
          this.getEventLabels[event].split(".")[1]
        )
      ) {
        date = moment(item.completed_date).format("D/MM/YYYY");
      } else {
        date = moment(item.updated_date).format("D/MM/YYYY");
      }
      if (item.event_date) {
        date = moment(item.event_date).format("D/MM/YYYY");
      }
      return this.$t(this.getEventLabels[event], { Date: date });
    },
  },
};
export default eventLabels;
