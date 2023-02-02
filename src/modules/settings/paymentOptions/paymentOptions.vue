<template>
  <div></div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import eventsMixin from "../../../mixins/events_mixin";

export default {
  mixins: [eventsMixin],
  mounted() {
    this.setComponent("common.paymentOptions");
    this.selectPaymentMethod();
    this.sendSegmentEvents({
      event: "Select_Payment_Methods",
      data: {
        userId: this.getStorageUserDetails.business_id,
        clientType: "web",
        device: "desktop",
      },
    });
  },
  computed: {
    ...mapGetters([
      "getBusinessDetails",
      "getUserDetails",
      "getStorageUserDetails",
    ]),
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
    selectPaymentMethod() {
      const buPayload = {
        user_id: this.getBusinessDetails.business_id,
        entity_id: 6,
        currency: this.getBusinessDetails.currency,
        country_code: this.getBusinessDetails.country_code,
        amount: "",
        success_callback_url: "",
        fail_callback_url: "",
        txref: "",
        bulk: false,
        paybill_no: "",
        email: this.getUserDetails.email,
        authToken: localStorage.accessToken,
        firstname: this.getUserDetails.first_name,
        lastname: this.getUserDetails.last_name,
        payment_options: "",
        company_code: this.getBusinessDetails.company_code,
        locale: this.getBusinessDetails.language,
      };
      this.$paymentInit(buPayload, "payment-option");
    },
  },
};
</script>

<style></style>
