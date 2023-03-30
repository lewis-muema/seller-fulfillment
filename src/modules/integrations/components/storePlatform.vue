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
            <h5>{{ $t("merchant.platformInUse") }}</h5>
          </div>
          <div>
            <selectComponent
              :availableStores="availableStores"
              class="dropdown"
              @update="updateStore"
            />

            <v-btn
              class="sendy-btn-default"
              @click="storeDetailsDialog = true"
              data-test="select-platform-btn"
            >
              {{ $t("merchant.continue") }}
            </v-btn>
            <!-- <div class="integration-actions">
              <span class="integration-actions__text">{{
                $t("merchant.missingPlatform")
              }}</span>
              <a class="integration-actions__link" @click="redirect()">
                {{ $t("merchant.letsKnow") }}
              </a>
            </div> -->
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
import headerComponent from "./header.vue";
import selectComponent from "./selectComponent.vue";

export default {
  components: { storeDetails, headerComponent, selectComponent },
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
    updateStore(store) {
      this.platform = store;
      this.onPlatformSet();
    },
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
<style lang="scss" scoped>
.integration-actions {
  margin-top: 32px;

  &__text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.005em;
    color: #000000;
    display: block;
  }

  &__link {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.005em;
    text-decoration-line: underline;
    color: #324ba8;
    cursor: pointer;
  }
}
</style>
<style scoped>
.dropdown {
  margin-bottom: 24px;
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
