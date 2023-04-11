<template>
  <div class="integrations-container">
    <v-card
      class="integrations-card mx-auto"
      max-width="1000 1   1§  1ES B"
      variant="outlined"
    >
      <v-card-item v-loading="storesLoading">
        <div class="integration-text">{{ $t("merchant.connectedStore") }}</div>
        <v-divider class="divider"></v-divider>
        <div
          class="integration-content integration-content__no-integration"
          v-if="!hasConnectedStore"
        >
          <div
            class="integration-content__no-integration--msg integration-content__no-integration--section"
          >
            {{ $t("merchant.noStoreFound") }}
          </div>
          <div class="integration-content__no-integration--section">
            <button
              class="integration-content__no-integration--btn"
              @click="addStoreDialog = true"
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
        <div class="integration-content" v-else>
          <span
            class="integration-content__columns integration-content__title"
            >{{ connectedStore.name }}</span
          >
          <span
            class="integration-content__columns integration-content__added-by"
            >{{ $t("merchant.added") }}
            <!-- <span v-if="userDetails">{{
              `By ${userDetails.first_name} ${userDetails.last_name.charAt(0)}.`
            }}</span> -->
            {{ ` ${connectedStore.dateAdded}` }}</span
          >
          <span class="integration-content__columns--remove-btn"
            ><img
              src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/remove-store.svg"
            /><a href="#" class="integration-content__text--remove">{{
              $t("merchant.remove")
            }}</a></span
          >
        </div>
      </v-card-item>
      <!-- <v-card-item>
        <div class="integration-card-inner">
          <div class="integration-text mb-1">API Keys</div>
          <v-divider></v-divider>
          <div class="integration-content">
            <div class="text-caption">No API Keys found</div>
            <v-card-actions>
              <v-btn
                prepend-icon="mdi-plus"
                class="integration-button"
                variant="outlined"
              >
                Create new API Key
              </v-btn>
            </v-card-actions>
            <div class="text-caption">
              Learn more about Sendy Fulfillment API
              <v-icon start icon="mdi-arrow-right" size="small"></v-icon>
            </div>
          </div>
        </div>
      </v-card-item> -->
    </v-card>
    <addStore
      v-if="addStoreDialog"
      :showDialog="addStoreDialog"
      @clicked="onClickChild"
    />
  </div>
</template>
<script>
import addStore from "./addStore.vue";
import { getTimeAgo } from "@/utils/time";
import { mapActions } from "vuex";

export default {
  components: { addStore },
  data: () => ({
    addStoreDialog: false,
    connectedStore: {},
    storesLoading: false,
  }),
  mounted() {
    this.fetchConnectedStores();
  },
  methods: {
    ...mapActions(["getStoreIntegrations"]),
    onClickChild() {
      this.addStoreDialog = false;
    },
    async fetchConnectedStores() {
      this.storesLoading = true;
      try {
        const payload = {
          app: process.env.FULFILMENT_API,
          endpoint: "v1/internal/users",
          params: {
            channel_id: "2",
          },
        };

        const { status, data } = await this.getStoreIntegrations(payload);
        if (status === 200) {
          const { name, created_at } = data.salesChannels.find(
            (x) => x.channel_id === 2
          );

          this.connectedStore = {
            name,
            dateAdded: getTimeAgo(new Date(created_at)),
          };
        }
      } catch (error) {
        return error;
      } finally {
        this.storesLoading = false;
      }
    },
  },
  computed: {
    hasConnectedStore() {
      return Object.keys(this.connectedStore).length !== 0;
    },
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

  &__title {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    /* identical to box height, or 143% */
    letter-spacing: 0.005em;
    /* Neutral - Grays/gray90 */
    color: #303133;
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

  &__columns {
    display: flex;

    &--remove-btn {
      visibility: hidden;
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
