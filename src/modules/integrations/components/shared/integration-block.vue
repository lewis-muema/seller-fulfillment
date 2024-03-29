<template>
  <div class="integration">
    <div class="platform">
      <v-row class="integration__section">
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
      <div v-if="showSteps && salesChannelId === 2" class="platform-steps">
        <v-row
          v-for="(status, index) in statuses"
          :key="index"
          class="platform-steps__section"
        >
          <v-col cols="1" class="platform-steps__icon-box">
            <img
              v-if="currentStep < index"
              src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/grey-tick.svg"
            />
            <img
              v-if="currentStep >= index"
              src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/green-tick.svg"
            />
          </v-col>
          <v-col cols="auto" class="align-left"
            ><div
              class="platform-steps__msg-txt"
              :class="
                currentStep >= +index ? 'platform-steps__msg-txt--complete' : ''
              "
            >
              {{ status.message }}
            </div>
            <span
              v-if="status.subText && currentStep === index - 1"
              class="platform-steps__sub-txt"
            >
              {{ status.subText }}
            </span>
          </v-col>
          <v-col class="align-right">
            <div v-if="currentStep < index">
              <v-btn
                v-if="status.hasAction && currentStep + 1 === index"
                @click="status.action()"
                class="platform-steps__button"
                :loading="loading"
              >
                {{ status.actionButtonText }}
              </v-btn>
              <span v-else class="platform-steps__status">{{
                $t("merchant.Pending")
              }}</span>
            </div>
            <span v-else class="platform-steps__status">{{
              $t("merchant.Complete")
            }}</span>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import useIntegrations from "@/modules/integrations/composibles/useIntegrations.js";

export default {
  name: "IntegrationContainer",
  props: {
    integration: {
      type: Object,
      default: () => {},
      require: true,
    },
    salesChannelId: {
      type: Number,
      default: 3,
    },
  },
  setup(props) {
    const router = useRouter();
    const availableIntegration = ref(
      Object.keys(props.integration).length !== 0
    );

    const { retryCreatingWebhooks, webhooksRetryLoading } = useIntegrations();

    // button warning sign url: https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/warning-sign.svg

    const statuses = reactive([
      {
        message: "Enter your store details",
        status: "STORE_DETAILS_ADDED",
        hasAction: false,
      },
      {
        message: "Store Permissions",
        status: "STORE_PERMISSIONS_VALIDATED",
        hasAction: true,
        actionButtonText: "Retry Permissions",
        action: function () {
          return retryCreatingWebhooks();
        },
        loading: webhooksRetryLoading,
        subText:
          "We require you to enable some store permissions on your store admin dashboard",
      },
      {
        message: "Import your products",
        status: "PRODUCTS_SYNC_INITIATED",
        hasAction: true,
        action: function () {
          return router.push({ name: "SetupStep6" });
        },
        actionButtonText: "Import",
        loading: false,
      },
      {
        message: "Currently Syncing products",
        status: "PRODUCTS_SYNCED",
        hasAction: false,
      },
    ]);

    const currentStep = computed(() =>
      statuses.findIndex(
        (x) => x.status === props.integration.integration_status
      )
    );

    const currentStatus = computed(() => props.integration.integration_status);

    const showSteps = computed(() => availableIntegration.value);

    return {
      webhooksRetryLoading,
      showSteps,
      currentStatus,
      currentStep,
      availableIntegration,
      statuses,
    };
  },
};
</script>

<style lang="scss" scoped>
.integration {
  &__section {
    margin-bottom: 28px;
    margin: 0;
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

  .platform-steps {
    .v-row {
      color: #909399;
    }
    .v-col {
      padding: 0;
    }
    &__section {
      margin: 4px 0;
    }
    &__status {
      font-family: "DM Sans";
      font-style: italic;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      text-align: right;
      letter-spacing: 0.005em;
    }
    &__msg-txt {
      font-family: "DM Sans";
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;

      &--complete {
        text-decoration: line-through;
      }
    }

    &__sub-txt {
      font-family: "DM Sans";
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: 0.01em;
      color: #9b101c;
    }

    &__button {
      font-family: "DM Sans";
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: 0.01em;
      color: #ffffff;
      background: #324ba8;
      border-radius: 6px;
      text-transform: none;
    }

    // &__icon-box {
    //   display: contents;
    //   margin-right: 8px;
    // }
  }
}

.align-right {
  text-align: right;
}

.align-left {
  text-align: left;
}
</style>
