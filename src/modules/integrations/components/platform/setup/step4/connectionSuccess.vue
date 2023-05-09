<template>
  <div class="container">
    <div class="congratulations-container">
      <div class="congratulations-container__logo">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 0C8.96 0 0 8.96 0 20C0 31.04 8.96 40 20 40C31.04 40 40 31.04 40 20C40 8.96 31.04 0 20 0ZM14.58 28.58L7.4 21.4C7.21484 21.2148 7.06796 20.995 6.96775 20.7531C6.86754 20.5112 6.81596 20.2519 6.81596 19.99C6.81596 19.7281 6.86754 19.4688 6.96775 19.2269C7.06796 18.985 7.21484 18.7652 7.4 18.58C7.58516 18.3948 7.80499 18.248 8.04691 18.1477C8.28884 18.0475 8.54814 17.996 8.81 17.996C9.07186 17.996 9.33116 18.0475 9.57309 18.1477C9.81501 18.248 10.0348 18.3948 10.22 18.58L16 24.34L29.76 10.58C30.134 10.206 30.6411 9.99596 31.17 9.99596C31.6989 9.99596 32.206 10.206 32.58 10.58C32.954 10.954 33.164 11.4611 33.164 11.99C33.164 12.5189 32.954 13.026 32.58 13.4L17.4 28.58C17.215 28.7654 16.9952 28.9125 16.7532 29.0129C16.5113 29.1132 16.2519 29.1649 15.99 29.1649C15.7281 29.1649 15.4687 29.1132 15.2268 29.0129C14.9848 28.9125 14.765 28.7654 14.58 28.58Z"
            fill="#20BE47"
          />
        </svg>
      </div>
      <div
        class="congratulations-container__heading"
        data-test="congratulations"
      >
        Your store is now connected
      </div>
      <div class="congratulations-container__text">
        We have connected your store to Sendy
      </div>
      <div class="congratulations-container__text">
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/successful-store.svg"
          class="congratulations-container__image--checklist"
        />
        Correct store details were provided
      </div>
      <div class="congratulations-container__text">
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/successful-store.svg"
          class="congratulations-container__image--checklist"
        />
        Webhooks to support product and order updates were created successfully
      </div>
      <hr class="hr-line" />
      <div class="congratulations-container__bottom">
        <v-btn
          class="congratulations-container__btn"
          @click="next()"
          data-test="import-products"
          >Import your products</v-btn
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
  name: "ThankYou",
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
    closePage() {
      this.$router.push({ path: "/settings/integrations" });
    },
  },
};
</script>
