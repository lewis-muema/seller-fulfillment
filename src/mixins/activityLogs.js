import { mapGetters } from "vuex";

const mappedActivityLogs = {
  computed: {
    ...mapGetters(["getActivityLogs"]),
  },
  methods: {
    showActivityLogs(name, activity) {
      let {
        previous,
        current,
        productName,
        type,
        customerName,
        to,
        toCustomer,
        username,
      } = "";
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
      if (
        ["userCreated", "userActivated", "userDeactivated"].includes(
          this.getActivityLogs[newName].split(".")[1]
        )
      ) {
        username = activity.resource_short_description;
      }
      if (
        ["orderCreated", "orderCanceled", "orderRescheduled"].includes(
          this.getActivityLogs[newName].split(".")[1]
        )
      ) {
        type = activity.resource_type;
        if (type === "DELIVERY_ORDER") {
          to = this.$t("settings.to");
          customerName = activity.resource_short_description;
          toCustomer = " " + to + " " + customerName;
        }
        type = activity.resource_type.replace("_", " ").toLowerCase();
      }
      return this.$t(this.getActivityLogs[newName], {
        previous: previous,
        current: current,
        name: productName,
        type: type,
        customerName: toCustomer,
        username: username,
      });
    },
  },
};

export default mappedActivityLogs;
