import storeFields from "../constants/storeFields.json";
import { isValidUrl } from "@/utils/text-validation";
import i18n from "@/i18n";

export default class Stores {
  constructor(store, availableStores = storeFields) {
    this.store = store;
    this.storeRequiredFields = [];
    this.availableStores = availableStores;
  }

  getStoreFields() {
    const fields = JSON.parse(JSON.stringify(this.availableStores[this.store]));
    for (const field of fields.sort((a, b) => b.required - a.required)) {
      const rules = [];
      if (field.required) {
        rules.push(
          (v) =>
            !!v || `${field.fieldName} ${i18n.global.t("merchant.required")}`
        );
      }
      if (field.isUrl) {
        rules.push((v) =>
          v
            ? isValidUrl(v)
            : true || `${field.fieldName} ${i18n.global.t("merchant.validUrl")}`
        );
      }
      this.storeRequiredFields.push({
        fieldName: field.fieldName,
        value: "",
        rules,
      });
    }

    this.storeRequiredFields.sort((a, b) => {
      return b.required - a.required;
    });
  }
}
