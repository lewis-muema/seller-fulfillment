import storeFields from "../constants/storeFields.json";
import { isValidUrl } from "@/utils/text-validation";
import i18n from "@/i18n";

export default class Stores {
  constructor(store) {
    this.store = store;
    this.storeRequiredFields = [];
  }

  getStoreFields() {
    const fields = JSON.parse(JSON.stringify(storeFields[this.store]));
    for (const field of fields) {
      const rules = [];
      if (field.required) {
        rules.push(
          (v) =>
            !!v || `${field.fieldName} ${i18n.global.t("merchant.required")}`
        );
      }
      if (field.isUrl) {
        rules.push(
          (v) =>
            isValidUrl(v) ||
            `${field.fieldName} ${i18n.global.t("merchant.validUrl")}`
        );
      }
      this.storeRequiredFields.push({
        fieldName: field.fieldName,
        value: "",
        rules,
      });
    }
  }
}
