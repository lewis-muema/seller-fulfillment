<template>
  <div class="step-5-dialog">
    <div class="step-5-dialog__card" v-if="productsLoaded">
      <div class="top-action-bar">
        <v-btn class="back-btn" dark @click="back()">
          <v-icon large dark left> mdi-arrow-left </v-icon>
        </v-btn>
      </div>
      <v-card-title class="step-5-dialog__title">
        {{ $t("merchant.ready_to_import") }}
      </v-card-title>
      <div>
        <v-card-text>
          <p class="step-5-dialog__text">{{ $t("merchant.we_have_found") }};</p>
          <p
            class="step-5-dialog__text"
            v-if="getPlatformSyncNewProducts.length"
          >
            <strong
              >{{ `${getPlatformSyncNewProducts.length}` }}
              {{ $t("merchant.new_products") }}</strong
            >
            {{ $t("merchant.to_be_imported_as_new_products") }}.
          </p>
          <p
            class="step-5-dialog__text"
            v-if="getPlatformSyncMatchingProducts.length"
          >
            <strong
              >{{ `${getPlatformSyncMatchingProducts.length} ` }}
              {{ $t("merchant.matching_products") }}
            </strong>
            {{ $t("merchant.linked_to_existing_products") }}
          </p>
        </v-card-text>
        <div class="step-5-dialog__link-container">
          <p
            class="step-5-dialog__text"
            v-if="getPlatformSyncPartialMatchingProducts.length !== 0"
          >
            <strong
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
          >
            {{ $t("merchant.link") }}
            {{ `${getPlatformSyncPartialMatchingProducts.length}` }}
            {{ $t("merchant.products") }}
          </button>
        </div>
        <v-card-text>
          <p class="step-5-dialog__text">
            {{ $t("merchant.click_below_to_begin") }}?
          </p>
        </v-card-text>
        <v-card-actions class="step-5-dialog__actions">
          <v-row>
            <v-col span="6">
              <!-- todo: add action to go back to main screen using inject-->
              <button
                class="step-5-dialog__button step-5-dialog__button--cancel"
                @click="back()"
              >
                {{ $t("merchant.back") }}
              </button>
            </v-col>
            <v-col span="6">
              <button
                class="step-5-dialog__button step-5-dialog__button--continue"
                @click="finishSyncingProducts()"
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
// import { onMounted } from "vue";

export default {
  name: "step6",
  mixins: [platformSetupMixin],
  setup() {
    const {
      getPlatformSyncProducts,
      getPlatformSyncStatus,
      productsLoading,
      productsLoaded,
      getPlatformSyncPartialMatchingProducts,
      getPlatformSyncMatchingProducts,
      getPlatformSyncNewProducts,
      finishSync,
    } = useProducts();

    const finishSyncingProducts = () => {
      let payload = {};
      switch (getPlatformSyncStatus) {
        case 1:
          payload = {
            currency: "KES", // required
            createAllProducts: true, // required
            syncStatus: 1,
          };
          break;
        case 3:
          payload = {
            currency: "KES", // required
            createAllProducts: false, // required
            syncStatus: 3,
            matchingProducts: [],
            newProducts: [],
          };
          break;
        default:
          break;
      }
      finishSync(payload);
    };

    return {
      finishSyncingProducts,
      getPlatformSyncProducts,
      getPlatformSyncStatus,
      productsLoading,
      productsLoaded,
      getPlatformSyncPartialMatchingProducts,
      getPlatformSyncMatchingProducts,
      getPlatformSyncNewProducts,
    };
  },
  data() {
    return {
      cancelDialog: false,
    };
  },
  methods: {
    goToLastStep() {
      this.last();
    },
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
  }

  &__actions {
    margin-top: 130px;
  }

  &__title {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 26px;
    line-height: 32px;
    letter-spacing: -0.01em;
    color: #303133;
  }

  &__text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #606266;
    margin-top: 24px;
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
    }

    &--cancel {
      width: 160px;
      border: 1px solid #c0c4cc;
      color: #606266;
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
