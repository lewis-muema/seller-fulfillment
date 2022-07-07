const industryList = {
  methods: {
    async industryList() {
      const fullPayload = {
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.businessId}/industries`,
      };
      const data = await this.industries(fullPayload);
      if (data.errors.length === 0) {
        return data;
      }
    },
  },
};
export default industryList;
