/* eslint-disable no-undef */
const algoliaInit = {
  methods: {
    initiateAlgolia(item, type) {
      const indexMap = {
        product: process.env.ALGOLIA_INDEX_NAME,
        delivery: process.env.ALGOLIA_INDEX_NAME_ORDERS,
        OnDemand: process.env.ALGOLIA_INDEX_ON_DEMAND_ORDERS,
      };
      const algoliasearch = require("algoliasearch");

      const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
      const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
      const ALGOLIA_INDEX_NAME = indexMap[type];

      const businessId = this.$store.getters.getStorageUserDetails.business_id;

      const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

      const index = client.initIndex(ALGOLIA_INDEX_NAME);
      index.setSettings({
        attributesForFaceting: ["filterOnly(business_id)"],
      });
      index
        .search(item, {
          filters: `business_id:${businessId}`,
        })
        .then((objects) => {
          this.algoliaResults(objects);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
export default algoliaInit;
