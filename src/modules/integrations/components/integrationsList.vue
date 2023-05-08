<template>
  <div class="integrations-container" v-loading="loading">
    <v-card
      class="integrations-card mx-auto"
      max-width="1000 1   1§  1ES B"
      variant="outlined"
    >
      <v-card-item>
        <div class="integration-text" data-test="heading-platform">
          {{ $t("merchant.connectedStore") }}
        </div>
        <v-divider class="divider"></v-divider>
        <div
          class="integration-content integration-content__no-integration"
          v-if="!activeIntegrations.platform"
        >
          <div
            class="integration-content__no-integration--msg integration-content__no-integration--section"
            data-test="no-store-integration"
          >
            {{ $t("merchant.noStoreFound") }}
          </div>
          <div class="integration-content__no-integration--section">
            <button
              class="integration-content__no-integration--btn"
              data-test="add-platform-integration"
              @click="addPlatformDialog = true"
            >
              <img
                src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/connect-store.svg"
                class="integration-content__no-integration--btn-logo"
              />
              <span class="integration-content__no-integration--btn-txt"
                >Connect your online store</span
              >
            </button>
          </div>
          <div
            class="integration-content__no-integration--section integration-content__no-integration--learn-txt"
          >
            {{ $t("merchant.learnMoreMsg") }}
            <v-icon start icon="mdi-arrow-right" size="small"></v-icon>
          </div>
        </div>
        <integrationBlock
          :integration="integrations.platform"
          :key="integrations.platform.channelId"
          @revokeSalesChannel="revokeSalesChannel"
          v-else
        />
      </v-card-item>
      <v-card-item>
        <div class="integration-text mb-1" data-test="heading-api-keys">
          {{ $t("merchant.apiKeys") }}
        </div>
        <v-divider></v-divider>
        <div
          class="integration-content integration-content__no-integration"
          v-if="!activeIntegrations.api"
        >
          <div
            class="integration-content__no-integration--msg integration-content__no-integration--section"
            data-test="no-api-integration"
          >
            {{ $t("merchant.noApiKeys") }}
          </div>
          <div class="integration-content__no-integration--section">
            <button
              class="integration-content__no-integration--btn"
              @click="generateAPIkeyDialog = true"
              data-test="generate-api-key-btn"
            >
              <img
                src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/connect-store.svg"
                class="integration-content__no-integration--btn-logo"
              />
              <span class="integration-content__no-integration--btn-txt">{{
                $t("merchant.createApiKey")
              }}</span>
            </button>
          </div>
          <div
            class="integration-content__no-integration--section integration-content__no-integration--learn-txt"
          >
            {{ $t("merchant.learnMoreAboutFulfillment") }}
            <v-icon start icon="mdi-arrow-right" size="small"></v-icon>
          </div>
        </div>
        <integrationBlock
          :integration="integrations.apiKey"
          :key="integrations.apiKey.channelId"
          @revokeSalesChannel="revokeSalesChannel"
          v-else
        />
      </v-card-item>
    </v-card>
    <addPlatformDialog
      v-if="addPlatformDialog"
      :showDialog="addPlatformDialog"
      @clicked="onClickChild"
    />
    <addApiKeyDialog
      v-if="generateAPIkeyDialog"
      :generateAPIkeyDialog="generateAPIkeyDialog"
      @closeDialog="generateAPIkeyDialog = false"
    />
  </div>
</template>
<script>
import addPlatformDialog from "./addPlatformDialog.vue";
import { getTimeAgo } from "@/utils/time";
import { mapActions, mapGetters } from "vuex";
import addApiKeyDialog from "./api/dialog.vue";
import integrationBlock from "./shared/integration-block.vue";
import { ElNotification } from "element-plus";
import eventsMixin from "@/mixins/events_mixin";
import { provide } from "vue";

export default {
  mixins: [eventsMixin],
  components: { addPlatformDialog, addApiKeyDialog, integrationBlock },
  data: () => ({
    addPlatformDialog: false,
    apiKey: null,
    loading: false,
    generateAPIkeyDialog: false,
    integrations: {
      platform: {},
      apiKey: {},
    },
  }),
  mounted() {
    this.getMerchantIntegrations();
    this.sendSegmentEvents({
      event: "[merchant] Visited Integrations Page",
      data: {
        userId: this.getUserDetails.business_id,
      },
    });
    provide(/* key */ "getUserDetails", /* value */ this.getUserDetails);
  },
  methods: {
    ...mapActions([
      "getIntegrations",
      "revokeApiKey",
      "removePlatformIntegration",
    ]),
    onClickChild() {
      this.addPlatformDialog = false;
    },
    async getMerchantIntegrations() {
      this.loading = true;
      this.integrations.platform = {};
      this.integrations.apiKey = {};
      try {
        const payload = {
          app: process.env.FULFILMENT_API,
          endpoint: "v1/internal/users",
          params: {
            enabled: true,
          },
        };

        const { status, data } = await this.getIntegrations(payload);

        if (status === 200) {
          for (const salesChannel of data.salesChannels) {
            switch (salesChannel.channel_id) {
              // API2Cart
              case 2:
                this.integrations.platform = {
                  name: salesChannel.name,
                  dateAdded: getTimeAgo(new Date(salesChannel.created_at)),
                  channelId: salesChannel.channel_id,
                  id: salesChannel.id,
                  url: salesChannel.salesChannelProperties.url,
                  addedBy: salesChannel.salesChannelProperties.addedBy,
                };
                // fetch
                localStorage.setItem("platformSalesChannelId", salesChannel.id);
                break;
              case 3:
                // API Integration
                this.integrations.apiKey = {
                  name: salesChannel.name,
                  dateAdded: getTimeAgo(new Date(salesChannel.created_at)),
                  channelId: salesChannel.channel_id,
                  id: salesChannel.id,
                };
                break;
            }
          }
        }
      } catch (error) {
        return error;
      } finally {
        this.loading = false;
      }
    },
    revokeSalesChannel(integration) {
      const { channelId, id } = integration;
      switch (channelId) {
        case 3:
          this.removeApiKey();
          break;
        case 2:
          this.removeIntegration(id);
          break;
      }
    },
    async removeIntegration(salesChannelId) {
      this.loading = true;

      try {
        const payload = {
          app: process.env.MERCHANT_GATEWAY,
          endpoint: "api2cart/stores/opt-out",
          values: {
            salesChannelId,
          },
        };
        this.sendSegmentEvents({
          event: "[merchant] Remove platform integration",
          data: {
            userId: this.getUserDetails.business_id,
            payload,
          },
        });
        const { status } = await this.removePlatformIntegration(payload);
        if (status === 200) {
          ElNotification({
            title: "",
            message: "Successful removing integration",
            type: "success",
          });
        }
      } catch (error) {
        ElNotification({
          title: "",
          message: `Unsuccessful removing platform integration ${error}`,
          type: "error",
        });
      } finally {
        this.loading = false;
        this.getMerchantIntegrations();
      }
    },
    async removeApiKey() {
      this.loading = true;
      try {
        const payload = {
          app: process.env.FULFILMENT_API,
          endpoint: "v1/internal/api/token",
          params: {
            enabled: true,
          },
        };
        this.sendSegmentEvents({
          event: "[merchant] Remove api key",
          data: {
            userId: this.getUserDetails.user_id,
            payload,
          },
        });
        const { status } = await this.revokeApiKey(payload);
        if (status === 200) {
          ElNotification({
            title: "",
            message: "Successful removing API key",
            type: "success",
          });
        }
      } catch (error) {
        ElNotification({
          title: "",
          message: `Unsuccessful removing API Key ${error}`,
          type: "error",
        });
      } finally {
        this.loading = false;
        this.getMerchantIntegrations();
      }
    },
  },
  computed: {
    activeIntegrations() {
      return {
        platform: Object.keys(this.integrations.platform).length !== 0,
        api: Object.keys(this.integrations.apiKey).length !== 0,
      };
    },
    ...mapGetters(["getUserDetails"]),
  },
};
</script>
<style lang="scss">
.integrations-container {
  width: 85%;
  margin: 50px auto;
}
.integrations-card {
  padding: 32px !important;
  border-color: #e2e7ed;
}
.integration-card-inner {
  margin-top: 60px !important;
}
.integration-content {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin: 16px 0;
  align-items: baseline;

  &__no-integration {
    display: block !important;
    margin: 37px;

    &--section {
      margin-bottom: 8px;
    }

    &--msg {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.005em;
      color: #303133;
    }

    &--btn {
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 8px 16px 8px 18px;
      gap: 10px;
      border: 1px solid #324ba8;
      border-radius: 6px;
    }

    &--btn-logo {
      margin-right: 10px;
    }

    &--btn-txt {
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: 0.01em;
      color: #324ba8 !important;
    }

    &--learn-txt {
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: 0.01em;
      color: #606266;
    }
  }

  &__text {
    &--remove {
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.005em;
      color: #680720;
      text-decoration: none;
      margin-left: 9px;

      &:hover {
        color: #680720;
      }
    }
  }
}

.el-loading-mask {
  opacity: 90%;
  background-color: white !important;
}

.v-card-actions {
  display: block !important;
}
.integration-text {
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 24px;
  letter-spacing: -0.005em;
  color: #606266;
  margin-bottom: 13px;
}
.integration-button-dark {
  background-color: #324ba8;
  color: #ffffff !important;
}
.block-add-integration {
  text-align: right;
  margin-top: -36px;
  margin-bottom: 5px;
}

.divider {
  border: 1px solid #e2e7ed !important;
}
</style>
