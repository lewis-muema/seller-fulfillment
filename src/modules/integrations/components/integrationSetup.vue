<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
      :retain-focus="false"
    >
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
              :src="
                require(`../../../assets/logos/${storePlatform.toLowerCase()}.svg`)
              "
              class="platform-image"
            />
            <span class="store-platform-name"
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
                variant="outlined"
                class="personalInfo-field"
              ></v-text-field>
            </div>
            <v-btn class="sendy-btn-default" @click="validateForm('default')">
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
                    :src="require('../../../assets/loading.gif')"
                    class="connecting-dialog__icon"
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
    </v-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import Stores from "../classes/stores";
import headerComponent from "./header.vue";

export default {
  name: "integrationSetup",
  components: {
    headerComponent,
  },
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
      dialog: false,
      connectDialog: false,
      connecting: false,
      storeConnected: false,
      resultMessage: "",
      storeObj: null,
      hasError: false,
    };
  },
  mounted() {
    this.storeObj = new Stores(this.storePlatform);
    this.dialog = this.setupDialog;
    this.storeObj.getStoreFields();
  },
  watch: {
    setupDialog() {
      if (this.setupDialog) this.dialog = true;
    },
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
      };

      this.saveStore(payload);
    },
    async saveStore(payload) {
      try {
        const fullPayload = {
          app: process.env.MERCHANT_GATEWAY,
          values: payload,
          storeKey: this.storeKey,
          endpoint: "api2cart/stores",
        };

        const { status, data } = await this.connectStore(fullPayload);
        this.connecting = false;

        if (status === 200 && data.data.return_code === 0) {
          this.storeConnected = true;
          this.connecting = false;
          this.$router.push({
            name: "ThankYou",
            params: {
              storeName: this.storeName,
            },
          });
        } else {
          this.storeConnected = false;
          this.connecting = false;
          throw new Error(
            data?.data?.return_message || this.$t("merchant.somethingWentWrong")
          );
        }
      } catch (error) {
        this.resultMessage = error;
        this.storeConnected = false;
        this.connecting = false;
        this.hasError = true;
      }
    },
  },
};
</script>
<style lang="scss">
@import "../assets/styling.scss";

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
  margin-top: 65px;
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
