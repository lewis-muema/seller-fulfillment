<template>
  <div class="integration">
    <v-row class="platform integration__section">
      <v-col class="platform__column-1">
        <div
          class="platform__title"
          :data-test="`integration-${integration.channelId}`"
        >
          {{ integration.name }}
        </div>
        <div class="platform__sub-text">
          {{ integration.addedBy ? `By ${integration.addedBy}.` : "" }}
          {{ ` ${integration.dateAdded}` }}
        </div>
      </v-col>
      <v-col class="platform__column-2">
        <span
          class="api__columns--remove-btn"
          @click="$emit('revokeSalesChannel', integration)"
        >
          <img
            src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/remove-store.svg"
          /><a
            href="#"
            class="platform__remove-text"
            :data-test="`remove-channel-${integration.channelId}`"
            >{{ $t("merchant.remove") }}</a
          >
        </span>
      </v-col>
    </v-row>
  </div>
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
.integration {
  &__section {
    margin-bottom: 28px;
  }
  .api {
    border: 0.5px solid #c0c4cc;
    border-radius: 6px;
    padding: 8px;
    gap: 4px;
    margin: 32px;

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
      letter-spacing: 0.005em;
      color: #606266;
    }
  }
  .platform {
    border: 0.5px solid #c0c4cc;
    border-radius: 6px;
    padding: 8px;
    gap: 4px;
    margin: 32px;

    &__column-1 {
      text-align: left;
      padding: 0;
    }

    &__column-2 {
      text-align: right;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    &__title {
      font-family: "DM Sans";
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      color: #303133;
    }

    &__sub-text {
      font-family: "DM Sans";
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.005em;
      color: #909399;
      flex: none;
      order: 1;
    }

    &__remove-text {
      font-family: "DM Sans";
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.005em;
      color: #680720;
      text-decoration: none;
      padding-left: 9px;
    }
  }
}
</style>
