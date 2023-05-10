<template>
  <div>
    <v-card>
      <headerComponent />
      <div class="integrations-card">
        <div class="top-action-bar">
          <v-btn class="back-btn" dark @click="$emit('connected', false)">
            <v-icon large dark left> mdi-arrow-left </v-icon>
          </v-btn>
        </div>
        <div class="store-platform">
          <img
            :src="`https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/${storePlatform.toLowerCase()}.svg`"
            class="store-platform__image"
          />
          <span class="store-platform__name"
            >{{ storePlatform }} {{ $t("merchant.integration") }}</span
          >
        </div>
        <div class="tag">
          <h5>{{ $t("merchant.storeDetails") }}</h5>
          <p>{{ $t("merchant.storeDetailsTagline") }}</p>
        </div>
        <hr class="divider" />
        <v-form ref="default" v-model="valid" lazy-validation>
          <div
            v-for="(field, index) in storeObj.storeRequiredFields"
            :key="index"
          >
            <label for="field" class="personalInfo-label">
              {{ $t(`merchant.${field.fieldName}`) }}
            </label>
            <v-text-field
              v-model="field.value"
              :required="field.required"
              :rules="field.rules"
              :id="`${field.fieldName}`"
              variant="outlined"
              class="personalInfo-field"
            ></v-text-field>
          </div>
          <v-btn
            class="sendy-btn-default"
            @click="validateForm('default')"
            data-test="integrate-btn"
          >
            {{ $t("merchant.continue") }}
          </v-btn>
        </v-form>
        <div class="text-center">
          <v-dialog v-model="connectDialog" class="connecting-dialog">
            <v-card class="connect-store">
              <div v-if="connecting" class="connect-progress">
                <div class="connecting-dialog__title">
                  {{ $t("merchant.connecting_your_store") }}
                </div>
                <img
                  src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/loading.gif"
                  class="connecting-dialog__icon"
                  data-test="loading-gif"
                />
                <div class="connecting-dialog__msg">
                  {{ $t("merchant.waiting") }}
                </div>
              </div>
              <div v-if="hasError && !connecting" class="connect-progress">
                <div class="connecting-dialog__title">
                  {{ $t("merchant.somethingWentWrong") }}
                </div>
                <div class="connecting-dialog__msg">
                  {{ resultMessage }}
                </div>
              </div>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import Stores from "@/modules/integrations/classes/stores.js";
import eventsMixin from "@/mixins/events_mixin";
import { inject, reactive, onBeforeMount } from "vue";
import platformSetupMixin from "@/modules/integrations/mixins/platformSetup";
import usePlatform from "@/modules/integrations/composibles/usePlatform";
import { ElNotification } from "element-plus";

export default {
  name: "integrationSetup",
  mixins: [eventsMixin, platformSetupMixin],
  props: {
    setupDialog: {
      type: Boolean,
      default: false,
    },
    storePlatform: {
      type: String,
      default: "",
    },
    storeName: {
      type: String,
      default: "",
    },
    storeUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      valid: true,
      connectDialog: false,
      connecting: false,
      storeConnected: false,
      resultMessage: "",
      hasError: false,
      getUserDetails: inject("getUserDetails"),
    };
  },
  setup(props) {
    let storeObj = reactive(new Stores(props.storePlatform));

    onBeforeMount(() => {
      storeObj.getStoreFields();
    });

    return {
      storeObj,
    };
  },
  watch: {
    connectDialog(value) {
      if (!value) {
        this.hasError = false;
      }
    },
  },
  methods: {
    ...mapActions(["connectStore"]),
    async validateForm(formName) {
      const { valid } = await this.$refs[formName].validate();
      if (valid) {
        this.connect(formName);
      }
    },
    async connect() {
      this.connectDialog = true;
      this.connecting = true;
      const storeFields = {};

      for (const field of this.storeObj.storeRequiredFields) {
        storeFields[field.fieldName] = field.value;
      }

      let cartId = this.storePlatform.replace(" ", "").toLowerCase();
      cartId = cartId.charAt(0).toUpperCase() + cartId.slice(1);

      const payload = {
        storeUrl: this.storeUrl,
        storeName: this.storeName,
        cartId,
        ...storeFields,
        addedBy: this.getUserDetails.first_name,
      };

      this.saveStore(payload);
    },
    async saveStore(payload) {
      const { savePlatform } = usePlatform();
      try {
        const { data = null, status = null } = await savePlatform(payload);
        this.connecting = false;

        console.log("data", data);
        console.log("status", status);

        if (status === 201) {
          this.storeConnected = true;
          this.connecting = false;
          this.sendSegmentEvents({
            event: "[merchant]_successful_integration_request",
            data: {
              userId: this.getUserDetails.user_id,
              payload,
              response: data,
            },
          });
          this.next();
        } else {
          this.storeConnected = false;
          this.connecting = false;
          throw data;
        }
      } catch (error) {
        // Add logic to
        const { errorCode = null, errorType, message } = error.data;
        switch (errorType) {
          case 1: // STORE_CONFIG_ERRORS
            this.next({ params: { success: false, errorMessage: message } });
            break;
          case 2: // USER_ERRORS
            ElNotification({
              title: "User Error",
              message,
              type: "error",
            });
            break;
          case 3: // SERVER_ERRORS
            ElNotification({
              title: "Server Error",
              message:
                "There was an error setting up your store, kindy try again after a few minutes.",
              type: "error",
            });
            break;
        }
        this.sendSegmentEvents({
          event: "[merchant]_failed_integration_request",
          data: {
            userId: this.getUserDetails.user_id,
            error: message,
            errorCode,
          },
        });

        this.resultMessage = message;
        this.storeConnected = false;
        this.connecting = false;
        this.hasError = true;
      }
    },
  },
};
</script>
<style lang="scss">
@import "~@/modules/integrations/assets/styling.scss";

.connecting-dialog {
  border-radius: 6px;
  padding: 16px;

  &__title {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 36px;
    letter-spacing: -0.01em;
    color: #303133;
    margin-bottom: 24px;
    text-align: left;
  }

  &__icon {
    margin-bottom: 24px;
    width: 90px;
    height: 90px;
  }

  &__msg {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #606266;
  }
}
.text {
  &__store-details {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 26px;
    line-height: 32px;
    letter-spacing: -0.01em;
    color: #303133;
  }

  &__store-tagline {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #606266;
  }
}
.v-overlay {
  &__content {
    max-width: unset !important;
    max-height: unset !important;
  }
}
</style>
<style scoped>
.integrations-container {
  width: 50%;
  margin: 100px auto;
}
.integration-text {
  color: #606266;
  margin: 10px, 3px, 20px;
  margin-top: 20px;
  margin-left: 20px;
}
.integrations-card {
  margin: auto;
  width: 40%;
  padding: 25px;
  /* margin-top: 65px; */
}
.ma-2 {
  float: right;
  margin-top: -40px !important;
}
.sendy-btn-default {
  text-transform: inherit;
  font-size: 14px;
  letter-spacing: 0px;
  color: #ffffff !important;
  border: 1px solid #324ba8 !important;
  background-color: #324ba8 !important;
  width: 100%;
}
.top-action-bar {
  margin-bottom: 20px;
}
.back-btn {
  box-shadow: none !important;
}

.connect-store {
  width: 512px;
  height: 276px;
  font-weight: 500;
  margin: 10px;
  text-align: center !important;
}
.connect-progress {
  display: block;
  margin: 20px;
}
.dialog-title {
  font-size: 25px;
}
</style>
