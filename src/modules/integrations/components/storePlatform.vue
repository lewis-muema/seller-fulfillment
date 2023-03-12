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
          @click="$emit('selected', false)"
        ></v-btn>
        <div class="integrations-card">
          <div class="top-action-bar">
            <h5>{{ $t("merchant.platformInUse") }}</h5>
          </div>
          <div>
            <v-select
              label="Select your platform"
              density="compact"
              v-model="platform"
              @update:modelValue="onPlatformSet"
              :items="availableStores"
              outlined
            ></v-select>
            <v-btn class="sendy-btn-default" @click="storeDetailsDialog = true">
              {{ $t("merchant.continue") }}
            </v-btn>
            <div class="integration-actions">
              <h6>{{ $t("merchant.missingPlatform") }}</h6>
              <v-btn class="sendy-btn-text" variant="text" @click="redirect()">
                {{ $t("merchant.letsKnow") }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <storeDetails
      v-if="storeDetailsDialog"
      :detailsDialog="storeDetailsDialog"
      :storePlatform="platform"
      @saved="onSavedChild"
    />
  </div>
</template>
<script>
import storeDetails from "./storeDetails.vue";
import stores from "../constants/storeFields.json";

export default {
  components: { storeDetails },
  props: {
    displayDialog: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    availableStores() {
      return Object.keys(stores).sort((a, b) => {
        return a - b;
      });
    },
  },
  data() {
    return {
      platform: "",
      platformSet: false,
      dialog: false,
      storeDetailsDialog: false,
      documentationLink: "https://fulfillment-api.sendyit.com/documentation",
    };
  },
  mounted() {
    this.dialog = this.displayDialog;
  },
  watch: {
    displayDialog() {
      if (this.displayDialog) this.dialog = true;
    },
  },
  methods: {
    onPlatformSet() {
      this.platformSet = true;
    },
    onSavedChild() {
      this.storeDetailsDialog = false;
    },
    redirect() {
      window.open(this.documentationLink);
    },
  },
};
</script>
<style scoped>
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
.integration-text {
  color: #606266;
  margin: 10px, 3px, 20px;
  margin-top: 20px;
  margin-left: 20px;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 26px;
  line-height: 32px;
  letter-spacing: -0.01em;
}
.integration-actions {
  margin-top: 20px;
}
.top-action-bar {
  margin-bottom: 20px;
}
.back-btn {
  box-shadow: none !important;
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
.sendy-btn-text {
  text-transform: inherit;
  color: #324ba8 !important;
  text-decoration: underline !important;
}
</style>
