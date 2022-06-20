<template>
  <div class="changeLanguage-container">
    <label for="languages" class="changeLanguage-label">
      {{ $t("settings.changePreferredLanguage") }}
    </label>
    <el-select
      class="mb-6 business-details-industry"
      :disabled="buttonLoader"
      id="industry"
      v-model="defaultLanguage"
    >
      <el-option
        v-for="lang in getLanguages"
        :key="lang.name"
        :label="lang.name"
        :value="lang.tag"
      >
      </el-option>
    </el-select>
    <v-btn
      class="changeLanguage-save"
      v-loading="buttonLoader"
      @click="saveLanguage()"
    >
      {{ $t("settings.saveChanges") }}
    </v-btn>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import { ElNotification } from "element-plus";

export default {
  watch: {
    defaultLanguage(val) {
      this.setDefaultLanguage(val);
    },
  },
  computed: {
    ...mapGetters(["getLanguages", "getDefaultLanguage", "getBusinessDetails"]),
  },
  data() {
    return {
      defaultLanguage: "en",
      buttonLoader: false,
    };
  },
  mounted() {
    this.listLanguages();
    this.getBusinesssDetails();
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setDefaultLanguage",
      "setLanguages",
      "setBusinessDetails",
    ]),
    ...mapActions(["requestAxiosGet", "requestAxiosPut"]),
    listLanguages() {
      this.buttonLoader = true;
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/business/signup/languages`,
      }).then((response) => {
        if (response.status === 200) {
          this.buttonLoader = false;
          this.setLanguages(response.data.data.languages);
        }
      });
    },
    getBusinesssDetails() {
      const userDetails = JSON.parse(localStorage.userDetails).data;
      this.buttonLoader = true;
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${userDetails.business_id}/business`,
      }).then((response) => {
        if (response.status === 200) {
          this.buttonLoader = false;
          this.setBusinessDetails(response.data.data.business);
          this.defaultLanguage = this.getBusinessDetails.language;
        }
      });
    },
    saveLanguage() {
      this.buttonLoader = true;
      const userDetails = JSON.parse(localStorage.userDetails).data;
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${userDetails.business_id}/business`,
        values: {
          business_id: this.getBusinessDetails.business_id,
          business_name: this.getBusinessDetails.business_name,
          business_industry_id:
            this.getBusinessDetails.business_industry.industry_id,
          business_tax_identification_number:
            this.getBusinessDetails.business_tax_identification_number,
          business_default_address:
            this.getBusinessDetails.business_default_address,
          business_instagram_page:
            this.getBusinessDetails.business_instagram_page,
          business_website: this.getBusinessDetails.business_website,
          business_facebook_page:
            this.getBusinessDetails.business_facebook_page,
          business_language: this.defaultLanguage,
        },
      }).then((response) => {
        this.buttonLoader = false;
        if (response.status === 200) {
          this.setBusinessDetails(response.data.data.business);
          this.defaultLanguage = this.getBusinessDetails.language;
          ElNotification({
            title: this.$t("settings.languageUpdatedSuccessfully"),
            message: "",
            type: "success",
          });
        } else {
          ElNotification({
            title: this.$t("settings.languageUpdateFailed"),
            message: "",
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style>
.changeLanguage-container {
  width: 50%;
  padding: 10px 60px;
}
.changeLanguage-label {
  font-size: 14px;
  font-weight: 500;
}
.changeLanguage-save {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 40px;
  height: 50px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
.changeLanguage-field .v-input__control {
  border: 1px solid #c5c5c5;
  border-radius: 5px;
  background: white;
  --v-input-padding-top: 10px;
}
</style>
