<template>
  <div class="header">
    <span
      ><h5 class="header__title">
        {{ $t("merchant.connectStore") }}
      </h5>
    </span>
    <span>
      <button @click="closePage">
        <img :src="require('../../../assets/close-button.svg')" />
      </button>
    </span>
  </div>
</template>

<script>
export default {
  methods: {
    closePage() {
      this.$router.go("/settings/integrations");
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin: 16px 16px 0 16px;
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: space-between;
  align-items: center;

  &__title {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 24px;
    letter-spacing: -0.005em;
    color: #606266;
  }

  &__btn {
    background: #606266;
    height: 13px;
    width: 13px;
  }
}
</style>
