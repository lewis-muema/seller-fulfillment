<template>
  <headerComponent />
  <div class="container">
    <div class="congratulations-container">
      <div class="congratulations-container__logo">
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/successful-store.svg"
          class="congratulations-container__image"
        />
      </div>
      <div
        class="congratulations-container__heading"
        data-test="congratulations"
      >
        {{ $t("merchant.congratulations") }}
      </div>
      <div class="congratulations-container__text">
        {{ $t("merchant.your_store") }} {{ storeName }}
        {{ $t("merchant.is_now_integrated_with_sendy") }}
      </div>
      <div class="congratulations-container__bottom">
        <v-btn
          class="congratulations-container__btn"
          @click="closePage"
          data-test="close-thank-you"
          >{{ $t("merchant.close") }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import headerComponent from "./header.vue";
import eventsMixin from "@/mixins/events_mixin";
import { inject } from "vue";

export default {
  name: "ThankYou",
  mixins: [eventsMixin],
  components: {
    headerComponent,
  },
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
  props: {
    storeName: {
      type: String,
      default: "",
      required: true,
    },
  },
  methods: {
    closePage() {
      this.$router.push({ path: "/settings/integrations" });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100svmax;
  align-items: baseline;
  text-align: -webkit-center;
}
.congratulations-container {
  width: 512px;
  text-align: center;
  padding-top: 82px;

  &__logo {
    text-align: left;
    margin-bottom: 29px;
  }

  &__heading {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 36px;
    letter-spacing: -0.01em;
    color: #303133;
    margin-bottom: 8px;
  }

  &__text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #606266;
    margin-bottom: 28px;
  }

  &__bottom {
    text-align: right;
  }

  &__btn {
    justify-content: center;
    align-items: center;
    padding: 12px 24px !important;
    width: 96px;
    height: 46px;
    background: #324ba8;
    border-radius: 6px;
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #ffffff;
  }
}
</style>
