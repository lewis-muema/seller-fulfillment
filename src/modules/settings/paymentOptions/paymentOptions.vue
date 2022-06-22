<template>
  <div></div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  mounted() {
    this.setComponent(this.$t("common.paymentOptions"));
    this.selectPaymentMethod();
  },
  computed: {
    ...mapGetters(["getBusinessDetails", "getUserDetails"]),
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
        authToken: localStorage.token,
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
