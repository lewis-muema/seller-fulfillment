const industryList = {
  methods: {
    async industryList() {
      const fullPayload = {
        app: process.env.SELLER_FULFILLMENT_SERVER2,
        endpoint: `seller/${this.businessId}/industries`,
      };
      const data = await this.industries(fullPayload);
      console.log(data);
      if (data.errors.length === 0) {
        return data;
      }
    },
  },
};
export default industryList;
