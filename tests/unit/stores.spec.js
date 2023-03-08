import { expect } from "chai";
import Stores from "@/modules/integrations/classes/stores.js";

const sampleStore = {
  Magento: [
    {
      fieldName: "bridgeUrl",
      required: true,
      isUrl: true,
    },
    {
      fieldName: "storeKey",
      required: true,
    },
    {
      fieldName: "storeRoot",
      required: true,
    },
    {
      fieldName: "url",
      required: true,
      isUrl: true,
    },
  ],
};

const storesObject = new Stores("Magento", sampleStore);

describe("Stores class", () => {
  storesObject.getStoreFields();
  describe("should return the correct fields after initialization", () => {
    it("fieldnames", () => {
      const fieldNames = storesObject.storeRequiredFields.map(
        (x) => x.fieldName
      );

      expect(fieldNames).to.include.members([
        "bridgeUrl",
        "storeKey",
        "storeRoot",
        "url",
      ]);

      expect(fieldNames).not.to.include.members([
        "shopifyApiKey",
        "shopifyKey",
      ]);
    });

    it("rules", () => {
      storesObject.storeRequiredFields.forEach((field) => {
        if (["storeKey", "storeRoot"].includes(field.fieldName)) {
          expect(field.rules.length).to.equal(1);
        }

        if (["bridgeUrl", "url"].includes(field.fieldName)) {
          expect(field.rules.length).to.equal(2);
        }
      });
    });
  });
});
