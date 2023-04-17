<template>
  <div>
    <v-card>
      <headerComponent />
      <div class="integrations-card">
        <div class="top-action-bar">
          <v-btn class="back-btn" dark @click="$emit('saved', false)">
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
        <v-form ref="form" v-model="valid" lazy-validation>
          <label :for="storeName" class="personalInfo-label">
            {{ $t("merchant.storeName") }}
          </label>
          <v-text-field
            v-model="storeName"
            :counter="20"
            :rules="nameRules"
            required
            variant="outlined"
            class="personalInfo-field"
            id="store-name-field"
            data-test="store-name-field"
          ></v-text-field>
          <label :for="storeUrl" class="personalInfo-label">
            {{ $t("merchant.storeUrl") }}
          </label>
          <v-text-field
            v-model="storeUrl"
            :rules="urlRules"
            required
            variant="outlined"
            class="personalInfo-field"
            data-test="store-url-field"
            id="store-url-field"
          ></v-text-field>
          <v-btn
            class="sendy-btn-default"
            @click="validate"
            data-test="continue-btn"
          >
            {{ $t("merchant.continue") }}
          </v-btn>
        </v-form>
      </div>
    </v-card>
    <integrationSetup
      v-if="storeSetupDialog"
      :setupDialog="storeSetupDialog"
      :storePlatform="storePlatform"
      :storeName="storeName"
      :storeUrl="storeUrl"
      @connected="onConnectedChild"
    />
  </div>
</template>
<script>
import integrationSetup from "./integrationSetup.vue";
import { isValidUrl } from "@/utils/text-validation";
import headerComponent from "./header.vue";
import eventsMixin from "@/mixins/events_mixin";

export default {
  components: { integrationSetup, headerComponent },
  inject: ["getUserDetails", "platform"],
  mixins: [eventsMixin],
  data() {
    return {
      valid: true,
      storeName: "",
      storeUrl: "",
      select: null,
      checkbox: false,
      platform: "",
      storeSetupDialog: false,
      nameRules: [
        (v) => !!v || this.$t("merchant.storeNameRequired"),
        (v) => (v && v.length <= 20) || this.$t("merchant.characterCheck"),
      ],
      urlRules: [(v) => isValidUrl(v) || this.$t("merchant.storeUrlRequired")],
    };
  },
  mounted() {
    this.platform = this.storePlatform;
  },
  watch: {
    detailsDialog() {
      if (this.detailsDialog) this.dialog = true;
    },
  },
  computed: {
    storePlatform() {
      return this.$route.params.storePlatform;
    },
  },
  methods: {
    onConnectedChild() {
      this.storeSetupDialog = false;
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();
      if (valid) this.storeSetupDialog = true;
      this.sendSegmentEvents({
        event: "[merchant]added_store_details",
        data: {
          userId: this.getUserDetails.user_id,
          payload: {
            storeName: this.storeName,
            storeUrl: this.storeUrl,
          },
        },
      });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
<style lang="scss">
@import "../assets/styling.scss";
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
