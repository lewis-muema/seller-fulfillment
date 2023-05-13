<template>
  <div>
    <router-view />
  </div>
</template>
<script>
import useIntegrations from "@/modules/integrations/composibles/useIntegrations";
import { onMounted } from "vue";

export default {
  name: "Step4",
  setup() {
    const { fetchIntegrations } = useIntegrations();

    onMounted(async () => {
      await fetchIntegrations();
    });
  },
};
</script>

<style lang="scss">
.container {
  height: 100svmax;
  align-items: baseline;
  text-align: center;
  display: flex;
  justify-content: center;
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
    font-size: 22px;
    line-height: 24px;
    letter-spacing: -0.005em;
    color: #303133;
    text-align: left;
  }

  &__text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    text-align: left;
    color: #606266;
    margin-bottom: 28px;
  }

  &__bottom {
    text-align: right;
  }

  &__btn {
    height: 46px !important;
    background: #324ba8;
    border-radius: 6px;
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #ffffff !important;
  }

  &__image {
    &--checklist {
      height: 20px;
      width: 20px;
    }
  }
}
.hr-line {
  margin: 28px 0 !important;
}
</style>
