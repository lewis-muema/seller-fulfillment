/* eslint-disable no-undef */
const algoliaInit = {
  methods: {
    initiateAlgolia(item) {
      const algoliasearch = require("algoliasearch");

      const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
      const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
      const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

      const userDetails = JSON.parse(localStorage.userDetails).data;
      const businessId = userDetails.business_id.split("-")[2];

      const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

      const index = client.initIndex(ALGOLIA_INDEX_NAME);
      index.setSettings({
        attributesForFaceting: ["filterOnly(objectID)"],
      });
      index
        .search(item, {
          filters: `objectID:ecommerce-sample-data-${businessId}`,
        })
        .then((objects) => this.algoliaResults(objects))
        .catch();
    },
  },
};
export default algoliaInit;
