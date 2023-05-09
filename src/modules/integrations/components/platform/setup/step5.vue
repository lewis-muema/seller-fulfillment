<template>
  <div class="step-4-dialog">
    <div class="step-4-dialog__card">
      <v-card-title class="step-4-dialog__title">
        {{ $t("merchant.import_your_products") }}
      </v-card-title>
      <div class="step-4-dialog__image-section">
        <!-- todo: add proper image placeholder -->
        <img class="step-4-dialog__image" />
      </div>
      <v-card-text>
        <p class="step-4-dialog__text">
          {{ $t("merchant.import_products_text") }}
        </p>
        <p class="step-4-dialog__text">
          {{ $t("merchant.click") }}
          <strong>{{ $t("merchant.continue") }}</strong>
          {{ $t("merchant.below_guide_through_steps_msg") }}
        </p>
      </v-card-text>
      <v-card-actions class="step-4-dialog__actions">
        <v-row>
          <v-col span="6">
            <!-- todo: add action to go back to main screen using inject-->
            <button class="step-4-dialog__button step-4-dialog__button--cancel">
              {{ $t("merchant.cancel") }}
              <v-dialog v-model="cancelDialog" activator="parent">
                <v-card class="cancellation-dialog">
                  <v-row class="cancellation-dialog__header">
                    <v-col cols="11">
                      <h3 class="cancellation-dialog__title">
                        {{ $t("merchant.importing_products_required") }}
                      </h3>
                    </v-col>
                    <v-col cols="1" class="right">
                      <img
                        class="cancellation-dialog__close-btn"
                        @click="backToIntegrationsPage()"
                        src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/close-button.svg"
                    /></v-col>
                  </v-row>
                  <div>
                    <p class="cancellation-dialog__text">
                      {{ $t("merchant.import_warning") }}
                    </p>
                    <p
                      class="cancellation-dialog__text cancellation-dialog__text--note"
                    >
                      {{ $t("merchant.import_note") }}
                    </p>
                  </div>
                  <v-card-actions>
                    <v-row>
                      <v-col span="6">
                        <button
                          @click="cancelDialog = false"
                          class="cancellation-dialog__button cancellation-dialog__button--back"
                        >
                          {{ $t("merchant.go_back_import") }}
                        </button>
                        <!-- todo: add action to go back to main screen using inject-->
                      </v-col>
                      <v-col span="6">
                        <button
                          @click="cancelDialog = false"
                          class="cancellation-dialog__button cancellation-dialog__button--cancel"
                        >
                          {{ $t("merchant.cancel_import") }}
                        </button>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </button>
          </v-col>
          <v-col span="6">
            <button
              class="step-4-dialog__button step-4-dialog__button--continue"
              @click="next()"
              data-test="continue"
            >
              {{ $t("merchant.continue") }}
            </button>
          </v-col>
        </v-row>
      </v-card-actions>
    </div>
  </div>
</template>

<script>
import platformSetupMixin from "@/modules/integrations/mixins/platformSetup";
export default {
  name: "step4",
  mixins: [platformSetupMixin],
  data() {
    return {
      cancelDialog: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.step-4-dialog {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0px;
  gap: 4px;
  width: 512px;
  height: 640px;
  margin: 0 auto;

  &__image-section {
    text-align: center;
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

  &__image {
    width: 480px;
    height: 160px;
    background: #d9d9d9;
    margin-top: 24px;
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
