<template>
  <div class="container">
    <div class="congratulations-container">
      <div class="congratulations-container__logo">
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/connection-error-warning.svg"
        />
      </div>
      <div
        class="congratulations-container__heading congratulations-container__section"
        data-test="congratulations"
      >
        {{ $t("merchant.we_could_not_fully_connect_to_your_store") }}
      </div>
      <div class="congratulations-container__text" v-if="message">
        {{ message }}
      </div>
      <div class="congratulations-container__text">
        {{ $t("merchant.we") }} {{ message ? "also" : "" }}
        {{ $t("merchant.require_you_to_enable_some_store_permissions_msg") }}
      </div>
      <div class="congratulations-container__help-section">
        <span class="congratulations-container__help-section-text">{{
          $t("merchant.learn_about_woocommerce_store_permissions")
        }}</span>
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/go-to-documentation.svg"
        />
      </div>
      <hr class="hr-line" />
      <div class="congratulations-container__bottom">
        <button
          class="congratulations-container__btn"
          data-test="import-products"
        >
          <img
            src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/check-permissions.svg"
          />
          {{ $t("merchant.check_permissions") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConnectionError",
  props: {
    message: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.congratulations-container {
  &__section {
    margin-bottom: 24px;
  }

  &__help-section {
    display: flex;
  }

  &__bottom {
    text-align: right !important;
  }

  &__help-section-text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    color: #324ba8;
    margin-right: 11px;
  }

  &__btn {
    display: flex;
    align-items: center;
    flex-direction: row;
  }
}
</style>
