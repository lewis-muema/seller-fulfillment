<template>
  <div class="import-container">
    <div class="import-container__section">
      <img
        class="import-container__image"
        src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/loading.gif"
      />
    </div>
    <div class="import-container__title import-container__section">
      {{ $t("merchant.importing_your_products") }}...
    </div>
    <div class="import-container__text import-container__section">
      {{ $t("merchant.importing_products_msg") }}.
    </div>
    <div class="import-container__text import-container__section">
      {{ $t("merchant.we_will_notify_you_msg") }}.
    </div>
    <div class="import-container__bottom">
      <button
        class="import-container__button"
        @click="backToIntegrationsPage()"
      >
        {{ $t("merchant.close_window") }}
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import useProducts from "@/modules/integrations/composibles/useProducts";
import platformSetupMixin from "@/modules/integrations/mixins/platformSetup";

export default {
  mixins: [platformSetupMixin],
  setup() {
    const { finishSync } = useProducts();
    onMounted(async () => {
      await finishSync();
    });
  },
};
</script>

<style lang="scss" scoped>
.import-container {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 24px;
  gap: 16px;
  width: 512px;
  background: #ffffff;
  border-radius: 6px;
  flex: none;
  order: 1;
  flex-grow: 0;

  &__image {
    height: 48px;
    width: 48px;
  }

  &__title {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 24px;
    letter-spacing: -0&__005em;
    color: #303133;
  }

  &__text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #606266;
  }

  &__button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px 24px;
    gap: 10px;
    width: 156px;
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

  &__section {
    margin-bottom: 24px;
  }

  &__bottom {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
