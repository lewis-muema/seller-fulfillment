<template>
  <div class="text-center wrapper">
    <v-dialog v-model="dialog" @update="closeDialog()">
      <v-card class="api-integraion-dialog">
        <v-card-title class="api-integraion-dialog__header reset">
          <v-col cols="11" class="reset">
            <span class="api-integraion-dialog__title" v-if="stage === 1">{{
              $t("merchant.createApiKey")
            }}</span>
            <span class="api-integraion-dialog__title" v-if="stage === 2">{{
              $t("merchant.generatingApiKey")
            }}</span>
            <span class="api-integraion-dialog__title" v-if="stage === 3">{{
              $t("merchant.apiKeyReady")
            }}</span>
          </v-col>
          <v-col class="reset">
            <button @click="closeDialog()" class="reset">
              <img
                src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/close-button.svg"
              />
            </button>
          </v-col>
        </v-card-title>
        <v-form class="api-integraion-dialog__form" v-if="stage === 1">
          <v-container class="reset">
            <v-row class="reset">
              <v-col cols="12" class="reset">
                <label for="description" class="api-integraion-dialog__label">
                  {{ $t(`API Key Description`) }}
                </label>
                <v-text-field
                  data-test="api-description-textbox"
                  v-model="description"
                  :rules="[(v) => !!v || $t('merchant.descriptionRequired')]"
                  :label="$t('merchant.enterDescription')"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <div v-if="stage === 2" class="api-integraion-dialog__form center">
          <img
            src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/loading.gif"
            class="api-integraion-dialog__loading-icon"
            data-test="loading-icon"
          />
        </div>
        <div v-if="stage === 3" class="api-integraion-dialog__form">
          <img
            src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/successful-store.svg"
            class="api-integraion-dialog__success-icon"
          />
        </div>
        <v-card-actions>
          <v-row v-if="stage === 2" class="center">
            <span class="api-integraion-dialog__text"
              >{{ $t("merchant.thisWillTakeaMoment") }}...</span
            >
          </v-row>
          <div v-if="stage === 3" class="center">
            <v-row class="api-integraion-dialog__api-key">
              <v-col cols="auto" class="reset">
                <span id="text__api-key" data-test="api-key">{{ apiKey }}</span>
              </v-col>
              <v-col class="reset api-integraion-dialog__copy-btn">
                <span>
                  <button
                    class="api-integraion-dialog__btn"
                    @click="copyToClipboard()"
                    data-test="copy-key-btn"
                  >
                    {{ $t("merchant.copyApiKey") }}
                  </button>
                </span>
              </v-col>
            </v-row>
            <v-row
              v-show="textCopied"
              class="api-integraion-dialog__key-copied-txt"
            >
              <v-col>
                <span data-text="key-copied-txt"
                  >{{ $t("merchant.apiKeyCopied") }}!</span
                >
              </v-col>
            </v-row>
          </div>
          <v-row v-if="stage === 1">
            <v-col cols="6" class="reset"
              ><button
                color="primary"
                block
                @click="closeDialog()"
                class="form__buttons form__buttons--cancel"
              >
                {{ $t("merchant.cancel") }}
              </button></v-col
            >
            <v-col cols="6" class="form__buttons--right reset"
              ><button
                class="form__buttons form__buttons--generate"
                @click="fetchApiKey()"
                data-test="create-api-key-button"
              >
                {{ $t("merchant.generateApiKey") }}
              </button></v-col
            >
          </v-row>
          <v-row v-if="stage === 3" class="reset">
            <v-col cols="12">
              <div class="api-integraion-dialog__text center">
                {{ $t("merchant.protectApiKeyMsg") }}.
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { ElNotification } from "element-plus";

export default {
  props: {
    generateAPIkeyDialog: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.dialog = this.generateAPIkeyDialog;
  },
  watch: {
    addApiKeyDialog(value) {
      this.dialog = value;
    },
  },
  data() {
    return {
      dialog: false,
      description: "",
      loading: false,
      keyGenerated: true,
      apiKey: null,
      //Stage 1 - creating(default), 2 - loading, 3 - connected
      stage: 1,
      textCopied: false,
    };
  },
  methods: {
    ...mapActions(["generateApiKey"]),
    closeDialog() {
      this.$emit("closeDialog");
      this.closeDialog();
    },
    copyToClipboard() {
      const copyText = document.getElementById("text__api-key");
      console.log("code", navigator.clipboard.readtext);
      navigator.clipboard.writeText(copyText.innerHTML.trim());
      this.textCopied = true;
    },
    async fetchApiKey() {
      this.loading = true;
      this.stage = 2;
      try {
        const payload = {
          app: process.env.FULFILMENT_API,
          endpoint: "v1/internal/api/token",
          values: {
            description: this.description,
          },
        };

        const { status, data } = await this.generateApiKey(payload);

        if (status === 200) {
          this.apiKey = data.token.token;
          this.stage = 3;
        } else {
          throw data;
        }
      } catch (error) {
        this.stage = 1;
        ElNotification({
          title: "",
          message: `Error generating API Key ${error.message}`,
          type: "error",
        });
        return error;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.wrapper {
  background-color: #ffffff;
  margin: 0 auto;
}
.form {
  &__buttons {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    height: 46px;
    border-radius: 6px;

    &--cancel {
      background-color: #ffffff;
      color: #606266;
      width: 101px;
      border: 1px solid #c0c4cc;
    }

    &--generate {
      background-color: #324ba8;
      color: #ffffff;
      width: 179px;
    }

    &--right {
      text-align: right;
    }
  }
}

.api-integraion-dialog {
  width: 512px;
  padding: 24px;

  &__copy-btn {
    text-align: right;
  }

  &__success-icon {
    height: 53px;
    width: 53px;
    margin: 29px 0;
  }

  &__loading-icon {
    width: 90px;
    height: 90px;
    margin: 24px 0;
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

  &__header {
    margin-bottom: 28px !important;
  }

  &__text-box {
    background: #ffffff;
    border: 1px solid #c0c4cc;
    border-radius: 6px;
    padding: 16px 8px;
    gap: 8px;
    width: 464px;
    height: 56px;
  }

  &__label {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    letter-spacing: 0.005em;
    color: #303133;
    margin-top: 28px;
    margin-bottom: 4px;
  }

  // &__form-margin {
  //   margin-bottom: 28px;
  // }

  &__text {
    width: 100%;
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #606266;
  }

  &__btn {
    background: #324ba8;
    border-radius: 6px;
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #ffffff;
    padding: 12px 24px;
    width: 148px;
    height: 46px;
    margin: 3px 3px 3px 0;
  }

  &__api-key {
    background: #ffffff;
    border: 1px solid #c0c4cc;
    border-radius: 6px;
    display: flex;
    align-content: flex-start;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
  }

  &__key-copied-txt {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    text-align: right;
    letter-spacing: 0.01em;
    color: #324ba8;
    margin-top: 8px;
  }
}

.reset {
  margin: 0 !important;
  padding: 0 !important;
}

.center {
  text-align: center;
}

.v-text-field {
  .v-input {
    &__append {
      margin: 0;
      padding: 0;
    }
  }
}

#text {
  &__api-key {
    margin-left: 8px;
  }
}
</style>
