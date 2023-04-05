<template>
  <v-row class="integration-content">
    <v-col cols="5" class="integration-content__columns"
      ><span
        class="integration-content__title"
        :data-test="`integration-${integration.channelId}`"
        >{{ integration.name }}</span
      ></v-col
    >
    <v-col cols="4" class="integration-content__columns"
      ><span class="integration-content__added-by"
        >{{ $t("merchant.added") }} {{ integration.addedBy ? `By ${integration.addedBy}.` : '' }}
        {{ ` ${integration.dateAdded}` }}
      </span>
    </v-col>
    <v-col cols="3" class="integration-content__columns">
      <span
        class="integration-content__columns--remove-btn"
        @click="$emit('revokeSalesChannel', integration)"
      >
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/remove-store.svg"
        /><a
          href="#"
          class="integration-content__text--remove"
          :data-test="`remove-channel-${integration.channelId}`"
          >{{ $t("merchant.remove") }}</a
        >
      </span>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "IntegrationContainer",
  props: {
    integration: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.integration-content {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin: 16px 0;
  align-items: baseline;

  &__title {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.005em;
    color: #303133;
  }

  &__columns {
    display: flex;
    overflow: scroll;
  }

  &__added-by {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    /* identical to box height, or 143% */
    letter-spacing: 0.005em;
    /* Neutral - Grays/gray80 */
    color: #606266;
  }
}
</style>
