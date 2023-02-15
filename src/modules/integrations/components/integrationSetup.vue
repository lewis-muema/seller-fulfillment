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
        <h5 class="integration-text">{{ $t("merchant.connectStore") }}</h5>
        <v-btn
          class="ma-2"
          variant="text"
          icon="mdi-close"
          size="small"
          @click="$emit('connected', false)"
        ></v-btn>
        <div class="integrations-card">
          <div class="top-action-bar">
            <v-btn class="back-btn" dark @click="$emit('connected', false)">
              <v-icon large dark left> mdi-arrow-left </v-icon>
            </v-btn>
          </div>
          <div class="store-platform">
            <v-icon icon="mdi-store" size="x-large"></v-icon
            ><span class="store-platform-name"
              >{{ storePlatform }} {{ $t("merchant.integration") }}</span
            >
          </div>
          <div class="tag">
            <h5>{{ $t("merchant.storeDetails") }}</h5>
            <p>{{ $t("merchant.storeDetailsTagline") }}</p>
          </div>
          <div v-if="storePlatform === 'Shopify'">
            <v-form ref="shopify" v-model="valid" lazy-validation>
              <v-text-field
                v-model="APIKey"
                :label="$t('merchant.APIKey')"
                :rules="apiRules"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="APIPassword"
                :label="$t('merchant.APIPassword')"
                :rules="passwordRules"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="accessToken"
                :label="$t('merchant.accessToken')"
                :rules="tokenRules"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="secret"
                :label="$t('merchant.sharedSecret')"
                :rules="secretRules"
                required
                density="compact"
              ></v-text-field>
            </v-form>
            <v-btn class="sendy-btn-default" @click="validateForm('shopify')">
              {{ $t("merchant.continue") }}
            </v-btn>
          </div>
          <div v-else>
            <v-form ref="default" v-model="valid" lazy-validation>
              <v-text-field
                v-model="storeKey"
                :label="$t('merchant.storeKey')"
                :rules="storeKeyRules"
                required
                density="compact"
              ></v-text-field>
              <v-text-field
                v-model="bridgeUrl"
                :label="$t('merchant.bridgeUrl')"
                :rules="bridgeUrlRules"
                required
                density="compact"
              ></v-text-field>
              <v-text-field
                v-model="storeRoot"
                :label="$t('merchant.storeRoot')"
                density="compact"
              ></v-text-field>
              <v-btn class="sendy-btn-default" @click="validateForm('default')">
                {{ $t("merchant.continue") }}
              </v-btn>
            </v-form>
          </div>
          <div class="text-center">
            <v-dialog v-model="connectDialog">
              <v-card class="connect-store">
                <div v-if="connecting" class="connect-progress">
                  <div class="dialog-title">{{ $t("merchant.adding") }}</div>
                  <v-progress-circular
                    :width="3"
                    color="indigo-darken-2"
                    indeterminate
                  ></v-progress-circular>
                  <div class="">{{ $t("merchant.waiting") }}</div>
                </div>
                <div v-else>
                  <div v-if="storeConnected">
                    <v-icon
                      icon="mdi-success-circle-outline"
                      color="green-darken-2"
                      size="x-large"
                    ></v-icon>
                    <h4>{{ $t("merchant.congratulations") }}</h4>
                    <p>{{ $t("merchant.success") }}</p>
                  </div>
                  <div v-else>
                    <v-icon
                      icon="error-outline"
                      color="red-darken-2"
                      size="x-large"
                    ></v-icon>
                    <h4>{{ $t("merchant.fail") }}</h4>
                    <p>{{ resultMessage }}</p>
                  </div>
                  <v-btn class="close-btn" @click="$emit('connected', false)">
                    {{ $t("merchant.close") }}
                  </v-btn>
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
import { isValidUrl } from "@/utils/text-validation";

export default {
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
      wooValid: true,
      dialog: false,
      connectDialog: false,
      connecting: false,
      storeConnected: false,
      resultMessage: "",
      bridgeUrl: "",
      storeRoot: "",
      storeKey: "",
      APIKey: "",
      APIPassword: "",
      secret: "",
      accessToken: "",
      apiRules: [
        (v) =>
          !!v || `${this.$t("merchant.APIKey")}${this.$t("merchant.required")}`,
      ],
      passwordRules: [
        (v) =>
          !!v ||
          `${this.$t("merchant.APIPassword")}${this.$t("merchant.required")}`,
      ],
      secretRules: [
        (v) =>
          !!v ||
          `${this.$t("merchant.sharedSecret")}${this.$t("merchant.required")}`,
      ],
      tokenRules: [
        (v) =>
          !!v ||
          `${this.$t("merchant.accessToken")}${this.$t("merchant.required")}`,
      ],
      bridgeUrlRules: [
        (v) => isValidUrl(v) || this.$t("merchant.validBridgeURL"),
      ],
      storeKeyRules: [
        (v) =>
          !!v ||
          `${this.$t("merchant.storeKey")}${this.$t("merchant.required")}`,
      ],
    };
  },
  mounted() {
    this.dialog = this.setupDialog;
  },
  watch: {
    setupDialog() {
      if (this.setupDialog) this.dialog = true;
    },
  },
  computed: {},
  methods: {
    ...mapActions(["connectStore"]),
    async validateForm(formName) {
      const { valid } = await this.$refs[formName].validate();
      if (valid) {
        this.connect(formName);
      }
    },
    async connect(strategy) {
      this.connectDialog = true;
      this.connecting = true;
      const payload = {
        default: {
          storeUrl: this.storeUrl,
          storeName: this.storeName,
          cartId: this.storePlatform,
          // bridgeUrl: this.bridgeUrl ? this.bridgeUrl : "",
          // storeRoot: this.storeRoot ? this.storeRoot : "",
        },
        shopify: {
          storeUrl: this.storeUrl,
          storeName: this.storeName,
          cartId: this.storePlatform,
          shopifyApiKey: this.APIKey ? this.APIKey : "",
          shopifyApiPassword: this.APIPassword ? this.APIPassword : "",
          shopifyAccessToken: this.accessToken ? this.accessToken : "",
          shopifySharedSecret: this.secret ? this.secret : "",
        },
      };
      this.saveStore(payload[strategy]);
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

        if (status === 200 && data.data.return_code !== 109) {
          this.storeConnected = true;
          this.connecting = false;
        } else {
          this.storeConnected = false;
          this.connecting = false;
          throw new Error(
            data?.data?.return_message || this.$t("merchant.somethingWentWrong")
          );
        }
      } catch (error) {
        this.storeConnected = false;
        this.connecting = false;
        this.resultMessage = error;
      }
    },
  },
};
</script>
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
.tag {
  margin-bottom: 30px;
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
.store-platform {
  margin-bottom: 20px;
}
.store-platform-name {
  margin-left: 10px;
  font-weight: 500;
}
.connect-store {
  min-width: 400px;
  min-height: 170px;
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
