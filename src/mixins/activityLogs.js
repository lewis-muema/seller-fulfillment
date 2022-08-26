import { mapGetters } from "vuex";

const mappedActivityLogs = {
  computed: {
    ...mapGetters(["getActivityLogs"]),
  },
  methods: {
    showActivityLogs(name, activity) {
      let previous = "";
      let current = "";
      let newName = name.split("_").join(".");
      if (!newName) {
        return;
      }
      if (this.getActivityLogs[newName] === undefined) {
        return;
      }
      if (
        [
          "productChanged",
          "productUnitChanged",
          "productImageLinkChanged",
          "orderlineItemChanged",
          "orderDestinatioHouseChanged",
          "orderDestinatioLatitudeChanged",
          "orderDestinatioLongitudeChanged",
          "orderDestinatioNameChanged",
          "orderPrimaryRecepientChanged",
          "orderPrimaryRecepientPhoneChanged",
          "orderSecondaryRecepientPhoneChanged",
          "orderInstructionsChanged",
        ].includes(this.getActivityLogs[newName].split(".")[1])
      ) {
        previous = activity.before_value;
        current = activity.after_value;
      }
      if (
        ["addedNewProduct", "productArchived", "productUnarchived"].includes(
          this.getActivityLogs[newName].split(".")[1]
        )
      ) {
        name = activity.resource_short_description;
      }
      console.log(
        "activityMixin",
        this.$t(
          this.getActivityLogs[newName],
          { name: name },
          { previous: previous },
          { current: current }
        )
      );
      return this.$t(
        this.getActivityLogs[newName],
        { Name: name },
        { previous: previous },
        { current: current }
      );
    },
  },
};

export default mappedActivityLogs;
