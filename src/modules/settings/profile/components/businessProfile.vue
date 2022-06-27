<template>
  <div class="businessProfile-container">
    <label for="business-name" class="businessProfile-label">
      {{ $t("settings.businessName") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="business-name"
      v-model="businessName"
      variant="outlined"
      clearable
      :disabled="buttonLoader"
      clear-icon="mdi-close"
    ></v-text-field>
    <label for="industry" class="businessProfile-label">
      {{ $t("settings.industry") }}
    </label>
    <el-select
      class="mb-6 business-details-industry"
      :disabled="buttonLoader"
      id="industry"
      v-model="industryItem"
    >
      <el-option
        v-for="item in industry"
        :key="item.industry_id"
        :label="item.name"
        :value="item.industry_id"
      >
      </el-option>
    </el-select>
    <label for="TIN" class="businessProfile-label">
      {{ $t("settings.taxIdentificationNumber") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="TIN"
      v-model="TIN"
      :label="$t('settings.enterTaxIdentificationNumber')"
      variant="outlined"
      clearable
      :disabled="buttonLoader"
      clear-icon="mdi-close"
    ></v-text-field>
    <label for="physical-address" class="businessProfile-label">
      {{ $t("settings.defaultPhysicalAddress") }}
    </label>
    <GMapAutocomplete
      id="physical-address"
      class="businessProfile-address"
      :placeholder="$t('settings.searchLocation')"
      :value="location"
      @place_changed="setPlace"
      :disabled="buttonLoader"
    >
    </GMapAutocomplete>
    <p>{{ $t("settings.businessSocialProfile") }}</p>
    <label for="instagram" class="businessProfile-label">
      {{ $t("settings.instagram") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="instagram"
      v-model="instagram"
      :disabled="buttonLoader"
      :label="$t('settings.enterInstagramUrl')"
      variant="outlined"
      clearable
      clear-icon="mdi-close"
    ></v-text-field>
    <label for="facebookPage" class="businessProfile-label">
      {{ $t("settings.facebookPage") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="facebookPage"
      v-model="facebookPage"
      :disabled="buttonLoader"
      :label="$t('settings.enterFacebookPageUrl')"
      variant="outlined"
      clearable
      clear-icon="mdi-close"
    ></v-text-field>
    <label for="website" class="businessProfile-label">
      {{ $t("settings.website") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="website"
      v-model="website"
      :disabled="buttonLoader"
      :label="$t('settings.enterWebsiteLink')"
      variant="outlined"
      clearable
      clear-icon="mdi-close"
    ></v-text-field>
    <v-btn
      class="businessProfile-save"
      v-loading="buttonLoader"
      @click="updateBusinessDetails()"
    >
      {{ $t("settings.saveChanges") }}
    </v-btn>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
// eslint-disable-next-line no-unused-vars
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      businessName: "",
      TIN: "",
      industry: [],
      industryItem: "",
      instagram: "",
      facebookPage: "",
      website: "",
      buttonLoader: false,
      location: "",
      place: {},
    };
  },
  computed: {
    ...mapGetters([
      "getBusinessDetails",
      "getIndustries",
      "getStorageUserDetails",
    ]),
  },
  mounted() {
    this.getBusinesssDetails();
    this.listIndustries();
  },
  methods: {
    ...mapMutations(["setBusinessDetails", "setIndustries"]),
    ...mapActions(["requestAxiosGet", "requestAxiosPut"]),
    setPlace(place) {
      this.place = place;
      this.location = document.querySelector("#physical-address").value;
    },
    getBusinesssDetails() {
      this.buttonLoader = true;
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/business`,
      }).then((response) => {
        if (response.status === 200) {
          this.buttonLoader = false;
          this.setBusinessDetails(response.data.data.business);
          this.setBusinesssDetails();
        }
      });
    },
    setBusinesssDetails() {
      this.businessName = this.getBusinessDetails.business_name;
      this.TIN = this.getBusinessDetails.business_tax_identification_number;
      this.instagram = this.getBusinessDetails.business_instagram_page;
      this.facebookPage = this.getBusinessDetails.business_facebook_page;
      this.website = this.getBusinessDetails.business_website;
      this.industry = this.getIndustries;
      this.industryItem = this.getBusinessDetails.business_industry.industry_id;
      this.industryObject = this.getBusinessDetails.business_industry;
      this.location = this.getBusinessDetails.business_default_address
        ? this.getBusinessDetails.business_default_address.description
        : "";
    },
    listIndustries() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/industries`,
      }).then((response) => {
        if (response.status === 200) {
          this.setIndustries(response.data.data.industries);
        }
      });
    },
    updateBusinessDetails() {
      if (this.businessName && this.TIN && this.industryItem && this.location) {
        this.buttonLoader = true;
        this.requestAxiosPut({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/business`,
          values: {
            business_id: this.getBusinessDetails.business_id,
            business_name: this.businessName,
            business_industry_id: this.industryItem,
            business_tax_identification_number: this.TIN,
            business_default_address: {
              description: this.location,
              longitude: this.place.geometry
                ? this.place.geometry.location.lng()
                : this.getBusinessDetails.business_default_address.longitude,
              latitude: this.place.geometry
                ? this.place.geometry.location.lat()
                : this.getBusinessDetails.business_default_address.latitude,
            },
            business_instagram_page: this.instagram,
            business_website: this.website,
            business_facebook_page: this.facebookPage,
            business_language: this.getBusinessDetails.language,
          },
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            this.setBusinessDetails(response.data.data.business);
            this.setBusinesssDetails();
            ElNotification({
              title: this.$t("settings.businessDetailsUpdatedSuccessfully"),
              message: "",
              type: "success",
            });
          } else {
            ElNotification({
              title: this.$t("settings.businessDetailsUpdateFailed"),
              message: "",
              type: "error",
            });
          }
        });
      } else {
        ElNotification({
          title: this.$t("deliveries.insufficientInformation"),
          message: this.$t("deliveries.fillInAllFields"),
          type: "warning",
        });
      }
    },
  },
};
</script>

<style>
.businessProfile-container {
  width: 50%;
  padding: 10px 60px;
}
.businessProfile-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}
.businessProfile-field {
  zoom: 90%;
}
.businessProfile-field .v-input__control {
  background: white;
}
.businessProfile-phone {
  height: 50px;
  background: white;
}
.businessProfile-save {
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
.businessProfile-select .v-input__control {
  border: 1px solid #c5c5c5;
  border-radius: 5px;
  --v-input-padding-top: 10px;
}
.businessProfile-address {
  width: 100%;
  border: 1px solid #c5c5c5;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 30px;
}
.business-details-industry .select-trigger .el-input .el-input__wrapper {
  height: 50px;
}
</style>
