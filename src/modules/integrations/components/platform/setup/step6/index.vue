<template>
  <div class="step-5-dialog">
    <div class="step-5-dialog__card">
      <div class="top-action-bar">
        <v-btn class="back-btn" dark @click="back()">
          <v-icon large dark left> mdi-arrow-left </v-icon>
        </v-btn>
      </div>
      <v-card-title class="step-5-dialog__title">
        {{ $t("merchant.ready_to_import") }}
      </v-card-title>
      <div v-loading="loading">
        <v-card-text class="step-5-dialog__text">
          <p>{{ $t("merchant.we_have_found") }};</p>
        </v-card-text>
        <div v-show="getPlatformProductsLoaded">
          <v-card-text>
            <p
              class="step-5-dialog__text"
              v-if="getPlatformSyncNewProducts.length"
            >
              <strong data-test="newProductsCount"
                >{{ `${getPlatformSyncNewProducts.length}` }}
                {{ $t("merchant.new_products") }}</strong
              >
              {{ $t("merchant.to_be_imported_as_new_products") }}.
            </p>
            <p
              class="step-5-dialog__text"
              v-if="getPlatformSyncMatchingProducts.length"
            >
              <strong data-test="matchingProductsCount"
                >{{ `${getPlatformSyncMatchingProducts.length} ` }}
                {{ $t("merchant.matching_products") }}
              </strong>
              {{ $t("merchant.linked_to_existing_products") }}
            </p>
          </v-card-text>
          <div
            class="step-5-dialog__link-container"
            v-if="getPlatformSyncPartialMatchingProducts.length !== 0"
          >
            <p class="step-5-dialog__text">
              <strong data-test="partialProductsCount"
                >{{ `${getPlatformSyncPartialMatchingProducts.length}` }}
                {{ $t("merchant.products") }}</strong
              >
              {{ $t("merchant.we_couldnt_match") }}.
            </p>
            <p class="step-5-dialog__text">
              {{ $t("merchant.we_require_you_to_either") }}
              <strong>{{ $t("merchant.link_to_existing_products") }}</strong>
              {{ $t("merchant.link_to_existing_products_or") }}
              <strong>{{ $t("merchant.import_as_new_products") }}</strong>
            </p>
            <button
              class="step-5-dialog__link-container button"
              @click="goToResolveConflics()"
              v-if="!conflictsResolved"
              data-test="resolve-conflicts"
            >
              {{ $t("merchant.link") }}
              {{ `${getPlatformSyncPartialMatchingProducts.length}` }}
              {{ $t("merchant.products") }}
            </button>
            <span v-else data-test="products_linked_count">
              <img
                src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/check-circle-filled.svg"
              /><span class="step-5-dialog__link-container-text"
                >{{ `${getPlatformSyncPartialMatchingProducts.length}` }}
                {{ $t("merchant.products_linked") }}.
                <a
                  class="step-5-dialog__link-container-text-link"
                  @click="goToResolveConflics()"
                  data-test="edit_conflicts"
                  >{{ $t("merchant.edit") }}</a
                ></span
              >
            </span>
          </div>
          <v-card-text>
            <p class="step-5-dialog__text">
              {{ $t("merchant.click_below_to_begin") }}?
            </p>
          </v-card-text>
        </div>
        <v-card-actions class="step-5-dialog__actions">
          <v-row>
            <v-col span="6">
              <!-- todo: add action to go back to main screen using inject-->
              <button
                class="step-5-dialog__button step-5-dialog__button--cancel"
                @click="back()"
                :disabled="!conflictsResolved && getPlatformSyncStatus === 2"
              >
                {{ $t("merchant.back") }}
              </button>
            </v-col>
            <v-col span="6">
              <button
                class="step-5-dialog__button step-5-dialog__button--continue"
                @click="finishSyncingProducts()"
                data-test="continue"
                :disabled="!conflictsResolved && getPlatformSyncStatus === 2"
              >
                {{ $t("merchant.continue") }}
              </button>
            </v-col>
          </v-row>
        </v-card-actions>
      </div>
    </div>
  </div>
</template>

<script>
import platformSetupMixin from "@/modules/integrations/mixins/platformSetup";
import useProducts from "@/modules/integrations/composibles/useProducts";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { onMounted, ref } from "vue";

export default {
  name: "step6",
  mixins: [platformSetupMixin],
  setup() {
    const {
      getPlatformSyncProducts,
      getPlatformSyncStatus,
      getPlatformProductsLoaded,
      getPlatformSyncPartialMatchingProducts,
      getPlatformSyncMatchingProducts,
      getPlatformSyncNewProducts,
      getPlatformSyncPayload,
      conflictsResolved,
      finishSync,
      sync,
    } = useProducts();

    const store = useStore();
    // const { t } = useI18n();

    const router = useRouter();

    const loading = ref(false);

    onMounted(async () => {
      if (!getPlatformProductsLoaded.value) {
        loading.value = true;
        sync()
          .then((response) => {
            loading.value = false;

            return response;
          })
          .catch((e) => {
            loading.value = false;

            return e;
          });
      }
    });

    const finishSyncingProducts = async () => {
      try {
        let payload = {};
        switch (getPlatformSyncStatus.value) {
          case 1:
            payload = {
              currency: "KES", // required
              createAllProducts: true, // required
              syncStatus: 1,
            };
            store.dispatch("setFinishSyncPayload", payload);
            break;
          case 3:
            payload = {
              currency: "KES", // required
              createAllProducts: false, // required
              syncStatus: 3,
              matchingProducts: getPlatformSyncMatchingProducts.value,
              newProducts: getPlatformSyncNewProducts.value,
            };
            store.dispatch("setFinishSyncPayload", payload);
            break;
          default:
            break;
        }
        await finishSync(payload);
        router.push({ name: "SetupStep7" });
      } catch (error) {
        ElNotification({
          // title: t("merchant.unexpected_error"),
          // message: t("merchant.could_not_create_payload_to_sync_items"),
          title: "Something Went Wrong",
          message: error,
          type: "error",
        });
      }
    };

    return {
      conflictsResolved,
      finishSyncingProducts,
      getPlatformSyncProducts,
      getPlatformSyncStatus,
      loading,
      getPlatformProductsLoaded,
      getPlatformSyncPartialMatchingProducts,
      getPlatformSyncMatchingProducts,
      getPlatformSyncNewProducts,
      getPlatformSyncPayload,
    };
  },
  data() {
    return {
      cancelDialog: false,
    };
  },
  methods: {
    goToResolveConflics() {
      this.$router.push({ name: "ConflictResolution" });
    },
  },
};
</script>

<style lang="scss" scoped>
.step-5-dialog {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0px;
  gap: 4px;
  width: 512px;
  margin: 0 auto;

  &__link-container {
    width: 480px;
    background: #f7f9fc;
    border-radius: 6px;
    padding: 16px;

    .button {
      width: 139px;
      height: 34px;
      background: #324ba8;
      border-radius: 6px;
      font-family: "DM Sans";
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: 0.01em;
      color: #ffffff;
    }

    &-text {
      font-family: "DM Sans";
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.005em;
      color: #909399;
      margin-left: 8px;
      padding: 0.5rem;
    }

    &-text-link {
      color: #324ba8;
      text-decoration: underline;
    }
  }

  &-text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.005em;
    color: #909399;
    padding: 0.5rem !important;
  }

  // &__actions {
  //   margin-top: 130px;
  // }

  &__title {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 26px;
    line-height: 32px;
    letter-spacing: -0.01em;
    color: #303133;
    padding: 0.5rem;
  }

  &__text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #606266;
    margin-top: 24px;
    padding: 0.5rem;
  }

  &__button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px 24px;
    gap: 10px;
    border-radius: 6px;
    display: inline-block;
    height: 46px;

    &--continue {
      background: #324ba8;
      width: 260px;
      color: #ffffff;

      &:disabled {
        background: #e2e7ed;
        color: #ffffff;
      }
    }

    &--cancel {
      width: 160px;
      border: 1px solid #c0c4cc;
      color: #606266;

      &:disabled {
        border: 1px solid #d3ddf6;
        color: #d3ddf6;
      }
    }
  }
}

.cancellation-dialog {
  width: 512px;
  height: 290px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  gap: 4px;
  background: #ffffff;
  border-radius: 6px;

  &__header {
    width: 100%;
    margin: 0;

    .v-col {
      padding: 0;
    }
    .right {
      text-align: right;
    }
  }

  &__title {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 24px;
    letter-spacing: -0.005em;
    color: #606266;
  }

  &__text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #606266;
    margin-bottom: 24px;

    &--note {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.005em;
    }
  }

  .v-card-actions {
    padding: 0;
    width: 100%;
  }

  &__button {
    display: inline;
    border-radius: 6px;
    height: 46px;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    font-family: "DM Sans";
    font-style: normal;

    &--cancel {
      width: 216px;
      background: #9b101c;
      color: #ffffff;
    }

    &--back {
      width: 186px;
      border: 1px solid #c0c4cc;
      color: #606266;
    }
  }

  &__close-btn {
    cursor: pointer;
  }
}
</style>
