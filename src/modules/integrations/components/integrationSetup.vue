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
            <h5 class="text__store-details">
              {{ $t("merchant.storeDetails") }}
            </h5>
            <p class="text__store-tagline">
              {{ $t("merchant.storeDetailsTagline") }}
            </p>
          </div>
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
import Stores from "../classes/stores";

export default {
  name: "integrationSetup",
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

      const payload = {
        storeUrl: this.storeUrl,
        storeName: this.storeName,
        cartId: this.storePlatform,
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
<style lang="scss">
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
  display: flex;
  align-items: center;
}
.store-platform-name {
  margin-left: 10px;
  font-weight: 500;
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: #000000;
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
