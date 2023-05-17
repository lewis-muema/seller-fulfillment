<template>
  <div class="container">
    <div class="congratulations-container">
      <div class="congratulations-container__logo">
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/connection-success.svg"
        />
      </div>
      <div
        class="congratulations-container__heading"
        data-test="congratulations"
      >
        {{ $t("merchant.store_now_connected") }}
      </div>
      <div class="congratulations-container__text">
        {{ $t("merchant.connected_your_store_to_sendy") }}
      </div>
      <div class="congratulations-container__text">
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/successful-store.svg"
          class="congratulations-container__image--checklist"
        />
        {{ $t("merchant.correct_store_details_provided") }}
      </div>
      <div class="congratulations-container__text">
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/successful-store.svg"
          class="congratulations-container__image--checklist"
        />
        {{ $t("merchant.webhooks_and_order_updates_created_successfully") }}
      </div>
      <hr class="hr-line" />
      <div class="congratulations-container__bottom">
        <v-btn
          class="congratulations-container__btn"
          @click="goToStepFive()"
          data-test="import-products"
          >{{ $t("merchant.import_your_products") }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import eventsMixin from "@/mixins/events_mixin";
import { inject } from "vue";
import platformSetupMixin from "@/modules/integrations/mixins/platformSetup";

export default {
  name: "ConnectionError",
  mixins: [eventsMixin, platformSetupMixin],
  mounted() {
    this.sendSegmentEvents({
      event: "[merchant] Store integration success page",
      data: {
        userId: this.getUserDetails.user_id,
      },
    });
  },
  data() {
    return {
      getUserDetails: inject("getUserDetails"),
    };
  },
  methods: {
    goToStepFive() {
      this.$router.push({ name: "SetupStep5" });
    },
    closePage() {
      this.$router.push({ path: "/settings/integrations" });
    },
  },
};
</script>
