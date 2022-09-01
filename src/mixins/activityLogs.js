import { mapGetters } from "vuex";

const mappedActivityLogs = {
  computed: {
    ...mapGetters(["getActivityLogs"]),
  },
  methods: {
    showActivityLogs(name, activity) {
      let previous = "";
      let current = "";
      let productName = "";
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
          "productPriceChanged",
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
        previous = activity.before_value !== null ? activity.before_value : "";
        current = activity.after_value !== null ? activity.after_value : "";
      }
      if (
        [
          "addedNewProduct",
          "productArchived",
          "productUnarchived",
          "productPriceChanged",
        ].includes(this.getActivityLogs[newName].split(".")[1])
      ) {
        productName = activity.resource_short_description;
      }
      return this.$t(this.getActivityLogs[newName], {
        previous: previous,
        current: current,
        name: productName,
      });
    },
  },
};

export default mappedActivityLogs;
